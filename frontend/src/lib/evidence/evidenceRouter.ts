import { classifyClaimKind } from "@/lib/evidence/classifyClaimKind";
import type { ClaimVerdict, EvidenceSearchResponse } from "@/lib/types";

export type RecommendedEvidenceMode = "standard" | "deep";

export interface EvidenceRouterResult {
  shouldEscalate: boolean;
  escalationReason: string;
  escalationSignals: string[];
  riskSignals: string[];
  weakResultSignals: string[];
  recommendedMode: RecommendedEvidenceMode;
}

const NUMERIC_PATTERN =
  /\d+(?:\.\d+)?%|\$\d[\d,.]*[bmk]?|\d+\s*(?:million|billion|thousand)\b/i;

const TIMELINE_PATTERNS = [
  /\bby\s+20\d{2}\b/i,
  /\bwithin\s+(?:one|a|\d+)\s+(?:year|month|week|day)s?\b/i,
  /\bsince\s+20\d{2}\b/i,
  /\b(?:in|over|after|before)\s+\d+\s+(?:year|month|week)s?\b/i,
  /\brecent\s+years?\b/i,
];

const MEDICAL_SCIENTIFIC_TERMS = [
  "cancer",
  "vaccine",
  "radiation",
  "disease",
  "climate",
  "emissions",
  "microchip",
  "virus",
  "clinical",
  "health",
];

const CAUSAL_PATTERNS = [
  /\bcause[sd]?\b/i,
  /\blead[s]?\s+to\b/i,
  /\bresult[s]?\s+in\b/i,
  /\blinked\s+to\b/i,
  /\bbecause\s+of\b/i,
];

const ABSOLUTE_PATTERN =
  /\b(?:always|never|proves?|guaranteed|impossible|every|all)\b/i;

const BROAD_VAGUE_PATTERNS = [
  /\b(?:always|never|everyone|everybody|all\s+cities)\b/i,
  /\bway\s+(?:nicer|better|worse)\b/i,
  /\b(?:europe|they|their)\b.*\b(?:nicer|better|worse|does\s+it)\b/i,
  /\bdoes\s+it\b/i,
  /\bstudies\s+prove\b/i,
  /\bmuch\s+(?:nicer|better|worse)\b/i,
];

const OPINION_PATTERNS = [
  /\bi\s+think\b/i,
  /\bi\s+believe\b/i,
  /\bin\s+my\s+opinion\b/i,
];

const RISK_SIGNAL_IDS = new Set([
  "numeric",
  "timeline",
  "medical_or_scientific",
  "causal",
  "absolute_language",
  "broad_or_vague",
]);

const WEAK_SIGNAL_IDS = new Set([
  "verdict_unclear",
  "verdict_too_broad",
  "verdict_unsupported",
  "no_attachable_sources",
  "mostly_related_or_unclear",
  "snippet_only_verification",
]);

function isBroadOrVague(claim: string): boolean {
  return BROAD_VAGUE_PATTERNS.some((pattern) => pattern.test(claim));
}

function isSimpleOpinion(claim: string, claimKind: string): boolean {
  if (isBroadOrVague(claim)) {
    return false;
  }
  if (claimKind === "opinion") {
    return true;
  }

  const lower = claim.toLowerCase();
  const hasOpinion = OPINION_PATTERNS.some((pattern) => pattern.test(lower));
  const hasFactualSignal =
    NUMERIC_PATTERN.test(claim) ||
    TIMELINE_PATTERNS.some((pattern) => pattern.test(lower)) ||
    MEDICAL_SCIENTIFIC_TERMS.some((term) => lower.includes(term)) ||
    ABSOLUTE_PATTERN.test(lower) ||
    CAUSAL_PATTERNS.some((pattern) => pattern.test(claim));

  return hasOpinion && !hasFactualSignal;
}

function detectRiskSignals(claim: string): string[] {
  const signals: string[] = [];
  const lower = claim.toLowerCase();

  if (NUMERIC_PATTERN.test(claim)) {
    signals.push("numeric");
  }
  if (TIMELINE_PATTERNS.some((pattern) => pattern.test(lower))) {
    signals.push("timeline");
  }
  if (MEDICAL_SCIENTIFIC_TERMS.some((term) => lower.includes(term))) {
    signals.push("medical_or_scientific");
  }
  if (CAUSAL_PATTERNS.some((pattern) => pattern.test(claim))) {
    signals.push("causal");
  }
  if (ABSOLUTE_PATTERN.test(lower)) {
    signals.push("absolute_language");
  }
  if (isBroadOrVague(claim)) {
    signals.push("broad_or_vague");
  }

  return signals;
}

function detectWeakResultSignals(
  claim: string,
  result: EvidenceSearchResponse,
): string[] {
  const signals: string[] = [];
  const claimKind = result.claimKind ?? classifyClaimKind(claim);
  const { sources } = result;
  const clearlyResolved = isClearlyResolved(result.claimVerdict, sources);

  if (result.claimVerdict === "unclear") {
    signals.push("verdict_unclear");
  }
  if (result.claimVerdict === "too_broad") {
    signals.push("verdict_too_broad");
  }
  if (result.claimVerdict === "unsupported") {
    signals.push("verdict_unsupported");
  }

  if (result.claimVerdict === "partially_supported") {
    const risk = detectRiskSignals(claim);
    if (risk.includes("broad_or_vague")) {
      signals.push("partially_supported_broad_claim");
    }
  }

  if (clearlyResolved) {
    return signals;
  }

  if (result.verificationBasis === "snippets") {
    signals.push("snippet_only_verification");
  }

  const attachableCount = sources.filter((source) => source.canAttachAsSupport).length;
  if (
    claimKind === "factual" &&
    attachableCount === 0 &&
    result.claimVerdict !== "contradicted" &&
    result.claimVerdict !== "supported"
  ) {
    signals.push("no_attachable_sources");
  }

  if (sources.length > 0) {
    const weakSupportCount = sources.filter(
      (source) =>
        source.supportLevel === "related_only" || source.supportLevel === "unclear",
    ).length;
    if (weakSupportCount >= Math.max(1, Math.ceil(sources.length / 2))) {
      signals.push("mostly_related_or_unclear");
    }
  }

  return signals;
}

function isClearlyResolved(
  claimVerdict: ClaimVerdict,
  sources: EvidenceSearchResponse["sources"],
): boolean {
  if (claimVerdict === "supported" || claimVerdict === "contradicted") {
    return true;
  }
  if (
    claimVerdict === "partially_supported" &&
    sources.some((source) => source.canAttachAsSupport)
  ) {
    return true;
  }
  return false;
}

function decideEscalation(
  riskSignals: string[],
  weakSignals: string[],
  clearlyResolved: boolean,
): boolean {
  if (weakSignals.length > 0) {
    return true;
  }
  if (riskSignals.length >= 2 && !clearlyResolved) {
    return true;
  }
  return false;
}

function buildEscalationReason(
  riskSignals: string[],
  weakSignals: string[],
  claimVerdict: ClaimVerdict,
  shouldEscalate: boolean,
): string {
  if (!shouldEscalate) {
    return "Standard check completed with sufficient confidence.";
  }

  const parts: string[] = [];

  for (const signal of weakSignals) {
    switch (signal) {
      case "verdict_unclear":
        parts.push("standard check returned unclear");
        break;
      case "verdict_too_broad":
        parts.push("standard check returned too broad");
        break;
      case "verdict_unsupported":
        parts.push("standard check returned unsupported");
        break;
      case "no_attachable_sources":
        parts.push("no attachable supporting sources found");
        break;
      case "mostly_related_or_unclear":
        parts.push("sources are mostly related or unclear");
        break;
      case "snippet_only_verification":
        parts.push("page fetch failed — only snippets were available");
        break;
      case "partially_supported_broad_claim":
        parts.push("broad claim only partly supported");
        break;
    }
  }

  for (const signal of riskSignals) {
    switch (signal) {
      case "numeric":
        parts.push("exact numbers or statistics in the claim");
        break;
      case "timeline":
        parts.push("timeline wording in the claim");
        break;
      case "medical_or_scientific":
        parts.push("medical or scientific topic");
        break;
      case "causal":
        parts.push("causal wording needs closer review");
        break;
      case "absolute_language":
        parts.push("absolute language (always, never, proves, etc.)");
        break;
      case "broad_or_vague":
        parts.push("broad or vague comparison");
        break;
    }
  }

  const uniqueParts = [...new Set(parts)];
  if (uniqueParts.length === 0) {
    return `Standard check returned ${claimVerdict}; deeper investigation may help.`;
  }

  return `This claim may need deeper investigation: ${uniqueParts.join("; ")}.`;
}

export function routeEvidence(
  claim: string,
  result: EvidenceSearchResponse,
): EvidenceRouterResult {
  const claimKind = result.claimKind ?? classifyClaimKind(claim);

  if (isSimpleOpinion(claim, claimKind)) {
    return {
      shouldEscalate: false,
      escalationReason: "Simple opinion claim — standard check is sufficient.",
      escalationSignals: [],
      riskSignals: [],
      weakResultSignals: [],
      recommendedMode: "standard",
    };
  }

  const riskSignals = detectRiskSignals(claim);
  const weakResultSignals = detectWeakResultSignals(claim, result);
  const clearlyResolved = isClearlyResolved(result.claimVerdict, result.sources);
  const shouldEscalate = decideEscalation(
    riskSignals,
    weakResultSignals,
    clearlyResolved,
  );

  const escalationSignals = [...new Set([...riskSignals, ...weakResultSignals])];

  return {
    shouldEscalate,
    escalationReason: buildEscalationReason(
      riskSignals,
      weakResultSignals,
      result.claimVerdict,
      shouldEscalate,
    ),
    escalationSignals,
    riskSignals,
    weakResultSignals,
    recommendedMode: shouldEscalate ? "deep" : "standard",
  };
}

export function mergeRouterIntoResponse(
  result: EvidenceSearchResponse,
  router: EvidenceRouterResult,
): EvidenceSearchResponse {
  return {
    ...result,
    evidenceMode: result.evidenceMode ?? "standard",
    shouldEscalate: router.shouldEscalate,
    escalationReason: router.escalationReason,
    escalationSignals: router.escalationSignals,
    deepInvestigationAvailable: router.shouldEscalate,
  };
}

export { RISK_SIGNAL_IDS, WEAK_SIGNAL_IDS };
