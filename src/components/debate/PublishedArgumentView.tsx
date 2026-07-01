"use client";

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
import { ContestedChip } from "./ContestedChip";
import { DeskBangButton } from "./DeskBangButton";
import { ThreadBranch } from "./ThreadBranch";

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
}

function CitationText({
  segments,
  sources,
}: {
  segments: CitationSegment[];
  sources: Source[];
}) {
  return (
    <>
      {segments.map((segment, i) => {
        if (segment.citationIndex === undefined) {
          return (
            <span key={i} className="text-zinc-200">
              {segment.text}
            </span>
          );
        }

        const color = getCitationColor(segment.citationIndex);
        const marker = segment.citationIndex + 1;
        const sourceId = `source-${sources[segment.citationIndex]?.id}`;

        return (
          <span key={i} className="relative">
            <mark
              className="rounded-sm underline decoration-2 underline-offset-[3px]"
              style={{
                backgroundColor: `${color.bg}33`,
                textDecorationColor: color.underline,
              }}
            >
              {segment.text}
            </mark>
            <a
              href={`#${sourceId}`}
              className="ml-0.5 inline-flex align-super text-[10px] font-bold no-underline transition-opacity hover:opacity-70"
              style={{ color: color.marker }}
              aria-label={`Source ${marker}`}
            >
              [{marker}]
            </a>
          </span>
        );
      })}
    </>
  );
}

function SourceListItem({
  source,
  index,
}: {
  source: Source;
  index: number;
}) {
  const color = getCitationColor(index);
  const sourceId = `source-${source.id}`;

  return (
    <a
      id={sourceId}
      href={source.url ?? "#"}
      target={source.url ? "_blank" : undefined}
      rel={source.url ? "noopener noreferrer" : undefined}
      className="group scroll-mt-24 rounded-lg border border-zinc-800 bg-zinc-900/60 p-3.5 transition-colors hover:border-zinc-700 hover:bg-zinc-900"
      style={{ borderLeftColor: color.ring, borderLeftWidth: 2 }}
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
        <span className="text-[12px] font-medium leading-snug text-zinc-200 group-hover:text-zinc-50">
          {source.title}
        </span>
        {source.url && (
          <ExternalLink className="ml-auto h-3 w-3 shrink-0 text-zinc-600 opacity-0 transition-opacity group-hover:opacity-100" />
        )}
      </div>
      <p className="pl-7 text-[11px] text-zinc-500">
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
}: PublishedArgumentViewProps) {
  const sourceIndex = buildSourceIndex(argument);
  const segments = highlightCitations(
    argument.text,
    argument.citations,
    sourceIndex,
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`mx-auto w-full px-4 py-6 lg:px-0 ${
        isAuthor ? "max-w-2xl" : "max-w-2xl"
      }`}
    >
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-zinc-500 transition-colors hover:text-zinc-200"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {isAuthor ? "Back to edit" : "Back to thread"}
        </button>
        {isAuthor && onDone && (
          <button
            type="button"
            onClick={onDone}
            className="inline-flex items-center rounded-lg bg-zinc-100 px-4 py-1.5 text-[12px] font-bold text-zinc-950 transition-colors hover:bg-white"
          >
            View in debate
          </button>
        )}
        {!isAuthor && onReply && (
          <button
            type="button"
            onClick={onReply}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-1.5 text-[12px] font-semibold text-zinc-200 transition-colors hover:border-zinc-600 hover:bg-zinc-800"
          >
            <MessageSquare className="h-3.5 w-3.5" strokeWidth={2} />
            Reply
          </button>
        )}
      </div>

      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-600">
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
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-800 text-[12px] font-bold text-zinc-300 ring-1 ring-zinc-700">
            {argument.author
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <p className="text-[14px] font-bold text-zinc-100">
              {argument.author}
            </p>
            <p className="text-[11px] text-zinc-600">{argument.postedAt}</p>
          </div>
        </div>

        {isAuthor ? (
          <span className="inline-flex items-center gap-1 rounded-md border border-teal-500/25 bg-teal-500/10 px-2.5 py-1 text-[11px] font-medium text-teal-400">
            <ShieldCheck className="h-3 w-3" strokeWidth={2} />
            {formatByline(argument)}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-md border border-teal-500/25 bg-teal-500/10 px-2.5 py-1 text-[11px] font-medium text-teal-400">
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
          <p className="text-[11px] leading-relaxed text-zinc-600">
            The judge flagged a possible fallacy. The author reviewed it,
            disagreed, and chose to post anyway. Hover the chip for details.
          </p>
        </div>
      )}

      {argument.caveats?.map((caveat) => (
        <p key={caveat} className="mb-4 text-[12px] italic text-zinc-600">
          {caveat}
        </p>
      ))}

      <article className="mb-8 rounded-xl border border-zinc-800 bg-zinc-900/40 px-5 py-7 sm:px-8 sm:py-9">
        <p className="whitespace-pre-wrap text-[18px] leading-[1.85] tracking-[-0.01em] text-zinc-100 sm:text-[19px]">
          <CitationText segments={segments} sources={argument.sources} />
        </p>
      </article>

      {argument.sources.length > 0 && (
        <section className="mb-10">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
            Sources
          </p>
          <div className="flex flex-col gap-2">
            {argument.sources.map((source, index) => (
              <SourceListItem key={source.id} source={source} index={index} />
            ))}
          </div>
        </section>
      )}

      {!isAuthor && directReplies.length > 0 && (
        <section className="border-t border-zinc-800 pt-8">
          <p className="mb-5 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
            Replies · {totalReplyCount}
          </p>
          <div className="space-y-6 rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-4">
            {directReplies.map((child) => (
              <ThreadBranch
                key={child.id}
                node={buildPostTree(posts, child.id)}
                onOpenPost={(id) => onThreadOpen?.(id)}
                onReply={(id) => onThreadReply?.(id)}
                onDeskBang={(id) => onThreadDeskBang?.(id)}
              />
            ))}
          </div>
        </section>
      )}
    </motion.div>
  );
}
