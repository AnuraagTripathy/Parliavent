import { getPost } from "./mockFeed";
import type { PublishedArgument } from "./types";

export const CITATION_PALETTE = [
  { bg: "#e8eef8", underline: "#7a9cc4", marker: "#5a7a9e", ring: "#dce4ef" },
  { bg: "#e6f0ec", underline: "#7aab96", marker: "#4a8a72", ring: "#d4e8df" },
  { bg: "#ebe8f4", underline: "#9a8cc4", marker: "#6a5a9e", ring: "#e0dce8" },
  { bg: "#f0ebe6", underline: "#b49a7a", marker: "#8a725a", ring: "#e8e0d8" },
] as const;

export function getCitationColor(sourceIndex: number) {
  return CITATION_PALETTE[sourceIndex % CITATION_PALETTE.length];
}

/** @deprecated Use getPost from mockFeed */
export function getPublishedArgument(id: string): PublishedArgument | undefined {
  return getPost(id);
}
