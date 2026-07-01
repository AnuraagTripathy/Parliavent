import type { Finding, FindingType, Source } from "@/lib/types";

export const MAX_FINDINGS = 5;

/** Sample sources so claim cards keep working in Groq mode (not real evidence). */
export const SAMPLE_CLAIM_SOURCES: Source[] = [
  {
    id: "source-1",
    title: "Car-free streets and city livability",
    publisher: "Urban Planning Review",
    isSample: true,
  },
  {
    id: "source-2",
    title: "Oslo city center traffic reduction outcomes",
    publisher: "City of Oslo policy brief",
    isSample: true,
  },
  {
    id: "source-3",
    title: "Paris low-traffic zones, three-year review",
    publisher: "Sample case study",
    isSample: true,
  },
];

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

/** Keep only findings whose span is an exact substring of the argument. */
export function filterFindingsBySpan(
  findings: Omit<Finding, "sources">[],
  text: string,
): Omit<Finding, "sources">[] {
  return findings.filter((finding) => text.includes(finding.spanText));
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

function ensureUniqueIds(findings: Omit<Finding, "sources">[]): Finding[] {
  const usedIds = new Set<string>();

  return findings.map((finding, index) => {
    let id = finding.id;
    if (usedIds.has(id)) {
      id = `${finding.id}-${index + 1}`;
    }
    usedIds.add(id);

    const withSources: Finding = { ...finding, id };
    if (finding.type === "claim") {
      withSources.sources = SAMPLE_CLAIM_SOURCES;
    }

    return withSources;
  });
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

  return ensureUniqueIds(deduped.slice(0, MAX_FINDINGS));
}
