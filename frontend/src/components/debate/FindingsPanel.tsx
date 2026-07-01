"use client";

import { motion } from "framer-motion";
import type { CheckingState, Finding } from "@/lib/types";
import { FindingCard } from "./FindingCard";

interface FindingsPanelProps {
  findings: Finding[];
  checkingState?: CheckingState;
  judgeError?: string | null;
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
  onUseSuggestion,
  onKeepAsIs,
  onAttachSource,
  onMarkAsOpinion,
  onDispute,
}: FindingsPanelProps) {
  const isChecking = checkingState === "checking";
  const showEmptyState =
    !isChecking && checkingState === "complete" && findings.length === 0;

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
