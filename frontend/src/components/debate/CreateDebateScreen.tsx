"use client";

import { useState } from "react";
import { ArrowLeft, PenLine } from "lucide-react";
import type { JudgeMode } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";

export interface CreateDebateDraft {
  motion: string;
  argument: string;
  judgeMode: JudgeMode;
}

interface CreateDebateScreenProps {
  onBack: () => void;
  onContinue: (draft: CreateDebateDraft) => void | Promise<void>;
  isSubmitting?: boolean;
  submitError?: string | null;
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
  isSubmitting = false,
  submitError = null,
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
    void onContinue({
      motion: trimmedMotion,
      argument: argument.trim(),
      judgeMode,
    });
  }

  return (
    <div className="w-full px-4 py-10 md:px-8 lg:px-12 xl:px-16">
      <div className="mx-auto w-full max-w-3xl">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="mb-8 h-8 px-2 text-xs text-muted-foreground"
        >
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
          Back to debates
        </Button>

        <div className="mb-10 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <PenLine className="h-5 w-5 text-primary" strokeWidth={2} />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-medium tracking-tight text-foreground md:text-4xl">
              Create debate
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Set your motion, write your starter, and the judge will review
              against your topic.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label
              htmlFor="debate-motion"
              className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground"
            >
              Debate topic / motion
            </label>
            <input
              id="debate-motion"
              type="text"
              value={motion}
              onChange={(e) => setMotion(e.target.value)}
              placeholder="Do mobile phones increase cancer risk?"
              className="w-full rounded-xl border border-input bg-card px-4 py-3.5 text-base text-foreground outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              autoFocus
            />
          </div>

          <div>
            <label
              htmlFor="debate-argument"
              className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground"
            >
              Starter argument
            </label>
            <Textarea
              id="debate-argument"
              value={argument}
              onChange={(e) => setArgument(e.target.value)}
              placeholder="Write your opening argument here, or continue in the composer…"
              rows={6}
              className="min-h-[160px] resize-y bg-card text-base leading-relaxed"
            />
          </div>

          <fieldset>
            <legend className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Debate mode
            </legend>
            <div className="space-y-3">
              {MODE_OPTIONS.map((option) => {
                const selected = judgeMode === option.value;
                return (
                  <label
                    key={option.value}
                    className={`flex cursor-pointer gap-3 rounded-xl border px-5 py-4 transition-colors ${
                      selected
                        ? "border-primary/40 bg-primary/5"
                        : "border-border bg-card hover:border-primary/20"
                    }`}
                  >
                    <input
                      type="radio"
                      name="debate-mode"
                      value={option.value}
                      checked={selected}
                      onChange={() => setJudgeMode(option.value)}
                      className="mt-1 accent-primary"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-foreground">
                        {option.label}
                        {option.value === "structured_debate" && (
                          <span className="ml-2 text-xs font-medium text-primary">
                            Default
                          </span>
                        )}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {option.description}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {(error || submitError) && (
            <p className="text-sm text-destructive" role="alert">
              {error ?? submitError}
            </p>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full sm:w-auto sm:px-10"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Spinner label="Saving debate…" />
            ) : (
              "Continue to review"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
