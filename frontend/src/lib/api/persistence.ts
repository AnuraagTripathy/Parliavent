import type {
  ClaimKind,
  ClaimVerdict,
  EvidenceSearchResponse,
  Finding,
  JudgeMode,
  PublishedArgument,
  SavedDebateSummary,
  SourceCredibility,
  SupportLevel,
} from "@/lib/types";

export interface CreateDebateRequest {
  motion: string;
  text: string;
  mode: JudgeMode;
  authorName?: string;
}

export interface CreateDebateResponse {
  debate: {
    id: string;
    motion: string;
    slug: string;
    mode: JudgeMode;
    createdAt: string;
  };
  post: {
    id: string;
    debateId: string;
    text: string;
    postType: "starter" | "reply";
    authorName: string;
    createdAt: string;
  };
}

export interface SaveFindingsRequest {
  findings: Finding[];
}

export interface SaveEvidenceRequest {
  claimVerdict: ClaimVerdict;
  summary: string;
  claimKind?: ClaimKind;
  sources: Array<{
    id: string;
    title: string;
    publisher: string;
    url: string;
    snippet: string;
    supportLevel: SupportLevel;
    credibility: SourceCredibility;
    rationale?: string;
    canAttachAsSupport: boolean;
    isAttached?: boolean;
  }>;
}

export interface PublishPostRequest {
  text: string;
  findings: Finding[];
  authorName?: string;
}

export interface PublishPostResponse {
  post: PublishedArgument;
}

export interface ListDebatesResponse {
  debates: SavedDebateSummary[];
}

export async function listDebates(): Promise<ListDebatesResponse> {
  const res = await fetch("/api/debates");

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      typeof err.error === "string" ? err.error : "Failed to load debates",
    );
  }

  return res.json();
}

export interface CreateDebatePostRequest {
  debateId: string;
  postType: "starter" | "reply";
  parentPostId?: string;
  text?: string;
  authorName?: string;
}

export interface CreateDebatePostResponse {
  post: {
    id: string;
    debateId: string;
    parentPostId: string | null;
    text: string;
    postType: "starter" | "reply";
    authorName: string;
    createdAt: string;
  };
  debate: {
    id: string;
    slug: string;
    motion: string;
    mode: JudgeMode;
  };
}

/** @deprecated Use createDebatePost */
export type CreateReplyRequest = CreateDebatePostRequest & {
  parentPostId: string;
};

export async function createDebatePost(
  payload: CreateDebatePostRequest,
): Promise<CreateDebatePostResponse> {
  const res = await fetch(`/api/debates/${payload.debateId}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      postType: payload.postType,
      parentPostId: payload.parentPostId,
      text: payload.text ?? "",
      authorName: payload.authorName ?? "Guest",
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      typeof err.error === "string" ? err.error : "Failed to create post",
    );
  }

  return res.json();
}

export async function createReply(
  payload: CreateDebatePostRequest & { parentPostId: string },
): Promise<CreateDebatePostResponse> {
  return createDebatePost({ ...payload, postType: "reply" });
}

export async function deleteDraftPost(postId: string): Promise<void> {
  const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      typeof err.error === "string" ? err.error : "Failed to delete draft",
    );
  }
}

export async function createDebate(
  payload: CreateDebateRequest,
): Promise<CreateDebateResponse> {
  const res = await fetch("/api/debates", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      typeof err.error === "string" ? err.error : "Failed to create debate",
    );
  }

  return res.json();
}

export async function fetchDebate(
  debateId: string,
): Promise<{
  debate: CreateDebateResponse["debate"] & {
    updatedAt?: string;
    posts: PublishedArgument[];
  };
}> {
  const res = await fetch(`/api/debates/${debateId}`);

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      typeof err.error === "string" ? err.error : "Failed to load debate",
    );
  }

  return res.json();
}

export async function saveFindings(
  postId: string,
  findings: Finding[],
): Promise<void> {
  const res = await fetch(`/api/posts/${postId}/findings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ findings } satisfies SaveFindingsRequest),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      typeof err.error === "string" ? err.error : "Failed to save findings",
    );
  }
}

export async function saveEvidence(
  findingId: string,
  payload: SaveEvidenceRequest,
): Promise<void> {
  const res = await fetch(`/api/findings/${findingId}/evidence`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      typeof err.error === "string" ? err.error : "Failed to save evidence",
    );
  }
}

export async function publishPost(
  postId: string,
  payload: PublishPostRequest,
): Promise<PublishPostResponse> {
  const res = await fetch(`/api/posts/${postId}/publish`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      typeof err.error === "string" ? err.error : "Failed to publish post",
    );
  }

  return res.json();
}

export function findingHasEvidence(finding: Finding): boolean {
  return Boolean(
    finding.evidenceClaimVerdict ||
      finding.evidenceSummary ||
      (finding.sourceCandidates && finding.sourceCandidates.length > 0),
  );
}

export function findingToEvidencePayload(
  finding: Finding,
): SaveEvidenceRequest | null {
  if (!finding.evidenceClaimVerdict || !finding.evidenceSummary) {
    return null;
  }

  return {
    claimVerdict: finding.evidenceClaimVerdict,
    summary: finding.evidenceSummary,
    claimKind: finding.claimKind,
    sources: (finding.sourceCandidates ?? []).map((source) => ({
      id: source.id,
      title: source.title,
      publisher: source.publisher,
      url: source.url,
      snippet: source.snippet,
      supportLevel: source.supportLevel,
      credibility: source.credibility,
      rationale: source.rationale,
      canAttachAsSupport: source.canAttachAsSupport,
      isAttached: finding.selectedSourceId === source.id,
    })),
  };
}

export async function persistPublishFlow(
  postId: string,
  text: string,
  findings: Finding[],
  authorName?: string,
): Promise<PublishedArgument> {
  await saveFindings(postId, findings);

  for (const finding of findings) {
    const evidencePayload = findingToEvidencePayload(finding);
    if (evidencePayload) {
      await saveEvidence(finding.id, evidencePayload);
    }
  }

  const { post } = await publishPost(postId, { text, findings, authorName });
  return post;
}
