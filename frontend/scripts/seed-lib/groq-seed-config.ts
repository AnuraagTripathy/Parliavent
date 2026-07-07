import type { Finding } from "../../src/lib/types";
import { loadEnvFiles } from "./load-env";

loadEnvFiles();

export const SEED_JUDGE_PACE_MS = Number.parseInt(
  process.env.SEED_JUDGE_PACE_MS ?? "18000",
  10,
);

export const SEED_EVIDENCE_PACE_MS = Number.parseInt(
  process.env.SEED_EVIDENCE_PACE_MS ?? "22000",
  10,
);

export const SEED_MAX_EVIDENCE_PER_POST = Number.parseInt(
  process.env.SEED_MAX_EVIDENCE_PER_POST ?? "2",
  10,
);

function parseConfidence(finding: Finding): number {
  if (!finding.confidence) return 0;
  const parsed = Number.parseFloat(finding.confidence.replace("%", "").trim());
  return Number.isFinite(parsed) ? parsed : 0;
}

export function selectClaimFindingsForEvidence(
  findings: Finding[],
  cap: number,
  isEligible: (finding: Finding) => boolean,
): { toVerify: Finding[]; skipped: Finding[] } {
  const eligible = findings.filter(
    (f) => f.type === "claim" && isEligible(f),
  );

  if (eligible.length <= cap) {
    return { toVerify: eligible, skipped: [] };
  }

  const sorted = [...eligible].sort(
    (a, b) => parseConfidence(b) - parseConfidence(a),
  );

  return {
    toVerify: sorted.slice(0, cap),
    skipped: sorted.slice(cap),
  };
}
