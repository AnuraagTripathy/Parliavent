"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
import {
  EVIDENCE_UNSUPPORTED_WARNING,
} from "@/lib/api/evidence";
import { sortEvidenceSources } from "@/lib/evidence/sortEvidenceSources";
import { cleanEvidenceText } from "@/lib/evidence/cleanEvidenceText";
import type {
  AgentTraceStep,
  ClaimVerdict,
  EvidenceResultMode,
  EvidenceSource,
  SourceCredibility,
  SupportLevel,
} from "@/lib/types";
import { InvestigationTrace } from "./InvestigationTrace";
import { Button } from "@/components/ui/button";

interface EvidenceCandidatesListProps {
  claimVerdict: ClaimVerdict;
  summary: string;
  sources: EvidenceSource[];
  evidencePassages?: string[];
  investigationTrace?: AgentTraceStep[];
  evidenceMode?: EvidenceResultMode;
  onUseSource: (source: EvidenceSource) => void;
}

const VISIBLE_SOURCE_COUNT = 2;

const POSITIVE_BADGE = "border-emerald-500/25 bg-emerald-500/10 text-emerald-400";
const CAVEAT_BADGE = "border-amber-500/25 bg-amber-500/10 text-amber-400";
const NEGATIVE_BADGE = "border-red-500/25 bg-red-500/10 text-red-400";
const NEUTRAL_BADGE = "border-border bg-muted text-muted-foreground";
const RELATED_BADGE = "border-sky-500/25 bg-sky-500/10 text-sky-400";

const credibilityLabels: Record<SourceCredibility, string> = {
  high: "Reliable source",
  medium: "General source",
  low: "Weak source",
};

const credibilityStyles: Record<SourceCredibility, string> = {
  high: POSITIVE_BADGE,
  medium: CAVEAT_BADGE,
  low: NEUTRAL_BADGE,
};

const verdictLabels: Record<ClaimVerdict, string> = {
  supported: "Supported",
  partially_supported: "Partly supported",
  contradicted: "Not supported",
  unsupported: "Not supported",
  too_broad: "Too broad",
  unclear: "Unclear",
};

const verdictStyles: Record<ClaimVerdict, string> = {
  supported: POSITIVE_BADGE,
  partially_supported: CAVEAT_BADGE,
  contradicted: NEGATIVE_BADGE,
  unsupported: NEGATIVE_BADGE,
  too_broad: CAVEAT_BADGE,
  unclear: NEUTRAL_BADGE,
};

const supportLevelLabels: Record<SupportLevel, string> = {
  supports: "Supports claim",
  partially_supports: "Partly supports",
  contradicts: "Does not support claim",
  related_only: "Related only",
  unclear: "Unclear",
};

const supportLevelBadgeStyles: Record<SupportLevel, string> = {
  supports: POSITIVE_BADGE,
  partially_supports: CAVEAT_BADGE,
  contradicts: NEGATIVE_BADGE,
  related_only: RELATED_BADGE,
  unclear: NEUTRAL_BADGE,
};

function MiniBadge({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  return (
    <span
      className={`inline-flex rounded border px-1.5 py-0.5 text-[9px] font-medium ${className}`}
    >
      {children}
    </span>
  );
}

function SourceActionButton({
  source,
  onUseSource,
}: {
  source: EvidenceSource;
  onUseSource: (source: EvidenceSource) => void;
}) {
  if (source.canAttachAsSupport) {
    const isFullSupport = source.supportLevel === "supports";
    return (
      <Button
        variant={isFullSupport ? "default" : "outline"}
        size="sm"
        onClick={(event) => {
          event.stopPropagation();
          onUseSource(source);
        }}
        className={
          isFullSupport
            ? "h-6 rounded-md px-2.5 text-[10px] font-medium"
            : "h-6 rounded-md border-amber-500/40 px-2.5 text-[10px] font-medium text-amber-300 hover:bg-amber-500/10 hover:text-amber-200"
        }
      >
        {isFullSupport ? "Use as source" : "Use with caveat"}
      </Button>
    );
  }

  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event) => event.stopPropagation()}
      className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-2.5 py-1 text-[10px] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      Open source
      <ExternalLink className="h-2.5 w-2.5" strokeWidth={2} />
    </a>
  );
}

function SourceRow({
  source,
  onUseSource,
}: {
  source: EvidenceSource;
  onUseSource: (source: EvidenceSource) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <li className="rounded-md border border-border/70 bg-muted/30">
      <button
        type="button"
        onClick={() => setExpanded((open) => !open)}
        aria-expanded={expanded}
        className="w-full px-2.5 pt-2 text-left"
      >
        <div className="flex items-start gap-1.5">
          <p className="min-w-0 flex-1 text-[11px] font-medium leading-snug text-foreground/90">
            {cleanEvidenceText(source.title)}
          </p>
          <ChevronDown
            className={`mt-0.5 h-3 w-3 shrink-0 text-muted-foreground transition-transform ${
              expanded ? "rotate-180" : ""
            }`}
            strokeWidth={2}
          />
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-1">
          <MiniBadge className={credibilityStyles[source.credibility]}>
            {credibilityLabels[source.credibility]}
          </MiniBadge>
          <MiniBadge className={supportLevelBadgeStyles[source.supportLevel]}>
            {supportLevelLabels[source.supportLevel]}
          </MiniBadge>
          <span className="text-[10px] text-muted-foreground">{source.publisher}</span>
        </div>

        {!expanded && source.snippet && (
          <p className="mt-1 line-clamp-1 text-[10px] leading-relaxed text-muted-foreground">
            {cleanEvidenceText(source.snippet)}
          </p>
        )}
      </button>

      {expanded && (
        <div className="px-2.5 pt-1.5">
          {source.snippet && (
            <p className="mb-1.5 whitespace-pre-line text-[10px] leading-relaxed text-muted-foreground">
              {cleanEvidenceText(source.snippet)}
            </p>
          )}
          {source.rationale && (
            <p className="mb-1.5 text-[10px] italic leading-relaxed text-muted-foreground/80">
              {source.rationale}
            </p>
          )}
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[10px] font-medium text-sky-400 underline decoration-sky-400/30 underline-offset-2 hover:text-sky-300"
          >
            {source.url.replace(/^https?:\/\/(www\.)?/, "").slice(0, 50)}
            <ExternalLink className="h-2.5 w-2.5" strokeWidth={2} />
          </a>
        </div>
      )}

      <div className="px-2.5 pb-2 pt-1.5">
        <SourceActionButton source={source} onUseSource={onUseSource} />
      </div>
    </li>
  );
}

export function EvidenceCandidatesList({
  claimVerdict,
  summary,
  sources,
  evidencePassages,
  investigationTrace,
  evidenceMode,
  onUseSource,
}: EvidenceCandidatesListProps) {
  const [showAll, setShowAll] = useState(false);
  const [whyOpen, setWhyOpen] = useState(false);

  const sortedSources = useMemo(
    () => sortEvidenceSources(sources, claimVerdict),
    [sources, claimVerdict],
  );
  const visibleSources = showAll
    ? sortedSources
    : sortedSources.slice(0, VISIBLE_SOURCE_COUNT);
  const hiddenCount = sortedSources.length - VISIBLE_SOURCE_COUNT;

  const showUnsupportedWarning =
    claimVerdict === "contradicted" || claimVerdict === "unsupported";

  const rationales = sortedSources
    .map((source) => source.rationale?.trim())
    .filter((text): text is string => Boolean(text));

  const hasWhyDetail = Boolean(summary) || rationales.length > 0;

  return (
    <div className="mt-3 rounded-lg border border-border bg-card/80 p-2">
      <div className="mb-1.5 flex flex-wrap items-center gap-1.5 px-1">
        <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
          Evidence review
        </p>
        {evidenceMode === "deep" && (
          <MiniBadge className={CAVEAT_BADGE}>Deep investigation</MiniBadge>
        )}
        {evidenceMode === "auto_escalated" && (
          <MiniBadge className={CAVEAT_BADGE}>Auto-escalated</MiniBadge>
        )}
        <MiniBadge className={verdictStyles[claimVerdict]}>
          {verdictLabels[claimVerdict]}
        </MiniBadge>
        {hasWhyDetail && (
          <button
            type="button"
            onClick={() => setWhyOpen((open) => !open)}
            className="ml-auto text-[10px] font-medium text-muted-foreground underline decoration-border underline-offset-2 hover:text-foreground"
          >
            {whyOpen ? "Hide why" : "Why this verdict?"}
          </button>
        )}
      </div>

      {whyOpen && hasWhyDetail && (
        <div className="mb-2 rounded-md border border-border/70 bg-muted/30 px-2 py-1.5">
          {summary && (
            <p className="text-[10px] leading-relaxed text-foreground/80">
              {summary}
            </p>
          )}
          {rationales.length > 0 && (
            <ul className={`space-y-1 ${summary ? "mt-1.5" : ""}`}>
              {rationales.slice(0, 3).map((text, index) => (
                <li
                  key={index}
                  className="text-[10px] leading-relaxed text-muted-foreground before:mr-1 before:text-muted-foreground/60 before:content-['·']"
                >
                  {text}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {showUnsupportedWarning && (
        <p className="mb-2 rounded-md border border-red-500/20 bg-red-500/5 px-2 py-1.5 text-[10px] leading-relaxed text-red-300/90">
          {EVIDENCE_UNSUPPORTED_WARNING}
        </p>
      )}

      {evidencePassages && evidencePassages.length > 0 && (
        <div className="mb-2 rounded-md border border-border/70 bg-muted/30 px-2 py-1.5">
          <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
            Key evidence passages
          </p>
          <ul className="space-y-1">
            {evidencePassages.slice(0, 3).map((passage, index) => (
              <li
                key={index}
                className="text-[10px] leading-relaxed text-foreground/80 before:mr-1 before:text-muted-foreground/60 before:content-['·']"
              >
                {cleanEvidenceText(passage)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {investigationTrace && investigationTrace.length > 0 && (
        <InvestigationTrace trace={investigationTrace} />
      )}

      <ul className="space-y-1.5">
        {visibleSources.map((source) => (
          <SourceRow
            key={source.id}
            source={source}
            onUseSource={onUseSource}
          />
        ))}
      </ul>

      {hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setShowAll((open) => !open)}
          className="mt-1.5 w-full rounded-md px-2 py-1.5 text-[10px] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          {showAll
            ? "Show fewer sources"
            : `Show all sources (${sortedSources.length})`}
        </button>
      )}
    </div>
  );
}
