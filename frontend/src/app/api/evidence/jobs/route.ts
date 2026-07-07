import { NextResponse } from "next/server";
import { getOptionalAuthUser, unauthorizedResponse } from "@/lib/auth/session";
import {
  checkRateLimit,
  EVIDENCE_RATE_LIMIT,
  rateLimitResponse,
} from "@/lib/rateLimit";

function getFastApiUrl(): string | null {
  const url = process.env.FASTAPI_EVIDENCE_URL?.trim();
  return url ? url.replace(/\/$/, "") : null;
}

function normalizeMode(mode: unknown): "standard" | "deep" {
  if (mode === "deep" || mode === "agent") return "deep";
  return "standard";
}

export async function GET(request: Request) {
  const user = await getOptionalAuthUser(request);
  if (!user) {
    return unauthorizedResponse();
  }

  const fastApiUrl = getFastApiUrl();
  if (!fastApiUrl) {
    return NextResponse.json(
      { error: "Evidence jobs service not configured" },
      { status: 503 },
    );
  }

  try {
    const response = await fetch(`${fastApiUrl}/evidence/jobs`, {
      cache: "no-store",
    });

    const data: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        data ?? { error: "Failed to list evidence jobs" },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[GET /api/evidence/jobs]", error);
    return NextResponse.json(
      { error: "Evidence jobs service unavailable" },
      { status: 503 },
    );
  }
}

export async function POST(request: Request) {
  const user = await getOptionalAuthUser(request);
  if (!user) {
    return unauthorizedResponse();
  }

  // Shares the "evidence" bucket with the sync /api/evidence/search route.
  const rate = checkRateLimit(
    `evidence:${user.id}`,
    EVIDENCE_RATE_LIMIT.limit,
    EVIDENCE_RATE_LIMIT.windowMs,
  );
  if (!rate.allowed) {
    return rateLimitResponse(rate.retryAfterSeconds);
  }

  const fastApiUrl = getFastApiUrl();
  if (!fastApiUrl) {
    return NextResponse.json(
      { error: "Evidence jobs service not configured" },
      { status: 503 },
    );
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

  const { claim, argumentContext, threadId, findingId, mode, autoEscalate } = body as {
    claim?: unknown;
    argumentContext?: unknown;
    threadId?: unknown;
    findingId?: unknown;
    mode?: unknown;
    autoEscalate?: unknown;
  };

  if (typeof claim !== "string" || !claim.trim()) {
    return NextResponse.json({ error: "claim is required" }, { status: 400 });
  }

  if (argumentContext !== undefined && typeof argumentContext !== "string") {
    return NextResponse.json({ error: "Invalid argumentContext" }, { status: 400 });
  }

  if (threadId !== undefined && typeof threadId !== "string") {
    return NextResponse.json({ error: "Invalid threadId" }, { status: 400 });
  }

  if (findingId !== undefined && typeof findingId !== "string") {
    return NextResponse.json({ error: "Invalid findingId" }, { status: 400 });
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

  try {
    const response = await fetch(`${fastApiUrl}/evidence/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        claim: claim.trim(),
        argumentContext:
          typeof argumentContext === "string" ? argumentContext : undefined,
        threadId: typeof threadId === "string" ? threadId : undefined,
        findingId: typeof findingId === "string" ? findingId : undefined,
        mode: normalizeMode(mode),
        autoEscalate: autoEscalate === true,
      }),
    });

    const data: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        data ?? { error: "Failed to create evidence job" },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[POST /api/evidence/jobs]", error);
    return NextResponse.json(
      { error: "Evidence jobs service unavailable" },
      { status: 503 },
    );
  }
}
