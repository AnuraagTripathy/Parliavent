import { getPost } from "./mockFeed";
import type { PublishedArgument } from "./types";

/** Dark-theme citation colors — tuned for #0c0a09 / #171412 backgrounds */
export const CITATION_PALETTE = [
  { bg: "#3b82f6", underline: "#60a5fa", marker: "#93c5fd", ring: "#3b82f6" },
  { bg: "#10b981", underline: "#34d399", marker: "#6ee7b7", ring: "#10b981" },
  { bg: "#8b5cf6", underline: "#a78bfa", marker: "#c4b5fd", ring: "#8b5cf6" },
  { bg: "#f59e0b", underline: "#fbbf24", marker: "#fcd34d", ring: "#f59e0b" },
] as const;

export function getCitationColor(sourceIndex: number) {
  return CITATION_PALETTE[sourceIndex % CITATION_PALETTE.length];
}

/** @deprecated Use getPost from mockFeed */
export function getPublishedArgument(id: string): PublishedArgument | undefined {
  return getPost(id);
}
