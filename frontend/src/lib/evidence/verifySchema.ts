import { classifyClaimKind } from "@/lib/evidence/classifyClaimKind";
import { finalizeEvidenceSources } from "@/lib/evidence/sourceEligibility";
import type {
  ClaimKind,
  ClaimVerdict,
  EvidenceSource,
  SupportLevel,
} from "@/lib/types";

const CLAIM_VERDICTS = new Set<ClaimVerdict>([
  "supported",
  "partially_supported",
  "contradicted",
  "unsupported",
  "too_broad",
  "unclear",
]);

const CLAIM_KINDS = new Set<ClaimKind>([
  "factual",
  "opinion",
  "mixed",
  "unclear",
]);

const SUPPORT_LEVELS = new Set<SupportLevel>([
  "supports",
  "partially_supports",
  "contradicts",
  "related_only",
  "unclear",
]);

/** Map legacy verifier output for safety during rollout. */
const LEGACY_SUPPORT_LEVEL_MAP: Record<string, SupportLevel> = {
  context_only: "related_only",
};

export interface VerifiedEvidenceResult {
  claimKind: ClaimKind;
  claimVerdict: ClaimVerdict;
  summary: string;
  sourceAssessments: Array<{
    id: string;
    supportLevel: SupportLevel;
    rationale?: string;
  }>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeOptionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function normalizeSupportLevel(value: unknown): SupportLevel | null {
  if (typeof value !== "string") return null;

  const mapped = LEGACY_SUPPORT_LEVEL_MAP[value] ?? value;
  if (!SUPPORT_LEVELS.has(mapped as SupportLevel)) return null;

  return mapped as SupportLevel;
}

function normalizeSourceAssessment(
  value: unknown,
): VerifiedEvidenceResult["sourceAssessments"][number] | null {
  if (!isRecord(value)) return null;

  const id = normalizeOptionalString(value.id);
  const supportLevel = normalizeSupportLevel(value.supportLevel);

  if (!id || !supportLevel) return null;

  return {
    id,
    supportLevel,
    rationale: normalizeOptionalString(value.rationale),
  };
}

function normalizeClaimKind(value: unknown, claim: string): ClaimKind {
  if (typeof value === "string" && CLAIM_KINDS.has(value as ClaimKind)) {
    return value as ClaimKind;
  }
  return classifyClaimKind(claim);
}

export function parseVerifiedEvidenceOutput(
  data: unknown,
  sourceIds: Set<string>,
  claim: string,
): VerifiedEvidenceResult | null {
  if (!isRecord(data)) return null;

  const claimVerdict = data.claimVerdict;
  const summary = normalizeOptionalString(data.summary);

  if (
    typeof claimVerdict !== "string" ||
    !CLAIM_VERDICTS.has(claimVerdict as ClaimVerdict) ||
    !summary
  ) {
    return null;
  }

  if (!Array.isArray(data.sources)) return null;

  const sourceAssessments = data.sources
    .map(normalizeSourceAssessment)
    .filter(
      (assessment): assessment is NonNullable<typeof assessment> =>
        assessment !== null && sourceIds.has(assessment.id),
    );

  if (sourceAssessments.length === 0) return null;

  return {
    claimKind: normalizeClaimKind(data.claimKind, claim),
    claimVerdict: claimVerdict as ClaimVerdict,
    summary,
    sourceAssessments,
  };
}

export function applyVerificationToSources(
  sources: EvidenceSource[],
  verified: VerifiedEvidenceResult,
): EvidenceSource[] {
  const assessmentById = new Map(
    verified.sourceAssessments.map((assessment) => [assessment.id, assessment]),
  );

  const merged = sources.map((source) => {
    const assessment = assessmentById.get(source.id);
    if (!assessment) {
      return {
        ...source,
        supportLevel: "unclear" as const,
      };
    }

    return {
      ...source,
      supportLevel: assessment.supportLevel,
      rationale: assessment.rationale,
    };
  });

  return finalizeEvidenceSources(merged);
}

export function buildUnclearVerificationFallback(
  claim: string,
  sources: EvidenceSource[],
): VerifiedEvidenceResult {
  return {
    claimKind: classifyClaimKind(claim),
    claimVerdict: "unclear",
    summary:
      "Sources were found, but evidence could not be fully evaluated from the available snippets.",
    sourceAssessments: sources.map((source) => ({
      id: source.id,
      supportLevel: "unclear",
    })),
  };
}
