"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
import {
  EVIDENCE_UNSUPPORTED_WARNING,
} from "@/lib/api/evidence";
import { sortEvidenceSources } from "@/lib/evidence/sortEvidenceSources";
import type {
  ClaimVerdict,
  EvidenceSource,
  SourceCredibility,
  SupportLevel,
} from "@/lib/types";

interface EvidenceCandidatesListProps {
  claimVerdict: ClaimVerdict;
  summary: string;
  sources: EvidenceSource[];
  onUseSource: (source: EvidenceSource) => void;
}

const VISIBLE_SOURCE_COUNT = 2;

const credibilityLabels: Record<SourceCredibility, string> = {
  high: "Reliable source",
  medium: "General source",
  low: "Weak source",
};

const credibilityStyles: Record<SourceCredibility, string> = {
  high: "border-[#c8e6d4] bg-[#f0faf4] text-[#4a8a6a]",
  medium: "border-[#ebe3d4] bg-[#faf8f3] text-[#9a7b3c]",
  low: "border-[#e4e4e0] bg-[#f5f5f3] text-[#8a8a86]",
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
  supported: "border-[#c8e6d4] bg-[#f0faf4] text-[#4a8a6a]",
  partially_supported: "border-[#ebe3d4] bg-[#faf8f3] text-[#9a7b3c]",
  contradicted: "border-[#ebdede] bg-[#fdf6f6] text-[#9e5a5a]",
  unsupported: "border-[#ebdede] bg-[#fdf6f6] text-[#9e5a5a]",
  too_broad: "border-[#ebe3d4] bg-[#faf8f3] text-[#9a7b3c]",
  unclear: "border-[#e4e4e0] bg-[#f5f5f3] text-[#8a8a86]",
};

const supportLevelLabels: Record<SupportLevel, string> = {
  supports: "Supports claim",
  partially_supports: "Partly supports",
  contradicts: "Does not support claim",
  related_only: "Related only",
  unclear: "Unclear",
};

const supportLevelBadgeStyles: Record<SupportLevel, string> = {
  supports: "border-[#c8e6d4] bg-[#f0faf4] text-[#4a8a6a]",
  partially_supports: "border-[#ebe3d4] bg-[#faf8f3] text-[#9a7b3c]",
  contradicts: "border-[#ebdede] bg-[#fdf6f6] text-[#9e5a5a]",
  related_only: "border-[#dce4ef] bg-[#f4f7fb] text-[#5a7a9e]",
  unclear: "border-[#e4e4e0] bg-[#f5f5f3] text-[#8a8a86]",
};

function Badge({
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
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onUseSource(source);
        }}
        className={`rounded-md border px-2.5 py-1 text-[10px] font-medium transition-colors ${
          isFullSupport
            ? "border-[#1a1a18] bg-[#1a1a18] text-white hover:bg-[#2a2a28]"
            : "border-[#9a7b3c] bg-white text-[#6a5a30] hover:bg-[#faf8f3]"
        }`}
      >
        {isFullSupport ? "Use as source" : "Use with caveat"}
      </button>
    );
  }

  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event) => event.stopPropagation()}
      className="inline-flex items-center gap-1 rounded-md border border-[#d0d0cc] bg-white px-2.5 py-1 text-[10px] font-medium text-[#6a6a66] transition-colors hover:bg-[#fafaf8]"
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
    <li className="rounded-md border border-[#ececea] bg-[#fafaf8]">
      <button
        type="button"
        onClick={() => setExpanded((open) => !open)}
        aria-expanded={expanded}
        className="w-full px-2.5 pt-2 text-left"
      >
        <div className="flex items-start gap-1.5">
          <p className="min-w-0 flex-1 text-[11px] font-medium leading-snug text-[#4a4a48]">
            {source.title}
          </p>
          <ChevronDown
            className={`mt-0.5 h-3 w-3 shrink-0 text-[#a8a8a4] transition-transform ${
              expanded ? "rotate-180" : ""
            }`}
            strokeWidth={2}
          />
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-1">
          <Badge className={credibilityStyles[source.credibility]}>
            {credibilityLabels[source.credibility]}
          </Badge>
          <Badge className={supportLevelBadgeStyles[source.supportLevel]}>
            {supportLevelLabels[source.supportLevel]}
          </Badge>
          <span className="text-[10px] text-[#9a9a96]">{source.publisher}</span>
        </div>

        {!expanded && source.snippet && (
          <p className="mt-1 line-clamp-1 text-[10px] leading-relaxed text-[#7a7a76]">
            {source.snippet}
          </p>
        )}
      </button>

      {expanded && (
        <div className="px-2.5 pt-1.5">
          {source.snippet && (
            <p className="mb-1.5 text-[10px] leading-relaxed text-[#7a7a76]">
              {source.snippet}
            </p>
          )}
          {source.rationale && (
            <p className="mb-1.5 text-[10px] italic leading-relaxed text-[#8a8a86]">
              {source.rationale}
            </p>
          )}
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[10px] font-medium text-[#5a7a9e] underline decoration-[#dce4ef] underline-offset-2 hover:text-[#3a5a7e]"
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
    <div className="mt-3 rounded-lg border border-[#dce4ef] bg-white p-2 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <div className="mb-1.5 flex flex-wrap items-center gap-1.5 px-1">
        <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#a8a8a4]">
          Evidence review
        </p>
        <Badge className={verdictStyles[claimVerdict]}>
          {verdictLabels[claimVerdict]}
        </Badge>
        {hasWhyDetail && (
          <button
            type="button"
            onClick={() => setWhyOpen((open) => !open)}
            className="ml-auto text-[10px] font-medium text-[#7a7a76] underline decoration-[#d0d0cc] underline-offset-2 hover:text-[#4a4a48]"
          >
            {whyOpen ? "Hide why" : "Why this verdict?"}
          </button>
        )}
      </div>

      {whyOpen && hasWhyDetail && (
        <div className="mb-2 rounded-md border border-[#ececea] bg-[#fafaf8] px-2 py-1.5">
          {summary && (
            <p className="text-[10px] leading-relaxed text-[#6a6a66]">
              {summary}
            </p>
          )}
          {rationales.length > 0 && (
            <ul className={`space-y-1 ${summary ? "mt-1.5" : ""}`}>
              {rationales.slice(0, 3).map((text, index) => (
                <li
                  key={index}
                  className="text-[10px] leading-relaxed text-[#8a8a86] before:mr-1 before:text-[#c0c0bc] before:content-['·']"
                >
                  {text}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {showUnsupportedWarning && (
        <p className="mb-2 rounded-md border border-[#ebdede] bg-[#fdf6f6] px-2 py-1.5 text-[10px] leading-relaxed text-[#8a5050]">
          {EVIDENCE_UNSUPPORTED_WARNING}
        </p>
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
          className="mt-1.5 w-full rounded-md px-2 py-1.5 text-[10px] font-medium text-[#7a7a76] transition-colors hover:bg-[#fafaf8] hover:text-[#4a4a48]"
        >
          {showAll
            ? "Show fewer sources"
            : `Show all sources (${sortedSources.length})`}
        </button>
      )}
    </div>
  );
}
