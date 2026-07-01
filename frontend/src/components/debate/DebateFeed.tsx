"use client";

import { Flame, MessageSquare, Plus } from "lucide-react";
import {
  formatDeskBangs,
  getHotIssues,
  MOCK_ISSUES,
} from "@/lib/mockFeed";
import type { Issue } from "@/lib/types";

interface DebateFeedProps {
  onOpenIssue: (issueId: string) => void;
  onNewStarter: (issueId: string) => void;
}

function IssueCard({
  issue,
  onOpen,
  onNewStarter,
}: {
  issue: Issue;
  onOpen: () => void;
  onNewStarter: () => void;
}) {
  return (
    <article className="group overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 transition-all hover:border-zinc-700 hover:bg-zinc-900/80">
      <button type="button" onClick={onOpen} className="w-full px-5 py-4 text-left">
        <div className="mb-2.5 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            {issue.category}
          </span>
          {issue.isHot && (
            <span className="inline-flex items-center gap-1 rounded-md bg-orange-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-orange-400">
              <Flame className="h-3 w-3" strokeWidth={2.5} />
              Hot
            </span>
          )}
          <span className="text-[11px] text-zinc-600">{issue.lastActive}</span>
        </div>

        <h2 className="mb-2 text-[17px] font-bold leading-snug text-zinc-50 group-hover:text-white sm:text-[18px]">
          {issue.title}
        </h2>
        <p className="mb-3 line-clamp-2 text-[13px] leading-relaxed text-zinc-400">
          {issue.description}
        </p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-zinc-600">
          <span className="inline-flex items-center gap-1.5 font-medium text-zinc-500">
            <span aria-hidden>🪑</span>
            {formatDeskBangs(issue.deskBangs)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MessageSquare className="h-3.5 w-3.5" strokeWidth={2} />
            {issue.starterCount} starters · {issue.responseCount} replies
          </span>
        </div>
      </button>

      <div className="flex border-t border-zinc-800">
        <button
          type="button"
          onClick={onOpen}
          className="flex-1 py-2.5 text-[12px] font-semibold text-zinc-400 transition-colors hover:bg-zinc-800/50 hover:text-zinc-100"
        >
          Open thread
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNewStarter();
          }}
          className="flex flex-1 items-center justify-center gap-1.5 border-l border-zinc-800 py-2.5 text-[12px] font-semibold text-teal-400 transition-colors hover:bg-teal-500/10"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
          Starter
        </button>
      </div>
    </article>
  );
}

export function DebateFeed({ onOpenIssue, onNewStarter }: DebateFeedProps) {
  const hotIssues = getHotIssues();
  const otherIssues = MOCK_ISSUES.filter((i) => !i.isHot);

  return (
    <div className="mx-auto flex w-full max-w-5xl gap-8 px-4 py-6 lg:px-0">
      <main className="min-w-0 flex-1">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-50">
            Popping now
          </h1>
          <p className="mt-1 text-[13px] text-zinc-500">
            Live debates · vetted arguments · desk bangs
          </p>
        </div>

        <div className="mb-5 flex gap-4 border-b border-zinc-800">
          {(["hot", "new", "top"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              className={`-mb-px border-b-2 pb-2.5 text-[13px] font-semibold capitalize transition-colors ${
                tab === "hot"
                  ? "border-teal-400 text-zinc-50"
                  : "border-transparent text-zinc-600 hover:text-zinc-400"
              }`}
            >
              {tab === "hot" ? "Popping" : tab}
            </button>
          ))}
        </div>

        <section className="mb-10">
          <div className="flex flex-col gap-3">
            {hotIssues.map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                onOpen={() => onOpenIssue(issue.id)}
                onNewStarter={() => onNewStarter(issue.id)}
              />
            ))}
          </div>
        </section>

        {otherIssues.length > 0 && (
          <section>
            <h2 className="mb-3 text-[11px] font-bold uppercase tracking-widest text-zinc-600">
              More
            </h2>
            <div className="flex flex-col gap-3">
              {otherIssues.map((issue) => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  onOpen={() => onOpenIssue(issue.id)}
                  onNewStarter={() => onNewStarter(issue.id)}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      <aside className="hidden w-[260px] shrink-0 lg:block">
        <div className="sticky top-[65px] rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <h3 className="mb-2 text-[13px] font-bold text-zinc-200">
            How it works
          </h3>
          <div className="space-y-3 text-[12px] leading-relaxed text-zinc-500">
            <p>
              <span className="font-semibold text-zinc-400">Starters</span> open
              a position.{" "}
              <span className="font-semibold text-zinc-400">Replies</span> nest
              under any post — like Threads.
            </p>
            <p>
              Every post is reviewed before publishing. Attach sources, dispute
              flags, post anyway.
            </p>
            <p>
              <span className="font-semibold text-teal-400/90">🪑 Desk bang</span>{" "}
              when someone lands a point.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
