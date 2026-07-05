import { NextResponse } from "next/server";
import { analyzeArgument } from "@/lib/judge/analyzeArgument";
import type {
  JudgeMode,
  JudgePostType,
  JudgeRequest,
  JudgeUserStance,
} from "@/lib/types";

const VALID_MODES: JudgeMode[] = [
  "open_floor",
  "structured_debate",
  "formal_motion",
];

const VALID_POST_TYPES: JudgePostType[] = ["starter", "reply"];

const VALID_USER_STANCES: JudgeUserStance[] = [
  "for",
  "against",
  "mixed",
  "unknown",
];

function isOptionalString(value: unknown): value is string | undefined {
  return value === undefined || typeof value === "string";
}

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

  const {
    text,
    mode,
    threadId,
    motion,
    postType,
    parentArgument,
    threadSummary,
    userStance,
  } = body as JudgeRequest;

  if (typeof text !== "string") {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  if (!VALID_MODES.includes(mode as JudgeMode)) {
    return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
  }

  if (!isOptionalString(threadId)) {
    return NextResponse.json({ error: "Invalid threadId" }, { status: 400 });
  }

  if (!isOptionalString(motion)) {
    return NextResponse.json({ error: "Invalid motion" }, { status: 400 });
  }

  if (!isOptionalString(parentArgument)) {
    return NextResponse.json({ error: "Invalid parentArgument" }, { status: 400 });
  }

  if (!isOptionalString(threadSummary)) {
    return NextResponse.json({ error: "Invalid threadSummary" }, { status: 400 });
  }

  if (
    postType !== undefined &&
    !VALID_POST_TYPES.includes(postType as JudgePostType)
  ) {
    return NextResponse.json({ error: "Invalid postType" }, { status: 400 });
  }

  if (
    userStance !== undefined &&
    !VALID_USER_STANCES.includes(userStance as JudgeUserStance)
  ) {
    return NextResponse.json({ error: "Invalid userStance" }, { status: 400 });
  }

  try {
    const findings = await analyzeArgument({
      text,
      mode: mode as JudgeMode,
      threadId,
      motion,
      postType,
      parentArgument,
      threadSummary,
      userStance,
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
