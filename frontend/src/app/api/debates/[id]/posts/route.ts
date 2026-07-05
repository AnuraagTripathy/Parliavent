import { NextResponse } from "next/server";
import type { PostType } from "@prisma/client";
import { prisma } from "@/lib/db";

const VALID_POST_TYPES: PostType[] = ["starter", "reply"];

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { parentPostId, text, authorName, postType } = body as Record<
    string,
    unknown
  >;

  const type: PostType =
    postType === "starter" ? "starter" : "reply";

  if (postType !== undefined && !VALID_POST_TYPES.includes(type)) {
    return NextResponse.json({ error: "Invalid postType" }, { status: 400 });
  }

  if (type === "reply") {
    if (typeof parentPostId !== "string" || !parentPostId.trim()) {
      return NextResponse.json(
        { error: "parentPostId is required for replies" },
        { status: 400 },
      );
    }
  }

  if (text !== undefined && typeof text !== "string") {
    return NextResponse.json({ error: "text must be a string" }, { status: 400 });
  }

  const author =
    typeof authorName === "string" && authorName.trim()
      ? authorName.trim()
      : "Guest";

  try {
    const debate = await prisma.debate.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!debate) {
      return NextResponse.json({ error: "Debate not found" }, { status: 404 });
    }

    let resolvedParentId: string | null = null;

    if (type === "reply") {
      const parentPost = await prisma.post.findFirst({
        where: {
          id: parentPostId as string,
          debateId: debate.id,
        },
      });

      if (!parentPost) {
        return NextResponse.json(
          { error: "Parent post not found" },
          { status: 404 },
        );
      }

      resolvedParentId = parentPost.id;
    }

    const post = await prisma.post.create({
      data: {
        debateId: debate.id,
        parentPostId: resolvedParentId,
        text: typeof text === "string" ? text.trim() : "",
        postType: type,
        authorName: author,
      },
    });

    await prisma.debate.update({
      where: { id: debate.id },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({
      post: {
        id: post.id,
        debateId: post.debateId,
        parentPostId: post.parentPostId,
        text: post.text,
        postType: post.postType,
        authorName: post.authorName,
        createdAt: post.createdAt.toISOString(),
      },
      debate: {
        id: debate.id,
        slug: debate.slug,
        motion: debate.motion,
        mode: debate.mode,
      },
    });
  } catch (error) {
    console.error(`POST /api/debates/${id}/posts failed:`, error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 },
    );
  }
}
