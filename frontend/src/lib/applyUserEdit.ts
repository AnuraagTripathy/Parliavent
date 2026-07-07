export interface ApplyUserApprovedEditParams {
  text: string;
  spanText: string;
  replacement: string;
  /**
   * Anchored offset of the occurrence to replace (from the judge run).
   * Ignored when the text at that offset no longer matches spanText.
   */
  spanStart?: number;
}

/**
 * Replaces the anchored occurrence of spanText with replacement, falling back
 * to the first occurrence when no valid anchor is available.
 * All argument text changes must go through this helper after explicit user action.
 */
export function applyUserApprovedEdit({
  text,
  spanText,
  replacement,
  spanStart,
}: ApplyUserApprovedEditParams): string {
  const index =
    spanStart !== undefined && text.startsWith(spanText, spanStart)
      ? spanStart
      : text.indexOf(spanText);
  if (index === -1) return text;
  return text.slice(0, index) + replacement + text.slice(index + spanText.length);
}
