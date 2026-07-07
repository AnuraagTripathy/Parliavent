import { NextResponse } from "next/server";
import { requireAuthUser, unauthorizedResponse } from "@/lib/auth/session";
import { canViewDbPost } from "@/lib/db/debateVisibility";
import { prisma } from "@/lib/db";
import { toPublishedArgument } from "@/lib/db/mappers";
import { isVisibleDbPost } from "@/lib/db/postVisibility";

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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  let auth;
  try {
    auth = await requireAuthUser(request);
  } catch {
    return unauthorizedResponse();
  }

  try {
    const debate = await prisma.debate.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        posts: {
          include: postInclude,
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!debate) {
      return NextResponse.json({ error: "Debate not found" }, { status: 404 });
    }

    const visiblePosts = debate.posts.filter(
      (post) =>
        isVisibleDbPost(post) && canViewDbPost(post, auth.authorId),
    );

    if (visiblePosts.length === 0) {
      return NextResponse.json({ error: "Debate not found" }, { status: 404 });
    }

    const posts = visiblePosts.map((post) => toPublishedArgument(post, debate));

    return NextResponse.json({
      debate: {
        id: debate.id,
        motion: debate.motion,
        slug: debate.slug,
        mode: debate.mode,
        createdAt: debate.createdAt.toISOString(),
        updatedAt: debate.updatedAt.toISOString(),
        posts,
      },
    });
  } catch (error) {
    console.error(`GET /api/debates/${id} failed:`, error);
    return NextResponse.json(
      { error: "Failed to load debate" },
      { status: 500 },
    );
  }
}
