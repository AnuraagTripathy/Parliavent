"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { FallacyGuideContent } from "./FallacyGuideContent";
import { getAllFallacyGuides } from "@/lib/fallacyGuide";
import { cn } from "@/lib/utils";

interface FallacyGuidePopoverProps {
  fallacyName: string;
  contextNote?: string;
  flaggedSpan?: string;
  disputed?: boolean;
  compact?: boolean;
  children: React.ReactNode;
}

export function FallacyGuidePopover({
  fallacyName,
  contextNote,
  flaggedSpan,
  disputed = false,
  compact = false,
  children,
}: FallacyGuidePopoverProps) {
  const [open, setOpen] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setShowGlossary(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        setShowGlossary(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative inline-flex max-w-full">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          setOpen((value) => !value);
          setShowGlossary(false);
        }}
        className="inline-flex max-w-full items-center gap-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {children}
        <ChevronDown
          className={cn(
            "h-3 w-3 shrink-0 text-amber-400/70 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-label={`${fallacyName} explained`}
          className={cn(
            "absolute left-0 top-[calc(100%+0.5rem)] z-50 w-[min(22rem,calc(100vw-2rem))] rounded-xl border border-border bg-card p-3 shadow-xl shadow-black/40",
            compact && "sm:left-auto sm:right-0",
          )}
        >
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {showGlossary ? "Fallacy glossary" : "Quick guide"}
            </p>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setShowGlossary(false);
              }}
              className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {showGlossary ? (
            <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
              {getAllFallacyGuides().map((entry) => (
                <div
                  key={entry.name}
                  className="rounded-lg border border-border/80 bg-muted/20 px-3 py-2"
                >
                  <p className="text-xs font-semibold text-foreground">{entry.name}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                    {entry.definition}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <FallacyGuideContent
              fallacyName={fallacyName}
              contextNote={contextNote}
              flaggedSpan={flaggedSpan}
              disputed={disputed}
              compact
            />
          )}

          <button
            type="button"
            onClick={() => setShowGlossary((value) => !value)}
            className="mt-3 text-[11px] font-medium text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary"
          >
            {showGlossary ? "Back to this fallacy" : "Browse all fallacies"}
          </button>
        </div>
      )}
    </div>
  );
}
