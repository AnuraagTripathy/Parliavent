import type { EvidenceSource, Finding } from "../../src/lib/types";
import { SHOWCASE_SOURCES } from "./showcase-sources";

export interface ShowcaseFindingSeed {
  postKey: string;
  findings: Finding[];
  /** Run live evidence search for these finding ids when --with-evidence is passed. */
  evidenceFindingIds?: string[];
}

function f(partial: Omit<Finding, "id"> & { id: string }): Finding {
  return { ...partial };
}

function attachedClaim(
  id: string,
  spanText: string,
  sourceKey: keyof typeof SHOWCASE_SOURCES,
  overrides?: Partial<Finding>,
): Finding {
  const source = SHOWCASE_SOURCES[sourceKey];
  const evidenceSource: EvidenceSource = {
    id: source.id,
    title: source.title,
    publisher: source.publisher,
    url: source.url ?? "",
    snippet: source.snippet,
    supportLevel: source.supportLevel,
    credibility: source.credibility,
    rationale: source.rationale,
    canAttachAsSupport: true,
  };

  return f({
    id,
    type: "claim",
    status: "source_attached",
    spanText,
    title: "Source attached",
    reason: source.rationale ?? "A supporting source was attached to this claim.",
    claimKind: "factual",
    evidenceClaimVerdict: source.verdict,
    evidenceSummary: source.summary,
    selectedSourceId: source.id,
    sources: [
      {
        id: source.id,
        title: source.title,
        publisher: source.publisher,
        url: source.url,
        isSample: false,
      },
    ],
    sourceCandidates: [{ ...evidenceSource, isAttached: true } as EvidenceSource & { isAttached?: boolean }],
    ...overrides,
  });
}

export const SHOWCASE_FINDING_SEEDS: ShowcaseFindingSeed[] = [
  {
    postKey: "promise-starter",
    findings: [
      f({
        id: "promise-starter-clarity-1",
        type: "clarity",
        status: "open",
        spanText: "clearly cause serious harm",
        title: "Define what counts as serious harm",
        reason:
          "Readers may disagree about which harms justify breaking a promise unless the threshold is spelled out.",
        confidence: "86%",
        suggestedRewrite:
          "Breaking a promise can be justified when keeping it would cause serious, foreseeable harm such as injury or death.",
      }),
    ],
  },
  {
    postKey: "promise-r1-1",
    findings: [
      f({
        id: "promise-r1-1-fallacy-1",
        type: "fallacy",
        status: "open",
        spanText:
          "Either you keep every promise no matter what or you basically have no integrity at all",
        title: "This may be a false dilemma",
        subtitle: "False dilemma",
        reason:
          "Rare emergency exceptions and total dishonesty are not the only two moral options.",
        confidence: "82%",
        example:
          '"Either you never miss work or you have no work ethic." Sick days exist.',
        suggestedRewrite:
          "We can value integrity while still allowing rare exceptions when harm is serious.",
      }),
    ],
  },
  {
    postKey: "promise-r2",
    findings: [
      f({
        id: "promise-r2-fallacy-1",
        type: "fallacy",
        status: "open",
        spanText:
          "Imagine watching someone bleed out because your friend would not break a dinner promise to call for help. Anyone who hesitates clearly has no heart",
        title: "This leans on emotional pressure",
        subtitle: "Appeal to emotion",
        reason:
          "A horrifying story can illustrate stakes, but it does not by itself prove a general rule about promises.",
        confidence: "80%",
        example:
          "Using a tragedy to shut down debate instead of weighing reasons.",
        suggestedRewrite:
          "Extreme harm cases matter, but we still need a principle that works for ordinary tradeoffs too.",
      }),
    ],
  },
  {
    postKey: "promise-r3",
    findings: [
      f({
        id: "promise-r3-fallacy-1",
        type: "fallacy",
        status: "open",
        spanText:
          "If we allow one exception, soon every broken promise will be excused and language will mean nothing",
        title: "This assumes an inevitable chain",
        subtitle: "Slippery slope",
        reason:
          "Allowing a narrow emergency exception does not show that every promise will automatically be discarded.",
        confidence: "79%",
        example:
          '"If schools allow one excused absence, students will never attend again."',
        suggestedRewrite:
          "We can define narrow exceptions without collapsing all promise-keeping norms.",
      }),
    ],
  },
  {
    postKey: "phones-starter",
    evidenceFindingIds: ["phones-starter-claim-1"],
    findings: [
      f({
        id: "phones-starter-claim-1",
        type: "claim",
        status: "ignored",
        spanText: "Mobile phones literally cause cancer",
        title: "This needs stronger evidence",
        reason:
          "Major health agencies have not found clear evidence that typical mobile phone use causes cancer.",
        claimKind: "factual",
        evidenceClaimVerdict: "contradicted",
        evidenceSummary:
          "Authoritative cancer and radiation bodies generally report no consistent evidence that ordinary mobile phone use clearly causes cancer in humans.",
      }),
    ],
  },
  {
    postKey: "phones-r1",
    evidenceFindingIds: ["phones-r1-claim-1"],
    findings: [
      attachedClaim(
        "phones-r1-claim-1",
        "Reliable cancer organizations generally say normal mobile phone use has not been shown to clearly cause cancer",
        "nciPhones",
        {
          title: "Supported by major health agencies",
          reason:
            "National cancer authorities report no consistent evidence that typical mobile phone use causes cancer.",
        },
      ),
    ],
  },
  {
    postKey: "phones-r1-1",
    findings: [
      f({
        id: "phones-r1-1-clarity-1",
        type: "clarity",
        status: "ignored",
        spanText:
          "But phones emit radiation, and radiation causes cancer, so it seems obvious that phones are dangerous",
        title: "This skips an important distinction",
        reason:
          "Not all radiation works the same way. Non-ionizing phone radiation is a weaker basis for a cancer claim than ionizing radiation.",
        suggestedRewrite:
          "Phones emit non-ionizing radiation, which is a weaker reason by itself to claim they cause cancer.",
      }),
    ],
  },
  {
    postKey: "vax-starter",
    evidenceFindingIds: ["vax-starter-claim-1"],
    findings: [
      f({
        id: "vax-starter-claim-1",
        type: "claim",
        status: "ignored",
        spanText: "Vaccines contain microchips",
        title: "This claim is not supported",
        reason:
          "Public ingredient lists and manufacturing documentation do not support hidden microchips in standard vaccines.",
        claimKind: "factual",
        evidenceClaimVerdict: "contradicted",
        evidenceSummary:
          "Available public vaccine ingredient and manufacturing information does not support the claim that standard vaccines contain microchips.",
      }),
    ],
  },
  {
    postKey: "vax-r1",
    evidenceFindingIds: ["vax-r1-claim-1"],
    findings: [
      attachedClaim(
        "vax-r1-claim-1",
        "Public vaccine ingredients, manufacturing processes, and dosing information do not support the microchip claim",
        "cdcVaccineIngredients",
        {
          title: "Public records do not support microchips",
          reason:
            "Published vaccine ingredient lists and manufacturing documentation do not describe hidden microchips.",
        },
      ),
    ],
  },
  {
    postKey: "vax-r1-1",
    findings: [
      f({
        id: "vax-r1-1-clarity-1",
        type: "clarity",
        status: "ignored",
        spanText:
          "Of course they would not list the microchips publicly if they were hiding them",
        title: "This makes the claim hard to test",
        reason:
          "Treating missing public evidence as proof of concealment moves the claim outside normal falsifiability.",
      }),
    ],
  },
  {
    postKey: "congestion-starter",
    evidenceFindingIds: ["congestion-starter-claim-1"],
    findings: [
      f({
        id: "congestion-starter-claim-1",
        type: "claim",
        status: "ignored",
        spanText:
          "Studies prove congestion pricing always cuts emissions by 40% within one year",
        title: "This overstates what studies show",
        reason:
          "The words 'always', '40%', and 'within one year' turn a policy debate into a very specific empirical claim that needs narrow sourcing.",
        claimKind: "factual",
        evidenceClaimVerdict: "too_broad",
        evidenceSummary:
          "Congestion pricing may reduce traffic and emissions in some cities, but a universal 40% emissions cut within one year is too broad to verify as stated.",
      }),
    ],
  },
  {
    postKey: "congestion-r1",
    evidenceFindingIds: ["congestion-r1-claim-1"],
    findings: [
      attachedClaim(
        "congestion-r1-claim-1",
        "A safer claim is that congestion pricing can reduce traffic and may reduce emissions depending on city design, exemptions, and transit alternatives",
        "congestionPricingPartial",
        {
          title: "A more defensible policy claim",
          reason:
            "Evidence often shows traffic reductions with variable emissions effects depending on local design.",
        },
      ),
    ],
  },
  {
    postKey: "god-r2",
    findings: [
      f({
        id: "god-r2-fallacy-1",
        type: "fallacy",
        status: "disputed",
        spanText: "God obviously exists because the Bible says God exists",
        title: "This may be circular reasoning",
        subtitle: "Circular reasoning",
        reason:
          "The conclusion is being used as its own support unless the audience already accepts the Bible as authoritative.",
        confidence: "78%",
        example: '"This book is true because the book says it is true."',
        suggestedRewrite:
          "For me, belief in God is grounded in faith and scripture, not a proof that should convince everyone.",
      }),
    ],
  },
  {
    postKey: "cars-r2",
    evidenceFindingIds: ["cars-r2-claim-1"],
    findings: [
      f({
        id: "cars-r2-claim-1",
        type: "claim",
        status: "ignored",
        spanText: "Banning cars always makes every city richer within a year",
        title: "This claim is too broad",
        reason:
          "'Every city' and 'within a year' need very specific evidence and ignore implementation differences.",
        claimKind: "factual",
        evidenceClaimVerdict: "too_broad",
        evidenceSummary:
          "Some pedestrianization projects may help local business, but a universal one-year economic gain for every city is too broad to verify as stated.",
      }),
    ],
  },
  {
    postKey: "cars-r2-2",
    evidenceFindingIds: ["cars-r2-2-claim-1"],
    findings: [
      attachedClaim(
        "cars-r2-2-claim-1",
        "A better claim is that some pedestrianization projects can help local business, but the effect depends on implementation",
        "pedestrianBusinessPartial",
        {
          title: "More careful economic claim",
          reason:
            "Some pedestrianization studies report local business gains, but outcomes vary by implementation.",
        },
      ),
    ],
  },
  {
    postKey: "ai-starter",
    evidenceFindingIds: ["ai-starter-claim-1", "ai-starter-claim-2"],
    findings: [
      f({
        id: "ai-starter-claim-1",
        type: "claim",
        status: "ignored",
        spanText:
          "AI is going to take basically every tech job within five years",
        title: "This prediction is too strong",
        reason:
          "Replacing essentially all tech jobs on a five-year timeline goes beyond what current labor-market evidence supports.",
        claimKind: "factual",
        evidenceClaimVerdict: "unsupported",
        evidenceSummary:
          "AI is changing software work, but current evidence does not support the claim that essentially all tech jobs will disappear within five years.",
      }),
      f({
        id: "ai-starter-claim-2",
        type: "claim",
        status: "ignored",
        spanText:
          "Junior engineers are already obsolete because companies can just use coding agents instead",
        title: "This overstates current hiring reality",
        reason:
          "Many companies still hire juniors, even as AI changes what entry-level work looks like.",
        claimKind: "factual",
        evidenceClaimVerdict: "unsupported",
        evidenceSummary:
          "Coding agents are changing some engineering tasks, but the claim that junior engineers are already obsolete is stronger than current evidence shows.",
      }),
    ],
  },
];

/** Post keys that should run live evidence when --with-evidence is passed. */
export const SHOWCASE_EVIDENCE_POST_KEYS = new Set([
  "phones-starter",
  "phones-r1",
  "vax-starter",
  "vax-r1",
  "congestion-starter",
  "congestion-r1",
  "ai-starter",
  "cars-r2",
  "cars-r2-2",
]);

export function findingsForPost(postKey: string): Finding[] {
  const seed = SHOWCASE_FINDING_SEEDS.find((item) => item.postKey === postKey);
  return seed?.findings.map((finding) => ({ ...finding })) ?? [];
}

export function evidenceTargetsForPost(postKey: string): string[] {
  return (
    SHOWCASE_FINDING_SEEDS.find((seed) => seed.postKey === postKey)
      ?.evidenceFindingIds ?? []
  );
}

export function allEvidenceTargetFindingIds(): string[] {
  return SHOWCASE_FINDING_SEEDS.flatMap(
    (seed) => seed.evidenceFindingIds ?? [],
  );
}

export function shouldRunLiveEvidenceForPost(postKey: string): boolean {
  return SHOWCASE_EVIDENCE_POST_KEYS.has(postKey);
}
