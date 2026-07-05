import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { toPublishedArgument } from "@/lib/db/mappers";

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
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

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

    const posts = debate.posts.map((post) =>
      toPublishedArgument(post, debate),
    );

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
