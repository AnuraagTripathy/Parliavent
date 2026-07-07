import {
  buildPublishedReviewFromFindings,
  hasOpenNonCaveatedFindings,
} from "./publishedReviewFindings";
import type { Finding, PostKind, PublishedArgument } from "./types";

export function buildPublishedArgument(params: {
  text: string;
  findings: Finding[];
  author?: string;
  kind?: PostKind;
  issueId?: string;
  parentId?: string;
  id?: string;
  debateId?: string;
  dbPostId?: string;
}): PublishedArgument {
  const review = buildPublishedReviewFromFindings(params.findings);
  const hasOtherOpenFindings = hasOpenNonCaveatedFindings(params.findings);

  return {
    id: params.id ?? params.dbPostId ?? `user-${Date.now()}`,
    author: params.author ?? "You",
    postedAt: "Just now",
    text: params.text,
    publishedFindings: params.findings.map((f) => ({
      id: f.id,
      type: f.type,
      status: f.status,
      spanText: f.spanText,
      title: f.title,
      reason: f.reason,
      subtitle: f.subtitle,
      evidenceClaimVerdict: f.evidenceClaimVerdict,
      selectedSourceId: f.selectedSourceId,
      sources: f.sources,
    })),
    sources: review.sources,
    citations: review.citations,
    claimCaveats:
      review.claimCaveats.length > 0 ? review.claimCaveats : undefined,
    needsEvidence:
      review.needsEvidence.length > 0 ? review.needsEvidence : undefined,
    reviewFallacies:
      review.reviewFallacies.length > 0 ? review.reviewFallacies : undefined,
    reviewClarity:
      review.reviewClarity.length > 0 ? review.reviewClarity : undefined,
    kind: params.kind,
    issueId: params.issueId,
    parentId: params.parentId,
    deskBangs: 0,
    userBanged: false,
    contestedFallacies:
      review.contestedFallacies.length > 0
        ? review.contestedFallacies
        : undefined,
    caveats: hasOtherOpenFindings
      ? ["Posted with unresolved review item."]
      : undefined,
    debateId: params.debateId,
    dbPostId: params.dbPostId,
  };
}

export function formatByline(argument: PublishedArgument): string {
  const sourceCount = argument.sources.length;
  const contestedCount = argument.contestedFallacies?.length ?? 0;

  const sourceLabel =
    sourceCount === 1 ? "1 source attached" : `${sourceCount} sources attached`;
  const flagLabel =
    contestedCount === 1
      ? "1 logical fallacy"
      : `${contestedCount} logical fallacies`;

  return `Vetted, ${sourceLabel}, ${flagLabel}`;
}
