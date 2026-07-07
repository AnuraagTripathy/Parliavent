import { NextResponse } from "next/server";
import { requireAuthUser, unauthorizedResponse } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { isValidFindingInput } from "@/lib/db/findingInput";
import {
  findingToCreateInput,
  toPublishedArgument,
} from "@/lib/db/mappers";
import { scopedFindingId } from "@/lib/scopedIds";
import {
  buildClaimCaveatsFromFindings,
} from "@/lib/claimCaveats";
import { hasOpenNonCaveatedFindings } from "@/lib/publishedReviewFindings";

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

export async function POST(
  request: Request,
  { params }: { params: Promise<{ postId: string }> },
) {
  const { postId } = await params;

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

  const { text, findings } = body as Record<string, unknown>;

  if (typeof text !== "string") {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  if (!Array.isArray(findings) || !findings.every(isValidFindingInput)) {
    return NextResponse.json(
      { error: "findings must be an array of valid findings" },
      { status: 400 },
    );
  }

  const author = auth.authorName;
  const trimmedText = text.trim();

  // Findings must anchor to the text being published. Stale findings whose
  // span no longer exists (user edited right before posting) are dropped
  // rather than rejected — same behavior as the client-side judge merge.
  const validFindings = findings.filter((f) =>
    trimmedText.includes(f.spanText),
  );

  try {
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
      include: { debate: true },
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (existingPost.authorId !== auth.authorId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.$transaction(async (tx) => {
      const incomingIds = validFindings.map((f) =>
        scopedFindingId(postId, f.id),
      );

      await tx.finding.deleteMany({
        where: {
          postId,
          id: { notIn: incomingIds },
        },
      });

      for (const finding of validFindings) {
        const data = {
          ...findingToCreateInput(finding),
          id: scopedFindingId(postId, finding.id),
        };
        await tx.finding.upsert({
          where: { id: data.id },
          create: { ...data, postId },
          update: data,
        });
      }

      await tx.post.update({
        where: { id: postId },
        data: {
          text: trimmedText,
          authorId: auth.authorId,
          authorName: author,
          publishedAt: new Date(),
        },
      });

      await tx.caveat.deleteMany({ where: { postId } });

      const claimCaveats = buildClaimCaveatsFromFindings(validFindings);
      for (const caveat of claimCaveats) {
        await tx.caveat.create({
          data: {
            postId,
            findingId: scopedFindingId(postId, caveat.id),
            type: "claim_verdict",
            message: caveat.message,
          },
        });
      }

      if (hasOpenNonCaveatedFindings(validFindings)) {
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
