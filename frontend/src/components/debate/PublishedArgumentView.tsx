"use client";

import { useState } from "react";
import { ArrowLeft, ExternalLink, MessageSquare, ShieldCheck } from "lucide-react";
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
import { Button } from "@/components/ui/button";
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
            <span key={i}>
              <span className="underline decoration-dotted decoration-muted-foreground/50 underline-offset-[3px]">
                {segment.text}
              </span>
              <span className="ml-1.5 text-[11px] italic text-muted-foreground">
                {segment.caveatMessage}
              </span>
            </span>
          );
        }

        return (
          <span key={i} className="text-stone-100">
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
  const contextLabel = issue?.title ?? "Argument";

  const directReplies =
    posts.length > 0 ? getChildren(posts, argument.id) : [];
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
      <div className="grid w-full gap-10 xl:grid-cols-[1fr_minmax(280px,360px)]">
        <div className="min-w-0">
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="h-8 px-2 text-[12px] font-semibold text-muted-foreground"
        >
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
          {isAuthor ? "Back to edit" : "Back to thread"}
        </Button>
        {isAuthor && onDone && (
          <Button size="sm" onClick={onDone} className="h-8 text-[12px] font-bold">
            View in debate
          </Button>
        )}
        {!isAuthor && onReply && (
          <Button
            variant="outline"
            size="sm"
            onClick={onReply}
            className="h-8 text-[12px] font-semibold"
          >
            <MessageSquare className="mr-1.5 h-3.5 w-3.5" strokeWidth={2} />
            Reply
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Spinner label="Loading saved post…" />
          <SkeletonPost />
        </div>
      ) : (
        <>
      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
        {contextLabel}
      </p>

      <div className="mb-5 flex flex-wrap items-center gap-3">
        {!isAuthor && onDeskBang && (
          <DeskBangButton
            count={argument.deskBangs ?? 0}
            banged={argument.userBanged ?? false}
            onToggle={onDeskBang}
            layout="horizontal"
          />
        )}
        <div className="flex items-center gap-2.5">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={`https://api.dicebear.com/8.x/lorelei/svg?seed=${encodeURIComponent(argument.author)}`}
              alt=""
            />
            <AvatarFallback className="bg-primary/10 text-[12px] font-bold">
              {argument.author
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-[14px] font-bold text-foreground">
              {argument.author}
            </p>
            <p className="text-[11px] text-muted-foreground">{argument.postedAt}</p>
          </div>
        </div>

        {isAuthor ? (
          <span className="inline-flex items-center gap-1 rounded-md border border-primary/25 bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
            <ShieldCheck className="h-3 w-3" strokeWidth={2} />
            {formatByline(argument)}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-md border border-primary/25 bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
            <ShieldCheck className="h-3 w-3" strokeWidth={2} />
            Vetted
          </span>
        )}
      </div>

      {(argument.contestedFallacies?.length ?? 0) > 0 && (
        <div className="mb-4 space-y-2">
          <div className="flex flex-wrap gap-2">
            {argument.contestedFallacies!.map((fallacy) => (
              <ContestedChip key={fallacy} fallacyName={fallacy} />
            ))}
          </div>
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            The judge flagged a possible fallacy. The author reviewed it,
            disagreed, and chose to post anyway. Hover the chip for details.
          </p>
        </div>
      )}

      {argument.caveats?.map((caveat) => (
        <p key={caveat} className="mb-4 text-[12px] italic text-muted-foreground">
          {caveat}
        </p>
      ))}

      <article className="mb-8 rounded-2xl border border-border/80 bg-[#1a1714] px-6 py-8 sm:px-10 sm:py-10">
        <p className="whitespace-pre-wrap font-serif text-[1.35rem] font-normal leading-[1.8] tracking-[0.01em] text-stone-100 antialiased md:text-[1.5rem]">
          <CitationText
            segments={segments}
            sources={argument.sources}
            hoveredSourceIndex={hoveredSourceIndex}
            onSourceHover={setHoveredSourceIndex}
          />
        </p>
      </article>

      {!isAuthor && directReplies.length > 0 && (
        <section className="border-t border-border pt-8">
          <p className="mb-5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Replies · {totalReplyCount}
          </p>
          <ParliaventDebateThread
            comments={replyComments}
            getMeta={getReplyMeta}
            onOpenPost={(id) => onThreadOpen?.(id)}
            onReply={(id) => onThreadReply?.(id)}
            onDeskBang={(id) => onThreadDeskBang?.(id)}
          />
        </section>
      )}
        </>
      )}
        </div>

        {!isLoading && argument.sources.length > 0 && (
          <aside className="xl:sticky xl:top-24 xl:self-start">
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
