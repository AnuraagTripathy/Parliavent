import { NextResponse } from "next/server";
import {
  getEvidenceCacheHit,
  setEvidenceCache,
} from "@/lib/evidence/evidenceCache";
import {
  searchEvidenceWithMode,
  type EvidenceEngineStage,
} from "@/lib/evidence/searchEvidenceWithMode";
import {
  TavilyConfigError,
  TavilySearchError,
} from "@/lib/evidence/searchEvidence";
import type { EvidenceSearchMode } from "@/lib/types";

// Vercel: same long-running pipeline as /api/evidence/search.
export const maxDuration = 300;

// The .env.example placeholder must never work as a real secret.
const PLACEHOLDER_SECRET = "change-me-to-a-long-random-string";

const rawSecret = process.env.EVIDENCE_INTERNAL_SECRET?.trim();
const INTERNAL_SECRET =
  rawSecret && rawSecret !== PLACEHOLDER_SECRET ? rawSecret : undefined;

function isAuthorized(request: Request): boolean {
  if (!INTERNAL_SECRET) {
    return false;
  }
  return request.headers.get("x-evidence-internal-secret") === INTERNAL_SECRET;
}

async function reportJobStage(
  jobId: string,
  stage: EvidenceEngineStage,
): Promise<void> {
  const fastApiUrl = process.env.FASTAPI_EVIDENCE_URL?.trim();
  if (!fastApiUrl || !INTERNAL_SECRET) {
    return;
  }

  try {
    await fetch(`${fastApiUrl.replace(/\/$/, "")}/evidence/jobs/${jobId}/stage`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-Evidence-Internal-Secret": INTERNAL_SECRET,
      },
      body: JSON.stringify({ stage }),
    });
  } catch (error) {
    console.warn("[POST /api/evidence/internal/search] stage update failed", error);
  }
}

function parseMode(value: unknown): EvidenceSearchMode {
  if (value === "deep" || value === "agent") return "deep";
  return "standard";
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

  const { claim, argumentContext, threadId, jobId, mode, autoEscalate } = body as {
    claim?: unknown;
    argumentContext?: unknown;
    threadId?: unknown;
    jobId?: unknown;
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

  if (jobId !== undefined && typeof jobId !== "string") {
    return NextResponse.json({ error: "Invalid jobId" }, { status: 400 });
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
  const normalizedJobId = typeof jobId === "string" ? jobId : undefined;
  const normalizedMode = parseMode(mode);
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
        typeof argumentContext === "string" ? argumentContext : undefined,
      threadId: normalizedThreadId,
      mode: normalizedMode,
      autoEscalate: normalizedAutoEscalate,
      onStage: normalizedJobId
        ? (stage) => reportJobStage(normalizedJobId, stage)
        : undefined,
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
      console.error("[POST /api/evidence/internal/search]", error.message);
      return NextResponse.json(
        { error: "Source search failed" },
        { status: 502 },
      );
    }

    console.error("[POST /api/evidence/internal/search]", error);
    return NextResponse.json(
      { error: "Source search failed" },
      { status: 500 },
    );
  }
}
