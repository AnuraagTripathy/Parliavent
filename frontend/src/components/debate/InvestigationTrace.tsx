"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { AgentTraceStep } from "@/lib/types";

interface InvestigationTraceProps {
  trace: AgentTraceStep[];
}

export function InvestigationTrace({ trace }: InvestigationTraceProps) {
  const [open, setOpen] = useState(false);

  if (trace.length === 0) {
    return null;
  }

  return (
    <div className="mt-2 rounded-md border border-border/70 bg-muted/20">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-2.5 py-2 text-left"
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
          Investigation trace
        </span>
        <ChevronDown
          className={`h-3 w-3 text-muted-foreground transition-transform ${
            open ? "rotate-180" : ""
          }`}
          strokeWidth={2}
        />
      </button>

      {open && (
        <ol className="space-y-2 border-t border-border/60 px-2.5 py-2">
          {trace.map((step) => (
            <li key={step.step} className="text-[10px] leading-relaxed">
              <p className="font-medium text-foreground/85">
                {step.step}. {step.stage.replace(/_/g, " ")}
              </p>
              <p className="text-muted-foreground">{step.summary}</p>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
