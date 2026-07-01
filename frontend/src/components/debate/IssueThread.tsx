"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { buildPostTree, countDescendants } from "@/lib/buildPostTree";
import { getIssue } from "@/lib/mockFeed";
import type { PublishedArgument } from "@/lib/types";
import { ThreadBranch } from "./ThreadBranch";

interface IssueThreadProps {
  issueId: string;
  posts: PublishedArgument[];
  onBack: () => void;
  onOpenPost: (postId: string) => void;
  onNewStarter: () => void;
  onReply: (postId: string) => void;
  onDeskBang: (postId: string) => void;
}

export function IssueThread({
  issueId,
  posts,
  onBack,
  onOpenPost,
  onNewStarter,
  onReply,
  onDeskBang,
}: IssueThreadProps) {
  const issue = getIssue(issueId);
  const [sort, setSort] = useState<"top" | "new" | "contested">("top");

  const starters = useMemo(() => {
    const list = posts.filter(
      (p) => p.issueId === issueId && p.kind === "starter",
    );
    if (sort === "top") {
      return [...list].sort((a, b) => (b.deskBangs ?? 0) - (a.deskBangs ?? 0));
    }
    if (sort === "contested") {
      return [...list].sort(
        (a, b) =>
          (b.contestedFallacies?.length ?? 0) -
          (a.contestedFallacies?.length ?? 0),
      );
    }
    return list;
  }, [posts, issueId, sort]);

  if (!issue) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center text-[14px] text-zinc-500">
        Issue not found.
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6 lg:px-0">
      <button
        type="button"
        onClick={onBack}
        className="mb-5 inline-flex items-center gap-1.5 text-[12px] font-medium text-zinc-500 transition-colors hover:text-zinc-200"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back
      </button>

      <header className="mb-8 border-b border-zinc-800 pb-6">
        <span className="mb-3 inline-block text-[11px] font-semibold uppercase tracking-[0.16em] text-teal-400/80">
          {issue.category}
        </span>
        <h1 className="mb-2 text-2xl font-bold leading-tight tracking-tight text-zinc-50 sm:text-[28px]">
          {issue.title}
        </h1>
        <p className="mb-4 text-[14px] leading-relaxed text-zinc-400">
          {issue.description}
        </p>
        <div className="flex flex-wrap items-center gap-3 text-[12px] text-zinc-600">
          <span>{issue.starterCount} starters</span>
          <span className="text-zinc-700">·</span>
          <span>{issue.responseCount} replies</span>
          <span className="text-zinc-700">·</span>
          <span>🪑 {issue.deskBangs}</span>
        </div>
        <button
          type="button"
          onClick={onNewStarter}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-zinc-100 px-4 py-2 text-[13px] font-semibold text-zinc-950 transition-colors hover:bg-white"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Post starter
        </button>
      </header>

      <div className="mb-6 flex gap-4 border-b border-zinc-800">
        {(
          [
            { id: "top", label: "Top" },
            { id: "new", label: "New" },
            { id: "contested", label: "Contested" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSort(tab.id)}
            className={`-mb-px border-b-2 pb-2.5 text-[13px] font-semibold transition-colors ${
              sort === tab.id
                ? "border-teal-400 text-zinc-50"
                : "border-transparent text-zinc-600 hover:text-zinc-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-10">
        {starters.map((starter) => {
          const tree = buildPostTree(posts, starter.id);
          const replyCount = countDescendants(tree);

          return (
            <section
              key={starter.id}
              className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 sm:p-5"
            >
              {replyCount > 0 && (
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
                  {replyCount} {replyCount === 1 ? "reply" : "replies"}
                </p>
              )}
              <ThreadBranch
                node={tree}
                onOpenPost={onOpenPost}
                onReply={onReply}
                onDeskBang={onDeskBang}
                isRoot
              />
            </section>
          );
        })}
      </div>
    </div>
  );
}
