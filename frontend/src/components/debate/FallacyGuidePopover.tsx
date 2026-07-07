"use client";

import Link from "next/link";
import { FallacyGuideContent } from "./FallacyGuideContent";
import { fallacyGuideSlug } from "@/lib/fallacyGuide";
import { ReviewChipPopover } from "./ReviewChipPopover";

interface FallacyGuidePopoverProps {
  fallacyName: string;
  contextNote?: string;
  flaggedSpan?: string;
  disputed?: boolean;
  compact?: boolean;
}

export function FallacyGuidePopover({
  fallacyName,
  contextNote,
  flaggedSpan,
  disputed = false,
  compact = false,
}: FallacyGuidePopoverProps) {
  return (
    <ReviewChipPopover
      label={disputed ? "Disputed" : "Logical fallacy"}
      subtitle={fallacyName}
      tone={disputed ? "amber" : "orange"}
      compact={compact}
      panelTitle="Quick guide"
    >
      <FallacyGuideContent
        fallacyName={fallacyName}
        contextNote={contextNote}
        flaggedSpan={flaggedSpan}
        disputed={disputed}
        compact
      />

      <Link
        href={`/app/fallacies#${fallacyGuideSlug(fallacyName)}`}
        className="mt-3 inline-block text-[11px] font-medium text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary"
      >
        Browse all fallacies
      </Link>
    </ReviewChipPopover>
  );
}
