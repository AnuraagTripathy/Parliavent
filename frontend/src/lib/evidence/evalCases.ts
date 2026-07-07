import type { ClaimVerdict } from "@/lib/types";

export interface EvidenceEvalCase {
  id: string;
  label: string;
  claim: string;
  expectedVerdicts: ClaimVerdict[];
  /** Whether the router should recommend deep investigation after standard check. */
  shouldEscalate: boolean;
  /** Expected risk/weak router signal tags detected (even if shouldEscalate is false). */
  expectedEscalationSignals?: string[];
  mustNotHaveSupportingSource?: boolean;
  mustHaveAtLeastOneAttachableSource?: boolean;
  mustNotBeFullySupported?: boolean;
  preferredDomains?: string[];
}

export const EVIDENCE_EVAL_CASES: EvidenceEvalCase[] = [
  {
    id: "eval-mobile-phones-cancer",
    label: "Debunked health scare",
    claim: "Mobile phones cause cancer",
    expectedVerdicts: ["unsupported", "contradicted"],
    shouldEscalate: false,
    expectedEscalationSignals: ["medical_or_scientific", "causal"],
    mustNotHaveSupportingSource: true,
    preferredDomains: ["cancer.gov", "cancerresearchuk.org", "cancer.org"],
  },
  {
    id: "eval-congestion-pricing-overclaim",
    label: "Empirical overclaim with false precision",
    claim:
      "Studies prove congestion pricing always cuts emissions by 40% within one year",
    expectedVerdicts: ["unsupported", "too_broad", "unclear", "contradicted"],
    shouldEscalate: false,
    expectedEscalationSignals: ["numeric", "timeline", "absolute_language"],
    mustNotHaveSupportingSource: true,
  },
  {
    id: "eval-paris-ltz-expansion",
    label: "Verifiable recent policy fact",
    claim:
      "Paris has expanded low-traffic and pedestrian-friendly zones in recent years",
    expectedVerdicts: ["supported", "partially_supported"],
    shouldEscalate: false,
    mustHaveAtLeastOneAttachableSource: true,
  },
  {
    id: "eval-europe-vague-comparison",
    label: "Vague cross-region comparison",
    claim: "Europe does it and their cities are way nicer",
    expectedVerdicts: ["too_broad", "partially_supported", "unsupported", "unclear"],
    shouldEscalate: true,
    expectedEscalationSignals: ["broad_or_vague"],
    mustNotBeFullySupported: true,
  },
  {
    id: "eval-vaccine-microchips",
    label: "Known conspiracy claim",
    claim: "Vaccines contain microchips",
    expectedVerdicts: ["unsupported", "contradicted"],
    shouldEscalate: false,
    expectedEscalationSignals: ["medical_or_scientific"],
    mustNotHaveSupportingSource: true,
  },
];
