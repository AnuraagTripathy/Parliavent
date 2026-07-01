"use client";

import { motion } from "framer-motion";
import type { Finding } from "@/lib/types";
import { getReadiness } from "@/lib/readiness";

interface ReadinessBarProps {
  findings: Finding[];
  judgeError?: string | null;
  isTooShort?: boolean;
  onPost: () => void;
  postLabel?: string;
}

export function ReadinessBar({
  findings,
  judgeError = null,
  isTooShort = false,
  onPost,
  postLabel = "Post",
}: ReadinessBarProps) {
  const { resolved, total, percent, label } = getReadiness(findings, {
    judgeUnavailable: Boolean(judgeError),
    isTooShort,
  });

  return (
    <footer className="fixed inset-x-0 bottom-0 z-10 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-md lg:sticky lg:bottom-0">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 lg:px-8">
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <p className="truncate text-[12px] font-semibold text-zinc-400">
              {label}
            </p>
            <p className="shrink-0 text-[11px] text-zinc-600">
              {resolved}/{total} resolved
            </p>
          </div>

          <div className="h-1 overflow-hidden rounded-full bg-zinc-800">
            <motion.div
              className="h-full rounded-full bg-teal-500"
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onPost}
          className="shrink-0 rounded-lg bg-zinc-100 px-4 py-2 text-[12px] font-bold text-zinc-950 transition-colors hover:bg-white"
        >
          {postLabel}
        </button>
      </div>
    </footer>
  );
}
