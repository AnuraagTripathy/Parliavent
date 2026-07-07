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
  /** Top ranked passages extracted from the source page. */
  evidencePassages?: string[];
}

export interface EvidenceSearchRequest {
  claim: string;
  argumentText?: string;
  threadId?: string;
  mode?: EvidenceSearchMode;
  autoEscalate?: boolean;
}

export type EvidenceSearchMode = "standard" | "deep";

export type EvidenceResultMode = "standard" | "deep" | "auto_escalated";

export type DeepInvestigationStage =
  | "standard_pipeline"
  | "routing_evidence"
  | "deep_classification"
  | "deep_follow_up_search"
  | "deep_source_review"
  | "deep_verification";

export interface AgentTraceStep {
  step: number;
  stage:
    | "classification"
    | "follow_up_search"
    | "source_review"
    | "verdict";
  summary: string;
}

export interface EvidenceSearchResponse {
  claim: string;
  claimKind: ClaimKind;
  claimVerdict: ClaimVerdict;
  summary: string;
  sources: EvidenceSource[];
  /** Flattened top passages used for verification across sources. */
  evidencePassages?: string[];
  /** Whether Groq judged from page passages, snippets, or both. */
  verificationBasis?: "passages" | "snippets" | "mixed";
  /** How this result was produced. */
  evidenceMode?: EvidenceResultMode;
  shouldEscalate?: boolean;
  escalationReason?: string;
  escalationSignals?: string[];
  deepInvestigationAvailable?: boolean;
  investigationTrace?: AgentTraceStep[];
}

export type EvidenceJobStatus = "queued" | "running" | "completed" | "failed";

export type EvidenceJobStage =
  | "queued"
  | "searching"
  | "fetching_pages"
  | "extracting_passages"
  | "ranking_passages"
  | "verifying"
  | "standard_pipeline"
  | "routing_evidence"
  | "deep_classification"
  | "deep_follow_up_search"
  | "deep_source_review"
  | "deep_verification"
  | "completed"
  | "failed";

export interface EvidenceJobCreateRequest {
  claim: string;
  argumentContext?: string;
  threadId?: string;
  findingId?: string;
  mode?: EvidenceSearchMode;
  autoEscalate?: boolean;
}

export interface EvidenceJobCreateResponse {
  jobId: string;
  status: "queued";
}

export interface EvidenceJobPollResponse {
  jobId: string;
  status: EvidenceJobStatus;
  stage: EvidenceJobStage;
  progress: number;
  result?: EvidenceSearchResponse;
  error?: string;
}

export interface Finding {
  id: string;
  type: FindingType;
  status: FindingStatus;
  spanText: string;
  /**
   * Character offset of the anchored occurrence of spanText, captured when
   * the judge validated the span. Disambiguates repeated phrases; consumers
   * must fall back to first-occurrence when the offset no longer matches
   * (user edited text since the last judge run). Not persisted.
   */
  spanStart?: number;
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
  evidenceShouldEscalate?: boolean;
  evidenceEscalationReason?: string;
  evidenceEscalationSignals?: string[];
  evidenceInvestigationTrace?: AgentTraceStep[];
  evidenceMode?: EvidenceResultMode;
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
  supportLevel?: SupportLevel;
}

export interface ClaimCaveat {
  id: string;
  spanText: string;
  verdict: ClaimVerdict;
  message: string;
}

export interface NeedsEvidenceNote {
  id: string;
  spanText: string;
  title: string;
  reason: string;
}

export interface ReviewFindingChip {
  id: string;
  type: FindingType;
  spanText: string;
  title: string;
  reason: string;
  subtitle?: string;
}

export interface PublishedReviewFinding {
  id: string;
  type: FindingType;
  status: FindingStatus;
  spanText: string;
  title: string;
  reason: string;
  subtitle?: string;
  evidenceClaimVerdict?: ClaimVerdict;
  selectedSourceId?: string;
  sources?: Source[];
}

export interface PublishedArgument {
  id: string;
  author: string;
  postedAt: string;
  text: string;
  sources: Source[];
  citations: Citation[];
  /** Saved judge findings used to derive thread review metadata. */
  publishedFindings?: PublishedReviewFinding[];
  claimCaveats?: ClaimCaveat[];
  needsEvidence?: NeedsEvidenceNote[];
  reviewFallacies?: ReviewFindingChip[];
  reviewClarity?: ReviewFindingChip[];
  contestedFallacies?: string[];
  caveats?: string[];
  kind?: PostKind;
  issueId?: string;
  parentId?: string;
  deskBangs?: number;
  userBanged?: boolean;
  /** Postgres debate id when persisted */
  debateId?: string;
  /** Postgres post id when persisted */
  dbPostId?: string;
  /** ISO timestamp when post was published; null if draft */
  publishedAt?: string | null;
  /** Debate motion for saved posts */
  debateMotion?: string;
  /** Debate judge mode for saved posts */
  debateMode?: JudgeMode;
}

export interface SavedDebateStarterPreview {
  id: string;
  preview: string;
  authorName: string;
  publishedAt: string | null;
}

export interface SavedDebateSummary {
  id: string;
  slug: string;
  motion: string;
  mode: JudgeMode;
  createdAt: string;
  updatedAt: string;
  /** True when the signed-in viewer created this debate's starter post */
  isYours: boolean;
  starterPost: SavedDebateStarterPreview | null;
  postCount: number;
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
  /** Full parent post text for judge context */
  parentArgument?: string;
  /** Saved debate in Postgres (starter or reply) */
  isSavedDebate?: boolean;
  /** Additional starter on an existing saved debate */
  isAdditionalStarter?: boolean;
  /** Parent post DB id for reply publish */
  parentDbPostId?: string;
  /** Postgres ids when debate was saved at creation */
  debateId?: string;
  dbPostId?: string;
}

export type AppScreen =
  | "landing"
  | "feed"
  | "issue"
  | "post"
  | "create"
  | "composer"
  | "argument";
