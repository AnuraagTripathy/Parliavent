import type { ClaimCaveat, ClaimVerdict, Finding } from "./types";

const CAVEAT_VERDICTS = new Set<ClaimVerdict>([
  "unsupported",
  "contradicted",
  "too_broad",
  "unclear",
]);

const CAVEAT_MESSAGES: Record<
  "unsupported" | "contradicted" | "too_broad" | "unclear",
  string
> = {
  unsupported: "Sources reviewed did not support this claim.",
  contradicted: "Sources reviewed appear to contradict this claim.",
  too_broad: "This claim was too broad to verify.",
  unclear: "This claim could not be verified from the reviewed sources.",
};

export function claimCaveatMessage(verdict: ClaimVerdict): string | null {
  if (!CAVEAT_VERDICTS.has(verdict)) {
    return null;
  }

  return CAVEAT_MESSAGES[verdict as keyof typeof CAVEAT_MESSAGES];
}

export function shouldShowClaimCaveat(finding: Finding): boolean {
  if (finding.type !== "claim") {
    return false;
  }

  if (finding.status === "source_attached") {
    return false;
  }

  if (
    finding.status === "resolved" ||
    finding.status === "marked_opinion" ||
    finding.status === "disputed"
  ) {
    return false;
  }

  const verdict = finding.evidenceClaimVerdict;
  if (!verdict || !CAVEAT_VERDICTS.has(verdict)) {
    return false;
  }

  return finding.status === "ignored" || finding.status === "open";
}

export function buildClaimCaveatsFromFindings(
  findings: Finding[],
  text: string,
): ClaimCaveat[] {
  const caveats: ClaimCaveat[] = [];

  for (const finding of findings) {
    if (!shouldShowClaimCaveat(finding)) {
      continue;
    }

    const verdict = finding.evidenceClaimVerdict!;
    const message = claimCaveatMessage(verdict);
    if (!message || !text.includes(finding.spanText)) {
      continue;
    }

    caveats.push({
      id: finding.id,
      spanText: finding.spanText,
      verdict,
      message,
    });
  }

  return caveats;
}

export function hasOpenNonCaveatedFindings(findings: Finding[]): boolean {
  return findings.some(
    (finding) => finding.status === "open" && !shouldShowClaimCaveat(finding),
  );
}
