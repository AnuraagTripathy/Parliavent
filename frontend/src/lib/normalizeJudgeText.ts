/** Normalize argument text for judge cache keys. */
export function normalizeJudgeText(text: string): string {
  return text.trim().replace(/\s+/g, " ");
}
