"use client";

import { ArrowLeft, MessageSquare, PenLine } from "lucide-react";
import type { ComposerContext } from "@/lib/types";
import { Button } from "@/components/ui/button";

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
      <div className="border-b border-border bg-card/80">
        <div className="w-full px-4 py-5 md:px-8 lg:px-12 xl:px-16">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="mb-3 h-8 px-2 text-[12px] text-muted-foreground"
          >
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            Cancel
          </Button>

          <div className="flex items-start gap-3">
            <div
              className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                isResponse ? "bg-teal-500/15" : "bg-secondary"
              }`}
            >
              {isResponse ? (
                <MessageSquare
                  className="h-4 w-4 text-teal-400"
                  strokeWidth={2}
                />
              ) : (
                <PenLine className="h-4 w-4 text-muted-foreground" strokeWidth={2} />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                {isResponse ? "Reply" : "Starter"}
              </p>
              <p className="mt-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                Motion
              </p>
              <h1 className="mt-0.5 text-lg font-bold leading-snug text-foreground sm:text-xl">
                {context.issueTitle}
              </h1>
              {isResponse && context.parentAuthor && (
                <p className="mt-2 text-[12px] text-muted-foreground">
                  Replying to {context.parentAuthor}
                </p>
              )}
              <p className="mt-2 text-[12px] text-muted-foreground">
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
