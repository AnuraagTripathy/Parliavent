import { NextResponse } from "next/server";
import { getOptionalAuthUser, unauthorizedResponse } from "@/lib/auth/session";
import {
  checkRateLimit,
  EVIDENCE_RATE_LIMIT,
  rateLimitResponse,
} from "@/lib/rateLimit";

// Vercel: the evidence pipeline (Tavily searches + page fetches + Groq
// verification, possibly escalating to deep mode) can take minutes.
// 300s is the Hobby-plan maximum with Fluid compute.
export const maxDuration = 300;

import {
  getEvidenceCacheHit,
  setEvidenceCache,
} from "@/lib/evidence/evidenceCache";
import { searchEvidenceWithMode } from "@/lib/evidence/searchEvidenceWithMode";
import {
  TavilyConfigError,
  TavilySearchError,
} from "@/lib/evidence/searchEvidence";
import type { EvidenceSearchMode } from "@/lib/types";

function normalizeMode(mode: unknown): EvidenceSearchMode {
  if (mode === "deep" || mode === "agent") return "deep";
  return "standard";
}

export async function POST(request: Request) {
  const user = await getOptionalAuthUser(request);
  if (!user) {
    return unauthorizedResponse();
  }

  // Shared "evidence" bucket with /api/evidence/jobs — each search costs
  // multiple Tavily + Groq calls, so the budget covers both entry points.
  const rate = checkRateLimit(
    `evidence:${user.id}`,
    EVIDENCE_RATE_LIMIT.limit,
    EVIDENCE_RATE_LIMIT.windowMs,
  );
  if (!rate.allowed) {
    return rateLimitResponse(rate.retryAfterSeconds);
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { claim, argumentText, threadId, mode, autoEscalate } = body as {
    claim?: unknown;
    argumentText?: unknown;
    threadId?: unknown;
    mode?: unknown;
    autoEscalate?: unknown;
  };

  if (typeof claim !== "string" || !claim.trim()) {
    return NextResponse.json({ error: "claim is required" }, { status: 400 });
  }

  if (argumentText !== undefined && typeof argumentText !== "string") {
    return NextResponse.json({ error: "Invalid argumentText" }, { status: 400 });
  }

  if (threadId !== undefined && typeof threadId !== "string") {
    return NextResponse.json({ error: "Invalid threadId" }, { status: 400 });
  }

  if (
    mode !== undefined &&
    mode !== "standard" &&
    mode !== "deep" &&
    mode !== "pipeline" &&
    mode !== "agent"
  ) {
    return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
  }

  if (autoEscalate !== undefined && typeof autoEscalate !== "boolean") {
    return NextResponse.json({ error: "Invalid autoEscalate" }, { status: 400 });
  }

  const normalizedThreadId =
    typeof threadId === "string" ? threadId : undefined;
  const normalizedMode = normalizeMode(mode);
  const normalizedAutoEscalate = autoEscalate === true;

  const cached = getEvidenceCacheHit(claim, normalizedThreadId);
  if (
    cached &&
    normalizedMode === "standard" &&
    !normalizedAutoEscalate &&
    !cached.investigationTrace
  ) {
    return NextResponse.json(cached);
  }

  try {
    const result = await searchEvidenceWithMode({
      claim,
      argumentText:
        typeof argumentText === "string" ? argumentText : undefined,
      threadId: normalizedThreadId,
      mode: normalizedMode,
      autoEscalate: normalizedAutoEscalate,
    });

    if (normalizedMode === "standard" && !normalizedAutoEscalate) {
      setEvidenceCache(claim, normalizedThreadId, result);
    }
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof TavilyConfigError) {
      return NextResponse.json(
        { error: "Tavily API key not configured" },
        { status: 503 },
      );
    }

    if (error instanceof TavilySearchError) {
      console.error("[POST /api/evidence/search]", error.message);
      return NextResponse.json(
        { error: "Source search failed" },
        { status: 502 },
      );
    }

    console.error("[POST /api/evidence/search]", error);
    return NextResponse.json(
      { error: "Source search failed" },
      { status: 500 },
    );
  }
}
