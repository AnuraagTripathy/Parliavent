import type { Citation, PublishedArgument } from "./types";

export interface CitationSegment {
  text: string;
  sourceId?: string;
  citationIndex?: number;
}

export function buildSourceIndex(argument: PublishedArgument) {
  const index = new Map<string, number>();
  argument.sources.forEach((source, i) => index.set(source.id, i));
  return index;
}

export function highlightCitations(
  text: string,
  citations: Citation[],
  sourceIndex: Map<string, number>,
): CitationSegment[] {
  const breakpoints = new Set<number>([0, text.length]);
  const spans: { start: number; end: number; sourceId: string }[] = [];

  for (const citation of citations) {
    const start = text.indexOf(citation.spanText);
    if (start === -1) continue;

    const end = start + citation.spanText.length;
    breakpoints.add(start);
    breakpoints.add(end);
    spans.push({ start, end, sourceId: citation.sourceId });
  }

  const sorted = Array.from(breakpoints).sort((a, b) => a - b);
  const segments: CitationSegment[] = [];

  for (let i = 0; i < sorted.length - 1; i++) {
    const start = sorted[i];
    const end = sorted[i + 1];
    if (start === end) continue;

    const match = spans.find((s) => s.start <= start && s.end >= end);
    const sourceId = match?.sourceId;
    const citationIndex =
      sourceId !== undefined ? sourceIndex.get(sourceId) : undefined;

    segments.push({
      text: text.slice(start, end),
      sourceId,
      citationIndex,
    });
  }

  return segments.length > 0 ? segments : [{ text }];
}
