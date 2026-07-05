import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  findingToCreateInput,
  toPublishedArgument,
} from "@/lib/db/mappers";
import {
  buildClaimCaveatsFromFindings,
  hasOpenNonCaveatedFindings,
} from "@/lib/claimCaveats";
import type { Finding } from "@/lib/types";

const postInclude = {
  findings: {
    include: {
      evidenceResult: true,
      findingSources: { include: { source: true } },
      caveats: true,
    },
  },
  caveats: true,
} as const;

function isFinding(value: unknown): value is Finding {
  if (!value || typeof value !== "object") return false;
  const f = value as Record<string, unknown>;
  return (
    typeof f.id === "string" &&
    typeof f.type === "string" &&
    typeof f.status === "string" &&
    typeof f.spanText === "string" &&
    typeof f.title === "string" &&
    typeof f.reason === "string"
  );
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ postId: string }> },
) {
  const { postId } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { text, findings, authorName } = body as Record<string, unknown>;

  if (typeof text !== "string") {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  if (!Array.isArray(findings) || !findings.every(isFinding)) {
    return NextResponse.json(
      { error: "findings must be an array of valid findings" },
      { status: 400 },
    );
  }

  const author =
    typeof authorName === "string" && authorName.trim()
      ? authorName.trim()
      : "Guest";

  try {
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
      include: { debate: true },
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      const incomingIds = findings.map((f) => f.id);

      await tx.finding.deleteMany({
        where: {
          postId,
          id: { notIn: incomingIds },
        },
      });

      for (const finding of findings) {
        const data = findingToCreateInput(finding);
        await tx.finding.upsert({
          where: { id: finding.id },
          create: { ...data, postId },
          update: data,
        });
      }

      await tx.post.update({
        where: { id: postId },
        data: {
          text: text.trim(),
          authorName: author,
          publishedAt: new Date(),
        },
      });

      await tx.caveat.deleteMany({ where: { postId } });

      const claimCaveats = buildClaimCaveatsFromFindings(findings, text);
      for (const caveat of claimCaveats) {
        await tx.caveat.create({
          data: {
            postId,
            findingId: caveat.id,
            type: "claim_verdict",
            message: caveat.message,
          },
        });
      }

      if (hasOpenNonCaveatedFindings(findings)) {
        await tx.caveat.create({
          data: {
            postId,
            type: "unresolved_review",
            message: "Posted with unresolved review item.",
          },
        });
      }
    });

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        ...postInclude,
        debate: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const published = toPublishedArgument(post, post.debate);

    return NextResponse.json({ post: published });
  } catch (error) {
    console.error(`POST /api/posts/${postId}/publish failed:`, error);
    return NextResponse.json(
      { error: "Failed to publish post" },
      { status: 500 },
    );
  }
}
