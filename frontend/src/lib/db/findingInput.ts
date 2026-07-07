import type { Finding } from "@/lib/types";

const FINDING_TYPES = new Set(["claim", "fallacy", "clarity"]);

const FINDING_STATUSES = new Set([
  "open",
  "resolved",
  "ignored",
  "disputed",
  "source_attached",
  "marked_opinion",
]);

const CLAIM_KINDS = new Set(["factual", "opinion", "mixed", "unclear"]);

const MAX_FINDING_ID_LENGTH = 200;

function isOptionalString(value: unknown): value is string | undefined {
  return value === undefined || typeof value === "string";
}

/**
 * Strict validation for client-submitted findings before persistence.
 * Enum fields are whitelisted so invalid values become a 400, not a Prisma
 * runtime error. Extra client-only fields (sourceCandidates, evidence*) are
 * ignored here; findingToCreateInput picks the persisted columns.
 */
export function isValidFindingInput(value: unknown): value is Finding {
  if (!value || typeof value !== "object") return false;
  const f = value as Record<string, unknown>;

  if (
    typeof f.id !== "string" ||
    !f.id.trim() ||
    f.id.length > MAX_FINDING_ID_LENGTH
  ) {
    return false;
  }
  if (typeof f.type !== "string" || !FINDING_TYPES.has(f.type)) return false;
  if (typeof f.status !== "string" || !FINDING_STATUSES.has(f.status)) {
    return false;
  }
  if (typeof f.spanText !== "string" || !f.spanText.trim()) return false;
  if (typeof f.title !== "string") return false;
  if (typeof f.reason !== "string") return false;
  if (
    f.claimKind !== undefined &&
    (typeof f.claimKind !== "string" || !CLAIM_KINDS.has(f.claimKind))
  ) {
    return false;
  }
  if (!isOptionalString(f.subtitle)) return false;
  if (!isOptionalString(f.confidence)) return false;
  if (!isOptionalString(f.example)) return false;
  if (!isOptionalString(f.suggestedRewrite)) return false;
  if (!isOptionalString(f.disputeReason)) return false;

  return true;
}
