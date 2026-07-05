"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { getIssue } from "@/lib/mockFeed";
import { startersToComments } from "@/lib/postsToCommentTree";
import type { PublishedArgument } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ParliaventDebateThread,
  type DebateCommentMeta,
} from "./ParliaventDebateThread";

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

  const issuePosts = useMemo(
    () => posts.filter((p) => p.issueId === issueId),
    [posts, issueId],
  );

  const starters = useMemo(() => {
    const list = issuePosts.filter((p) => p.kind === "starter");
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
  }, [issuePosts, sort]);

  const comments = useMemo(
    () => startersToComments(starters, issuePosts),
    [starters, issuePosts],
  );

  const getMeta = useMemo(() => {
    const map = new Map<string, DebateCommentMeta>();
    for (const post of issuePosts) {
      map.set(post.id, {
        deskBangs: post.deskBangs ?? 0,
        userBanged: post.userBanged ?? false,
        isStarter: post.kind === "starter",
        sourceCount: post.sources.length,
        contestedFallacies: post.contestedFallacies,
      });
    }
    return (id: string | number) => map.get(String(id));
  }, [issuePosts]);

  if (!issue) {
    return (
      <div className="w-full px-6 py-16 text-center text-muted-foreground lg:px-12">
        Issue not found.
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-8 md:px-8 lg:px-12 xl:px-16">
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="mb-6 h-8 px-2 text-xs text-muted-foreground"
      >
        <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
        All debates
      </Button>

      <div className="grid w-full gap-10 xl:grid-cols-[minmax(280px,360px)_1fr]">
        <aside className="xl:sticky xl:top-24 xl:self-start">
          <Card className="border-border/80 bg-card">
            <CardContent className="p-6 md:p-8">
              <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                {issue.category}
              </span>
              <h1 className="mb-3 font-serif text-3xl font-medium leading-tight tracking-tight text-foreground md:text-4xl">
                {issue.title}
              </h1>
              <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                {issue.description}
              </p>
              <div className="mb-6 flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span>{issue.starterCount} starters</span>
                <span>{issue.responseCount} replies</span>
                <span>🪑 {issue.deskBangs}</span>
              </div>
              <Button onClick={onNewStarter} className="w-full">
                <Plus className="mr-1.5 h-4 w-4" strokeWidth={2.5} />
                Post starter
              </Button>
            </CardContent>
          </Card>
        </aside>

        <main className="min-w-0">
          <div className="mb-6 flex gap-6 border-b border-border">
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
                className={`-mb-px border-b-2 pb-3 text-sm font-semibold transition-colors ${
                  sort === tab.id
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <ParliaventDebateThread
            comments={comments}
            getMeta={getMeta}
            onOpenPost={onOpenPost}
            onReply={onReply}
            onDeskBang={onDeskBang}
          />
        </main>
      </div>
    </div>
  );
}
