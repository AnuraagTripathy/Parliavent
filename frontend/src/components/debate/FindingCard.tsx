"use client";

import { useState } from "react";
import {
  EVIDENCE_EMPTY_MESSAGE,
  EVIDENCE_ERROR_MESSAGE,
  fetchEvidenceSearch,
  KEEP_AS_IS_CAVEAT_HINT,
} from "@/lib/api/evidence";
import { classifyClaimKind } from "@/lib/evidence/classifyClaimKind";
import { buildOpinionFallbackRewrite } from "@/lib/evidence/opinionFallbackRewrite";
import type { EvidenceSearchResponse, EvidenceSource, Finding, FindingType } from "@/lib/types";
import { AlertTriangle, BookOpen, Check, Loader2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { EvidenceCandidatesList } from "./EvidenceCandidatesList";
import { FallacyGuideContent } from "./FallacyGuideContent";

interface FindingCardProps {
  finding: Finding;
  argumentText: string;
  threadId?: string;
  onUseSuggestion: (findingId: string) => void;
  onKeepAsIs: (findingId: string) => void;
  onSourceSearchResult: (findingId: string, result: EvidenceSearchResponse) => void;
  onAttachEvidenceSource: (findingId: string, source: EvidenceSource) => void;
  onApplyRewrite: (findingId: string, replacement: string) => void;
  onMarkAsOpinion: (findingId: string) => void;
  onDispute: (findingId: string, reason: string) => void;
}

const typeConfig: Record<
  FindingType,
  { label: string; icon: typeof BookOpen; accent: string; border: string; dot: string }
> = {
  clarity: {
    label: "Clarity",
    icon: MessageCircle,
    accent: "text-amber-400",
    border: "border-amber-500/20",
    dot: "bg-amber-400",
  },
  claim: {
    label: "Claim",
    icon: BookOpen,
    accent: "text-sky-400",
    border: "border-sky-500/20",
    dot: "bg-sky-400",
  },
  fallacy: {
    label: "Fallacy",
    icon: AlertTriangle,
    accent: "text-red-400",
    border: "border-red-500/25",
    dot: "bg-red-400",
  },
};

const statusLabels: Partial<Record<Finding["status"], string>> = {
  resolved: "Suggestion applied",
  ignored: "Kept as-is",
  disputed: "Disputed",
  source_attached: "Source attached",
  marked_opinion: "Marked as opinion",
};

function hasSuggestedRewrite(finding: Finding): boolean {
  return Boolean(finding.suggestedRewrite?.trim());
}

function isRelevanceClarityFinding(finding: Finding): boolean {
  if (finding.type !== "clarity") {
    return false;
  }

  const haystack = `${finding.title} ${finding.reason}`.toLowerCase();
  return (
    haystack.includes("unclear connection") ||
    haystack.includes("off-topic") ||
    haystack.includes("off topic") ||
    haystack.includes("relevance") ||
    haystack.includes("not related") ||
    haystack.includes("does not address")
  );
}

function ActionButton({
  children,
  onClick,
  disabled = false,
  variant = "default",
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "default" | "primary" | "muted";
}) {
  const variantMap = {
    default: "outline",
    primary: "default",
    muted: "ghost",
  } as const;

  return (
    <Button
      variant={variantMap[variant]}
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "h-7 rounded-md px-2.5 text-[11px] font-medium",
        variant === "muted" && "text-muted-foreground",
      )}
    >
      {children}
    </Button>
  );
}

export function FindingCard({
  finding,
  argumentText,
  threadId,
  onUseSuggestion,
  onKeepAsIs,
  onSourceSearchResult,
  onAttachEvidenceSource,
  onApplyRewrite,
  onMarkAsOpinion,
  onDispute,
}: FindingCardProps) {
  const config = typeConfig[finding.type];
  const Icon = config.icon;
  const isOpen = finding.status === "open";
  const statusLabel = statusLabels[finding.status];
  const hasSourceCandidates =
    (finding.sourceCandidates?.length ?? 0) > 0;
  const claimKind =
    finding.claimKind ?? classifyClaimKind(finding.spanText);
  // One-click dismiss is only allowed when the span clearly reads as a
  // personal view. Factual and unclear claims get the stricter revise flow.
  const allowOneClickOpinion = claimKind === "opinion" || claimKind === "mixed";
  const hasNegativeEvidence =
    finding.evidenceClaimVerdict === "contradicted" ||
    finding.evidenceClaimVerdict === "unsupported";
  const opinionRewrite =
    finding.suggestedRewrite ?? buildOpinionFallbackRewrite(finding.spanText);

  const [fallacyExpanded, setFallacyExpanded] = useState(false);
  const [disputeOpen, setDisputeOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState("");
  const [revisePanelOpen, setRevisePanelOpen] = useState(false);
  const [sourceSearchLoading, setSourceSearchLoading] = useState(false);
  const [sourceSearchError, setSourceSearchError] = useState<string | null>(
    null,
  );
  const [sourceSearchEmpty, setSourceSearchEmpty] = useState(false);

  async function handleFindSources() {
    setSourceSearchLoading(true);
    setSourceSearchError(null);
    setSourceSearchEmpty(false);

    try {
      const result = await fetchEvidenceSearch({
        claim: finding.spanText,
        argumentText,
        threadId,
      });

      if (result.sources.length === 0) {
        setSourceSearchEmpty(true);
        return;
      }

      onSourceSearchResult(finding.id, result);
    } catch {
      setSourceSearchError(EVIDENCE_ERROR_MESSAGE);
    } finally {
      setSourceSearchLoading(false);
    }
  }

  function handleDisputeSubmit() {
    const trimmed = disputeReason.trim();
    if (!trimmed) return;
    onDispute(finding.id, trimmed);
    setDisputeOpen(false);
    setDisputeReason("");
  }

  return (
    <article
      className={cn(
        "rounded-lg border bg-card p-4",
        config.border,
        !isOpen && "opacity-70",
      )}
    >
      <div className="mb-2.5 flex items-center gap-2">
        <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
        <span className={`text-[10px] font-medium uppercase tracking-[0.12em] ${config.accent}`}>
          {config.label}
        </span>
        {isRelevanceClarityFinding(finding) && isOpen && (
          <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
            · Relevance
          </span>
        )}
        {finding.confidence && isOpen && (
          <span className="ml-auto text-[10px] text-muted-foreground/70">
            {finding.confidence} confidence
          </span>
        )}
        {statusLabel && (
          <span className="ml-auto flex items-center gap-1 text-[10px] text-emerald-400">
            <Check className="h-3 w-3" strokeWidth={2} />
            {statusLabel}
          </span>
        )}
      </div>

      <div className="mb-2 flex items-start gap-2">
        <Icon className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${config.accent}`} strokeWidth={1.75} />
        <div>
          <h3 className="text-[13px] font-medium leading-snug text-foreground">
            {finding.title}
          </h3>
          {finding.subtitle && (
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              {finding.subtitle}
            </p>
          )}
        </div>
      </div>

      {finding.type !== "fallacy" && (
        <p className="mb-3 text-[12px] leading-relaxed text-muted-foreground">
          {finding.reason}
        </p>
      )}

      <blockquote className="mb-3 rounded border-l-2 border-border bg-muted/40 py-1 pl-2.5 pr-1 text-[11px] italic leading-relaxed text-foreground/70">
        &ldquo;{finding.spanText}&rdquo;
      </blockquote>

      {finding.type === "fallacy" && (
        <div className="mb-3">
          <FallacyGuideContent
            fallacyName={finding.subtitle ?? finding.title}
            contextNote={finding.reason}
            flaggedSpan={finding.spanText}
            judgeExample={finding.example}
            disputed={finding.status === "disputed"}
          />
        </div>
      )}

      {finding.type === "clarity" && hasSuggestedRewrite(finding) && isOpen && (
        <div className="mb-3 rounded-md border border-border bg-muted/40 px-2.5 py-2">
          <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
            Suggested wording
          </p>
          <p className="text-[12px] leading-relaxed text-foreground/90">
            {finding.suggestedRewrite}
          </p>
        </div>
      )}

      {finding.type === "fallacy" && fallacyExpanded && (
        <>
          {finding.suggestedRewrite && (
            <div className="mb-3 rounded-md border border-border bg-muted/40 px-2.5 py-2">
              <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
                Suggested wording
              </p>
              <p className="text-[12px] leading-relaxed text-foreground/90">
                {finding.suggestedRewrite}
              </p>
            </div>
          )}
        </>
      )}

      {finding.status === "disputed" && finding.disputeReason && (
        <p className="mb-3 rounded-md border border-red-500/20 bg-red-500/5 px-2.5 py-2 text-[11px] leading-relaxed text-foreground/70">
          <span className="font-medium text-foreground/80">Your dispute: </span>
          {finding.disputeReason}
        </p>
      )}

      {isOpen && finding.type === "clarity" && (
        <div className="flex flex-wrap gap-2">
          {hasSuggestedRewrite(finding) && (
            <ActionButton variant="primary" onClick={() => onUseSuggestion(finding.id)}>
              Use suggestion
            </ActionButton>
          )}
          <ActionButton onClick={() => onKeepAsIs(finding.id)}>Keep as-is</ActionButton>
        </div>
      )}

      {isOpen && finding.type === "claim" && (
        <>
          <div className="flex flex-wrap gap-2">
            {!hasSourceCandidates && (
              <ActionButton
                variant="primary"
                onClick={() => void handleFindSources()}
                disabled={sourceSearchLoading}
              >
                {sourceSearchLoading ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Loader2 className="h-3 w-3 animate-spin" strokeWidth={2} />
                    Searching...
                  </span>
                ) : (
                  "Find sources"
                )}
              </ActionButton>
            )}
            {allowOneClickOpinion ? (
              <ActionButton onClick={() => onMarkAsOpinion(finding.id)}>
                Mark as opinion
              </ActionButton>
            ) : (
              <ActionButton
                onClick={() => setRevisePanelOpen((open) => !open)}
              >
                Revise as opinion
              </ActionButton>
            )}
            <div className="flex w-full flex-col gap-1">
              <ActionButton variant="muted" onClick={() => onKeepAsIs(finding.id)}>
                {hasNegativeEvidence ? "Keep as-is anyway" : "Keep as-is"}
              </ActionButton>
              {hasNegativeEvidence && (
                <p className="text-[10px] leading-relaxed text-amber-400/80">
                  {KEEP_AS_IS_CAVEAT_HINT}
                </p>
              )}
            </div>
          </div>

          {revisePanelOpen && !allowOneClickOpinion && (
            <div className="mt-3 rounded-md border border-border bg-muted/40 px-2.5 py-2.5">
              <p className="mb-2 text-[11px] leading-relaxed text-muted-foreground">
                This is written as a factual claim. To treat it as opinion,
                rewrite it as a personal view.
              </p>

              <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
                Suggested personal wording
              </p>
              <div className="mb-2 rounded border-l-2 border-sky-500/40 bg-background/60 py-1 pl-2.5 pr-1">
                <p className="text-[11px] leading-relaxed text-foreground/90">
                  {opinionRewrite}
                </p>
              </div>
              {!finding.suggestedRewrite && (
                <p className="mb-2 text-[10px] leading-relaxed text-muted-foreground/80">
                  You can edit this wording before using it, or keep your
                  original claim as-is.
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                <ActionButton
                  variant="primary"
                  onClick={() => {
                    setRevisePanelOpen(false);
                    onApplyRewrite(finding.id, opinionRewrite);
                  }}
                >
                  Use this wording
                </ActionButton>
                <ActionButton
                  variant="muted"
                  onClick={() => setRevisePanelOpen(false)}
                >
                  Cancel
                </ActionButton>
              </div>
            </div>
          )}

          {sourceSearchError && (
            <p className="mt-2 text-[11px] text-red-300/90" role="status">
              {sourceSearchError}
            </p>
          )}

          {sourceSearchEmpty && (
            <p className="mt-2 text-[11px] text-muted-foreground" role="status">
              {EVIDENCE_EMPTY_MESSAGE}
            </p>
          )}

          {hasSourceCandidates && finding.sourceCandidates && (
            <EvidenceCandidatesList
              claimVerdict={finding.evidenceClaimVerdict ?? "unclear"}
              summary={finding.evidenceSummary ?? ""}
              sources={finding.sourceCandidates}
              onUseSource={(source) =>
                onAttachEvidenceSource(finding.id, source)
              }
            />
          )}
        </>
      )}

      {isOpen && finding.type === "fallacy" && (
        <>
          <div className="flex flex-wrap gap-2">
            {!fallacyExpanded && (
              <ActionButton onClick={() => setFallacyExpanded(true)}>
                See suggested fix
              </ActionButton>
            )}
            {fallacyExpanded && finding.suggestedRewrite && (
              <ActionButton variant="primary" onClick={() => onUseSuggestion(finding.id)}>
                Use this wording
              </ActionButton>
            )}
            <ActionButton
              variant={fallacyExpanded ? "default" : "muted"}
              onClick={() => onKeepAsIs(finding.id)}
            >
              Keep as-is
            </ActionButton>
            {!disputeOpen && (
              <ActionButton variant="muted" onClick={() => setDisputeOpen(true)}>
                Dispute
              </ActionButton>
            )}
          </div>

          {disputeOpen && (
            <div className="mt-3 space-y-2">
              <Textarea
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                placeholder="Why do you disagree with this finding?"
                rows={2}
                className="min-h-0 resize-none bg-background/60 text-[12px] leading-relaxed"
              />
              <div className="flex gap-2">
                <ActionButton variant="primary" onClick={handleDisputeSubmit}>
                  Submit dispute
                </ActionButton>
                <ActionButton
                  variant="muted"
                  onClick={() => {
                    setDisputeOpen(false);
                    setDisputeReason("");
                  }}
                >
                  Cancel
                </ActionButton>
              </div>
            </div>
          )}
        </>
      )}
    </article>
  );
}
