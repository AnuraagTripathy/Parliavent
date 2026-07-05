"use client";

import { useCallback, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { AppHeader } from "@/components/ui/app-header";
import { PageTransition } from "@/components/ui/fade-in";
import { createDebate, deleteDraftPost, fetchDebate } from "@/lib/api/persistence";
import { excerptText } from "@/lib/excerptText";
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
  const [feedRefreshKey, setFeedRefreshKey] = useState(0);

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

  function mergeDebatePosts(savedPosts: PublishedArgument[]) {
    setPosts((prev) => {
      const savedIds = new Set(savedPosts.map((p) => p.id));
      const kept = prev.filter((p) => !savedIds.has(p.id));
      return [...savedPosts, ...kept];
    });
  }

  async function openSavedDebate(debateId: string) {
    try {
      const { debate } = await fetchDebate(debateId);
      mergeDebatePosts(debate.posts);

      const starter =
        debate.posts.find((p) => p.kind === "starter" && !p.parentId) ??
        debate.posts[0];

      if (!starter) return;

      if (starter.publishedAt) {
        setSelectedPostId(starter.id);
        setScreen("post");
        return;
      }

      startComposer({
        mode: "starter",
        issueId: debate.slug,
        issueTitle: debate.motion,
        judgeMode: debate.mode,
        initialText: starter.text,
        isCustomDebate: true,
        debateId: debate.id,
        dbPostId: starter.dbPostId ?? starter.id,
      });
    } catch (err) {
      console.warn("Could not open saved debate:", err);
    }
  }

  function openPost(postId: string) {
    setSelectedPostId(postId);
    setScreen("post");

    const post = posts.find((p) => p.id === postId);
    if (post?.debateId) {
      setLoadingPostId(postId);
      fetchDebate(post.debateId)
        .then(({ debate }) => {
          const saved = debate.posts.find(
            (p) => p.id === postId || p.dbPostId === postId,
          );
          if (saved) {
            mergeDebatePosts(debate.posts);
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
      setFeedRefreshKey((k) => k + 1);
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
    if (!parent) return;

    const parentExcerpt = excerptText(parent.text);

    if (parent.debateId) {
      startComposer({
        mode: "response",
        issueId: parent.issueId ?? parent.debateId,
        issueTitle: parent.debateMotion ?? "Debate",
        judgeMode: parent.debateMode,
        parentId: parent.id,
        parentDbPostId: parent.dbPostId ?? parent.id,
        parentAuthor: parent.author,
        parentPreview: parentExcerpt,
        parentArgument: parent.text,
        debateId: parent.debateId,
        isSavedDebate: true,
      });
      return;
    }

    if (!parent.issueId) return;
    const issue = getIssue(parent.issueId);
    if (!issue) return;
    startComposer({
      mode: "response",
      issueId: parent.issueId,
      issueTitle: issue.title,
      parentId,
      parentAuthor: parent.author,
      parentPreview: parentExcerpt,
      parentArgument: parent.text,
    });
  }

  async function startAnotherStarter(sourcePost: PublishedArgument) {
    if (!sourcePost.debateId) return;

    try {
      const { debate } = await fetchDebate(sourcePost.debateId);
      startComposer({
        mode: "starter",
        issueId: debate.slug,
        issueTitle: debate.motion,
        judgeMode: debate.mode,
        initialText: "",
        debateId: debate.id,
        isSavedDebate: true,
        isAdditionalStarter: true,
      });
    } catch (err) {
      console.warn("Could not start another argument:", err);
    }
  }

  function handlePosted(post: PublishedArgument) {
    setPosts((prev) => [post, ...prev]);
    setSelectedIssueId(post.issueId ?? null);
    setSelectedPostId(post.id);
    setFeedRefreshKey((k) => k + 1);
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

  async function backFromComposer() {
    const ctx = composerContext;
    if (ctx?.dbPostId && ctx.isSavedDebate) {
      try {
        await deleteDraftPost(ctx.dbPostId);
      } catch {
        // Draft may already be published or removed
      }
    }

    if (ctx?.parentId && ctx?.debateId) {
      setSelectedPostId(ctx.parentId);
      setScreen("post");
      setComposerContext(null);
      if (ctx.debateId) {
        fetchDebate(ctx.debateId)
          .then(({ debate }) => mergeDebatePosts(debate.posts))
          .catch(() => {});
      }
      return;
    }

    if (ctx?.isAdditionalStarter && ctx.debateId) {
      setComposerContext(null);
      goToFeed();
      return;
    }

    if (ctx?.isCustomDebate) {
      goToFeed();
      setComposerContext(null);
      return;
    }

    if (ctx?.parentId) {
      setScreen("issue");
      setSelectedIssueId(ctx.issueId);
    } else if (ctx?.issueId && getIssue(ctx.issueId)) {
      setScreen("issue");
      setSelectedIssueId(ctx.issueId);
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
          <DebateFeed
            onOpenIssue={openIssue}
            onNewStarter={startStarter}
            onOpenSavedDebate={openSavedDebate}
            refreshKey={feedRefreshKey}
          />
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
                if (selectedPost.debateId) {
                  if (selectedPost.parentId) {
                    setSelectedPostId(selectedPost.parentId);
                    setScreen("post");
                    return;
                  }
                  goToFeed();
                  return;
                }
                if (selectedPost.issueId && getIssue(selectedPost.issueId)) {
                  setSelectedIssueId(selectedPost.issueId);
                  setScreen("issue");
                } else {
                  goToFeed();
                }
              }}
              onDeskBang={() => toggleDeskBang(selectedPost.id)}
              onReply={() => startReply(selectedPost.id)}
              onAnotherStarter={() => startAnotherStarter(selectedPost)}
              onOpenParent={
                selectedPost.parentId
                  ? () => openPost(selectedPost.parentId!)
                  : undefined
              }
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
              const ctx = composerContext;
              if (!ctx) return;

              if (ctx.parentId && ctx.debateId) {
                setComposerContext(null);
                fetchDebate(ctx.debateId)
                  .then(({ debate }) => {
                    mergeDebatePosts(debate.posts);
                    setSelectedPostId(ctx.parentId!);
                    setScreen("post");
                  })
                  .catch(() => {
                    setSelectedPostId(ctx.parentId!);
                    setScreen("post");
                  });
                return;
              }

              if (ctx.isCustomDebate) {
                setComposerContext(null);
                setScreen("post");
                return;
              }

              const issueId = ctx.issueId;
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
