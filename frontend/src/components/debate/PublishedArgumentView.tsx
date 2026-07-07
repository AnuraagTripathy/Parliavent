"use client";

import { ArrowLeft, MessageSquare, PenLine, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { formatByline } from "@/lib/buildPublishedArgument";
import {
  buildPostTree,
  countDescendants,
  getChildren,
} from "@/lib/buildPostTree";
import { buildPostReviewMeta } from "@/lib/buildPostReviewMeta";
import { getShowcaseMeta } from "@/lib/showcaseMeta";
import { startersToComments } from "@/lib/postsToCommentTree";
import type { PublishedArgument } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SkeletonPost } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { DeskBangButton } from "./DeskBangButton";
import { PostReviewPanel } from "./PostReviewPanel";
import {
  ParliaventDebateThread,
  type DebateCommentMeta,
} from "./ParliaventDebateThread";

import { PostBodyWithSources } from "./PostCitations";

interface PublishedArgumentViewProps {
  argument: PublishedArgument;
  onBack: () => void;
  variant?: "feed" | "author";
  onDeskBang?: () => void;
  onDone?: () => void;
  onReply?: () => void;
  onAnotherStarter?: () => void;
  onOpenParent?: () => void;
  onThreadReply?: (postId: string) => void;
  onThreadDeskBang?: (postId: string) => void;
  posts?: PublishedArgument[];
  isLoading?: boolean;
}

export function PublishedArgumentView({
  argument,
  onBack,
  variant = "feed",
  onDeskBang,
  onDone,
  onReply,
  onAnotherStarter,
  onOpenParent,
  onThreadReply,
  onThreadDeskBang,
  posts = [],
  isLoading = false,
}: PublishedArgumentViewProps) {
  const isAuthor = variant === "author";
  const showcaseMeta = argument.issueId
    ? getShowcaseMeta(argument.issueId)
    : undefined;
  const contextLabel = argument.debateMotion ?? "Argument";
  const isSavedDebate = Boolean(argument.debateId);
  const parentPost = argument.parentId
    ? posts.find((p) => p.id === argument.parentId)
    : undefined;

  const directReplies =
    posts.length > 0 ? getChildren(posts, argument.id) : [];
  const otherStarters =
    isSavedDebate && argument.kind === "starter"
      ? posts.filter(
          (p) =>
            p.debateId === argument.debateId &&
            p.kind === "starter" &&
            !p.parentId &&
            p.id !== argument.id &&
            p.publishedAt,
        )
      : [];
  const totalReplyCount = directReplies.reduce((sum, child) => {
    const node = buildPostTree(posts, child.id);
    return sum + 1 + countDescendants(node);
  }, 0);

  const replyComments = startersToComments(directReplies, posts, true);
  const postReview = buildPostReviewMeta(argument);
  const replyMetaMap = new Map<string, DebateCommentMeta>();
  for (const post of posts) {
    const review = buildPostReviewMeta(post);
    replyMetaMap.set(post.id, {
      deskBangs: post.deskBangs ?? 0,
      userBanged: post.userBanged ?? false,
      isStarter: post.kind === "starter",
      sourceCount: review.sourceCount,
      review,
    });
  }
  const getReplyMeta = (id: string | number) => replyMetaMap.get(String(id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="w-full px-4 py-8 md:px-8 lg:px-12 xl:px-16"
    >
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="h-8 px-2 text-xs text-muted-foreground"
        >
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
          {isAuthor ? "Back to edit" : "Back to thread"}
        </Button>
        {isAuthor && onDone && (
          <Button size="sm" onClick={onDone} className="h-8 text-xs font-semibold">
            View in debate
          </Button>
        )}
        {!isAuthor && onReply && (
          <Button
            variant="outline"
            size="sm"
            onClick={onReply}
            className="h-8 text-xs font-semibold"
          >
            <MessageSquare className="mr-1.5 h-3.5 w-3.5" strokeWidth={2} />
            Reply
          </Button>
        )}
        {!isAuthor && onAnotherStarter && isSavedDebate && argument.kind === "starter" && (
          <Button
            variant="outline"
            size="sm"
            onClick={onAnotherStarter}
            className="h-8 text-xs font-semibold"
          >
            <PenLine className="mr-1.5 h-3.5 w-3.5" strokeWidth={2} />
            Another argument
          </Button>
        )}
      </div>

      <div className="grid w-full gap-8">
        <div className="min-w-0 space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              <Spinner label="Loading saved post…" />
              <SkeletonPost />
            </div>
          ) : (
            <>
              {showcaseMeta || argument.debateMotion ? (
                <div>
                  {showcaseMeta && (
                    <span className="mb-2 inline-block text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                      {showcaseMeta.category}
                    </span>
                  )}
                  <h1 className="font-serif text-2xl font-medium leading-tight tracking-tight text-foreground md:text-3xl">
                    {argument.debateMotion ?? contextLabel}
                  </h1>
                </div>
              ) : (
                <Badge
                  variant="secondary"
                  className="border-transparent bg-muted text-[10px] uppercase tracking-[0.16em] text-muted-foreground"
                >
                  {contextLabel}
                </Badge>
              )}

              {argument.kind === "response" && parentPost && (
                <div className="rounded-lg border border-border bg-muted/20 px-4 py-3">
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    In reply to {parentPost.author}
                  </p>
                  <p className="line-clamp-2 text-sm text-foreground/75">
                    &ldquo;{parentPost.text.slice(0, 160)}
                    {parentPost.text.length > 160 ? "…" : ""}&rdquo;
                  </p>
                  {onOpenParent && (
                    <button
                      type="button"
                      onClick={onOpenParent}
                      className="mt-2 text-xs font-medium text-primary hover:underline"
                    >
                      View parent post
                    </button>
                  )}
                </div>
              )}

              <Card className="border-border/80 bg-card">
                <CardHeader className="space-y-0 p-5 md:p-6">
                  <div className="flex flex-wrap items-center gap-3">
                    {!isAuthor && onDeskBang && (
                      <DeskBangButton
                        count={argument.deskBangs ?? 0}
                        banged={argument.userBanged ?? false}
                        onToggle={onDeskBang}
                        layout="horizontal"
                      />
                    )}
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={`https://api.dicebear.com/8.x/lorelei/svg?seed=${encodeURIComponent(argument.author)}`}
                        alt=""
                      />
                      <AvatarFallback className="bg-primary/10 text-xs font-bold">
                        {argument.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground">
                        {argument.author}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {argument.postedAt}
                      </p>
                    </div>
                    {isAuthor ? (
                      <Badge
                        variant="secondary"
                        className="border-transparent bg-primary/10 text-[10px] text-primary"
                      >
                        <ShieldCheck className="mr-1 h-3 w-3" strokeWidth={2} />
                        {formatByline(argument)}
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="border-transparent bg-primary/10 text-[10px] text-primary"
                      >
                        <ShieldCheck className="mr-1 h-3 w-3" strokeWidth={2} />
                        Vetted
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-5 px-5 pb-6 md:px-6">
                  <PostBodyWithSources
                    text={argument.text}
                    sources={argument.sources}
                    citations={argument.citations}
                    claimCaveats={argument.claimCaveats ?? []}
                    postId={argument.id}
                  />

                  {postReview.hasReview && (
                    <PostReviewPanel
                      review={postReview}
                      hideSources
                      className="border-t border-border pt-5"
                    />
                  )}
                </CardContent>
              </Card>

              {!isAuthor && directReplies.length > 0 && (
                <section className="border-t border-border pt-8">
                  <p className="mb-5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Replies · {totalReplyCount}
                  </p>
                  <div className="border-l-2 border-border/80 pl-4 md:pl-6">
                    <ParliaventDebateThread
                      comments={replyComments}
                      getMeta={getReplyMeta}
                      initialDepth={1}
                      onReply={onThreadReply}
                      onDeskBang={(id) => onThreadDeskBang?.(id)}
                    />
                  </div>
                </section>
              )}

              {otherStarters.length > 0 && (
                <section className="border-t border-border pt-8">
                  <p className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Other arguments in this debate
                  </p>
                  <div className="space-y-3">
                    {otherStarters.map((starter) => (
                      <div
                        key={starter.id}
                        className="rounded-lg border border-border bg-card/60 px-4 py-3"
                      >
                        <p className="mb-1 text-xs text-muted-foreground">
                          {starter.author} · {starter.postedAt}
                        </p>
                        <p className="line-clamp-2 text-sm text-foreground/85">
                          {starter.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
