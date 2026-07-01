"use client";

import { motion } from "framer-motion";
import type { Finding } from "@/lib/types";
import { FindingCard } from "./FindingCard";

interface FindingsPanelProps {
  findings: Finding[];
  onUseSuggestion: (findingId: string) => void;
  onKeepAsIs: (findingId: string) => void;
  onAttachSource: (findingId: string, sourceId: string) => void;
  onMarkAsOpinion: (findingId: string) => void;
  onDispute: (findingId: string, reason: string) => void;
}

export function FindingsPanel({
  findings,
  onUseSuggestion,
  onKeepAsIs,
  onAttachSource,
  onMarkAsOpinion,
  onDispute,
}: FindingsPanelProps) {
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
        <span className="rounded-full border border-[#e8e8e4] bg-white px-2 py-0.5 text-[11px] text-[#8a8a86]">
          {findings.length} findings
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {findings.map((finding, index) => (
          <motion.div
            key={finding.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.06, ease: "easeOut" }}
          >
            <FindingCard
              finding={finding}
              onUseSuggestion={onUseSuggestion}
              onKeepAsIs={onKeepAsIs}
              onAttachSource={onAttachSource}
              onMarkAsOpinion={onMarkAsOpinion}
              onDispute={onDispute}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
