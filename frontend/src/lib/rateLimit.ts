import { NextResponse } from "next/server";

/**
 * In-memory sliding-window rate limiter.
 *
 * Per-process only: counts reset on restart and are not shared across
 * instances. This is intentional for the current single-server deployment
 * (Render). If the app ever runs on multiple instances or serverless,
 * replace the Map with Redis — the call sites stay the same.
 */
const requestLog = new Map<string, number[]>();
const MAX_TRACKED_KEYS = 5_000;

export const JUDGE_RATE_LIMIT = { limit: 120, windowMs: 60 * 60 * 1000 };
export const EVIDENCE_RATE_LIMIT = { limit: 20, windowMs: 60 * 60 * 1000 };

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

function pruneOldestKeys(): void {
  // Map iteration order is insertion order; drop the oldest ~20% of keys.
  const dropCount = Math.ceil(MAX_TRACKED_KEYS / 5);
  let dropped = 0;
  for (const key of requestLog.keys()) {
    requestLog.delete(key);
    dropped += 1;
    if (dropped >= dropCount) break;
  }
}

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  const cutoff = now - windowMs;
  const timestamps = (requestLog.get(key) ?? []).filter((t) => t > cutoff);

  if (timestamps.length >= limit) {
    requestLog.set(key, timestamps);
    const oldest = timestamps[0];
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((oldest + windowMs - now) / 1000)),
    };
  }

  if (!requestLog.has(key) && requestLog.size >= MAX_TRACKED_KEYS) {
    pruneOldestKeys();
  }

  timestamps.push(now);
  requestLog.set(key, timestamps);
  return { allowed: true, retryAfterSeconds: 0 };
}

export function rateLimitResponse(retryAfterSeconds: number) {
  return NextResponse.json(
    { error: "Too many requests. Please wait a moment and try again." },
    { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } },
  );
}
