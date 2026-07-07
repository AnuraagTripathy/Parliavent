import { cleanEvidenceText } from "@/lib/evidence/cleanEvidenceText";

/** Maximum extracted characters kept per page before passage ranking. */
export const MAX_EXTRACTED_TEXT_LENGTH = 12_000;

const REMOVABLE_TAGS =
  /<(script|style|nav|header|footer|noscript|iframe|svg)[^>]*>[\s\S]*?<\/\1>/gi;

const HTML_COMMENT = /<!--[\s\S]*?-->/g;
const BLOCK_BREAK = /<\/?(p|div|br|li|h[1-6]|section|article|tr)[^>]*>/gi;

const HTML_ENTITIES: Record<string, string> = {
  "&nbsp;": " ",
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
};

function decodeBasicEntities(text: string): string {
  let decoded = text;
  for (const [entity, char] of Object.entries(HTML_ENTITIES)) {
    decoded = decoded.split(entity).join(char);
  }
  decoded = decoded.replace(/&#(\d+);/g, (_, code) =>
    String.fromCharCode(Number(code)),
  );
  decoded = decoded.replace(/&#x([0-9a-f]+);/gi, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16)),
  );
  return decoded;
}

function collapseWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

/**
 * Extract readable plain text from HTML without external dependencies.
 */
export function extractTextFromHtml(html: string): string {
  if (!html.trim()) {
    return "";
  }

  let text = html
    .replace(REMOVABLE_TAGS, " ")
    .replace(HTML_COMMENT, " ")
    .replace(BLOCK_BREAK, "\n");

  text = text.replace(/<[^>]+>/g, " ");
  text = decodeBasicEntities(text);
  text = text
    .split("\n")
    .map((line) => collapseWhitespace(line))
    .filter(Boolean)
    .join("\n\n");

  text = cleanEvidenceText(text.replace(/\n{3,}/g, "\n\n"));

  if (text.length > MAX_EXTRACTED_TEXT_LENGTH) {
    return `${text.slice(0, MAX_EXTRACTED_TEXT_LENGTH).trim()}…`;
  }

  return text;
}
