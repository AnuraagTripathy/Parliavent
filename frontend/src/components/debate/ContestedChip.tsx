"use client";

import { FallacyGuidePopover } from "./FallacyGuidePopover";

interface ContestedChipProps {
  fallacyName: string;
  compact?: boolean;
  contextNote?: string;
  flaggedSpan?: string;
}

export function ContestedChip({
  fallacyName,
  compact = false,
  contextNote,
  flaggedSpan,
}: ContestedChipProps) {
  return (
    <FallacyGuidePopover
      fallacyName={fallacyName}
      contextNote={
        contextNote ??
        "The judge thought this passage might use flawed reasoning. Tap to learn what that means."
      }
      flaggedSpan={flaggedSpan}
      disputed
      compact={compact}
    >
      <span
        className={`inline-flex max-w-full items-center gap-1.5 rounded-md border border-amber-500/30 bg-amber-500/10 transition-colors hover:bg-amber-500/15 ${
          compact ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]"
        }`}
      >
        <span className="font-medium text-amber-400">Disputed</span>
        <span className="text-muted-foreground">·</span>
        <span className="truncate text-amber-300/80">{fallacyName}</span>
      </span>
    </FallacyGuidePopover>
  );
}
