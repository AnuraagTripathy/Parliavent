import { getChildren } from "@/lib/buildPostTree";
import type { CommentType } from "@/components/ui/reddit-nested-thread-reply";
import type { PublishedArgument } from "@/lib/types";

function previewText(text: string, max = 420): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}…`;
}

export function postToComment(
  post: PublishedArgument,
  posts: PublishedArgument[],
  fullText = false,
): CommentType {
  const children = getChildren(posts, post.id);
  return {
    id: post.id,
    author: post.author,
    content: fullText
      ? post.text
      : previewText(post.text.trim() || "(Empty draft)"),
    timestamp: post.postedAt,
    upvotes: post.deskBangs ?? 0,
    downvotes: 0,
    replies: children.map((child) => postToComment(child, posts, fullText)),
  };
}

export function startersToComments(
  starters: PublishedArgument[],
  posts: PublishedArgument[],
): CommentType[] {
  return starters.map((starter) => postToComment(starter, posts));
}
