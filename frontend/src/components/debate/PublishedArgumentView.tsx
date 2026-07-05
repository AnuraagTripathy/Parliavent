"use client";

import { useState } from "react";
import { ArrowLeft, ExternalLink, MessageSquare, PenLine, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { formatByline } from "@/lib/buildPublishedArgument";
import {
  buildPostTree,
  countDescendants,
  getChildren,
} from "@/lib/buildPostTree";
import { getIssue } from "@/lib/mockFeed";
import { getCitationColor } from "@/lib/mockPublishedArguments";
import { buildSourceIndex, highlightCitations } from "@/lib/highlightCitations";
import { startersToComments } from "@/lib/postsToCommentTree";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SkeletonPost } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { ContestedChip } from "./ContestedChip";
import { DeskBangButton } from "./DeskBangButton";
import {
  ParliaventDebateThread,
  type DebateCommentMeta,
} from "./ParliaventDebateThread";

import type { CitationSegment } from "@/lib/highlightCitations";
import type { PublishedArgument, Source } from "@/lib/types";

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
  onThreadOpen?: (postId: string) => void;
  onThreadDeskBang?: (postId: string) => void;
  posts?: PublishedArgument[];
  isLoading?: boolean;
}

function CitationText({
  segments,
  sources,
  hoveredSourceIndex,
  onSourceHover,
}: {
  segments: CitationSegment[];
  sources: Source[];
  hoveredSourceIndex?: number | null;
  onSourceHover?: (index: number | null) => void;
}) {
  return (
    <>
      {segments.map((segment, i) => {
        if (segment.citationIndex !== undefined) {
          const color = getCitationColor(segment.citationIndex);
          const marker = segment.citationIndex + 1;
          const sourceId = `source-${sources[segment.citationIndex]?.id}`;

          return (
            <span
              key={i}
              className={cn(
                "citation-passage",
                hoveredSourceIndex === segment.citationIndex &&
                  "citation-passage--active",
              )}
              style={
                {
                  "--cite-bg": `${color.bg}22`,
                  "--cite-underline": color.underline,
                  "--cite-marker": color.marker,
                } as React.CSSProperties
              }
              onMouseEnter={() => onSourceHover?.(segment.citationIndex!)}
              onMouseLeave={() => onSourceHover?.(null)}
            >
              <mark>{segment.text}</mark>
              <a
                href={`#${sourceId}`}
                className="cite-marker ml-0.5 inline-flex align-super text-[11px] font-bold no-underline"
                style={{ color: color.marker }}
                aria-label={`Source ${marker}`}
                onFocus={() => onSourceHover?.(segment.citationIndex!)}
                onBlur={() => onSourceHover?.(null)}
              >
                [{marker}]
              </a>
            </span>
          );
        }

        if (segment.caveatMessage) {
          return (
            <span
              key={i}
              className="border-b border-dotted border-amber-500/50 text-foreground/90"
            >
              {segment.text}
            </span>
          );
        }

        return (
          <span key={i} className="text-foreground/90">
            {segment.text}
          </span>
        );
      })}
    </>
  );
}

function SourceListItem({
  source,
  index,
  isHighlighted,
  onSourceHover,
}: {
  source: Source;
  index: number;
  isHighlighted?: boolean;
  onSourceHover?: (index: number | null) => void;
}) {
  const color = getCitationColor(index);
  const sourceId = `source-${source.id}`;

  return (
    <a
      id={sourceId}
      href={source.url ?? "#"}
      target={source.url ? "_blank" : undefined}
      rel={source.url ? "noopener noreferrer" : undefined}
      className={cn(
        "group scroll-mt-24 rounded-lg border border-border bg-card/60 p-3.5 transition-all duration-200 hover:bg-muted/30",
        isHighlighted && "bg-muted/40 shadow-sm shadow-black/20",
      )}
      style={{
        borderLeftColor: color.ring,
        borderLeftWidth: isHighlighted ? 3 : 2,
      }}
      onMouseEnter={() => onSourceHover?.(index)}
      onMouseLeave={() => onSourceHover?.(null)}
    >
      <div className="mb-1.5 flex items-center gap-2">
        <span
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-bold"
          style={{
            backgroundColor: `${color.bg}44`,
            color: color.marker,
          }}
        >
          {index + 1}
        </span>
        <span className="text-[12px] font-medium leading-snug text-foreground/90 group-hover:text-foreground">
          {source.title}
        </span>
        {source.url && (
          <ExternalLink className="ml-auto h-3 w-3 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        )}
      </div>
      <p className="pl-7 text-[11px] text-muted-foreground">
        {source.publisher}
        {source.isSample && " · sample"}
      </p>
    </a>
  );
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
  onThreadOpen,
  onThreadDeskBang,
  posts = [],
  isLoading = false,
}: PublishedArgumentViewProps) {
  const [hoveredSourceIndex, setHoveredSourceIndex] = useState<number | null>(
    null,
  );
  const sourceIndex = buildSourceIndex(argument);
  const segments = highlightCitations(
    argument.text,
    argument.citations,
    sourceIndex,
    argument.claimCaveats ?? [],
  );
  const isAuthor = variant === "author";
  const issue = argument.issueId ? getIssue(argument.issueId) : undefined;
  const contextLabel =
    issue?.title ?? argument.debateMotion ?? "Argument";
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

  const replyComments = startersToComments(directReplies, posts);
  const replyMetaMap = new Map<string, DebateCommentMeta>();
  for (const post of posts) {
    replyMetaMap.set(post.id, {
      deskBangs: post.deskBangs ?? 0,
      userBanged: post.userBanged ?? false,
      isStarter: post.kind === "starter",
      sourceCount: post.sources.length,
      contestedFallacies: post.contestedFallacies,
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

      <div
        className={cn(
          "grid w-full gap-8",
          !isLoading &&
            argument.sources.length > 0 &&
            "xl:grid-cols-[1fr_minmax(280px,320px)]",
        )}
      >
        <div className="min-w-0 space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              <Spinner label="Loading saved post…" />
              <SkeletonPost />
            </div>
          ) : (
            <>
              {issue ? (
                <div>
                  <span className="mb-2 inline-block text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                    {issue.category}
                  </span>
                  <h1 className="font-serif text-2xl font-medium leading-tight tracking-tight text-foreground md:text-3xl">
                    {issue.title}
                  </h1>
                </div>
              ) : argument.debateMotion ? (
                <div>
                  <h1 className="font-serif text-2xl font-medium leading-tight tracking-tight text-foreground md:text-3xl">
                    {argument.debateMotion}
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
                  {(argument.contestedFallacies?.length ?? 0) > 0 && (
                    <div className="space-y-2 rounded-lg border border-border/80 bg-muted/30 px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {argument.contestedFallacies!.map((fallacy) => (
                          <ContestedChip key={fallacy} fallacyName={fallacy} />
                        ))}
                      </div>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        The author disagreed with the judge&apos;s fallacy flag.
                        Click a chip to learn what the term means.
                      </p>
                    </div>
                  )}

                  {argument.caveats?.map((caveat) => (
                    <p
                      key={caveat}
                      className="text-sm italic text-muted-foreground"
                    >
                      {caveat}
                    </p>
                  ))}

                  <div className="whitespace-pre-wrap text-base leading-relaxed text-foreground/90 md:text-[17px] md:leading-[1.75]">
                    <CitationText
                      segments={segments}
                      sources={argument.sources}
                      hoveredSourceIndex={hoveredSourceIndex}
                      onSourceHover={setHoveredSourceIndex}
                    />
                  </div>

                  {(argument.claimCaveats?.length ?? 0) > 0 && (
                    <div className="space-y-2 border-t border-border pt-5">
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Source notes
                      </p>
                      {argument.claimCaveats!.map((caveat) => (
                        <div
                          key={caveat.id}
                          className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3"
                        >
                          <p className="text-sm leading-relaxed text-foreground/90">
                            &ldquo;{caveat.spanText}&rdquo;
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {caveat.message}
                          </p>
                        </div>
                      ))}
                    </div>
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
                      onOpenPost={(id) => onThreadOpen?.(id)}
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
                      <button
                        key={starter.id}
                        type="button"
                        onClick={() => onThreadOpen?.(starter.id)}
                        className="w-full rounded-lg border border-border bg-card/60 px-4 py-3 text-left transition-colors hover:bg-muted/30"
                      >
                        <p className="mb-1 text-xs text-muted-foreground">
                          {starter.author} · {starter.postedAt}
                        </p>
                        <p className="line-clamp-2 text-sm text-foreground/85">
                          {starter.text}
                        </p>
                      </button>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>

        {!isLoading && argument.sources.length > 0 && (
          <aside className="xl:sticky xl:top-[4.5rem] xl:self-start">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Sources
            </p>
            <div className="flex flex-col gap-3">
              {argument.sources.map((source, index) => (
                <SourceListItem
                  key={source.id}
                  source={source}
                  index={index}
                  isHighlighted={hoveredSourceIndex === index}
                  onSourceHover={setHoveredSourceIndex}
                />
              ))}
            </div>
          </aside>
        )}
      </div>
    </motion.div>
  );
}
