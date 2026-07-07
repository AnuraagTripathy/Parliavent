import type { Finding, NeedsEvidenceNote, ReviewFindingChip } from "./types";
import { buildClaimCaveatsFromFindings, shouldShowClaimCaveat } from "./claimCaveats";
import { citationsFromFindings, sourcesFromFindings } from "./citationsFromFindings";
import type { ClaimCaveat, Citation, Source } from "./types";

export type { NeedsEvidenceNote, ReviewFindingChip };

export function isNeedsEvidenceFinding(finding: Finding): boolean {
  if (finding.type !== "claim") return false;
  if (finding.status === "source_attached") return false;
  if (
    finding.status === "resolved" ||
    finding.status === "marked_opinion" ||
    finding.status === "disputed"
  ) {
    return false;
  }
  if (finding.evidenceClaimVerdict) return false;
  if (claimFindingReadsAsClarity(finding)) return false;
  return finding.status === "open" || finding.status === "ignored";
}

const CLARITY_MISLABELED_CLAIM_PATTERNS = [
  /\bdefine\b/i,
  /\bvague\b/i,
  /\bunclear\b/i,
  /\bclarif/i,
  /\bclearer (link|wording|threshold)\b/i,
  /\binterpreted differently\b/i,
  /\bspeculative\b/i,
  /\banecdote/i,
  /\bhypothet/i,
  /\bdramatic scenario\b/i,
  /\bscenario (needs|may not)\b/i,
  /\bmay not be universally\b/i,
  /\bwhat counts as\b/i,
  /\bwhat (do you|does .+) mean\b/i,
  /\bspell out\b/i,
  /\bthreshold\b/i,
  /\bneeds evidence or a clearer\b/i,
  /\boverstated certainty\b/i,
  /\bimprecise\b/i,
];

export function claimFindingReadsAsClarity(finding: Finding): boolean {
  if (finding.type !== "claim") return false;
  const haystack = `${finding.title} ${finding.reason} ${finding.subtitle ?? ""}`;
  return CLARITY_MISLABELED_CLAIM_PATTERNS.some((pattern) =>
    pattern.test(haystack),
  );
}

function clarityNoteFromFinding(finding: Finding): ReviewFindingChip {
  const title = finding.title.replace(
    /^this needs evidence or a clearer link$/i,
    "Clarify the link to your conclusion",
  );
  return {
    id: finding.id,
    type: "clarity",
    spanText: finding.spanText,
    title,
    reason: finding.reason,
    subtitle: finding.subtitle,
  };
}

export function buildNeedsEvidenceNotes(
  findings: Finding[],
): NeedsEvidenceNote[] {
  return findings
    .filter((f) => isNeedsEvidenceFinding(f))
    .map((f) => ({
      id: f.id,
      spanText: f.spanText,
      title: f.title,
      reason: f.reason,
    }));
}

export function buildOpenFallacyChips(
  findings: Finding[],
): ReviewFindingChip[] {
  return findings
    .filter((f) => f.type === "fallacy" && f.status === "open")
    .map((f) => ({
      id: f.id,
      type: f.type,
      spanText: f.spanText,
      title: f.title,
      reason: f.reason,
      subtitle: f.subtitle,
    }));
}

function clarityChipIsLowValue(chip: ReviewFindingChip): boolean {
  const haystack = `${chip.title} ${chip.reason} ${chip.subtitle ?? ""}`;
  return LOW_VALUE_CLARITY_PATTERNS.some((pattern) => pattern.test(haystack));
}

export function buildOpenClarityNotes(
  findings: Finding[],
): ReviewFindingChip[] {
  const chips = findings
    .filter((finding) => {
      if (finding.type === "clarity" && finding.status === "open") {
        return shouldShowPublishedClarityFinding(finding);
      }
      if (
        finding.type === "claim" &&
        finding.status === "open" &&
        claimFindingReadsAsClarity(finding)
      ) {
        return true;
      }
      return false;
    })
    .map((finding) =>
      finding.type === "clarity"
        ? {
            id: finding.id,
            type: finding.type,
            spanText: finding.spanText,
            title: finding.title,
            reason: finding.reason,
            subtitle: finding.subtitle,
          }
        : clarityNoteFromFinding(finding),
    )
    .filter((chip) => !clarityChipIsLowValue(chip));

  const bySpan = new Map<string, ReviewFindingChip>();
  for (const chip of chips) {
    const key = chip.spanText.trim().toLowerCase();
    if (!bySpan.has(key)) {
      bySpan.set(key, chip);
    }
  }

  const fallacySpans = findings
    .filter((finding) => finding.type === "fallacy")
    .map((finding) => finding.spanText.trim().toLowerCase())
    .filter(Boolean);

  return [...bySpan.values()].filter((chip) => {
    const span = chip.spanText.trim().toLowerCase();
    if (!span) return true;
    return !fallacySpans.some(
      (fallacySpan) =>
        span === fallacySpan ||
        span.includes(fallacySpan) ||
        fallacySpan.includes(span),
    );
  });
}

const LOW_VALUE_CLARITY_PATTERNS = [
  /consider (more )?specific/i,
  /consider (more )?precise/i,
  /consider clearer wording/i,
  /more specific wording/i,
  /minor phrasing/i,
  /wording suggestion/i,
];

const HIGH_VALUE_CLARITY_PATTERNS = [
  /off[- ]?topic/i,
  /\brelevance\b/i,
  /unclear (connection|relation)/i,
  /unclear relation/i,
  /relation to (the )?(motion|parent)/i,
  /missing context/i,
  /ambiguous argument/i,
  /hard to follow/i,
  /doesn'?t address/i,
  /not (clearly )?related/i,
  /connection to the (motion|debate)/i,
  /\bdefine\b/i,
  /\bwhat counts as\b/i,
  /\bvague\b/i,
  /\bspeculative\b/i,
];

const CONVERSATIONAL_ACK =
  /^(that'?s fair|fair point|agreed|i see|good point|true enough)/i;

export function shouldShowPublishedClarityFinding(finding: Finding): boolean {
  if (finding.type !== "clarity") return false;

  const span = finding.spanText?.trim() ?? "";
  if (span.length > 0 && span.length < 36 && CONVERSATIONAL_ACK.test(span)) {
    return false;
  }

  const haystack = `${finding.title} ${finding.reason} ${finding.subtitle ?? ""}`;

  if (LOW_VALUE_CLARITY_PATTERNS.some((pattern) => pattern.test(haystack))) {
    return false;
  }

  if (HIGH_VALUE_CLARITY_PATTERNS.some((pattern) => pattern.test(haystack))) {
    return true;
  }

  if (finding.confidence) {
    const pct = Number.parseFloat(finding.confidence.replace("%", "").trim());
    if (Number.isFinite(pct) && pct >= 75) return true;
  }

  return false;
}

export function buildContestedReasoningChips(
  findings: Finding[],
): ReviewFindingChip[] {
  return findings
    .filter(
      (f) =>
        f.type === "fallacy" &&
        (f.status === "open" || f.status === "disputed"),
    )
    .map((f) => ({
      id: f.id,
      type: f.type,
      spanText: f.spanText,
      title: f.title,
      reason: f.reason,
      subtitle: f.subtitle,
    }));
}

export function buildPublishedReviewFromFindings(
  findings: Finding[],
): {
  sources: Source[];
  citations: Citation[];
  claimCaveats: ClaimCaveat[];
  needsEvidence: NeedsEvidenceNote[];
  reviewFallacies: ReviewFindingChip[];
  reviewClarity: ReviewFindingChip[];
  contestedReasoning: ReviewFindingChip[];
  contestedFallacies: string[];
} {
  const claimCaveats = buildClaimCaveatsFromFindings(findings);
  const needsEvidence = buildNeedsEvidenceNotes(findings);
  const reviewFallacies = buildOpenFallacyChips(findings);
  const reviewClarity = buildOpenClarityNotes(findings);
  const contestedReasoning = buildContestedReasoningChips(findings);
  const contestedFallacies = contestedReasoning
    .map((f) => f.subtitle)
    .filter((name): name is string => Boolean(name));

  return {
    sources: sourcesFromFindings(findings),
    citations: citationsFromFindings(findings),
    claimCaveats,
    needsEvidence,
    reviewFallacies,
    reviewClarity,
    contestedReasoning,
    contestedFallacies,
  };
}

export function hasOpenNonCaveatedFindings(findings: Finding[]): boolean {
  return findings.some((finding) => {
    if (finding.status !== "open") return false;
    if (shouldShowClaimCaveat(finding)) return false;
    if (isNeedsEvidenceFinding(finding)) return false;
    if (finding.type === "fallacy" || finding.type === "clarity") return false;
    return true;
  });
}
