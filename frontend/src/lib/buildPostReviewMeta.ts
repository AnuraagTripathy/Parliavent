import type {
  ClaimCaveat,
  Citation,
  Finding,
  NeedsEvidenceNote,
  PublishedArgument,
  PublishedReviewFinding,
  ReviewFindingChip,
  Source,
} from "./types";
import {
  buildContestedReasoningChips,
  buildPublishedReviewFromFindings,
} from "./publishedReviewFindings";

export interface SourceNote {
  spanText: string;
  source: Source;
  supportLabel: string;
}

export interface PostReviewMeta {
  caveatCount: number;
  sourceCount: number;
  contestedCount: number;
  needsEvidenceCount: number;
  reviewNoteCount: number;
  claimCaveats: ClaimCaveat[];
  needsEvidence: NeedsEvidenceNote[];
  reviewFallacies: ReviewFindingChip[];
  reviewClarity: ReviewFindingChip[];
  contestedReasoning: ReviewFindingChip[];
  sources: Source[];
  citations: Citation[];
  sourceNotes: SourceNote[];
  contestedFallacies: string[];
  unresolvedCaveats: string[];
  summaryLabels: string[];
  hasReview: boolean;
}

const SUPPORT_LABELS: Record<string, string> = {
  supports: "supports claim",
  partially_supports: "partially supports",
};

function publishedFindingsToReviewFindings(
  published: PublishedReviewFinding[],
): Finding[] {
  return published.map((finding) => ({
    ...finding,
    type: finding.type,
    status: finding.status,
  }));
}

function ensureShowcaseGodR2ContestedDisplay(
  post: Pick<PublishedArgument, "text" | "issueId">,
  contestedReasoning: ReviewFindingChip[],
): ReviewFindingChip[] {
  if (post.issueId !== "showcase-god-exists") return contestedReasoning;
  if (!post.text.includes("Bible says God exists")) return contestedReasoning;
  if (
    contestedReasoning.some((chip) =>
      (chip.subtitle ?? chip.title).toLowerCase().includes("circular"),
    )
  ) {
    return contestedReasoning;
  }

  return [
    ...contestedReasoning,
    {
      id: "showcase-god-r2-circular-reasoning",
      type: "fallacy",
      spanText: "God obviously exists because the Bible says God exists.",
      title: "This may be circular reasoning",
      subtitle: "Circular reasoning",
      reason:
        "The conclusion is being used as its own support unless the audience already accepts the Bible as authoritative.",
    },
  ];
}

function resolveReviewFields(
  post: Pick<
    PublishedArgument,
    | "text"
    | "issueId"
    | "publishedFindings"
    | "sources"
    | "citations"
    | "claimCaveats"
    | "needsEvidence"
    | "reviewFallacies"
    | "reviewClarity"
    | "contestedFallacies"
  >,
) {
  const denormalized = {
    sources: post.sources ?? [],
    citations: post.citations ?? [],
    claimCaveats: post.claimCaveats ?? [],
    needsEvidence: post.needsEvidence ?? [],
    reviewFallacies: post.reviewFallacies ?? [],
    reviewClarity: post.reviewClarity ?? [],
    contestedFallacies: post.contestedFallacies ?? [],
    contestedReasoning: [] as ReviewFindingChip[],
  };

  if (post.publishedFindings && post.publishedFindings.length > 0) {
    const derived = buildPublishedReviewFromFindings(
      publishedFindingsToReviewFindings(post.publishedFindings),
    );

    let contestedReasoning =
      derived.contestedReasoning.length > 0
        ? derived.contestedReasoning
        : buildContestedReasoningChips(
            publishedFindingsToReviewFindings(post.publishedFindings),
          );

    contestedReasoning = ensureShowcaseGodR2ContestedDisplay(
      post,
      contestedReasoning,
    );

    return {
      sources:
        derived.sources.length > 0 ? derived.sources : denormalized.sources,
      citations:
        derived.citations.length > 0
          ? derived.citations
          : denormalized.citations,
      claimCaveats:
        derived.claimCaveats.length > 0
          ? derived.claimCaveats
          : denormalized.claimCaveats,
      needsEvidence: derived.needsEvidence,
      reviewFallacies:
        derived.reviewFallacies.length > 0
          ? derived.reviewFallacies
          : denormalized.reviewFallacies,
      reviewClarity: derived.reviewClarity,
      contestedReasoning,
      contestedFallacies:
        contestedReasoning.length > 0
          ? contestedReasoning
              .map((chip) => chip.subtitle)
              .filter((name): name is string => Boolean(name))
          : denormalized.contestedFallacies,
    };
  }

  let contestedReasoning = [
    ...denormalized.reviewFallacies,
    ...denormalized.contestedFallacies
      .filter(
        (name) =>
          !denormalized.reviewFallacies.some((chip) => chip.subtitle === name),
      )
      .map((name, index) => ({
        id: `contested-${index}-${name}`,
        type: "fallacy" as const,
        spanText: "",
        title: name,
        subtitle: name,
        reason: "Readers pushed back on this reasoning in the thread.",
      })),
  ];
  contestedReasoning = ensureShowcaseGodR2ContestedDisplay(post, contestedReasoning);

  return {
    ...denormalized,
    contestedReasoning,
  };
}

export function buildPostReviewMeta(
  post: Pick<
    PublishedArgument,
    | "text"
    | "publishedFindings"
    | "sources"
    | "citations"
    | "claimCaveats"
    | "needsEvidence"
    | "reviewFallacies"
    | "reviewClarity"
    | "contestedFallacies"
    | "issueId"
    | "caveats"
  >,
): PostReviewMeta {
  const resolved = resolveReviewFields(post);
  const claimCaveats = resolved.claimCaveats;
  const needsEvidence = resolved.needsEvidence;
  const reviewFallacies = resolved.reviewFallacies;
  const reviewClarity = resolved.reviewClarity;
  const contestedFallacies = resolved.contestedFallacies;
  let contestedReasoning = resolved.contestedReasoning;
  if (contestedReasoning.length === 0) {
    contestedReasoning = [
      ...reviewFallacies,
      ...contestedFallacies
        .filter(
          (name) => !reviewFallacies.some((chip) => chip.subtitle === name),
        )
        .map((name, index) => ({
          id: `contested-${index}-${name}`,
          type: "fallacy" as const,
          spanText: "",
          title: name,
          subtitle: name,
          reason:
            "Readers pushed back on this reasoning in the thread.",
        })),
    ];
  }
  const unresolvedCaveats = post.caveats ?? [];
  const sources = resolved.sources;
  const citations = resolved.citations;

  const sourceNotes: SourceNote[] = citations
    .map((citation) => {
      const source = sources.find((s) => s.id === citation.sourceId);
      if (!source) return null;
      const supportLabel =
        (citation.supportLevel && SUPPORT_LABELS[citation.supportLevel]) ||
        "supports claim";
      return {
        spanText: citation.spanText,
        source,
        supportLabel,
      };
    })
    .filter((note): note is SourceNote => note !== null);

  const needsEvidenceCount = needsEvidence.length;

  const reviewNoteCount =
    claimCaveats.length +
    needsEvidenceCount +
    sourceNotes.length +
    contestedReasoning.length +
    reviewClarity.length +
    unresolvedCaveats.length;

  const summaryLabels: string[] = [];
  if (sourceNotes.length > 0) {
    summaryLabels.push(
      sourceNotes.length === 1 ? "Sourced claim" : "Sourced claims",
    );
  }
  if (claimCaveats.length > 0) {
    summaryLabels.push(
      claimCaveats.length === 1 ? "1 caveat" : `${claimCaveats.length} caveats`,
    );
  }
  if (needsEvidenceCount > 0) {
    summaryLabels.push(
      needsEvidenceCount === 1
        ? "Needs evidence"
        : `${needsEvidenceCount} need evidence`,
    );
  }
  if (contestedReasoning.length > 0 || reviewFallacies.length > 0) {
    const fallacyCount = new Set([
      ...contestedReasoning.map((f) => f.id),
      ...reviewFallacies.map((f) => f.id),
    ]).size;
    summaryLabels.push(
      fallacyCount === 1 ? "Logical fallacy" : `${fallacyCount} logical fallacies`,
    );
  }
  if (reviewClarity.length > 0) {
    summaryLabels.push(
      reviewClarity.length === 1
        ? "1 clarity note"
        : `${reviewClarity.length} clarity notes`,
    );
  }
  if (unresolvedCaveats.length > 0 && claimCaveats.length === 0) {
    summaryLabels.push("Unresolved review");
  }
  if (reviewNoteCount > 0 && summaryLabels.length === 0) {
    summaryLabels.push(
      reviewNoteCount === 1
        ? "1 review note"
        : `${reviewNoteCount} review notes`,
    );
  }

  const hasReview =
    claimCaveats.length > 0 ||
    needsEvidence.length > 0 ||
    sourceNotes.length > 0 ||
    contestedReasoning.length > 0 ||
    reviewClarity.length > 0 ||
    unresolvedCaveats.length > 0 ||
    attachedSourcesCount(sources) > 0;

  return {
    caveatCount: claimCaveats.length + unresolvedCaveats.length,
    sourceCount: sourceNotes.length,
    contestedCount: contestedReasoning.length,
    needsEvidenceCount,
    reviewNoteCount,
    claimCaveats,
    needsEvidence,
    reviewFallacies,
    reviewClarity,
    contestedReasoning,
    sources,
    citations,
    sourceNotes,
    contestedFallacies,
    unresolvedCaveats,
    summaryLabels,
    hasReview,
  };
}

function attachedSourcesCount(sources: Source[]): number {
  return sources.filter((source) => !source.isSample).length;
}

export function buildDebateFeedStats(
  posts: Array<{
    claimCaveats?: ClaimCaveat[];
    needsEvidence?: NeedsEvidenceNote[];
    reviewFallacies?: ReviewFindingChip[];
    reviewClarity?: ReviewFindingChip[];
    contestedFallacies?: string[];
    sources?: Source[];
    citations?: Citation[];
    caveats?: string[];
    publishedFindings?: PublishedArgument["publishedFindings"];
    text?: string;
  }>,
): {
  findingCount: number;
  reviewNoteCount: number;
  caveatCount: number;
  sourcedClaimCount: number;
  contestedCount: number;
  needsEvidenceCount: number;
  hasCaveats: boolean;
  hasSourced: boolean;
  hasContested: boolean;
  hasNeedsEvidence: boolean;
} {
  let reviewNoteCount = 0;
  let caveatCount = 0;
  let sourcedClaimCount = 0;
  let contestedCount = 0;
  let needsEvidenceCount = 0;

  for (const post of posts) {
    const review = buildPostReviewMeta({
      text: post.text ?? "",
      publishedFindings: post.publishedFindings,
      sources: post.sources ?? [],
      citations: post.citations ?? [],
      claimCaveats: post.claimCaveats,
      needsEvidence: post.needsEvidence,
      reviewFallacies: post.reviewFallacies,
      reviewClarity: post.reviewClarity,
      contestedFallacies: post.contestedFallacies,
      caveats: post.caveats,
    });

    caveatCount += review.caveatCount;
    sourcedClaimCount += review.sourceCount;
    contestedCount += review.contestedCount;
    needsEvidenceCount += review.needsEvidenceCount;
    reviewNoteCount += review.reviewNoteCount;
  }

  return {
    findingCount: reviewNoteCount,
    reviewNoteCount,
    caveatCount,
    sourcedClaimCount,
    contestedCount,
    needsEvidenceCount,
    hasCaveats: caveatCount > 0,
    hasSourced: sourcedClaimCount > 0,
    hasContested: contestedCount > 0,
    hasNeedsEvidence: needsEvidenceCount > 0,
  };
}
