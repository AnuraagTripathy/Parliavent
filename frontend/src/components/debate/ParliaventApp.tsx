"use client";

import { useCallback, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { AppHeader } from "@/components/ui/app-header";
import { PageTransition } from "@/components/ui/fade-in";
import { createDebate, fetchDebate } from "@/lib/api/persistence";
import { generateThreadId } from "@/lib/generateThreadId";
import { CreateDebateScreen } from "./CreateDebateScreen";
import { DebateFeed } from "./DebateFeed";
import { DebateApp } from "./DebateApp";
import { IssueThread } from "./IssueThread";
import { LandingPage } from "./LandingPage";
import { PublishedArgumentView } from "./PublishedArgumentView";
import { getIssue, getPost, MOCK_POSTS } from "@/lib/mockFeed";
import type {
  AppScreen,
  ComposerContext,
  PublishedArgument,
} from "@/lib/types";

export function ParliaventApp() {
  const [screen, setScreen] = useState<AppScreen>("landing");
  const [posts, setPosts] = useState<PublishedArgument[]>(() => [
    ...MOCK_POSTS,
  ]);
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [composerContext, setComposerContext] =
    useState<ComposerContext | null>(null);
  const [isCreatingDebate, setIsCreatingDebate] = useState(false);
  const [loadingPostId, setLoadingPostId] = useState<string | null>(null);

  const selectedPost = selectedPostId
    ? posts.find((p) => p.id === selectedPostId)
    : undefined;

  const toggleDeskBang = useCallback((postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const banged = p.userBanged ?? false;
        return {
          ...p,
          userBanged: !banged,
          deskBangs: Math.max(0, (p.deskBangs ?? 0) + (banged ? -1 : 1)),
        };
      }),
    );
  }, []);

  function openIssue(issueId: string) {
    setSelectedIssueId(issueId);
    setScreen("issue");
  }

  function openPost(postId: string) {
    setSelectedPostId(postId);
    setScreen("post");

    const post = posts.find((p) => p.id === postId);
    if (post?.debateId) {
      setLoadingPostId(postId);
      fetchDebate(post.debateId)
        .then(({ debate }) => {
          const saved = debate.posts.find((p) => p.id === postId || p.dbPostId === postId);
          if (saved) {
            setPosts((prev) => {
              const without = prev.filter((p) => p.id !== postId && p.dbPostId !== postId);
              return [saved, ...without];
            });
          }
        })
        .catch((err) => {
          console.warn("Could not load saved debate:", err);
        })
        .finally(() => {
          setLoadingPostId(null);
        });
    }
  }

  function startComposer(context: ComposerContext) {
    setComposerContext(context);
    setScreen("composer");
  }

  function startStarter(issueId: string) {
    const issue = getIssue(issueId);
    if (!issue) return;
    startComposer({
      mode: "starter",
      issueId,
      issueTitle: issue.title,
    });
  }

  async function startCustomDebate(draft: {
    motion: string;
    argument: string;
    judgeMode: ComposerContext["judgeMode"];
  }) {
    setIsCreatingDebate(true);

    try {
      const { debate, post } = await createDebate({
        motion: draft.motion,
        text: draft.argument,
        mode: draft.judgeMode ?? "structured_debate",
        authorName: "Guest",
      });

      startComposer({
        mode: "starter",
        issueId: debate.slug,
        issueTitle: draft.motion,
        judgeMode: draft.judgeMode ?? "structured_debate",
        initialText: draft.argument,
        isCustomDebate: true,
        debateId: debate.id,
        dbPostId: post.id,
      });
    } catch (err) {
      console.warn("Debate persistence unavailable, using in-memory flow:", err);
      startComposer({
        mode: "starter",
        issueId: generateThreadId(draft.motion),
        issueTitle: draft.motion,
        judgeMode: draft.judgeMode ?? "structured_debate",
        initialText: draft.argument,
        isCustomDebate: true,
      });
    } finally {
      setIsCreatingDebate(false);
    }
  }

  function backFromCreate() {
    goToFeed();
  }

  function startReply(parentId: string) {
    const parent = getPost(parentId) ?? posts.find((p) => p.id === parentId);
    if (!parent?.issueId) return;
    const issue = getIssue(parent.issueId);
    if (!issue) return;
    startComposer({
      mode: "response",
      issueId: parent.issueId,
      issueTitle: issue.title,
      parentId,
      parentAuthor: parent.author,
      parentPreview:
        parent.text.length > 120
          ? `${parent.text.slice(0, 120).trim()}…`
          : parent.text,
    });
  }

  function handlePosted(post: PublishedArgument) {
    setPosts((prev) => [post, ...prev]);
    setSelectedIssueId(post.issueId ?? null);
    setSelectedPostId(post.id);
  }

  function goToLanding() {
    setScreen("landing");
    setSelectedIssueId(null);
    setSelectedPostId(null);
    setComposerContext(null);
  }

  function goToFeed() {
    setScreen("feed");
    setSelectedIssueId(null);
    setSelectedPostId(null);
    setComposerContext(null);
  }

  function backFromComposer() {
    if (composerContext?.isCustomDebate) {
      goToFeed();
      return;
    }

    if (composerContext?.parentId) {
      setScreen("issue");
      setSelectedIssueId(composerContext.issueId);
    } else if (composerContext?.issueId && getIssue(composerContext.issueId)) {
      setScreen("issue");
      setSelectedIssueId(composerContext.issueId);
    } else {
      goToFeed();
    }
    setComposerContext(null);
  }

  const headerLinks = useMemo(
    () => [
      {
        label: "Home",
        onClick: goToLanding,
        active: screen === "landing",
      },
      {
        label: "Debates",
        onClick: goToFeed,
        active:
          screen === "feed" ||
          screen === "issue" ||
          screen === "post" ||
          screen === "create" ||
          screen === "composer",
      },
    ],
    [screen],
  );

  const screenKey = useMemo(() => {
    if (screen === "issue" && selectedIssueId) return `issue-${selectedIssueId}`;
    if (screen === "post" && selectedPostId) return `post-${selectedPostId}`;
    if (screen === "composer") return "composer";
    return screen;
  }, [screen, selectedIssueId, selectedPostId]);

  function renderScreen() {
    switch (screen) {
      case "landing":
        return <LandingPage onEnterDebates={goToFeed} />;
      case "feed":
        return (
          <DebateFeed onOpenIssue={openIssue} onNewStarter={startStarter} />
        );
      case "create":
        return (
          <CreateDebateScreen
            onBack={backFromCreate}
            onContinue={startCustomDebate}
            isSubmitting={isCreatingDebate}
          />
        );
      case "issue":
        return selectedIssueId ? (
          <IssueThread
            issueId={selectedIssueId}
            posts={posts}
            onBack={goToFeed}
            onOpenPost={openPost}
            onNewStarter={() => startStarter(selectedIssueId)}
            onReply={startReply}
            onDeskBang={toggleDeskBang}
          />
        ) : null;
      case "post":
        if (selectedPost) {
          return (
            <PublishedArgumentView
              argument={selectedPost}
              posts={posts}
              isLoading={loadingPostId === selectedPost.id}
              onBack={() => {
                if (selectedPost.issueId) {
                  setSelectedIssueId(selectedPost.issueId);
                  setScreen("issue");
                } else {
                  goToFeed();
                }
              }}
              onDeskBang={() => toggleDeskBang(selectedPost.id)}
              onReply={() => startReply(selectedPost.id)}
              onThreadOpen={openPost}
              onThreadReply={startReply}
              onThreadDeskBang={toggleDeskBang}
            />
          );
        }
        return (
          <div className="w-full px-6 py-16 text-center text-muted-foreground lg:px-12 xl:px-16">
            Post not found.{" "}
            <button
              type="button"
              onClick={goToFeed}
              className="font-medium text-primary underline"
            >
              Back to debates
            </button>
          </div>
        );
      case "composer":
        return composerContext ? (
          <DebateApp
            context={composerContext}
            onBack={backFromComposer}
            onPosted={handlePosted}
            onFinished={() => {
              if (composerContext.isCustomDebate) {
                setComposerContext(null);
                setScreen("post");
                return;
              }

              const issueId = composerContext.issueId;
              setComposerContext(null);
              setSelectedIssueId(issueId);
              setScreen("issue");
            }}
          />
        ) : null;
      default:
        return null;
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <AppHeader
        links={headerLinks}
        onLogoClick={goToLanding}
        onCreate={() => setScreen("create")}
        createLabel="Create debate"
      />

      <AnimatePresence mode="wait">
        <PageTransition key={screenKey}>{renderScreen()}</PageTransition>
      </AnimatePresence>
    </div>
  );
}
