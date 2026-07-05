"use client";

import { useState } from "react";
import { ArrowLeft, PenLine } from "lucide-react";
import type { JudgeMode } from "@/lib/types";

export interface CreateDebateDraft {
  motion: string;
  argument: string;
  judgeMode: JudgeMode;
}

interface CreateDebateScreenProps {
  onBack: () => void;
  onContinue: (draft: CreateDebateDraft) => void;
}

const MODE_OPTIONS: {
  value: JudgeMode;
  label: string;
  description: string;
}[] = [
  {
    value: "open_floor",
    label: "Open floor",
    description: "Light review — only the most obvious issues.",
  },
  {
    value: "structured_debate",
    label: "Structured debate",
    description: "Balanced review — recommended for most posts.",
  },
  {
    value: "formal_motion",
    label: "Formal motion",
    description: "Strict review — claims need stronger support.",
  },
];

export function CreateDebateScreen({
  onBack,
  onContinue,
}: CreateDebateScreenProps) {
  const [motion, setMotion] = useState("");
  const [argument, setArgument] = useState("");
  const [judgeMode, setJudgeMode] = useState<JudgeMode>("structured_debate");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const trimmedMotion = motion.trim();
    if (trimmedMotion.length < 8) {
      setError("Enter a debate topic or motion (at least 8 characters).");
      return;
    }

    setError(null);
    onContinue({
      motion: trimmedMotion,
      argument: argument.trim(),
      judgeMode,
    });
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 lg:px-0">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-1.5 text-[12px] font-medium text-zinc-500 transition-colors hover:text-zinc-200"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to home
      </button>

      <div className="mb-8 flex items-start gap-3">
        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-800">
          <PenLine className="h-4 w-4 text-zinc-400" strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-50">
            Create debate
          </h1>
          <p className="mt-1.5 text-[14px] leading-relaxed text-zinc-500">
            Set your motion, write your starter, and the judge will review against
            your topic — not a demo thread.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="debate-motion"
            className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-zinc-500"
          >
            Debate topic / motion
          </label>
          <input
            id="debate-motion"
            type="text"
            value={motion}
            onChange={(e) => setMotion(e.target.value)}
            placeholder="Do mobile phones increase cancer risk?"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-[15px] text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-zinc-600"
            autoFocus
          />
        </div>

        <div>
          <label
            htmlFor="debate-argument"
            className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-zinc-500"
          >
            Starter argument
          </label>
          <textarea
            id="debate-argument"
            value={argument}
            onChange={(e) => setArgument(e.target.value)}
            placeholder="Write your opening argument here, or continue in the composer…"
            rows={6}
            className="w-full resize-y rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-[15px] leading-relaxed text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-zinc-600"
          />
        </div>

        <fieldset>
          <legend className="mb-3 text-[11px] font-bold uppercase tracking-widest text-zinc-500">
            Debate mode
          </legend>
          <div className="space-y-2">
            {MODE_OPTIONS.map((option) => {
              const selected = judgeMode === option.value;
              return (
                <label
                  key={option.value}
                  className={`flex cursor-pointer gap-3 rounded-lg border px-4 py-3 transition-colors ${
                    selected
                      ? "border-teal-500/40 bg-teal-500/10"
                      : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="debate-mode"
                    value={option.value}
                    checked={selected}
                    onChange={() => setJudgeMode(option.value)}
                    className="mt-1"
                  />
                  <span>
                    <span className="block text-[14px] font-semibold text-zinc-100">
                      {option.label}
                      {option.value === "structured_debate" && (
                        <span className="ml-2 text-[11px] font-medium text-teal-400">
                          Default
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block text-[12px] text-zinc-500">
                      {option.description}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {error && (
          <p className="text-[13px] text-red-400/90" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-lg bg-zinc-100 px-4 py-3 text-[14px] font-bold text-zinc-950 transition-colors hover:bg-white sm:w-auto sm:px-8"
        >
          Continue to review
        </button>
      </form>
    </div>
  );
}
