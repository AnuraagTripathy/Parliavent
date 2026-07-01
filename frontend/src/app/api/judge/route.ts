import { NextResponse } from "next/server";
import { judgeText } from "@/lib/mockJudge";
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

  const { text, mode } = body as { text?: unknown; mode?: unknown };

  if (typeof text !== "string") {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  if (!VALID_MODES.includes(mode as JudgeMode)) {
    return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
  }

  return NextResponse.json({ findings: judgeText(text) });
}
