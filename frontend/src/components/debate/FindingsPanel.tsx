"use client";

import { motion } from "framer-motion";
import type { CheckingState, Finding } from "@/lib/types";
import { FindingCard } from "./FindingCard";

interface FindingsPanelProps {
  findings: Finding[];
  checkingState?: CheckingState;
  judgeError?: string | null;
  pendingOverlapApply?: string | null;
  onConfirmOverlapApply?: () => void;
  onCancelOverlapApply?: () => void;
  onUseSuggestion: (findingId: string) => void;
  onKeepAsIs: (findingId: string) => void;
  onAttachSource: (findingId: string, sourceId: string) => void;
  onMarkAsOpinion: (findingId: string) => void;
  onDispute: (findingId: string, reason: string) => void;
}

export function FindingsPanel({
  findings,
  checkingState = "complete",
  judgeError = null,
  pendingOverlapApply = null,
  onConfirmOverlapApply,
  onCancelOverlapApply,
  onUseSuggestion,
  onKeepAsIs,
  onAttachSource,
  onMarkAsOpinion,
  onDispute,
}: FindingsPanelProps) {
  const isChecking = checkingState === "checking";
  const showEmptyState =
    !isChecking &&
    checkingState === "complete" &&
    findings.length === 0 &&
    !judgeError;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex flex-col"
    >
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#9a9a96]">
          Judge review
        </p>
        {isChecking ? (
          <span className="text-[11px] text-[#8a8a86] animate-pulse">
            Checking argument...
          </span>
        ) : (
          <span className="rounded-full border border-[#e8e8e4] bg-white px-2 py-0.5 text-[11px] text-[#8a8a86]">
            {findings.length} findings
          </span>
        )}
      </div>

      {judgeError && (
        <p className="mb-3 text-[12px] text-[#9a7a6a]" role="status">
          {judgeError}
        </p>
      )}

      {pendingOverlapApply && (
        <div className="mb-3 rounded-lg border border-[#ebe3d4] bg-[#faf8f3] px-3.5 py-3">
          <p className="mb-2.5 text-[12px] leading-relaxed text-[#6a6a66]">
            This edit may also resolve another review item because the
            highlighted text overlaps.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onConfirmOverlapApply}
              className="rounded-md border border-[#1a1a18] bg-[#1a1a18] px-2.5 py-1.5 text-[11px] font-medium text-white transition-colors hover:bg-[#2a2a28]"
            >
              Apply anyway
            </button>
            <button
              type="button"
              onClick={onCancelOverlapApply}
              className="rounded-md border border-[#e4e4e0] bg-white px-2.5 py-1.5 text-[11px] font-medium text-[#6a6a66] transition-colors hover:border-[#d0d0cc]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showEmptyState && (
        <div className="rounded-xl border border-dashed border-[#e0e0dc] bg-[#fafaf8] px-4 py-6 text-center">
          <p className="text-[13px] font-medium text-[#6a6a66]">
            Nothing to flag. Ready to post.
          </p>
        </div>
      )}

      <div
        className={`flex flex-col gap-3 transition-opacity duration-200 ${
          isChecking && findings.length > 0 ? "opacity-80" : "opacity-100"
        }`}
      >
        {findings.map((finding) => (
          <div key={finding.id}>
            <FindingCard
              finding={finding}
              onUseSuggestion={onUseSuggestion}
              onKeepAsIs={onKeepAsIs}
              onAttachSource={onAttachSource}
              onMarkAsOpinion={onMarkAsOpinion}
              onDispute={onDispute}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
