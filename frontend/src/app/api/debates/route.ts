import { NextResponse } from "next/server";
import { Prisma, type DebateMode } from "@prisma/client";
import { requireAuthUser, unauthorizedResponse } from "@/lib/auth/session";
import { debateListWhere } from "@/lib/db/debateVisibility";
import { prisma } from "@/lib/db";
import { toSavedDebateSummary } from "@/lib/db/mappers";
import { slugFromMotion } from "@/lib/db/slug";
import type { JudgeMode } from "@/lib/types";

const debateListInclude = {
  posts: {
    include: {
      findings: {
        include: {
          evidenceResult: true,
          findingSources: { include: { source: true } },
        },
      },
      caveats: { select: { type: true, findingId: true, message: true } },
    },
    orderBy: { createdAt: "asc" as const },
  },
} as const;

export async function GET(request: Request) {
  let auth;
  try {
    auth = await requireAuthUser(request);
  } catch {
    return unauthorizedResponse();
  }

  try {
    const debates = await prisma.debate.findMany({
      where: debateListWhere(auth.authorId),
      orderBy: { updatedAt: "desc" },
      include: debateListInclude,
    });

    return NextResponse.json({
      debates: debates.map(toSavedDebateSummary),
    });
  } catch (error) {
    console.error("GET /api/debates failed:", error);
    return NextResponse.json(
      { error: "Failed to load debates" },
      { status: 500 },
    );
  }
}

const VALID_MODES: JudgeMode[] = [
  "open_floor",
  "structured_debate",
  "formal_motion",
];

function isValidMode(mode: unknown): mode is JudgeMode {
  return typeof mode === "string" && VALID_MODES.includes(mode as JudgeMode);
}

export async function POST(request: Request) {
  let auth;
  try {
    auth = await requireAuthUser(request);
  } catch {
    return unauthorizedResponse();
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

  const { motion, text, mode } = body as Record<string, unknown>;

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
  const author = auth.authorName;

  try {
    // Create-and-retry instead of check-then-create: two concurrent creates
    // with the same motion would both pass a pre-check and one would 500 on
    // the unique constraint. Sequential suffixes first, then random ones for
    // popular motions.
    const MAX_SLUG_ATTEMPTS = 6;
    let debate: Prisma.DebateGetPayload<{ include: { posts: true } }> | null =
      null;

    for (let attempt = 0; attempt < MAX_SLUG_ATTEMPTS; attempt++) {
      const slug =
        attempt === 0
          ? baseSlug
          : attempt <= 3
            ? `${baseSlug}-${attempt}`
            : `${baseSlug}-${Math.random().toString(36).slice(2, 8)}`;

      try {
        debate = await prisma.debate.create({
          data: {
            motion: trimmedMotion,
            slug,
            mode: mode as DebateMode,
            posts: {
              create: {
                text: text.trim(),
                postType: "starter",
                authorId: auth.authorId,
                authorName: author,
              },
            },
          },
          include: {
            posts: true,
          },
        });
        break;
      } catch (error) {
        const isUniqueViolation =
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002";
        if (!isUniqueViolation) throw error;
      }
    }

    if (!debate) {
      return NextResponse.json(
        { error: "Failed to create debate" },
        { status: 500 },
      );
    }

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
