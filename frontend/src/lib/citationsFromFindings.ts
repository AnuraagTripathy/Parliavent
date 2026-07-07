import type { Citation, Finding, Source } from "./types";

export function citationsFromFindings(findings: Finding[]): Citation[] {
  return findings
    .filter(
      (f) => f.status === "source_attached" && f.selectedSourceId !== undefined,
    )
    .map((f) => {
      const candidate = f.sourceCandidates?.find(
        (s) => s.id === f.selectedSourceId,
      );
      return {
        id: f.id,
        spanText: f.spanText,
        sourceId: f.selectedSourceId!,
        supportLevel: candidate?.supportLevel,
      };
    });
}

export function sourcesFromFindings(findings: Finding[]): Source[] {
  const seen = new Set<string>();
  const sources: Source[] = [];

  for (const finding of findings) {
    if (finding.status !== "source_attached" || !finding.selectedSourceId) {
      continue;
    }
    const source = finding.sources?.find((s) => s.id === finding.selectedSourceId);
    if (source && !seen.has(source.id)) {
      seen.add(source.id);
      sources.push(source);
    }
  }

  return sources;
}
