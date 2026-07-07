"use client";

import { useCallback, useMemo, useState } from "react";
import { useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { startersToComments } from "@/lib/postsToCommentTree";
import { buildPostReviewMeta } from "@/lib/buildPostReviewMeta";
import { getShowcaseMeta } from "@/lib/showcaseMeta";
import type { PublishedArgument } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { DebateThreadHeader } from "./DebateThreadHeader";
import {
  ParliaventDebateThread,
  type DebateCommentMeta,
} from "./ParliaventDebateThread";

interface IssueThreadProps {
  issueId: string;
  posts: PublishedArgument[];
  onBack: () => void;
  onNewStarter?: () => void;
  onReply: (postId: string) => void;
  onDeskBang: (postId: string) => void;
}

const PAGE_X = "px-4 md:px-8 lg:px-12 xl:px-16";
const COLLAPSE_DISTANCE = 112;

export function IssueThread({
  issueId,
  posts,
  onBack,
  onNewStarter,
  onReply,
  onDeskBang,
}: IssueThreadProps) {
  const showcaseMeta = getShowcaseMeta(issueId);
  const [sort, setSort] = useState<"top" | "new" | "contested">("top");
  const prefersReducedMotion = useReducedMotion();
  const collapseTarget = useMotionValue(0);
  const collapse = useSpring(collapseTarget, {
    stiffness: 260,
    damping: 32,
    mass: 0.85,
  });

  const issuePosts = useMemo(
    () => posts.filter((p) => p.issueId === issueId),
    [posts, issueId],
  );

  const debateMotion = issuePosts[0]?.debateMotion;
  const title = debateMotion ?? issueId;
  const description =
    showcaseMeta?.description ??
    "Read arguments and review notes inline — reply to join the debate.";

  const starters = useMemo(() => {
    const list = issuePosts.filter((p) => p.kind === "starter" && !p.parentId);
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
    () => startersToComments(starters, issuePosts, true),
    [starters, issuePosts],
  );

  const getMeta = useMemo(() => {
    const map = new Map<string, DebateCommentMeta>();
    for (const post of issuePosts) {
      const review = buildPostReviewMeta(post);
      map.set(post.id, {
        deskBangs: post.deskBangs ?? 0,
        userBanged: post.userBanged ?? false,
        isStarter: post.kind === "starter",
        sourceCount: review.sourceCount,
        review,
      });
    }
    return (id: string | number) => map.get(String(id));
  }, [issuePosts]);

  const replyCount = issuePosts.filter((p) => p.kind === "response").length;

  const handleThreadScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const scrollTop = event.currentTarget.scrollTop;
      if (prefersReducedMotion) {
        collapseTarget.set(scrollTop > 48 ? 1 : 0);
        return;
      }

      const progress = Math.min(1, Math.max(0, scrollTop / COLLAPSE_DISTANCE));
      collapseTarget.set(progress);
    },
    [collapseTarget, prefersReducedMotion],
  );

  if (issuePosts.length === 0) {
    return (
      <div className="w-full px-6 py-16 text-center text-muted-foreground lg:px-12">
        Debate not found.
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] flex-col overflow-hidden">
      <DebateThreadHeader
        title={title}
        description={description}
        category={showcaseMeta?.category ?? "Debate"}
        starterCount={starters.length}
        replyCount={replyCount}
        sort={sort}
        onSortChange={setSort}
        onBack={onBack}
        onNewStarter={onNewStarter}
        collapse={collapse}
      />

      <ScrollArea
        className="min-h-0 flex-1"
        scrollbarClassName="w-1.5 border-l-0 p-0"
        onViewportScroll={handleThreadScroll}
      >
        <div className={cn(PAGE_X, "w-full py-5 md:py-6")}>
          <ParliaventDebateThread
            comments={comments}
            getMeta={getMeta}
            onReply={onReply}
            onDeskBang={onDeskBang}
          />
        </div>
      </ScrollArea>
    </div>
  );
}
