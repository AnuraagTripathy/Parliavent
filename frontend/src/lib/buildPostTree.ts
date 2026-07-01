import type { PublishedArgument } from "./types";

export interface PostNode {
  post: PublishedArgument;
  children: PostNode[];
}

export function getChildren(
  posts: PublishedArgument[],
  parentId: string,
): PublishedArgument[] {
  return posts
    .filter((p) => p.parentId === parentId)
    .sort((a, b) => (b.deskBangs ?? 0) - (a.deskBangs ?? 0));
}

export function buildPostTree(
  posts: PublishedArgument[],
  rootId: string,
): PostNode {
  const post = posts.find((p) => p.id === rootId);
  if (!post) {
    throw new Error(`Post ${rootId} not found`);
  }

  const children = getChildren(posts, rootId).map((child) =>
    buildPostTree(posts, child.id),
  );

  return { post, children };
}

export function countDescendants(node: PostNode): number {
  return node.children.reduce(
    (sum, child) => sum + 1 + countDescendants(child),
    0,
  );
}

export function findRootStarter(
  posts: PublishedArgument[],
  postId: string,
): PublishedArgument | undefined {
  let current = posts.find((p) => p.id === postId);
  while (current?.parentId) {
    current = posts.find((p) => p.id === current!.parentId);
  }
  return current;
}
