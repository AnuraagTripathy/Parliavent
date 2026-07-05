"use client";

import { BookOpen, Lightbulb } from "lucide-react";
import { getFallacyGuide } from "@/lib/fallacyGuide";
import { cn } from "@/lib/utils";

interface FallacyGuideContentProps {
  fallacyName: string;
  contextNote?: string;
  flaggedSpan?: string;
  judgeExample?: string;
  disputed?: boolean;
  compact?: boolean;
  className?: string;
}

export function FallacyGuideContent({
  fallacyName,
  contextNote,
  flaggedSpan,
  judgeExample,
  disputed = false,
  compact = false,
  className,
}: FallacyGuideContentProps) {
  const guide = getFallacyGuide(fallacyName);

  return (
    <div
      className={cn(
        "rounded-lg border border-amber-500/20 bg-amber-500/5",
        compact ? "px-3 py-2.5" : "px-4 py-3.5",
        className,
      )}
    >
      <div className="mb-2 flex items-start gap-2">
        <BookOpen className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-amber-400/90">
            What is {guide.name}?
          </p>
          <p
            className={cn(
              "mt-1 leading-relaxed text-foreground/90",
              compact ? "text-[11px]" : "text-xs",
            )}
          >
            {guide.definition}
          </p>
        </div>
      </div>

      <div className="mb-2 flex items-start gap-2">
        <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Simple example
          </p>
          <p
            className={cn(
              "mt-1 italic leading-relaxed text-muted-foreground",
              compact ? "text-[11px]" : "text-xs",
            )}
          >
            {guide.analogy}
          </p>
        </div>
      </div>

      {contextNote && (
        <div className="rounded-md border border-border/80 bg-background/40 px-3 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Why it was flagged here
          </p>
          <p
            className={cn(
              "mt-1 leading-relaxed text-foreground/85",
              compact ? "text-[11px]" : "text-xs",
            )}
          >
            {contextNote}
          </p>
          {flaggedSpan && (
            <p className="mt-2 border-l-2 border-amber-500/30 pl-2 text-[11px] italic text-foreground/70">
              &ldquo;{flaggedSpan}&rdquo;
            </p>
          )}
        </div>
      )}

      {judgeExample && (
        <p className={cn("mt-2 text-muted-foreground", compact ? "text-[10px]" : "text-[11px]")}>
          <span className="font-medium text-foreground/70">Another example: </span>
          {judgeExample}
        </p>
      )}

      {disputed && (
        <p className={cn("mt-2 text-amber-400/80", compact ? "text-[10px]" : "text-[11px]")}>
          The author reviewed this flag, disagreed, and chose to post anyway.
        </p>
      )}
    </div>
  );
}
