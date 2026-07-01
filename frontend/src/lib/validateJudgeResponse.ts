import type { Finding, FindingStatus, FindingType, JudgeResponse } from "./types";

const FINDING_TYPES = new Set<FindingType>(["claim", "fallacy", "clarity"]);
const FINDING_STATUSES = new Set<FindingStatus>([
  "open",
  "resolved",
  "ignored",
  "disputed",
  "source_attached",
  "marked_opinion",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isFinding(value: unknown): value is Finding {
  if (!isRecord(value)) return false;

  return (
    typeof value.id === "string" &&
    typeof value.type === "string" &&
    FINDING_TYPES.has(value.type as FindingType) &&
    typeof value.status === "string" &&
    FINDING_STATUSES.has(value.status as FindingStatus) &&
    typeof value.spanText === "string" &&
    typeof value.title === "string" &&
    typeof value.reason === "string"
  );
}

export function parseJudgeResponse(data: unknown): JudgeResponse | null {
  if (!isRecord(data) || !Array.isArray(data.findings)) {
    return null;
  }

  if (!data.findings.every(isFinding)) {
    return null;
  }

  return { findings: data.findings };
}
