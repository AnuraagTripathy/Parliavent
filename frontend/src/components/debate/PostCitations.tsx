"use client";

import { useMemo, useState } from "react";
import { ExternalLink } from "lucide-react";
import { getCitationColor } from "@/lib/citationColors";
import {
  highlightCitations,
  type CitationSegment,
} from "@/lib/highlightCitations";
import type { Citation, ClaimCaveat, Source } from "@/lib/types";
import { cn } from "@/lib/utils";

export function CitationText({
  segments,
  sources,
  hoveredSourceIndex,
  onSourceHover,
  anchorPrefix = "",
}: {
  segments: CitationSegment[];
  sources: Source[];
  hoveredSourceIndex?: number | null;
  onSourceHover?: (index: number | null) => void;
  anchorPrefix?: string;
}) {
  return (
    <>
      {segments.map((segment, i) => {
        if (segment.citationIndex !== undefined) {
          const color = getCitationColor(segment.citationIndex);
          const marker = segment.citationIndex + 1;
          const sourceId = `${anchorPrefix}source-${sources[segment.citationIndex]?.id}`;

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

export function SourceListItem({
  source,
  index,
  isHighlighted,
  onSourceHover,
  compact = false,
  anchorPrefix = "",
}: {
  source: Source;
  index: number;
  isHighlighted?: boolean;
  onSourceHover?: (index: number | null) => void;
  compact?: boolean;
  anchorPrefix?: string;
}) {
  const color = getCitationColor(index);
  const sourceId = `${anchorPrefix}source-${source.id}`;

  return (
    <a
      id={sourceId}
      href={source.url ?? "#"}
      target={source.url ? "_blank" : undefined}
      rel={source.url ? "noopener noreferrer" : undefined}
      onClick={(event) => {
        if (!source.url) event.preventDefault();
      }}
      className={cn(
        "group block rounded-md border border-border/80 bg-muted/20 transition-colors hover:bg-muted/40",
        compact ? "px-2.5 py-2" : "rounded-lg p-3.5",
        isHighlighted && "bg-muted/40",
      )}
      style={{
        borderLeftColor: color.ring,
        borderLeftWidth: 2,
      }}
      onMouseEnter={() => onSourceHover?.(index)}
      onMouseLeave={() => onSourceHover?.(null)}
    >
      <div className="flex items-start gap-2">
        <span
          className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded text-[9px] font-bold"
          style={{
            backgroundColor: `${color.bg}44`,
            color: color.marker,
          }}
        >
          {index + 1}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "font-medium leading-snug text-foreground/90 group-hover:text-foreground",
                compact ? "text-[11px]" : "text-[12px]",
              )}
            >
              {source.title}
            </span>
            {source.url && (
              <ExternalLink className="h-3 w-3 shrink-0 text-sky-400/80" />
            )}
          </div>
          {source.publisher && (
            <p className="text-[10px] text-muted-foreground">{source.publisher}</p>
          )}
        </div>
      </div>
    </a>
  );
}

export function PostBodyWithSources({
  text,
  sources,
  citations,
  claimCaveats = [],
  compact = false,
  className,
  postId,
}: {
  text: string;
  sources: Source[];
  citations: Citation[];
  claimCaveats?: ClaimCaveat[];
  compact?: boolean;
  className?: string;
  postId?: string;
}) {
  const anchorPrefix = postId ? `${postId}-` : "";
  const [hoveredSourceIndex, setHoveredSourceIndex] = useState<number | null>(
    null,
  );

  const attachedSources = useMemo(
    () => sources.filter((source) => !source.isSample),
    [sources],
  );

  const sourceIndex = useMemo(() => {
    const index = new Map<string, number>();
    attachedSources.forEach((source, i) => index.set(source.id, i));
    return index;
  }, [attachedSources]);

  const segments = useMemo(
    () => highlightCitations(text, citations, sourceIndex, claimCaveats),
    [text, citations, sourceIndex, claimCaveats],
  );

  const hasCitations = citations.length > 0 && attachedSources.length > 0;

  return (
    <div className={className}>
      <div
        className={cn(
          "whitespace-pre-wrap leading-relaxed text-foreground/85",
          compact ? "text-sm" : "text-[15px]",
        )}
      >
        {hasCitations ? (
          <CitationText
            segments={segments}
            sources={attachedSources}
            hoveredSourceIndex={hoveredSourceIndex}
            onSourceHover={setHoveredSourceIndex}
            anchorPrefix={anchorPrefix}
          />
        ) : (
          text
        )}
      </div>

      {attachedSources.length > 0 && (
        <div className={cn("space-y-1", compact ? "mt-2" : "mt-3")}>
          {attachedSources.map((source, index) => (
            <SourceListItem
              key={source.id}
              source={source}
              index={index}
              compact={compact}
              isHighlighted={hoveredSourceIndex === index}
              onSourceHover={setHoveredSourceIndex}
              anchorPrefix={anchorPrefix}
            />
          ))}
        </div>
      )}
    </div>
  );
}
