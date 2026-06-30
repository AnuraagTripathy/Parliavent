"use client";

import { useState } from "react";
import { MOCK_FINDINGS, MOTION, SEED_ARGUMENT } from "@/lib/mockJudge";
import type { Finding } from "@/lib/types";
import { ArgumentEditor } from "./ArgumentEditor";
import { FindingsPanel } from "./FindingsPanel";
import { ReadinessBar } from "./ReadinessBar";

interface DebateAppProps {
  embedded?: boolean;
}

export function DebateApp({ embedded = false }: DebateAppProps) {
  const [argumentText, setArgumentText] = useState(SEED_ARGUMENT);
  const [findings] = useState<Finding[]>(MOCK_FINDINGS);

  return (
    <div className="flex flex-1 flex-col">
      {embedded && (
        <div className="border-b border-[#e8e8e4] bg-[#fafaf8]/60">
          <div className="mx-auto max-w-7xl px-4 py-5 lg:px-8">
            <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[#9a9a96]">
              Motion
            </p>
            <h1 className="max-w-3xl text-xl font-medium leading-snug tracking-tight text-[#1a1a18] sm:text-2xl">
              {MOTION}
            </h1>
          </div>
        </div>
      )}

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-0 px-4 pb-28 pt-6 lg:flex-row lg:gap-8 lg:px-8 lg:pb-8">
        <section className="min-h-[420px] flex-1 lg:min-h-0">
          <ArgumentEditor
            text={argumentText}
            findings={findings}
            onChange={setArgumentText}
          />
        </section>

        <aside className="w-full shrink-0 lg:w-[340px] xl:w-[380px]">
          <FindingsPanel findings={findings} />
        </aside>
      </div>

      <ReadinessBar findings={findings} />
    </div>
  );
}
