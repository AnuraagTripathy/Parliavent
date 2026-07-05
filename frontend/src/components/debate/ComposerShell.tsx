"use client";

import { ArrowLeft, MessageSquare, PenLine } from "lucide-react";
import type { ComposerContext } from "@/lib/types";

interface ComposerShellProps {
  context: ComposerContext;
  onBack: () => void;
  children: React.ReactNode;
}

export function ComposerShell({
  context,
  onBack,
  children,
}: ComposerShellProps) {
  const isResponse = context.mode === "response";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-b border-zinc-800 bg-zinc-900/60">
        <div className="mx-auto max-w-7xl px-4 py-4 lg:px-8">
          <button
            type="button"
            onClick={onBack}
            className="mb-3 inline-flex items-center gap-1.5 text-[12px] font-medium text-zinc-500 transition-colors hover:text-zinc-200"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Cancel
          </button>

          <div className="flex items-start gap-3">
            <div
              className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                isResponse ? "bg-teal-500/15" : "bg-zinc-800"
              }`}
            >
              {isResponse ? (
                <MessageSquare
                  className="h-4 w-4 text-teal-400"
                  strokeWidth={2}
                />
              ) : (
                <PenLine className="h-4 w-4 text-zinc-400" strokeWidth={2} />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-600">
                {isResponse ? "Reply" : "Starter"}
              </p>
              <p className="mt-2 text-[11px] font-bold uppercase tracking-widest text-zinc-600">
                Motion
              </p>
              <h1 className="mt-0.5 text-lg font-bold leading-snug text-zinc-50 sm:text-xl">
                {context.issueTitle}
              </h1>
              {isResponse && context.parentAuthor && (
                <div className="mt-3 rounded-lg border border-zinc-800 bg-zinc-950/60 px-3.5 py-3">
                  <p className="mb-1 text-[11px] font-semibold text-zinc-500">
                    Replying to{" "}
                    <span className="text-zinc-300">{context.parentAuthor}</span>
                  </p>
                  {context.parentPreview && (
                    <p className="line-clamp-2 text-[13px] leading-relaxed text-zinc-400">
                      &ldquo;{context.parentPreview}&rdquo;
                    </p>
                  )}
                </div>
              )}
              <p className="mt-2 text-[12px] text-zinc-600">
                Write → review judge findings → post. Your words, your call.
              </p>
            </div>
          </div>
        </div>
      </div>

      {children}
    </div>
  );
}
