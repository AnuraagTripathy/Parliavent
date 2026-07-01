import { NextResponse } from "next/server";
import { analyzeArgument } from "@/lib/judge/analyzeArgument";
import type { JudgeMode } from "@/lib/types";

const VALID_MODES: JudgeMode[] = [
  "open_floor",
  "structured_debate",
  "formal_motion",
];

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

  const { text, mode, threadId } = body as {
    text?: unknown;
    mode?: unknown;
    threadId?: unknown;
  };

  if (typeof text !== "string") {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  if (!VALID_MODES.includes(mode as JudgeMode)) {
    return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
  }

  if (threadId !== undefined && typeof threadId !== "string") {
    return NextResponse.json({ error: "Invalid threadId" }, { status: 400 });
  }

  try {
    const findings = await analyzeArgument({
      text,
      mode: mode as JudgeMode,
      threadId: typeof threadId === "string" ? threadId : undefined,
    });

    return NextResponse.json({ findings });
  } catch (error) {
    console.error("[POST /api/judge]", error);
    return NextResponse.json(
      { error: "Judge analysis failed" },
      { status: 500 },
    );
  }
}
