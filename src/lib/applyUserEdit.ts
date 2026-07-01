export interface ApplyUserApprovedEditParams {
  text: string;
  spanText: string;
  replacement: string;
}

/**
 * Replaces the first occurrence of spanText with replacement.
 * All argument text changes must go through this helper after explicit user action.
 */
export function applyUserApprovedEdit({
  text,
  spanText,
  replacement,
}: ApplyUserApprovedEditParams): string {
  const index = text.indexOf(spanText);
  if (index === -1) return text;
  return text.slice(0, index) + replacement + text.slice(index + spanText.length);
}
