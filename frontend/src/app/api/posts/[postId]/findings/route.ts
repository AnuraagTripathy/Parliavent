import { NextResponse } from "next/server";
import { requireAuthUser, unauthorizedResponse } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { isValidFindingInput } from "@/lib/db/findingInput";
import { findingToCreateInput } from "@/lib/db/mappers";
import { scopedFindingId } from "@/lib/scopedIds";

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

  const { findings } = body as { findings?: unknown };

  if (!Array.isArray(findings) || !findings.every(isValidFindingInput)) {
    return NextResponse.json(
      { error: "findings must be an array of valid findings" },
      { status: 400 },
    );
  }

  try {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (post.authorId !== auth.authorId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.$transaction(async (tx) => {
      const incomingIds = findings.map((f) => scopedFindingId(postId, f.id));

      await tx.finding.deleteMany({
        where: {
          postId,
          id: { notIn: incomingIds },
        },
      });

      for (const finding of findings) {
        const data = {
          ...findingToCreateInput(finding),
          id: scopedFindingId(postId, finding.id),
        };
        await tx.finding.upsert({
          where: { id: data.id },
          create: {
            ...data,
            postId,
          },
          update: data,
        });
      }
    });

    const saved = await prisma.finding.findMany({
      where: { postId },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ findings: saved });
  } catch (error) {
    console.error(`POST /api/posts/${postId}/findings failed:`, error);
    return NextResponse.json(
      { error: "Failed to save findings" },
      { status: 500 },
    );
  }
}
