"use client";

import { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { PenLine } from "lucide-react";
import type { fetchEvidenceSearchWithJob } from "@/lib/api/evidence";
import { applyUserApprovedEdit } from "@/lib/applyUserEdit";
import { citationsFromFindings, sourcesFromFindings } from "@/lib/citationsFromFindings";
import { getReadiness } from "@/lib/readiness";
import type {
  EvidenceSearchResponse,
  EvidenceSource,
  Finding,
  Source,
} from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ArgumentEditor } from "./ArgumentEditor";
import { FindingsPanel } from "./FindingsPanel";

/**
 * Landing-page demo of the composer. This is the REAL review UI —
 * ArgumentEditor, FindingsPanel, FindingCard — running on local state with
 * pre-seeded findings and a canned evidence search, so visitors can play
 * with the exact interactions (apply rewrites, dispute, attach sources)
 * without an account or API calls.
 */

const DEMO_TEXT =
  "Companies should switch to a four-day work week. In the UK's 2022 trial, 56 of the 61 participating companies kept the four-day week after it ended. Anyone defending five days is just a corporate bootlicker. And honestly, the office grind is soul-crushing.";

const DEMO_FINDINGS: Finding[] = [
  {
    id: "demo-claim-1",
    type: "claim",
    status: "open",
    spanText:
      "In the UK's 2022 trial, 56 of the 61 participating companies kept the four-day week after it ended.",
    title: "This statistic needs a source",
    reason: "To verify the outcome of the UK's 2022 trial.",
    claimKind: "factual",
  },
  {
    id: "demo-fallacy-1",
    type: "fallacy",
    status: "open",
    spanText: "Anyone defending five days is just a corporate bootlicker.",
    title: "This could be read as an ad hominem attack",
    subtitle: "Ad Hominem",
    confidence: "80%",
    reason:
      "Instead of addressing the argument, this phrase attacks the character of those who disagree.",
    example:
      "\"Everyone who supports remote work is just lazy\" attacks people rather than engaging their reasons.",
    suggestedRewrite:
      "I have not yet heard a strong argument for keeping the five-day week.",
  },
  {
    id: "demo-clarity-1",
    type: "clarity",
    status: "open",
    spanText: "the office grind is soul-crushing",
    title: "Consider more precise wording",
    reason:
      "While this phrase conveys a strong opinion, it may be perceived as overly emotive or vague.",
    suggestedRewrite:
      "the traditional office environment can be detrimental to mental health",
  },
];

const DEMO_EVIDENCE_SOURCES: EvidenceSource[] = [
  {
    id: "demo-source-autonomy",
    title:
      "The results are in: the UK's four-day week pilot",
    publisher: "Autonomy",
    url: "https://autonomy.work/portfolio/uk4dwpilotresults/",
    snippet:
      "Of the 61 companies that participated, 56 are continuing with the four-day week (92%), with 18 confirming the policy is a permanent change.",
    supportLevel: "supports",
    credibility: "high",
    rationale:
      "Official report from the pilot's research partner; directly states the 56-of-61 continuation figure.",
    canAttachAsSupport: true,
    evidencePassages: [
      "Of the 61 companies that participated, 56 are continuing with the four-day week (92%).",
    ],
  },
  {
    id: "demo-source-guardian",
    title:
      "Most UK firms in four-day week trial to continue with flexible working",
    publisher: "The Guardian",
    url: "https://www.theguardian.com/money/2023/feb/21/four-day-week-uk-trial-success-pattern",
    snippet:
      "The vast majority of companies taking part in the world's biggest trial of a four-day week have opted to continue with the new working pattern.",
    supportLevel: "partially_supports",
    credibility: "high",
    rationale:
      "Reports the trial outcome but summarizes rather than confirming the exact 56-of-61 count.",
    canAttachAsSupport: true,
  },
];

const DEMO_EVIDENCE_RESULT: EvidenceSearchResponse = {
  claim: DEMO_FINDINGS[0].spanText,
  claimKind: "factual",
  claimVerdict: "supported",
  summary:
    "Multiple reliable reports confirm that 56 of the 61 companies in the UK's 2022 pilot continued with the four-day week after the trial ended.",
  sources: DEMO_EVIDENCE_SOURCES,
  evidenceMode: "standard",
};

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

/** Same shape as fetchEvidenceSearchWithJob, but canned: staged progress, then the demo result. */
const demoFetchEvidence: typeof fetchEvidenceSearchWithJob = async (
  _params,
  options,
) => {
  options?.onProgress?.({ stage: "searching", progress: 30, message: "" });
  await sleep(900);
  options?.onProgress?.({ stage: "fetching_pages", progress: 60, message: "" });
  await sleep(900);
  options?.onProgress?.({ stage: "verifying", progress: 90, message: "" });
  await sleep(700);
  return DEMO_EVIDENCE_RESULT;
};

interface JudgePreviewProps {
  onTryIt?: () => void;
}

export function JudgePreview({ onTryIt }: JudgePreviewProps) {
  const [argumentText, setArgumentText] = useState(DEMO_TEXT);
  const [findings, setFindings] = useState<Finding[]>(DEMO_FINDINGS);

  const citations = useMemo(() => citationsFromFindings(findings), [findings]);
  const attachedSources = useMemo(
    () => sourcesFromFindings(findings),
    [findings],
  );
  const { resolved, total, percent, label } = getReadiness(findings);

  const updateFinding = useCallback(
    (findingId: string, patch: Partial<Finding>) => {
      setFindings((prev) =>
        prev.map((f) => (f.id === findingId ? { ...f, ...patch } : f)),
      );
    },
    [],
  );

  const applySuggestion = useCallback(
    (findingId: string) => {
      setFindings((prev) => {
        const finding = prev.find((f) => f.id === findingId);
        if (!finding?.suggestedRewrite) return prev;
        setArgumentText((text) =>
          applyUserApprovedEdit({
            text,
            spanText: finding.spanText,
            replacement: finding.suggestedRewrite!,
          }),
        );
        return prev.map((f) =>
          f.id === findingId ? { ...f, status: "resolved" as const } : f,
        );
      });
    },
    [],
  );

  const applyRewrite = useCallback(
    (findingId: string, replacement: string) => {
      setFindings((prev) => {
        const finding = prev.find((f) => f.id === findingId);
        if (!finding) return prev;
        setArgumentText((text) =>
          applyUserApprovedEdit({
            text,
            spanText: finding.spanText,
            replacement,
          }),
        );
        return prev.map((f) =>
          f.id === findingId ? { ...f, status: "resolved" as const } : f,
        );
      });
    },
    [],
  );

  const attachEvidenceSource = useCallback(
    (findingId: string, evidenceSource: EvidenceSource) => {
      if (!evidenceSource.canAttachAsSupport) return;
      const source: Source = {
        id: evidenceSource.id,
        title: evidenceSource.title,
        publisher: evidenceSource.publisher,
        url: evidenceSource.url,
        isSample: false,
      };
      updateFinding(findingId, {
        status: "source_attached",
        selectedSourceId: evidenceSource.id,
        sources: [source],
      });
    },
    [updateFinding],
  );

  return (
    <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-border bg-background text-left shadow-2xl shadow-black/40">
      {/* Composer header — same markup as ComposerShell's starter state */}
      <div className="border-b border-border bg-card/80">
        <div className="w-full px-4 py-5 md:px-8">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
              <PenLine className="h-4 w-4 text-muted-foreground" strokeWidth={2} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                Starter · Live demo
              </p>
              <p className="mt-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                Motion
              </p>
              <h3 className="mt-0.5 text-lg font-bold leading-snug text-foreground sm:text-xl">
                Four-day work weeks are so much better
              </h3>
              <p className="mt-2 text-[12px] text-muted-foreground">
                Write → review judge findings → post. Your words, your call.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col gap-6 px-4 pb-6 pt-6 md:px-8">
        <section className="mx-auto w-full max-w-4xl">
          <ArgumentEditor
            text={argumentText}
            findings={findings}
            citations={citations}
            attachedSources={attachedSources}
            onChange={setArgumentText}
          />
        </section>

        <section className="mx-auto w-full max-w-6xl">
          <FindingsPanel
            findings={findings}
            argumentText={argumentText}
            fetchEvidence={demoFetchEvidence}
            onUseSuggestion={applySuggestion}
            onKeepAsIs={(id) => updateFinding(id, { status: "ignored" })}
            onSourceSearchResult={(id, result) =>
              updateFinding(id, {
                sourceCandidates: result.sources,
                claimKind: result.claimKind,
                evidenceClaimVerdict: result.claimVerdict,
                evidenceSummary: result.summary,
                evidenceMode: result.evidenceMode,
              })
            }
            onAttachEvidenceSource={attachEvidenceSource}
            onApplyRewrite={applyRewrite}
            onMarkAsOpinion={(id) =>
              updateFinding(id, { status: "marked_opinion" })
            }
            onDispute={(id, reason) =>
              updateFinding(id, { status: "disputed", disputeReason: reason })
            }
          />
        </section>
      </div>

      {/* Readiness bar — same markup as ReadinessBar, scoped to the card */}
      <footer className="border-t border-border bg-background/95">
        <div className="flex w-full items-center gap-4 px-4 py-3 md:px-8">
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <p className="truncate text-[12px] font-semibold text-foreground/70">
                {label}
              </p>
              <p className="shrink-0 text-[11px] text-muted-foreground">
                {resolved}/{total} resolved
              </p>
            </div>
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
            onClick={onTryIt}
            className="h-9 shrink-0 px-4 text-[12px] font-bold"
          >
            Post starter
          </Button>
        </div>
      </footer>
    </div>
  );
}
