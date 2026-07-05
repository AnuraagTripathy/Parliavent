"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { CheckingState, EvidenceSearchResponse, EvidenceSource, Finding } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { SkeletonCard } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { transitionFast } from "@/lib/motion";
import { FindingCard } from "./FindingCard";

interface FindingsPanelProps {
  findings: Finding[];
  argumentText: string;
  threadId?: string;
  checkingState?: CheckingState;
  judgeError?: string | null;
  isTooShort?: boolean;
  onCheckNow?: () => void;
  pendingOverlapApply?: string | null;
  onConfirmOverlapApply?: () => void;
  onCancelOverlapApply?: () => void;
  onUseSuggestion: (findingId: string) => void;
  onKeepAsIs: (findingId: string) => void;
  onSourceSearchResult: (findingId: string, result: EvidenceSearchResponse) => void;
  onAttachEvidenceSource: (findingId: string, source: EvidenceSource) => void;
  onApplyRewrite: (findingId: string, replacement: string) => void;
  onMarkAsOpinion: (findingId: string) => void;
  onDispute: (findingId: string, reason: string) => void;
}

export function FindingsPanel({
  findings,
  argumentText,
  threadId,
  checkingState = "complete",
  judgeError = null,
  isTooShort = false,
  onCheckNow,
  pendingOverlapApply = null,
  onConfirmOverlapApply,
  onCancelOverlapApply,
  onUseSuggestion,
  onKeepAsIs,
  onSourceSearchResult,
  onAttachEvidenceSource,
  onApplyRewrite,
  onMarkAsOpinion,
  onDispute,
}: FindingsPanelProps) {
  const isChecking = checkingState === "checking";
  const showShortTextState =
    isTooShort && !isChecking && checkingState === "complete" && !judgeError;
  const showEmptyState =
    !isChecking &&
    checkingState === "complete" &&
    findings.length === 0 &&
    !judgeError &&
    !isTooShort;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex flex-col"
    >
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Judge review
        </p>
        <div className="flex items-center gap-2">
          {isChecking ? (
            <Spinner className="text-[11px]" label="Reviewing…" />
          ) : (
            <span className="rounded-full border border-border bg-card px-2 py-0.5 text-[11px] text-muted-foreground">
              {findings.length} findings
            </span>
          )}
          {onCheckNow && !isChecking && (
            <button
              type="button"
              onClick={onCheckNow}
              className="text-[11px] font-medium text-muted-foreground underline decoration-border underline-offset-2 transition-colors hover:text-foreground"
            >
              Check now
            </button>
          )}
        </div>
      </div>

      {judgeError && (
        <p className="mb-3 text-[12px] text-amber-400/90" role="status">
          {judgeError}
        </p>
      )}

      {pendingOverlapApply && (
        <div className="mb-3 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3.5 py-3">
          <p className="mb-2.5 text-[12px] leading-relaxed text-foreground/80">
            This edit may also resolve another review item because the
            highlighted text overlaps.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              onClick={onConfirmOverlapApply}
              className="h-7 rounded-md px-2.5 text-[11px] font-medium"
            >
              Apply anyway
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onCancelOverlapApply}
              className="h-7 rounded-md px-2.5 text-[11px] font-medium"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {isChecking && findings.length === 0 && (
        <div className="space-y-3">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {showShortTextState && (
        <div className="rounded-xl border border-dashed border-border bg-card/50 px-4 py-6 text-center">
          <p className="text-[13px] font-medium text-muted-foreground">
            Write a little more for review.
          </p>
        </div>
      )}

      {showEmptyState && (
        <div className="rounded-xl border border-dashed border-border bg-card/50 px-4 py-6 text-center">
          <p className="text-[13px] font-medium text-muted-foreground">
            Nothing to flag. Ready to post.
          </p>
        </div>
      )}

      <AnimatePresence initial={false}>
        <div
          className={`flex flex-col gap-3 transition-opacity duration-200 ${
            isChecking && findings.length > 0 ? "opacity-70" : "opacity-100"
          }`}
        >
          {findings.map((finding) => (
            <motion.div
              key={finding.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={transitionFast}
            >
              <FindingCard
                finding={finding}
                argumentText={argumentText}
                threadId={threadId}
                onUseSuggestion={onUseSuggestion}
                onKeepAsIs={onKeepAsIs}
                onSourceSearchResult={onSourceSearchResult}
                onAttachEvidenceSource={onAttachEvidenceSource}
                onApplyRewrite={onApplyRewrite}
                onMarkAsOpinion={onMarkAsOpinion}
                onDispute={onDispute}
              />
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </motion.div>
  );
}
