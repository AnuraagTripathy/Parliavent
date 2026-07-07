import { searchEvidenceWithMode } from "../../src/lib/evidence/searchEvidenceWithMode";
import type { ClaimVerdict, Finding } from "../../src/lib/types";
import {
  allEvidenceTargetFindingIds,
  shouldRunLiveEvidenceForPost,
} from "../seed-data/showcase-findings";
import {
  SEED_EVIDENCE_PACE_MS,
  SEED_MAX_EVIDENCE_PER_POST,
  selectClaimFindingsForEvidence,
} from "./groq-seed-config";

const CAVEAT_VERDICTS = new Set<ClaimVerdict>([
  "unsupported",
  "contradicted",
  "too_broad",
  "unclear",
]);

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function shouldRunEvidenceForFinding(params: {
  finding: Finding;
  postKey: string;
  withJudge: boolean;
  withEvidence: boolean;
}): boolean {
  if (!params.withEvidence || params.finding.type !== "claim") return false;

  if (params.withJudge) {
    return true;
  }

  return (
    shouldRunLiveEvidenceForPost(params.postKey) &&
    allEvidenceTargetFindingIds().includes(params.finding.id)
  );
}

export interface EvidenceEnrichResult {
  evidenceSkippedDueToCap: number;
}

export async function enrichClaimFindingsWithEvidence(params: {
  postKey: string;
  findings: Finding[];
  text: string;
  slug: string;
  withJudge: boolean;
  withEvidence: boolean;
}): Promise<EvidenceEnrichResult> {
  let evidenceSkippedDueToCap = 0;

  if (!params.withEvidence) {
    return { evidenceSkippedDueToCap };
  }

  const isEligible = (finding: Finding) =>
    shouldRunEvidenceForFinding({
      finding,
      postKey: params.postKey,
      withJudge: params.withJudge,
      withEvidence: params.withEvidence,
    });

  const { toVerify, skipped } = selectClaimFindingsForEvidence(
    params.findings,
    SEED_MAX_EVIDENCE_PER_POST,
    isEligible,
  );

  for (const finding of skipped) {
    evidenceSkippedDueToCap += 1;
    console.log(
      `  ↳ evidence cap (${SEED_MAX_EVIDENCE_PER_POST}/post): skipped claim on ${params.postKey} — "${finding.spanText.slice(0, 60)}${finding.spanText.length > 60 ? "…" : ""}"`,
    );
  }

  for (let i = 0; i < toVerify.length; i += 1) {
    const finding = toVerify[i];
    const priorAttached =
      finding.status === "source_attached" && Boolean(finding.selectedSourceId);
    const priorSnapshot: Finding = {
      ...finding,
      sources: finding.sources ? [...finding.sources] : undefined,
      sourceCandidates: finding.sourceCandidates
        ? [...finding.sourceCandidates]
        : undefined,
    };

    try {
      const result = await searchEvidenceWithMode({
        claim: finding.spanText,
        argumentText: params.text,
        threadId: params.slug,
        mode: "standard",
        autoEscalate: true,
      });

      finding.evidenceClaimVerdict = result.claimVerdict;
      finding.evidenceSummary = result.summary;
      finding.claimKind = result.claimKind;
      finding.sourceCandidates = result.sources;

      const supporting = result.sources.find((s) => s.canAttachAsSupport);
      if (
        supporting &&
        (result.claimVerdict === "supported" ||
          result.claimVerdict === "partially_supported")
      ) {
        finding.status = "source_attached";
        finding.selectedSourceId = supporting.id;
        finding.sources = [
          {
            id: supporting.id,
            title: supporting.title,
            publisher: supporting.publisher,
            url: supporting.url,
            isSample: false,
          },
        ];
      } else if (
        result.claimVerdict &&
        CAVEAT_VERDICTS.has(result.claimVerdict)
      ) {
        finding.status = "ignored";
        finding.selectedSourceId = undefined;
        finding.sources = undefined;
      } else if (!priorAttached) {
        finding.status = "open";
        finding.selectedSourceId = undefined;
        finding.sources = undefined;
      } else {
        finding.status = priorSnapshot.status;
        finding.selectedSourceId = priorSnapshot.selectedSourceId;
        finding.sources = priorSnapshot.sources;
        finding.sourceCandidates =
          priorSnapshot.sourceCandidates ?? finding.sourceCandidates;
      }
    } catch (error) {
      Object.assign(finding, priorSnapshot);
      console.warn(`Live evidence failed for ${finding.id}:`, error);
    }

    if (SEED_EVIDENCE_PACE_MS > 0 && i < toVerify.length - 1) {
      await sleep(SEED_EVIDENCE_PACE_MS);
    }
  }

  return { evidenceSkippedDueToCap };
}
