import { buildSearchQuery } from "@/lib/evidence/sourceUtils";

export interface PlannedQueries {
  support: string;
  contradiction: string;
  official: string;
}

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "been",
  "but",
  "by",
  "did",
  "do",
  "does",
  "for",
  "from",
  "had",
  "has",
  "have",
  "if",
  "in",
  "is",
  "it",
  "its",
  "of",
  "on",
  "or",
  "that",
  "the",
  "their",
  "they",
  "this",
  "to",
  "was",
  "were",
  "will",
  "with",
  "you",
  "your",
  "our",
  "we",
]);

const OFFICIAL_HINTS: Array<{ pattern: RegExp; hint: string }> = [
  { pattern: /\bcancer\b/i, hint: "cancer organization" },
  { pattern: /\bemission|climate|congestion|pricing\b/i, hint: "official emissions study" },
  { pattern: /\bparis\b/i, hint: "official Paris city policy" },
  { pattern: /\beurope|european\b/i, hint: "official European urban policy" },
  { pattern: /\bhealth|medical|disease\b/i, hint: "health organization" },
  { pattern: /\beconomy|gdp|productivity\b/i, hint: "official economic data" },
];

function extractClaimKeywords(claim: string): string[] {
  const words = claim
    .toLowerCase()
    .replace(/[^\w\s%]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));

  return [...new Set(words)];
}

function pickOfficialHint(claim: string, argumentText?: string): string {
  const combined = `${claim} ${argumentText ?? ""}`;
  for (const { pattern, hint } of OFFICIAL_HINTS) {
    if (pattern.test(combined)) {
      return hint;
    }
  }
  return "official research";
}

/**
 * Deterministic query planning for evidence search.
 * Generates support, contradiction, and official/neutral queries from the claim.
 */
export function planEvidenceQueries(
  claim: string,
  argumentText?: string,
  threadId?: string,
): PlannedQueries {
  const keywords = extractClaimKeywords(claim);
  const keywordPhrase = keywords.slice(0, 8).join(" ");

  const supportBase =
    keywordPhrase ||
    buildSearchQuery(claim, argumentText, threadId).replace(/\s+evidence$/, "");

  const officialHint = pickOfficialHint(claim, argumentText);

  return {
    support: `evidence ${supportBase}`.trim(),
    contradiction: `no evidence ${supportBase}`.trim(),
    official: `official ${officialHint} ${supportBase}`.trim(),
  };
}
