"use client";

import { motion } from "framer-motion";
import type { Finding } from "@/lib/types";
import { getReadiness } from "@/lib/readiness";

interface ReadinessBarProps {
  findings: Finding[];
}

export function ReadinessBar({ findings }: ReadinessBarProps) {
  const { resolved, total, percent, label } = getReadiness(findings);

  return (
    <footer className="fixed inset-x-0 bottom-0 z-10 border-t border-[#e8e8e4] bg-[#fafaf8]/90 backdrop-blur-sm lg:sticky lg:bottom-0">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 lg:px-8">
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <p className="truncate text-[12px] font-medium text-[#4a4a48]">
              {label}
            </p>
            <p className="shrink-0 text-[11px] text-[#9a9a96]">
              {resolved}/{total} resolved
            </p>
          </div>

          <div className="h-1 overflow-hidden rounded-full bg-[#ececea]">
            <motion.div
              className="h-full rounded-full bg-[#8ab89a]"
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        <button
          type="button"
          disabled
          className="shrink-0 rounded-lg border border-[#e4e4e0] bg-white px-4 py-2 text-[12px] font-medium text-[#b0b0ac] shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
        >
          Post
        </button>
      </div>
    </footer>
  );
}
