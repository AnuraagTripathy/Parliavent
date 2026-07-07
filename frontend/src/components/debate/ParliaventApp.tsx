"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@hexclave/next";
import { AnimatePresence } from "framer-motion";
import { AuthUserButton } from "@/components/auth/AuthUserButton";
import { AppHeader } from "@/components/ui/app-header";
import { PageTransition } from "@/components/ui/fade-in";
import { createDebate, deleteDraftPost, fetchDebate } from "@/lib/api/persistence";
import { excerptText } from "@/lib/excerptText";
import { generateThreadId } from "@/lib/generateThreadId";
import { CreateDebateScreen } from "./CreateDebateScreen";
import { DebateFeed } from "./DebateFeed";
import { DebateApp } from "./DebateApp";
import { IssueThread } from "./IssueThread";
import { PublishedArgumentView } from "./PublishedArgumentView";
import { getAuthorDisplayName } from "@/lib/auth/display-name";
import type {
  AppScreen,
  ComposerContext,
  PublishedArgument,
} from "@/lib/types";

interface ParliaventAppProps {
  /** When set, loads this debate thread from the URL (/app/debates/[slug]). */
  initialDebateSlug?: string;
}

export function ParliaventApp({ initialDebateSlug }: ParliaventAppProps = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useUser();
  const authorName = getAuthorDisplayName(user);
  const [screen, setScreen] = useState<AppScreen>(
    initialDebateSlug ? "issue" : "feed",
  );
  const [posts, setPosts] = useState<PublishedArgument[]>([]);
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(
    initialDebateSlug ?? null,
  );
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [composerContext, setComposerContext] =
    useState<ComposerContext | null>(null);
  const [isCreatingDebate, setIsCreatingDebate] = useState(false);
  const [loadingPostId, setLoadingPostId] = useState<string | null>(null);
  const [feedRefreshKey, setFeedRefreshKey] = useState(0);
  const [debateLoading, setDebateLoading] = useState(Boolean(initialDebateSlug));
  const composeHandledRef = useRef<string | null>(null);

  const composeParentId = searchParams.get("parent");
  const isComposeUrl = searchParams.get("compose") === "1";

  useEffect(() => {
    setPosts([]);
    if (!initialDebateSlug) {
      setScreen("feed");
      setSelectedIssueId(null);
    }
    setSelectedPostId(null);
    setComposerContext(null);
    setFeedRefreshKey((k) => k + 1);
  }, [user?.id, initialDebateSlug]);

  useEffect(() => {
    if (!initialDebateSlug) return;
    composeHandledRef.current = null;
    void loadDebateBySlug(initialDebateSlug);
  }, [initialDebateSlug]);

  useEffect(() => {
    if (!initialDebateSlug || !isComposeUrl || debateLoading) return;
    if (!composeParentId) return;

    const composeKey = `${initialDebateSlug}:${composeParentId}`;
    if (composeHandledRef.current === composeKey) return;
    composeHandledRef.current = composeKey;

    const parent = posts.find((p) => p.id === composeParentId);
    if (parent) {
      openReplyComposer(parent);
    }
  }, [
    initialDebateSlug,
    isComposeUrl,
    composeParentId,
    debateLoading,
    posts,
  ]);

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

  function mergeDebatePosts(savedPosts: PublishedArgument[]) {
    setPosts((prev) => {
      const savedIds = new Set(savedPosts.map((p) => p.id));
      const kept = prev.filter((p) => !savedIds.has(p.id));
      return [...savedPosts, ...kept];
    });
  }

  function debateThreadPath(slug: string) {
    return `/app/debates/${slug}`;
  }

  function debateComposePath(slug: string, parentId: string) {
    return `/app/debates/${slug}?compose=1&parent=${encodeURIComponent(parentId)}`;
  }

  async function loadDebateBySlug(slug: string) {
    setDebateLoading(true);
    try {
      const { debate } = await fetchDebate(slug);
      mergeDebatePosts(debate.posts);

      const starter =
        debate.posts.find((p) => p.kind === "starter" && !p.parentId) ??
        debate.posts.find((p) => p.kind === "starter") ??
        debate.posts[0];

      if (!starter) return;

      if (!starter.publishedAt) {
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
        return;
      }

      setSelectedIssueId(debate.slug);
      setSelectedPostId(null);
      if (!isComposeUrl) {
        setScreen("issue");
      }
    } catch (err) {
      console.warn("Could not open saved debate:", err);
    } finally {
      setDebateLoading(false);
    }
  }

  async function openSavedDebate(slugOrId: string) {
    try {
      const { debate } = await fetchDebate(slugOrId);
      mergeDebatePosts(debate.posts);
      router.push(debateThreadPath(debate.slug));
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

  function openReplyComposer(parent: PublishedArgument) {
    const parentExcerpt = excerptText(parent.text);
    const issueId = parent.issueId ?? parent.debateId ?? selectedIssueId ?? "";

    startComposer({
      mode: "response",
      issueId,
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
  }

  function startStarter(issueId: string) {
    const debatePost = posts.find((p) => p.issueId === issueId && p.debateId);
    if (debatePost?.debateId) {
      void startAnotherStarter(debatePost);
    }
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
        authorName,
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
    const parent = posts.find((p) => p.id === parentId);
    if (!parent) return;

    const slug = parent.issueId ?? selectedIssueId;
    if (slug) {
      router.push(debateComposePath(slug, parentId));
      return;
    }

    openReplyComposer(parent);
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
    const slug = post.issueId;
    if (slug) {
      router.replace(debateThreadPath(slug));
    }
    setSelectedIssueId(slug ?? null);
    setSelectedPostId(null);
    setScreen("issue");
    setFeedRefreshKey((k) => k + 1);
  }

  function goToLanding() {
    window.location.href = "/";
  }

  function goToFeed() {
    router.push("/app");
    setScreen("feed");
    setSelectedIssueId(null);
    setSelectedPostId(null);
    setComposerContext(null);
  }

  function returnToDebateThread(slug: string) {
    router.replace(debateThreadPath(slug));
    setSelectedIssueId(slug);
    setSelectedPostId(null);
    setScreen("issue");
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

    if (ctx?.parentId && ctx?.issueId) {
      returnToDebateThread(ctx.issueId);
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

    if (ctx?.parentId && ctx.issueId) {
      returnToDebateThread(ctx.issueId);
    } else if (ctx?.issueId) {
      returnToDebateThread(ctx.issueId);
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
        active: false,
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
    if (debateLoading && initialDebateSlug) {
      return (
        <div className="w-full px-6 py-16 text-center text-muted-foreground">
          Loading debate…
        </div>
      );
    }

    switch (screen) {
      case "feed":
        return (
          <DebateFeed
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
            onNewStarter={
              posts.some((p) => p.issueId === selectedIssueId && p.debateId)
                ? () => startStarter(selectedIssueId)
                : undefined
            }
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
                  router.push(debateThreadPath(selectedPost.issueId));
                  return;
                }
                goToFeed();
              }}
              onDeskBang={() => toggleDeskBang(selectedPost.id)}
              onReply={() => startReply(selectedPost.id)}
              onAnotherStarter={() => startAnotherStarter(selectedPost)}
              onOpenParent={
                selectedPost.parentId
                  ? () => openPost(selectedPost.parentId!)
                  : undefined
              }
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
            authorName={authorName}
            onBack={backFromComposer}
            onPosted={handlePosted}
            onFinished={() => {
              const ctx = composerContext;
              if (!ctx) return;

              if (ctx.parentId && ctx.debateId) {
                fetchDebate(ctx.debateId)
                  .then(({ debate }) => {
                    mergeDebatePosts(debate.posts);
                    returnToDebateThread(ctx.issueId);
                  })
                  .catch(() => {
                    returnToDebateThread(ctx.issueId);
                  });
                return;
              }

              if (ctx.isCustomDebate && ctx.issueId) {
                returnToDebateThread(ctx.issueId);
                return;
              }

              if (ctx.issueId) {
                returnToDebateThread(ctx.issueId);
                return;
              }

              goToFeed();
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
        authSlot={<AuthUserButton />}
      />

      <AnimatePresence mode="wait">
        <PageTransition key={screenKey}>{renderScreen()}</PageTransition>
      </AnimatePresence>
    </div>
  );
}
