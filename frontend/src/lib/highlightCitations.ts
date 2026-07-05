import type { Citation, ClaimCaveat, PublishedArgument } from "./types";

export interface CitationSegment {
  text: string;
  sourceId?: string;
  citationIndex?: number;
  caveatMessage?: string;
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
  claimCaveats: ClaimCaveat[] = [],
): CitationSegment[] {
  const breakpoints = new Set<number>([0, text.length]);
  const citationSpans: { start: number; end: number; sourceId: string }[] = [];
  const caveatSpans: { start: number; end: number; message: string }[] = [];

  for (const citation of citations) {
    const start = text.indexOf(citation.spanText);
    if (start === -1) continue;

    const end = start + citation.spanText.length;
    breakpoints.add(start);
    breakpoints.add(end);
    citationSpans.push({ start, end, sourceId: citation.sourceId });
  }

  for (const caveat of claimCaveats) {
    const start = text.indexOf(caveat.spanText);
    if (start === -1) continue;

    const end = start + caveat.spanText.length;
    const coveredByCitation = citationSpans.some(
      (span) => span.start <= start && span.end >= end,
    );
    if (coveredByCitation) continue;

    breakpoints.add(start);
    breakpoints.add(end);
    caveatSpans.push({ start, end, message: caveat.message });
  }

  const sorted = Array.from(breakpoints).sort((a, b) => a - b);
  const segments: CitationSegment[] = [];

  for (let i = 0; i < sorted.length - 1; i++) {
    const start = sorted[i];
    const end = sorted[i + 1];
    if (start === end) continue;

    const citationMatch = citationSpans.find(
      (span) => span.start <= start && span.end >= end,
    );
    const caveatMatch = caveatSpans.find(
      (span) => span.start <= start && span.end >= end,
    );

    const sourceId = citationMatch?.sourceId;
    const citationIndex =
      sourceId !== undefined ? sourceIndex.get(sourceId) : undefined;

    segments.push({
      text: text.slice(start, end),
      sourceId,
      citationIndex,
      caveatMessage:
        citationIndex === undefined ? caveatMatch?.message : undefined,
    });
  }

  return segments.length > 0 ? segments : [{ text }];
}
