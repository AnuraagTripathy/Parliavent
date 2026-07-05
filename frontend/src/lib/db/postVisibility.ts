import type { Post } from "@prisma/client";

/** Hide abandoned empty drafts created before publish. */
export function isVisibleDbPost(post: Pick<Post, "publishedAt" | "text">): boolean {
  if (post.publishedAt) return true;
  return post.text.trim().length > 0;
}
