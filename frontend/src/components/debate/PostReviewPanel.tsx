"use client";

import type { ClaimCaveat } from "@/lib/types";
import type { PostReviewMeta } from "@/lib/buildPostReviewMeta";
import type { Source } from "@/lib/types";
import { cn } from "@/lib/utils";
import { FallacyGuidePopover } from "./FallacyGuidePopover";
import { ReviewChipPanelBody, ReviewChipPopover } from "./ReviewChipPopover";

interface PostReviewPanelProps {
  review: PostReviewMeta;
  compact?: boolean;
  className?: string;
  /** Thread view shows sources inline on the post body; hide duplicate source cards. */
  hideSources?: boolean;
}

function sourceTitle(source: Source): string {
  return source.title || source.publisher || "Source";
}

function caveatSubtitle(caveat: ClaimCaveat): string {
  switch (caveat.verdict) {
    case "unsupported":
      return "Unsupported claim";
    case "contradicted":
      return "Contradicted";
    case "too_broad":
      return "Too broad";
    case "unclear":
      return "Unclear claim";
    default:
      return "Source note";
  }
}

const CHIP_SUMMARY_PATTERN =
  /caveat|fallacy|logical|evidence|needs|clarity|sourced|source/i;

export function PostReviewSummaryRow({
  review,
  className,
}: {
  review: PostReviewMeta;
  className?: string;
}) {
  const labels = review.summaryLabels.filter(
    (label) => !CHIP_SUMMARY_PATTERN.test(label),
  );

  if (!review.hasReview || labels.length === 0) return null;

  return (
    <div
      className={cn(
        "mb-2 flex flex-wrap items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground",
        className,
      )}
    >
      {labels.map((label) => (
        <span
          key={label}
          className="rounded-md border border-border bg-muted/40 px-1.5 py-0.5"
        >
          {label}
        </span>
      ))}
    </div>
  );
}

export function PostReviewPanel({
  review,
  compact = false,
  className,
  hideSources = false,
}: PostReviewPanelProps) {
  if (!review.hasReview) return null;

  const fallacyFindings = [
    ...new Map(
      [...review.reviewFallacies, ...review.contestedReasoning].map((finding) => [
        finding.id,
        finding,
      ]),
    ).values(),
  ];

  const summaryLabels = review.summaryLabels.filter(
    (label) =>
      !CHIP_SUMMARY_PATTERN.test(label) &&
      (!hideSources ||
        (!label.toLowerCase().includes("sourced") &&
          !label.toLowerCase().includes("source"))),
  );

  const hasVisibleReview =
    summaryLabels.length > 0 ||
    review.claimCaveats.length > 0 ||
    review.unresolvedCaveats.length > 0 ||
    review.needsEvidence.length > 0 ||
    fallacyFindings.length > 0 ||
    review.reviewClarity.length > 0 ||
    (!hideSources && review.sourceNotes.length > 0);

  if (!hasVisibleReview) return null;

  const chipCount =
    review.claimCaveats.length +
    review.unresolvedCaveats.length +
    review.needsEvidence.length +
    fallacyFindings.length +
    review.reviewClarity.length;

  return (
    <div className={cn("space-y-2", className)}>
      {summaryLabels.length > 0 && (
        <PostReviewSummaryRow
          review={{ ...review, summaryLabels }}
          className="mb-0"
        />
      )}

      {!hideSources &&
        review.sourceNotes.map((note) => (
          <ReviewChipPopover
            key={`${note.source.id}-${note.spanText}`}
            label="Source-backed"
            subtitle={sourceTitle(note.source)}
            tone="sky"
            compact={compact}
            panelTitle="Source-backed claim"
          >
            <ReviewChipPanelBody
              spanText={note.spanText}
              message={`${sourceTitle(note.source)}${
                note.source.publisher && note.source.title
                  ? ` · ${note.source.publisher}`
                  : ""
              } · ${note.supportLabel}`}
              compact={compact}
            />
          </ReviewChipPopover>
        ))}

      {chipCount > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          {review.claimCaveats.map((caveat) => (
            <ReviewChipPopover
              key={caveat.id}
              label={
                caveat.verdict === "unsupported" ||
                caveat.verdict === "contradicted"
                  ? "Caveat"
                  : "Source note"
              }
              subtitle={caveatSubtitle(caveat)}
              tone="amber"
              compact={compact}
            >
              <ReviewChipPanelBody
                spanText={caveat.spanText}
                message={caveat.message}
                compact={compact}
              />
            </ReviewChipPopover>
          ))}

          {review.unresolvedCaveats.map((message) => (
            <ReviewChipPopover
              key={message}
              label="Caveat"
              subtitle="Unresolved"
              tone="amber"
              compact={compact}
            >
              <ReviewChipPanelBody message={message} compact={compact} />
            </ReviewChipPopover>
          ))}

          {review.needsEvidence.map((note) => (
            <ReviewChipPopover
              key={note.id}
              label="Needs evidence"
              subtitle={note.title}
              tone="violet"
              compact={compact}
            >
              <ReviewChipPanelBody
                spanText={note.spanText}
                title={note.title}
                message={note.reason}
                compact={compact}
              />
            </ReviewChipPopover>
          ))}

          {fallacyFindings.map((finding) => (
            <FallacyGuidePopover
              key={finding.id}
              fallacyName={finding.subtitle ?? finding.title}
              flaggedSpan={finding.spanText}
              contextNote={finding.reason}
              disputed={false}
              compact={compact}
            />
          ))}

          {review.reviewClarity.map((finding) => (
            <ReviewChipPopover
              key={finding.id}
              label="Clarity note"
              subtitle={finding.title}
              tone="muted"
              compact={compact}
            >
              <ReviewChipPanelBody
                spanText={finding.spanText}
                title={finding.title}
                message={finding.reason}
                compact={compact}
              />
            </ReviewChipPopover>
          ))}
        </div>
      )}
    </div>
  );
}
