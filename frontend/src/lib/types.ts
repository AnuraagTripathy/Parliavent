export type FindingType = "claim" | "fallacy" | "clarity";

export type FindingStatus =
  | "open"
  | "resolved"
  | "ignored"
  | "disputed"
  | "source_attached"
  | "marked_opinion";

export type CurrentView = "composer" | "review" | "published";

export type CheckingState = "idle" | "checking" | "complete";

export type JudgeMode = "open_floor" | "structured_debate" | "formal_motion";

export type JudgePostType = "starter" | "reply";

export type JudgeUserStance = "for" | "against" | "mixed" | "unknown";

export interface JudgeRequest {
  text: string;
  mode: JudgeMode;
  threadId?: string;
  motion?: string;
  postType?: JudgePostType;
  parentArgument?: string;
  threadSummary?: string;
  userStance?: JudgeUserStance;
}

export interface JudgeResponse {
  findings: Finding[];
}

export type PostKind = "starter" | "response";

export type FeedSort = "hot" | "new" | "top";

export type SupportLevel =
  | "supports"
  | "partially_supports"
  | "contradicts"
  | "related_only"
  | "unclear";

/** How reliable the publisher is — not whether the snippet supports the claim. */
export type SourceCredibility = "high" | "medium" | "low";

export type ClaimKind = "factual" | "opinion" | "mixed" | "unclear";

export interface Source {
  id: string;
  title: string;
  publisher: string;
  url?: string;
  isSample: boolean;
}

export type ClaimVerdict =
  | "supported"
  | "partially_supported"
  | "contradicted"
  | "unsupported"
  | "too_broad"
  | "unclear";

export interface EvidenceSource {
  id: string;
  title: string;
  publisher: string;
  url: string;
  snippet: string;
  /** Whether the snippet supports the user's exact claim. */
  supportLevel: SupportLevel;
  /** Publisher reliability — independent of evidence match. */
  credibility: SourceCredibility;
  rationale?: string;
  /** True only when supportLevel is supports or partially_supports. */
  canAttachAsSupport: boolean;
}

export interface EvidenceSearchRequest {
  claim: string;
  argumentText?: string;
  threadId?: string;
}

export interface EvidenceSearchResponse {
  claim: string;
  claimKind: ClaimKind;
  claimVerdict: ClaimVerdict;
  summary: string;
  sources: EvidenceSource[];
}

export interface Finding {
  id: string;
  type: FindingType;
  status: FindingStatus;
  spanText: string;
  title: string;
  subtitle?: string;
  reason: string;
  confidence?: string;
  example?: string;
  suggestedRewrite?: string;
  sources?: Source[];
  sourceCandidates?: EvidenceSource[];
  claimKind?: ClaimKind;
  evidenceClaimVerdict?: ClaimVerdict;
  evidenceSummary?: string;
  selectedSourceId?: string;
  disputeReason?: string;
}

export interface ReadinessResult {
  resolved: number;
  total: number;
  percent: number;
  label: string;
}

export interface Citation {
  id: string;
  spanText: string;
  sourceId: string;
}

export interface ClaimCaveat {
  id: string;
  spanText: string;
  verdict: ClaimVerdict;
  message: string;
}

export interface PublishedArgument {
  id: string;
  author: string;
  postedAt: string;
  text: string;
  sources: Source[];
  citations: Citation[];
  claimCaveats?: ClaimCaveat[];
  contestedFallacies?: string[];
  caveats?: string[];
  kind?: PostKind;
  issueId?: string;
  parentId?: string;
  deskBangs?: number;
  userBanged?: boolean;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: string;
  starterCount: number;
  responseCount: number;
  deskBangs: number;
  lastActive: string;
  isHot?: boolean;
}

export interface ComposerContext {
  mode: PostKind;
  issueId: string;
  issueTitle: string;
  judgeMode?: JudgeMode;
  initialText?: string;
  isCustomDebate?: boolean;
  parentId?: string;
  parentAuthor?: string;
  parentPreview?: string;
}

export type AppScreen =
  | "feed"
  | "issue"
  | "post"
  | "create"
  | "composer"
  | "argument";
