import type {
  Caveat,
  EvidenceResult,
  Finding,
  FindingSource,
  Post,
  Source,
} from "@prisma/client";
import {
  buildPublishedReviewFromFindings,
  hasOpenNonCaveatedFindings,
} from "@/lib/publishedReviewFindings";
import { buildDebateFeedStats } from "@/lib/buildPostReviewMeta";
import type {
  ClaimCaveat,
  ClaimKind,
  ClaimVerdict,
  EvidenceSource,
  Finding as AppFinding,
  FindingStatus,
  FindingType,
  JudgeMode,
  PostKind,
  PublishedArgument,
  PublishedReviewFinding,
  SavedDebateSummary,
  Source as AppSource,
  SourceCredibility,
  SupportLevel,
} from "@/lib/types";

export type DbPostWithRelations = Post & {
  findings: (Finding & {
    evidenceResult: EvidenceResult | null;
    findingSources: (FindingSource & { source: Source })[];
    caveats: Caveat[];
  })[];
  caveats: Caveat[];
};

export type DbDebateWithPosts = {
  id: string;
  motion: string;
  slug: string;
  mode: string;
  createdAt: Date;
  updatedAt: Date;
  posts: DbPostWithRelations[];
};

export function toAppFinding(
  finding: Finding & {
    evidenceResult?: EvidenceResult | null;
    findingSources?: (FindingSource & { source: Source })[];
  },
): AppFinding {
  const attached = finding.findingSources?.find((fs) => fs.isAttached);
  const sourceCandidates: EvidenceSource[] | undefined = finding.findingSources?.map(
    (fs) => ({
      id: fs.source.id,
      title: fs.source.title,
      publisher: fs.source.publisher,
      url: fs.source.url ?? "",
      snippet: fs.source.snippet,
      supportLevel: fs.supportLevel as SupportLevel,
      credibility: fs.source.credibility as SourceCredibility,
      rationale: fs.rationale ?? undefined,
      canAttachAsSupport: fs.canAttachAsSupport,
    }),
  );

  const sources: AppSource[] | undefined = attached
    ? [
        {
          id: attached.source.id,
          title: attached.source.title,
          publisher: attached.source.publisher,
          url: attached.source.url ?? undefined,
          isSample: false,
        },
      ]
    : undefined;

  return {
    id: finding.id,
    type: finding.type as FindingType,
    status: finding.status as FindingStatus,
    spanText: finding.spanText,
    title: finding.title,
    subtitle: finding.subtitle ?? undefined,
    reason: finding.reason,
    confidence:
      finding.confidence !== null && finding.confidence !== undefined
        ? String(finding.confidence)
        : undefined,
    example: finding.example ?? undefined,
    suggestedRewrite: finding.suggestedRewrite ?? undefined,
    claimKind: (finding.claimKind as ClaimKind | null) ?? undefined,
    disputeReason: finding.disputeReason ?? undefined,
    evidenceClaimVerdict:
      (finding.evidenceResult?.claimVerdict as ClaimVerdict | undefined) ??
      undefined,
    evidenceSummary: finding.evidenceResult?.summary ?? undefined,
    sourceCandidates:
      sourceCandidates && sourceCandidates.length > 0
        ? sourceCandidates
        : undefined,
    selectedSourceId: attached?.source.id,
    sources,
  };
}

export function toPublishedArgument(
  post: DbPostWithRelations,
  debate: { id: string; slug: string; motion?: string; mode?: string },
): PublishedArgument {
  const findings = post.findings.map((f) => toAppFinding(f));
  const review = buildPublishedReviewFromFindings(findings);
  const publishedFindings: PublishedReviewFinding[] = findings.map((f) => ({
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
  }));

  const dbClaimCaveats: ClaimCaveat[] = post.caveats
    .filter((c) => c.type === "claim_verdict" && c.findingId)
    .map((c) => {
      const finding = findings.find((f) => f.id === c.findingId);
      return {
        id: c.id,
        spanText: finding?.spanText ?? "",
        verdict: finding?.evidenceClaimVerdict ?? "unclear",
        message: c.message,
      };
    })
    .filter((c) => c.spanText);

  const mergedClaimCaveats =
    review.claimCaveats.length > 0
      ? review.claimCaveats
      : dbClaimCaveats.length > 0
        ? dbClaimCaveats
        : undefined;

  const unresolvedCaveat = post.caveats.find(
    (c) => c.type === "unresolved_review",
  );

  const hasOtherOpenFindings = hasOpenNonCaveatedFindings(findings);

  return {
    id: post.id,
    author: post.authorName,
    postedAt: post.publishedAt
      ? post.publishedAt.toLocaleString()
      : post.createdAt.toLocaleString(),
    text: post.text,
    publishedFindings,
    sources: review.sources,
    citations: review.citations,
    claimCaveats: mergedClaimCaveats,
    needsEvidence:
      review.needsEvidence.length > 0 ? review.needsEvidence : undefined,
    reviewFallacies:
      review.reviewFallacies.length > 0 ? review.reviewFallacies : undefined,
    reviewClarity:
      review.reviewClarity.length > 0 ? review.reviewClarity : undefined,
    kind: post.postType === "starter" ? "starter" : "response",
    issueId: debate.slug,
    parentId: post.parentPostId ?? undefined,
    deskBangs: 0,
    userBanged: false,
    contestedFallacies:
      review.contestedFallacies.length > 0
        ? review.contestedFallacies
        : undefined,
    caveats:
      unresolvedCaveat || hasOtherOpenFindings
        ? [unresolvedCaveat?.message ?? "Posted with unresolved review item."]
        : undefined,
    debateId: debate.id,
    dbPostId: post.id,
    publishedAt: post.publishedAt?.toISOString() ?? null,
    debateMotion: debate.motion,
    debateMode: debate.mode as JudgeMode | undefined,
  };
}

const PREVIEW_MAX_LENGTH = 160;

export function previewText(text: string): string {
  const trimmed = text.trim();
  if (trimmed.length <= PREVIEW_MAX_LENGTH) return trimmed;
  return `${trimmed.slice(0, PREVIEW_MAX_LENGTH).trim()}…`;
}

export function toSavedDebateSummary(
  debate: {
    id: string;
    slug: string;
    motion: string;
    mode: string;
    createdAt: Date;
    updatedAt: Date;
    posts: Array<{
      id: string;
      text: string;
      postType: string;
      parentPostId: string | null;
      authorId: string | null;
      authorName: string;
      publishedAt: Date | null;
      findings: (Finding & {
        evidenceResult: EvidenceResult | null;
        findingSources: (FindingSource & { source: Source })[];
      })[];
      caveats: Array<Pick<Caveat, "type" | "findingId" | "message">>;
    }>;
  },
  viewerId: string,
): SavedDebateSummary {
  const starter =
    debate.posts.find(
      (p) => p.postType === "starter" && p.parentPostId === null,
    ) ?? debate.posts.find((p) => p.postType === "starter");

  const feedPosts: Parameters<typeof buildDebateFeedStats>[0] = [];

  for (const post of debate.posts) {
    const findings = post.findings.map((f) => toAppFinding(f));
    const publishedFindings = findings.map((f) => ({
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
    }));
    const review = buildPublishedReviewFromFindings(findings);
    const contestedFallacies = findings
      .filter((f) => f.type === "fallacy" && f.status === "disputed")
      .map((f) => f.subtitle)
      .filter((name): name is string => Boolean(name));
    const unresolvedCaveat = post.caveats.find(
      (c) => c.type === "unresolved_review",
    );

    feedPosts.push({
      text: post.text,
      publishedFindings,
      sources: review.sources,
      citations: review.citations,
      claimCaveats: review.claimCaveats,
      needsEvidence: review.needsEvidence,
      reviewFallacies: review.reviewFallacies,
      reviewClarity: review.reviewClarity,
      contestedFallacies,
      caveats: unresolvedCaveat ? [unresolvedCaveat.message] : undefined,
    });
  }

  const feedStats = buildDebateFeedStats(feedPosts);

  return {
    id: debate.id,
    slug: debate.slug,
    motion: debate.motion,
    mode: debate.mode as JudgeMode,
    createdAt: debate.createdAt.toISOString(),
    updatedAt: debate.updatedAt.toISOString(),
    isYours: Boolean(starter?.authorId && starter.authorId === viewerId),
    starterPost: starter
      ? {
          id: starter.id,
          preview: previewText(starter.text),
          authorName: starter.authorName,
          publishedAt: starter.publishedAt?.toISOString() ?? null,
        }
      : null,
    postCount: debate.posts.length,
    findingCount: feedStats.reviewNoteCount,
    reviewNoteCount: feedStats.reviewNoteCount,
    caveatCount: feedStats.caveatCount,
    sourcedClaimCount: feedStats.sourcedClaimCount,
    contestedCount: feedStats.contestedCount,
    needsEvidenceCount: feedStats.needsEvidenceCount,
    hasCaveats: feedStats.hasCaveats,
    hasSourced: feedStats.hasSourced,
    hasContested: feedStats.hasContested,
    hasNeedsEvidence: feedStats.hasNeedsEvidence,
  };
}

export function findingToCreateInput(finding: AppFinding) {
  return {
    id: finding.id,
    type: finding.type,
    status: finding.status,
    spanText: finding.spanText,
    title: finding.title,
    subtitle: finding.subtitle ?? null,
    reason: finding.reason,
    confidence:
      finding.confidence !== undefined
        ? Number.parseFloat(finding.confidence)
        : null,
    example: finding.example ?? null,
    suggestedRewrite: finding.suggestedRewrite ?? null,
    claimKind: finding.claimKind ?? null,
    disputeReason: finding.disputeReason ?? null,
  };
}

export function postTypeFromKind(kind: PostKind | undefined) {
  return kind === "response" ? "reply" : "starter";
}
