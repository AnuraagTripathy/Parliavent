import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/** Delete an unpublished draft post (e.g. user cancelled composer). */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ postId: string }> },
) {
  const { postId } = await params;

  try {
    const post = await prisma.post.findUnique({ where: { id: postId } });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (post.publishedAt) {
      return NextResponse.json(
        { error: "Cannot delete a published post" },
        { status: 400 },
      );
    }

    await prisma.post.delete({ where: { id: postId } });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(`DELETE /api/posts/${postId} failed:`, error);
    return NextResponse.json(
      { error: "Failed to delete draft post" },
      { status: 500 },
    );
  }
}
