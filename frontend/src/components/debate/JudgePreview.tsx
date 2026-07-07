"use client";

import { useState } from "react";
import { AlertTriangle, BookOpen, MessageCircleWarning } from "lucide-react";
import { StaggerGroup, StaggerItem } from "@/components/ui/fade-in";

type FindingId = "claim" | "fallacy" | "clarity";

interface Segment {
  text: string;
  finding?: FindingId;
}

const ARGUMENT: Segment[] = [
  { text: "Companies should switch to a four-day work week. " },
  {
    text: "In the UK's 2022 trial, 56 of the 61 participating companies kept the four-day week after it ended.",
    finding: "claim",
  },
  { text: " " },
  {
    text: "Anyone defending five days is just a corporate bootlicker.",
    finding: "fallacy",
  },
  { text: " And honestly, " },
  { text: "the office grind is soul-crushing", finding: "clarity" },
  { text: "." },
];

const SPAN_STYLES: Record<FindingId, { base: string; active: string }> = {
  claim: {
    base: "underline decoration-sky-400/60 decoration-2 underline-offset-4",
    active: "bg-sky-400/15 decoration-sky-400",
  },
  fallacy: {
    base: "underline decoration-red-400/60 decoration-2 underline-offset-4",
    active: "bg-red-400/15 decoration-red-400",
  },
  clarity: {
    base: "underline decoration-amber-400/60 decoration-2 underline-offset-4",
    active: "bg-amber-400/15 decoration-amber-400",
  },
};

interface JudgePreviewProps {
  onTryIt?: () => void;
}

export function JudgePreview({ onTryIt }: JudgePreviewProps) {
  const [active, setActive] = useState<FindingId | null>(null);

  const cardProps = (id: FindingId) => ({
    onMouseEnter: () => setActive(id),
    onMouseLeave: () => setActive(null),
    onFocus: () => setActive(id),
    onBlur: () => setActive(null),
  });

  return (
    <div className="mx-auto max-w-5xl">
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/40">
        {/* Composer chrome */}
        <div className="flex items-center justify-between border-b border-border px-6 py-3">
          <span className="font-display text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            Your argument
          </span>
          <span className="text-[11px] text-muted-foreground/60">256 chars</span>
        </div>

        {/* Argument with flagged spans */}
        <div className="px-6 py-6 md:px-10 md:py-8">
          <p className="text-base leading-loose text-foreground/90 md:text-lg">
            {ARGUMENT.map((segment, i) =>
              segment.finding ? (
                <span
                  key={i}
                  className={`rounded-sm px-0.5 transition-colors duration-200 ${SPAN_STYLES[segment.finding].base} ${
                    active === segment.finding
                      ? SPAN_STYLES[segment.finding].active
                      : ""
                  }`}
                >
                  {segment.text}
                </span>
              ) : (
                <span key={i}>{segment.text}</span>
              ),
            )}
          </p>
        </div>

        {/* Judge review */}
        <div className="border-t border-border bg-muted/20 px-6 py-6 md:px-10">
          <div className="mb-5 flex items-center justify-between">
            <span className="font-display text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
              Judge review
            </span>
            <span className="rounded-full border border-border px-3 py-1 text-[11px] text-muted-foreground">
              3 findings
            </span>
          </div>

          <StaggerGroup className="grid gap-4 md:grid-cols-3">
            <StaggerItem>
              <div
                {...cardProps("claim")}
                tabIndex={0}
                className="group h-full cursor-default rounded-xl border border-sky-400/25 bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-400/60"
              >
                <p className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-sky-400">
                  <BookOpen className="h-3.5 w-3.5" />
                  Claim
                </p>
                <p className="mb-2 text-sm font-semibold text-foreground">
                  This statistic needs a source
                </p>
                <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
                  To verify the outcome of the UK&apos;s 2022 trial.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-sky-400/15 px-3 py-1 text-[11px] font-medium text-sky-400">
                    Find sources
                  </span>
                  <span className="rounded-full border border-border px-3 py-1 text-[11px] text-muted-foreground">
                    Keep as-is
                  </span>
                </div>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div
                {...cardProps("fallacy")}
                tabIndex={0}
                className="group h-full cursor-default rounded-xl border border-red-400/25 bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-red-400/60"
              >
                <div className="mb-2 flex items-center justify-between">
                  <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-red-400">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Fallacy
                  </p>
                  <span className="text-[10px] text-muted-foreground/60">
                    80% confidence
                  </span>
                </div>
                <p className="mb-2 text-sm font-semibold text-foreground">
                  Could be read as an ad hominem
                </p>
                <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
                  This phrase attacks the character of those who disagree
                  instead of the argument.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-border px-3 py-1 text-[11px] text-muted-foreground">
                    Keep as-is
                  </span>
                  <span className="rounded-full border border-border px-3 py-1 text-[11px] text-muted-foreground">
                    Dispute
                  </span>
                </div>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div
                {...cardProps("clarity")}
                tabIndex={0}
                className="group h-full cursor-default rounded-xl border border-amber-400/25 bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-400/60"
              >
                <p className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400">
                  <MessageCircleWarning className="h-3.5 w-3.5" />
                  Clarity
                </p>
                <p className="mb-2 text-sm font-semibold text-foreground">
                  Consider more precise wording
                </p>
                <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
                  Strong opinion, but it may read as overly emotive or vague.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-primary px-3 py-1 text-[11px] font-medium text-primary-foreground">
                    Use suggestion
                  </span>
                  <span className="rounded-full border border-border px-3 py-1 text-[11px] text-muted-foreground">
                    Keep as-is
                  </span>
                </div>
              </div>
            </StaggerItem>
          </StaggerGroup>
        </div>

        {/* Footer bar */}
        <div className="flex items-center justify-between border-t border-border px-6 py-3">
          <span className="text-xs text-muted-foreground">3 items to review</span>
          <button
            type="button"
            onClick={onTryIt}
            className="rounded-full bg-primary px-5 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Post starter
          </button>
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Hover a card to see what it flags. Your words stay yours — nothing
        changes without your click.
      </p>
    </div>
  );
}
