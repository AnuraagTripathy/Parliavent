import type { Finding } from "./types";

/** True when two span strings are equal or one contains the other. */
export function spansOverlap(spanA: string, spanB: string): boolean {
  if (spanA === spanB) return true;
  return spanA.includes(spanB) || spanB.includes(spanA);
}

/** Other open findings whose span overlaps the target span. */
export function getOverlappingOpenFindings(
  target: Finding,
  findings: Finding[],
): Finding[] {
  return findings.filter(
    (finding) =>
      finding.id !== target.id &&
      finding.status === "open" &&
      spansOverlap(target.spanText, finding.spanText),
  );
}
