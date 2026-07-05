import { normalizeClaimText } from "@/lib/evidence/sourceUtils";
import { EVIDENCE_VERIFIER_PROMPT_VERSION } from "@/lib/evidence/verifyPrompts";
import type { EvidenceSearchResponse } from "@/lib/types";

/** Successful evidence searches expire after 30 minutes. */
export const EVIDENCE_CACHE_TTL_MS = 30 * 60 * 1000;

interface CacheEntry {
  response: EvidenceSearchResponse;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();

export function buildEvidenceCacheKey(
  claim: string,
  threadId?: string,
): string {
  return [
    EVIDENCE_VERIFIER_PROMPT_VERSION,
    normalizeClaimText(claim),
    threadId ?? "",
  ].join("\0");
}
function pruneExpiredEntries(): void {
  const now = Date.now();
  for (const [key, entry] of cache) {
    if (entry.expiresAt <= now) {
      cache.delete(key);
    }
  }
}

export function getEvidenceCacheHit(
  claim: string,
  threadId?: string,
): EvidenceSearchResponse | null {
  pruneExpiredEntries();

  const key = buildEvidenceCacheKey(claim, threadId);
  const entry = cache.get(key);
  if (!entry) {
    return null;
  }

  if (entry.expiresAt <= Date.now()) {
    cache.delete(key);
    return null;
  }

  return {
    claim: entry.response.claim,
    claimKind: entry.response.claimKind,
    claimVerdict: entry.response.claimVerdict,
    summary: entry.response.summary,
    verificationBasis: entry.response.verificationBasis,
    evidencePassages: entry.response.evidencePassages
      ? [...entry.response.evidencePassages]
      : undefined,
    sources: entry.response.sources.map((source) => ({ ...source })),
  };
}

export function setEvidenceCache(
  claim: string,
  threadId: string | undefined,
  response: EvidenceSearchResponse,
): void {
  pruneExpiredEntries();

  const key = buildEvidenceCacheKey(claim, threadId);
  cache.set(key, {
    response: {
      claim: response.claim,
      claimKind: response.claimKind,
      claimVerdict: response.claimVerdict,
      summary: response.summary,
      verificationBasis: response.verificationBasis,
      evidencePassages: response.evidencePassages
        ? [...response.evidencePassages]
        : undefined,
      sources: response.sources.map((source) => ({ ...source })),
    },
    expiresAt: Date.now() + EVIDENCE_CACHE_TTL_MS,
  });
}
