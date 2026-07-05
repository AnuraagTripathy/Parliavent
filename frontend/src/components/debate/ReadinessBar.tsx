"use client";

import { motion } from "framer-motion";
import type { Finding } from "@/lib/types";
import { getReadiness } from "@/lib/readiness";
import { Button } from "@/components/ui/button";

interface ReadinessBarProps {
  findings: Finding[];
  judgeError?: string | null;
  isTooShort?: boolean;
  onPost: () => void;
  postLabel?: string;
  isPosting?: boolean;
  postError?: string | null;
}

export function ReadinessBar({
  findings,
  judgeError = null,
  isTooShort = false,
  onPost,
  postLabel = "Post",
  isPosting = false,
  postError = null,
}: ReadinessBarProps) {
  const { resolved, total, percent, label } = getReadiness(findings, {
    judgeUnavailable: Boolean(judgeError),
    isTooShort,
  });

  return (
    <footer className="fixed inset-x-0 bottom-0 z-10 border-t border-border bg-background/95 backdrop-blur-md lg:sticky lg:bottom-0">
      <div className="flex w-full items-center gap-4 px-4 py-3 md:px-8 lg:px-12 xl:px-16">
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <p className="truncate text-[12px] font-semibold text-foreground/70">
              {label}
            </p>
            <p className="shrink-0 text-[11px] text-muted-foreground">
              {resolved}/{total} resolved
            </p>
          </div>

          {postError && (
            <p className="mb-1 text-[11px] text-destructive">{postError}</p>
          )}

          <div className="h-1 overflow-hidden rounded-full bg-secondary">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        <Button
          size="sm"
          onClick={onPost}
          disabled={isPosting}
          className="h-9 shrink-0 px-4 text-[12px] font-bold"
        >
          {isPosting ? "Posting…" : postLabel}
        </Button>
      </div>
    </footer>
  );
}
