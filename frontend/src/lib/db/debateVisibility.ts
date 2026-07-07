import type { Post } from "@prisma/client";

/** Draft posts are private to their author; published posts are public. */
export function canViewDbPost(
  post: Pick<Post, "publishedAt" | "authorId">,
  viewerId: string | null,
): boolean {
  if (post.publishedAt) return true;
  if (!viewerId) return false;
  return post.authorId === viewerId;
}

/** Debates visible in the feed: public published content or the viewer's own drafts. */
export function debateListWhere(viewerId: string) {
  return {
    posts: {
      some: {
        OR: [
          { publishedAt: { not: null } },
          { authorId: viewerId, publishedAt: null },
        ],
      },
    },
  };
}
