"use client";

import { useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  /** Override the evidence search transport (used by the landing-page demo). */
  fetchEvidence?: React.ComponentProps<typeof FindingCard>["fetchEvidence"];
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

const CAROUSEL_CARD_WIDTH_CLASS = "w-[min(380px,88vw)] shrink-0 snap-start";
const GRID_CARD_CLASS = "min-w-0";

export function FindingsPanel({
  findings,
  argumentText,
  threadId,
  checkingState = "complete",
  judgeError = null,
  isTooShort = false,
  fetchEvidence,
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const isChecking = checkingState === "checking";
  const showShortTextState =
    isTooShort && !isChecking && checkingState === "complete" && !judgeError;
  const showEmptyState =
    !isChecking &&
    checkingState === "complete" &&
    findings.length === 0 &&
    !judgeError &&
    !isTooShort;
  const showCarousel = findings.length > 0 || (isChecking && findings.length > 0);
  const useHorizontalCarousel = findings.length > 3;

  const scrollCarousel = useCallback((direction: "prev" | "next") => {
    const container = scrollRef.current;
    if (!container) return;

    const card = container.querySelector<HTMLElement>("[data-finding-card]");
    const cardWidth = card?.offsetWidth ?? 380;
    const gap = 16;
    container.scrollBy({
      left: direction === "next" ? cardWidth + gap : -(cardWidth + gap),
      behavior: "smooth",
    });
  }, []);

  function renderFindingCard(finding: Finding, cardClassName: string) {
    return (
      <motion.div
        key={finding.id}
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={transitionFast}
        className={cardClassName}
        data-finding-card
      >
        <FindingCard
          finding={finding}
          argumentText={argumentText}
          threadId={threadId}
          fetchEvidence={fetchEvidence}
          layout="carousel"
          onUseSuggestion={onUseSuggestion}
          onKeepAsIs={onKeepAsIs}
          onSourceSearchResult={onSourceSearchResult}
          onAttachEvidenceSource={onAttachEvidenceSource}
          onApplyRewrite={onApplyRewrite}
          onMarkAsOpinion={onMarkAsOpinion}
          onDispute={onDispute}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex flex-col"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Judge review
          </p>
          {useHorizontalCarousel && (
            <p className="mt-1 text-[11px] text-muted-foreground/80">
              Scroll horizontally to browse findings
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {isChecking ? (
            <Spinner className="text-[11px]" label="Reviewing…" />
          ) : (
            <span className="rounded-full border border-border bg-card px-2 py-0.5 text-[11px] text-muted-foreground">
              {findings.length} findings
            </span>
          )}
          {useHorizontalCarousel && (
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Previous finding"
                onClick={() => scrollCarousel("prev")}
                className="h-7 w-7 rounded-md"
              >
                <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2} />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Next finding"
                onClick={() => scrollCarousel("next")}
                className="h-7 w-7 rounded-md"
              >
                <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} />
              </Button>
            </div>
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

      {isChecking && findings.length === 0 && (
        <div className="-mx-4 overflow-x-auto px-4 pb-2 md:-mx-8 md:px-8 lg:-mx-12 lg:px-12">
          <div className="flex snap-x snap-mandatory gap-4">
            <div className={CAROUSEL_CARD_WIDTH_CLASS}>
              <SkeletonCard />
            </div>
            <div className={CAROUSEL_CARD_WIDTH_CLASS}>
              <SkeletonCard />
            </div>
          </div>
        </div>
      )}

      {showCarousel && (
        <AnimatePresence initial={false}>
          {useHorizontalCarousel ? (
            <div
              className={`relative -mx-4 px-4 pb-2 md:-mx-8 md:px-8 lg:-mx-12 lg:px-12 ${
                isChecking && findings.length > 0 ? "opacity-70" : "opacity-100"
              } transition-opacity duration-200`}
            >
              <div
                ref={scrollRef}
                className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1 scroll-smooth"
              >
                {findings.map((finding) =>
                  renderFindingCard(finding, CAROUSEL_CARD_WIDTH_CLASS),
                )}
              </div>
            </div>
          ) : (
            <div
              className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 ${
                isChecking && findings.length > 0 ? "opacity-70" : "opacity-100"
              } transition-opacity duration-200`}
            >
              {findings.map((finding) =>
                renderFindingCard(finding, GRID_CARD_CLASS),
              )}
            </div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
}
