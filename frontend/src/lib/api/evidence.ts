import type {
  ClaimKind,
  ClaimVerdict,
  EvidenceSearchRequest,
  EvidenceSearchResponse,
  EvidenceSource,
  SupportLevel,
} from "@/lib/types";

export const EVIDENCE_ERROR_MESSAGE =
  "Couldn't search sources. Your draft is safe.";

export const EVIDENCE_EMPTY_MESSAGE =
  "No useful sources found. Try narrowing the claim.";

export const EVIDENCE_UNSUPPORTED_WARNING =
  "These sources do not appear to support the claim.";

export const KEEP_AS_IS_CAVEAT_HINT =
  "Keeping this claim will post with a caveat that it lacks supporting evidence.";

const CLAIM_VERDICTS = new Set<ClaimVerdict>([
  "supported",
  "partially_supported",
  "contradicted",
  "unsupported",
  "too_broad",
  "unclear",
]);

const CLAIM_KINDS = new Set<ClaimKind>([
  "factual",
  "opinion",
  "mixed",
  "unclear",
]);

const SUPPORT_LEVELS = new Set<SupportLevel>([
  "supports",
  "partially_supports",
  "contradicts",
  "related_only",
  "unclear",
]);

function isValidEvidenceSource(value: unknown): value is EvidenceSource {
  if (!value || typeof value !== "object") return false;

  const source = value as EvidenceSource;
  return (
    typeof source.id === "string" &&
    typeof source.title === "string" &&
    typeof source.publisher === "string" &&
    typeof source.url === "string" &&
    typeof source.snippet === "string" &&
    typeof source.supportLevel === "string" &&
    SUPPORT_LEVELS.has(source.supportLevel) &&
    typeof source.credibility === "string" &&
    (source.credibility === "high" ||
      source.credibility === "medium" ||
      source.credibility === "low") &&
    typeof source.canAttachAsSupport === "boolean"
  );
}

function isValidEvidenceResponse(data: unknown): data is EvidenceSearchResponse {
  if (!data || typeof data !== "object") return false;

  const response = data as EvidenceSearchResponse;
  return (
    typeof response.claim === "string" &&
    typeof response.summary === "string" &&
    typeof response.claimKind === "string" &&
    CLAIM_KINDS.has(response.claimKind) &&
    typeof response.claimVerdict === "string" &&
    CLAIM_VERDICTS.has(response.claimVerdict) &&
    Array.isArray(response.sources) &&
    response.sources.every(isValidEvidenceSource)
  );
}

export async function fetchEvidenceSearch(
  params: EvidenceSearchRequest,
  signal?: AbortSignal,
): Promise<EvidenceSearchResponse> {
  const response = await fetch("/api/evidence/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Evidence search failed (${response.status})`);
  }

  const data: unknown = await response.json();

  if (!isValidEvidenceResponse(data)) {
    throw new Error("Invalid evidence search response");
  }

  return data;
}
