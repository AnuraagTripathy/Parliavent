import { normalizeJudgeText } from "@/lib/normalizeJudgeText";
import type { Finding, JudgeMode, JudgePostType } from "@/lib/types";

/** Successful Groq judge responses expire after 20 minutes. */
export const JUDGE_CACHE_TTL_MS = 20 * 60 * 1000;

/** Hard cap so a burst of unique texts can't grow memory unboundedly. */
export const JUDGE_CACHE_MAX_ENTRIES = 500;

interface CacheEntry {
  findings: Finding[];
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();

export interface JudgeCacheKeyParams {
  normalizedText: string;
  mode: JudgeMode;
  model: string;
  promptVersion: string;
  motion?: string;
  postType?: JudgePostType;
  parentArgument?: string;
  threadSummary?: string;
}

export function buildJudgeCacheKey(params: JudgeCacheKeyParams): string {
  return [
    params.promptVersion,
    params.model,
    params.mode,
    params.motion ?? "",
    params.postType ?? "",
    normalizeJudgeText(params.parentArgument ?? ""),
    normalizeJudgeText(params.threadSummary ?? ""),
    params.normalizedText,
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

export function getJudgeCacheHit(
  params: JudgeCacheKeyParams,
): Finding[] | null {
  pruneExpiredEntries();

  const key = buildJudgeCacheKey(params);
  const entry = cache.get(key);
  if (!entry) {
    return null;
  }

  if (entry.expiresAt <= Date.now()) {
    cache.delete(key);
    return null;
  }

  return entry.findings.map((finding) => ({ ...finding }));
}

export function setJudgeCache(
  params: JudgeCacheKeyParams,
  findings: Finding[],
): void {
  pruneExpiredEntries();

  // Evict oldest entries (Map iteration order is insertion order) past the cap.
  while (cache.size >= JUDGE_CACHE_MAX_ENTRIES) {
    const oldestKey = cache.keys().next().value;
    if (oldestKey === undefined) break;
    cache.delete(oldestKey);
  }

  const key = buildJudgeCacheKey(params);
  cache.set(key, {
    findings: findings.map((finding) => ({ ...finding })),
    expiresAt: Date.now() + JUDGE_CACHE_TTL_MS,
  });
}

/** Exposed for tests — normalize text the same way as cache keys. */
export { normalizeJudgeText };
