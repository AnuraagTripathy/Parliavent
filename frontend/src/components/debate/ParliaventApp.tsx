"use client";

import { useCallback, useState } from "react";
import { CreateDebateScreen } from "./CreateDebateScreen";
import { DebateFeed } from "./DebateFeed";
import { DebateApp } from "./DebateApp";
import { IssueThread } from "./IssueThread";
import { PublishedArgumentView } from "./PublishedArgumentView";
import { SiteHeader } from "./SiteHeader";
import { generateThreadId } from "@/lib/generateThreadId";
import { getIssue, getPost, MOCK_POSTS } from "@/lib/mockFeed";
import type {
  AppScreen,
  ComposerContext,
  PublishedArgument,
} from "@/lib/types";

export function ParliaventApp() {
  const [screen, setScreen] = useState<AppScreen>("feed");
  const [posts, setPosts] = useState<PublishedArgument[]>(() => [
    ...MOCK_POSTS,
  ]);
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [composerContext, setComposerContext] =
    useState<ComposerContext | null>(null);

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

  function startCustomDebate(draft: {
    motion: string;
    argument: string;
    judgeMode: ComposerContext["judgeMode"];
  }) {
    startComposer({
      mode: "starter",
      issueId: generateThreadId(draft.motion),
      issueTitle: draft.motion,
      judgeMode: draft.judgeMode ?? "structured_debate",
      initialText: draft.argument,
      isCustomDebate: true,
    });
  }

  function backFromCreate() {
    navigateHome();
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

  function navigateHome() {
    setScreen("feed");
    setSelectedIssueId(null);
    setSelectedPostId(null);
    setComposerContext(null);
  }

  function backFromComposer() {
    if (composerContext?.isCustomDebate) {
      navigateHome();
      return;
    }

    if (composerContext?.parentId) {
      setScreen("issue");
      setSelectedIssueId(composerContext.issueId);
    } else if (composerContext?.issueId && getIssue(composerContext.issueId)) {
      setScreen("issue");
      setSelectedIssueId(composerContext.issueId);
    } else {
      navigateHome();
    }
    setComposerContext(null);
  }

  const subtitle =
    screen === "create"
      ? "Create debate"
      : screen === "composer"
        ? composerContext?.mode === "response"
          ? "Write response"
          : "Write starter"
        : screen === "issue"
          ? "Debate"
          : screen === "post"
            ? "Argument"
            : undefined;

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <SiteHeader
        screen={screen}
        onNavigate={(next) => {
          if (next === "feed") navigateHome();
          if (next === "composer" && composerContext) setScreen("composer");
        }}
        subtitle={subtitle}
        onCreateStarter={() => setScreen("create")}
      />

      {screen === "feed" && (
        <DebateFeed
          onOpenIssue={openIssue}
          onNewStarter={startStarter}
        />
      )}

      {screen === "create" && (
        <CreateDebateScreen
          onBack={backFromCreate}
          onContinue={startCustomDebate}
        />
      )}

      {screen === "issue" && selectedIssueId && (
        <IssueThread
          issueId={selectedIssueId}
          posts={posts}
          onBack={navigateHome}
          onOpenPost={openPost}
          onNewStarter={() => startStarter(selectedIssueId)}
          onReply={startReply}
          onDeskBang={toggleDeskBang}
        />
      )}

      {screen === "post" && selectedPost && (
        <PublishedArgumentView
          argument={selectedPost}
          posts={posts}
          onBack={() => {
            if (selectedPost.issueId) {
              setSelectedIssueId(selectedPost.issueId);
              setScreen("issue");
            } else {
              navigateHome();
            }
          }}
          onDeskBang={() => toggleDeskBang(selectedPost.id)}
          onReply={() => startReply(selectedPost.id)}
          onThreadOpen={openPost}
          onThreadReply={startReply}
          onThreadDeskBang={toggleDeskBang}
        />
      )}

      {screen === "post" && !selectedPost && (
        <div className="mx-auto px-4 py-16 text-center text-[14px] text-[#6a6a66]">
          Post not found.{" "}
          <button
            type="button"
            onClick={navigateHome}
            className="font-medium text-[#1a1a18] underline"
          >
            Back to home
          </button>
        </div>
      )}

      {screen === "composer" && composerContext && (
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
      )}
    </div>
  );
}
