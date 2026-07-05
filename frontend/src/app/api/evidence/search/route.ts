import { NextResponse } from "next/server";
import {
  getEvidenceCacheHit,
  setEvidenceCache,
} from "@/lib/evidence/evidenceCache";
import {
  searchEvidence,
  TavilyConfigError,
  TavilySearchError,
} from "@/lib/evidence/searchEvidence";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { claim, argumentText, threadId } = body as {
    claim?: unknown;
    argumentText?: unknown;
    threadId?: unknown;
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

  const normalizedThreadId =
    typeof threadId === "string" ? threadId : undefined;

  const cached = getEvidenceCacheHit(claim, normalizedThreadId);
  if (cached) {
    return NextResponse.json(cached);
  }

  try {
    const result = await searchEvidence({
      claim,
      argumentText:
        typeof argumentText === "string" ? argumentText : undefined,
      threadId: normalizedThreadId,
    });

    setEvidenceCache(claim, normalizedThreadId, result);
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
