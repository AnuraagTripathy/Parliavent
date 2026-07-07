/**
 * Strip common markdown syntax from evidence text for plain-language display.
 * Tavily snippets and some page extracts include raw markdown markers.
 */
export function stripMarkdownSyntax(text: string): string {
  if (!text.trim()) {
    return "";
  }

  let cleaned = text.replace(/\r\n/g, "\n");

  cleaned = cleaned.replace(/^#{1,6}\s+/gm, "");
  cleaned = cleaned.replace(/^\s{0,3}>\s?/gm, "");
  cleaned = cleaned.replace(/^\s*[-*+]\s+/gm, "");
  cleaned = cleaned.replace(/^\s*\d+\.\s+/gm, "");

  cleaned = cleaned.replace(/\*\*\*(.+?)\*\*\*/g, "$1");
  cleaned = cleaned.replace(/\*\*(.+?)\*\*/g, "$1");
  cleaned = cleaned.replace(/__(.+?)__/g, "$1");
  cleaned = cleaned.replace(/\*(.+?)\*/g, "$1");
  cleaned = cleaned.replace(/_(.+?)_/g, "$1");

  cleaned = cleaned.replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1");
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  cleaned = cleaned.replace(/`([^`]+)`/g, "$1");

  return cleaned;
}

/** Normalize evidence text for UI display after markdown removal. */
export function cleanEvidenceText(text: string): string {
  let stripped = stripMarkdownSyntax(text);
  let previous = "";

  while (previous !== stripped) {
    previous = stripped;
    stripped = stripMarkdownSyntax(stripped);
  }

  return stripped
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
