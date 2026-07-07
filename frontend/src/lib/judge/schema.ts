import type { Finding, FindingType } from "@/lib/types";
import { spansOverlap } from "@/lib/spanOverlap";

export const MAX_FINDINGS = 5;

const FINDING_TYPES = new Set<FindingType>(["claim", "fallacy", "clarity"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeConfidence(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    const percent = value <= 1 ? Math.round(value * 100) : Math.round(value);
    return `${percent}%`;
  }
  return undefined;
}

function normalizeOptionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function normalizeRawFinding(
  value: unknown,
  index: number,
): Omit<Finding, "sources"> | null {
  if (!isRecord(value)) return null;

  const type = value.type;
  if (typeof type !== "string" || !FINDING_TYPES.has(type as FindingType)) {
    return null;
  }

  const spanText = normalizeOptionalString(value.spanText);
  const title = normalizeOptionalString(value.title);
  const reason = normalizeOptionalString(value.reason);
  if (!spanText || !title || !reason) return null;

  const id =
    typeof value.id === "string" && value.id.trim()
      ? value.id.trim()
      : `finding-${type}-${index + 1}`;

  return {
    id,
    type: type as FindingType,
    status: "open",
    spanText,
    title,
    reason,
    subtitle: normalizeOptionalString(value.subtitle),
    confidence: normalizeConfidence(value.confidence),
    example: normalizeOptionalString(value.example),
    suggestedRewrite: normalizeOptionalString(value.suggestedRewrite),
  };
}

/**
 * Parse model JSON and return normalized findings (before span filtering).
 * Returns null if the payload shape is invalid.
 */
export function parseAIJudgeOutput(data: unknown): Omit<Finding, "sources">[] | null {
  if (!isRecord(data) || !Array.isArray(data.findings)) {
    return null;
  }

  const normalized = data.findings
    .map((finding, index) => normalizeRawFinding(finding, index))
    .filter((finding): finding is Omit<Finding, "sources"> => finding !== null);

  return normalized;
}

/**
 * Keep only findings whose span is an exact substring of the argument,
 * recording the anchored offset so repeated phrases stay unambiguous
 * downstream (highlighting, user-approved edits).
 */
export function filterFindingsBySpan(
  findings: Omit<Finding, "sources">[],
  text: string,
): Omit<Finding, "sources">[] {
  return findings.flatMap((finding) => {
    const spanStart = text.indexOf(finding.spanText);
    if (spanStart === -1) return [];
    return [{ ...finding, spanStart }];
  });
}

function dedupeFindings(findings: Omit<Finding, "sources">[]): Omit<Finding, "sources">[] {
  const seen = new Set<string>();
  const result: Omit<Finding, "sources">[] = [];

  for (const finding of findings) {
    const key = `${finding.type}:${finding.spanText}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(finding);
  }

  return result;
}

/** Drop nested/overlapping findings of the same type — keep the broadest span. */
function dedupeOverlappingFindings(
  findings: Omit<Finding, "sources">[],
): Omit<Finding, "sources">[] {
  const sorted = [...findings].sort(
    (a, b) => b.spanText.length - a.spanText.length,
  );
  const kept: Omit<Finding, "sources">[] = [];

  for (const finding of sorted) {
    const overlapsExisting = kept.some(
      (existing) =>
        existing.type === finding.type &&
        spansOverlap(existing.spanText, finding.spanText),
    );
    if (!overlapsExisting) {
      kept.push(finding);
    }
  }

  return kept;
}

function ensureUniqueIds(findings: Omit<Finding, "sources">[]): Finding[] {
  const usedIds = new Set<string>();

  return findings.map((finding, index) => {
    let id = finding.id;
    if (usedIds.has(id)) {
      id = `${finding.id}-${index + 1}`;
    }
    usedIds.add(id);

    const withSources: Finding = { ...finding, id };
    return withSources;
  });
}

const INFORMAL_FILLER_PATTERN =
  /^(bro|dude|man|like|literally|basically|honestly|ngl|imo|tbh|kinda|sorta|fr|lowkey|highkey)[!.?]*$/i;

const EMOTION_FALLACY_PATTERN = /appeal to emotion|appeal to fear|fear/i;

const FACTUAL_CAUSAL_SPAN_PATTERN =
  /\b(cause|causes|caused|induce|increase|risk|emit|emits|lead to|leads to|proven|proof|study|studies|percent|%|wave|radiation|link|linked)\b/i;

function looksLikeInformalRegisterFallacy(
  finding: Omit<Finding, "sources">,
): boolean {
  if (finding.type !== "fallacy") {
    return false;
  }

  const span = finding.spanText.trim();
  const wordCount = span.split(/\s+/).filter(Boolean).length;
  const meta = `${finding.title} ${finding.reason} ${finding.subtitle ?? ""}`.toLowerCase();

  const isShortSpan = wordCount <= 3 && span.length <= 28;
  const mentionsInformalTone =
    meta.includes("informal") ||
    meta.includes("undermine credibility") ||
    (meta.includes("credibility") && meta.includes("tone"));

  if (!isShortSpan && !mentionsInformalTone) {
    return false;
  }

  if (INFORMAL_FILLER_PATTERN.test(span)) {
    return true;
  }

  if (
    finding.subtitle &&
    EMOTION_FALLACY_PATTERN.test(finding.subtitle) &&
    wordCount <= 2
  ) {
    return true;
  }

  return mentionsInformalTone && isShortSpan;
}

function downgradeInformalRegisterFallacy(
  finding: Omit<Finding, "sources">,
): Omit<Finding, "sources"> {
  return {
    ...finding,
    type: "clarity",
    subtitle: undefined,
    confidence: undefined,
    example: undefined,
    title: "Consider clearer wording",
    reason:
      "Informal filler or slang can distract readers in a written debate. A small wording tweak keeps your point without changing your stance.",
  };
}

function looksLikeScareLanguageFallacyOnFactualClaim(
  finding: Omit<Finding, "sources">,
): boolean {
  if (finding.type !== "fallacy") {
    return false;
  }

  const meta = `${finding.subtitle ?? ""} ${finding.title} ${finding.reason}`;
  if (!EMOTION_FALLACY_PATTERN.test(meta)) {
    return false;
  }

  return FACTUAL_CAUSAL_SPAN_PATTERN.test(finding.spanText);
}

function downgradeScareLanguageFallacyToClaim(
  finding: Omit<Finding, "sources">,
): Omit<Finding, "sources"> {
  return {
    ...finding,
    type: "claim",
    subtitle: undefined,
    confidence: undefined,
    example: undefined,
    title: "This claim needs evidence",
    reason:
      "This states a specific causal or mechanistic claim. Loaded wording is not a reasoning fallacy — readers may still expect evidence for the underlying assertion.",
  };
}

const PRECISION_ISSUE_META_PATTERN =
  /\b(specify|specified|type and level|amount|magnitude|clarify|more specific|more precise|what kind|which type|imprecise|unspecified|should be specified|needs clarification)\b/i;

const CONTESTED_FACTUAL_SPAN_PATTERN =
  /\b(cause|causes|caused|we know|proven|proof|always|never|\d+%|studies prove|study shows|linked to cancer|induce cancer)\b/i;

function looksLikePrecisionIssueMislabeledAsClaim(
  finding: Omit<Finding, "sources">,
): boolean {
  if (finding.type !== "claim") {
    return false;
  }

  const meta = `${finding.title} ${finding.reason}`;
  if (!PRECISION_ISSUE_META_PATTERN.test(meta)) {
    return false;
  }

  return !CONTESTED_FACTUAL_SPAN_PATTERN.test(finding.spanText);
}

function downgradePrecisionClaimToClarity(
  finding: Omit<Finding, "sources">,
): Omit<Finding, "sources"> {
  return {
    ...finding,
    type: "clarity",
    title: finding.title.includes("Specify")
      ? finding.title
      : "Be more specific here",
    reason:
      finding.reason ||
      "Readers may not know what exactly you mean. A more precise phrase helps — this is a wording issue, not a missing source.",
  };
}

function adjustFindingToneAndType(
  finding: Omit<Finding, "sources">,
): Omit<Finding, "sources"> {
  if (looksLikeInformalRegisterFallacy(finding)) {
    return downgradeInformalRegisterFallacy(finding);
  }

  if (looksLikeScareLanguageFallacyOnFactualClaim(finding)) {
    return downgradeScareLanguageFallacyToClaim(finding);
  }

  if (looksLikePrecisionIssueMislabeledAsClaim(finding)) {
    return downgradePrecisionClaimToClarity(finding);
  }

  return finding;
}

/** Full server-side pipeline after JSON parse. */
export function sanitizeAIFindings(
  raw: unknown,
  text: string,
): Finding[] {
  const parsed = parseAIJudgeOutput(raw);
  if (!parsed) {
    return [];
  }

  const spanMatched = filterFindingsBySpan(parsed, text);
  const deduped = dedupeFindings(spanMatched);
  const toneAdjusted = deduped.map(adjustFindingToneAndType);
  const overlapDeduped = dedupeOverlappingFindings(toneAdjusted);

  return ensureUniqueIds(overlapDeduped.slice(0, MAX_FINDINGS));
}
