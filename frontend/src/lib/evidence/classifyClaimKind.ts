import type { ClaimKind } from "@/lib/types";

const OPINION_PATTERNS = [
  /\bi think\b/,
  /\bi believe\b/,
  /\bi feel\b/,
  /\bin my opinion\b/,
  /\bi personally\b/,
  /\bpersonally\b/,
  /\bi prefer\b/,
  /\bseems? (creepy|weird|bad|good|nice|nicer|better|worse)\b/,
];

const FACTUAL_PATTERNS = [
  /\bcause[sd]?\b/,
  /\bproves?\b/,
  /\bstud(y|ies) (show|prove|find|demonstrate)\b/,
  /\balways\b/,
  /\bnever\b/,
  /\bliterally\b/,
  /\d+%/,
  /\d+ (year|month|day|percent|people|deaths|cases)\b/,
  /\bwill (collapse|fall|rise|increase|decrease|cause)\b/,
  /\bcancer\b/,
  /\bemissions\b/,
  /\bcuts? .{0,30}\d+/,
  /\bwithin (one|a|1) year\b/,
  /\bthere is (no|clear|strong) (evidence|link|proof)\b/,
];

const MIXED_PATTERNS = [
  /\b(way |much )?(better|worse|nicer)\b/,
  /\beurope\b.*\b(nicer|better|nicer)\b/,
  /\bdoes it\b.*\b(nicer|better)\b/,
];

/**
 * Classify whether a claim span reads as factual, opinion, mixed, or unclear.
 * Used before evidence search and as a fallback when the verifier omits claimKind.
 */
export function classifyClaimKind(claim: string): ClaimKind {
  const lower = claim.toLowerCase().trim();

  const hasOpinion = OPINION_PATTERNS.some((pattern) => pattern.test(lower));
  const hasFactual = FACTUAL_PATTERNS.some((pattern) => pattern.test(lower));
  const hasMixed = MIXED_PATTERNS.some((pattern) => pattern.test(lower));

  if (hasOpinion && (hasFactual || hasMixed)) return "mixed";
  if (hasMixed && hasFactual) return "mixed";
  if (hasMixed) return "mixed";
  if (hasOpinion) return "opinion";
  if (hasFactual) return "factual";

  return "unclear";
}

/** Factual claims should not be dismissed via "Mark as opinion." */
export function canMarkClaimAsOpinion(claimKind: ClaimKind): boolean {
  return claimKind !== "factual";
}
