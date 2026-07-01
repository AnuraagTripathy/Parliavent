import type { Finding, FindingType } from "./types";

export interface TextSegment {
  text: string;
  types: FindingType[];
}

export function highlightText(text: string, findings: Finding[]): TextSegment[] {
  const activeFindings = findings.filter((f) => f.status === "open");

  const breakpoints = new Set<number>([0, text.length]);
  const spans: { start: number; end: number; type: FindingType }[] = [];

  for (const finding of activeFindings) {
    const start = text.indexOf(finding.spanText);
    if (start === -1) continue;

    const end = start + finding.spanText.length;
    breakpoints.add(start);
    breakpoints.add(end);
    spans.push({ start, end, type: finding.type });
  }

  const sorted = Array.from(breakpoints).sort((a, b) => a - b);
  const segments: TextSegment[] = [];

  for (let i = 0; i < sorted.length - 1; i++) {
    const start = sorted[i];
    const end = sorted[i + 1];
    if (start === end) continue;

    const types = [
      ...new Set(
        spans
          .filter((s) => s.start <= start && s.end >= end)
          .map((s) => s.type),
      ),
    ];

    segments.push({ text: text.slice(start, end), types });
  }

  return segments.length > 0 ? segments : [{ text, types: [] }];
}
