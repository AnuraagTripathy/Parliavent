import type { ClaimVerdict, EvidenceSource, SourceCredibility, SupportLevel } from "@/lib/types";

const CREDIBILITY_RANK: Record<SourceCredibility, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

const POSITIVE_SUPPORT_RANK: Record<SupportLevel, number> = {
  supports: 0,
  partially_supports: 1,
  related_only: 2,
  unclear: 3,
  contradicts: 4,
};

function isNegativeVerdict(verdict: ClaimVerdict): boolean {
  return verdict === "contradicted" || verdict === "unsupported";
}

/** Rank for unsupported/contradicted claims — reliable contradictory sources first. */
function negativeEvidenceRank(source: EvidenceSource): number {
  const credibility = CREDIBILITY_RANK[source.credibility];

  switch (source.supportLevel) {
    case "contradicts":
      return credibility;
    case "related_only":
      return 10 + credibility;
    case "unclear":
      return 20 + credibility;
    case "partially_supports":
      return 30 + credibility;
    case "supports":
      return 40 + credibility;
    default:
      return 50;
  }
}

/** Rank for supported claims — supporting reliable sources first, weak sources last. */
function positiveEvidenceRank(source: EvidenceSource): number {
  return (
    POSITIVE_SUPPORT_RANK[source.supportLevel] * 10 +
    CREDIBILITY_RANK[source.credibility]
  );
}

/**
 * Order source candidates for display.
 * - Supported claims: supporting reliable sources first.
 * - Unsupported/contradicted: contradictory reliable sources first.
 * - Weak sources always sort later within their tier.
 */
export function sortEvidenceSources(
  sources: EvidenceSource[],
  claimVerdict: ClaimVerdict,
): EvidenceSource[] {
  const rank = isNegativeVerdict(claimVerdict)
    ? negativeEvidenceRank
    : positiveEvidenceRank;

  return [...sources].sort((a, b) => rank(a) - rank(b));
}
