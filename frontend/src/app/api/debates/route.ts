import { NextResponse } from "next/server";
import type { DebateMode } from "@prisma/client";
import { prisma } from "@/lib/db";
import { slugFromMotion } from "@/lib/db/slug";
import type { JudgeMode } from "@/lib/types";

const VALID_MODES: JudgeMode[] = [
  "open_floor",
  "structured_debate",
  "formal_motion",
];

function isValidMode(mode: unknown): mode is JudgeMode {
  return typeof mode === "string" && VALID_MODES.includes(mode as JudgeMode);
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

  const { motion, text, mode, authorName } = body as Record<string, unknown>;

  if (typeof motion !== "string" || motion.trim().length < 8) {
    return NextResponse.json(
      { error: "motion must be at least 8 characters" },
      { status: 400 },
    );
  }

  if (typeof text !== "string") {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  if (!isValidMode(mode)) {
    return NextResponse.json({ error: "Invalid debate mode" }, { status: 400 });
  }

  const trimmedMotion = motion.trim();
  const baseSlug = slugFromMotion(trimmedMotion);
  const author =
    typeof authorName === "string" && authorName.trim()
      ? authorName.trim()
      : "Guest";

  try {
    let slug = baseSlug;
    let suffix = 0;

    while (await prisma.debate.findUnique({ where: { slug } })) {
      suffix += 1;
      slug = `${baseSlug}-${suffix}`;
    }

    const debate = await prisma.debate.create({
      data: {
        motion: trimmedMotion,
        slug,
        mode: mode as DebateMode,
        posts: {
          create: {
            text: text.trim(),
            postType: "starter",
            authorName: author,
          },
        },
      },
      include: {
        posts: true,
      },
    });

    const post = debate.posts[0];

    return NextResponse.json({
      debate: {
        id: debate.id,
        motion: debate.motion,
        slug: debate.slug,
        mode: debate.mode,
        createdAt: debate.createdAt.toISOString(),
      },
      post: {
        id: post.id,
        debateId: post.debateId,
        text: post.text,
        postType: post.postType,
        authorName: post.authorName,
        createdAt: post.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("POST /api/debates failed:", error);
    return NextResponse.json(
      { error: "Failed to create debate" },
      { status: 500 },
    );
  }
}
