import type { Finding } from "./types";

export const MOTION =
  "Should cities ban cars from downtown areas?";

export const SEED_ARGUMENT =
  "Cities need to ban cars downtown. Every time I go there's traffic, honking, and someone almost gets hit. If we don't ban cars now, downtowns will become unlivable death zones. Europe does it and their cities are way nicer.";

export const SEED_RESPONSE =
  "Partial bans sound reasonable, but American downtowns were built around the car. Congestion pricing keeps access for deliveries and emergency vehicles while still cutting traffic — a full ban removes that flexibility.";

const MOCK_FINDING_TEMPLATES: Finding[] = [
  {
    id: "finding-clarity-1",
    type: "clarity",
    status: "open",
    spanText: "unlivable death zones",
    title: "This reads as venting",
    reason:
      "Naming a concrete risk lands harder than a phrase readers may discount.",
    suggestedRewrite:
      "downtowns will keep getting more dangerous for people on foot",
  },
  {
    id: "finding-claim-1",
    type: "claim",
    status: "open",
    spanText: "Europe does it and their cities are way nicer",
    title: "This needs a source",
    reason: "A reader can wave this off without evidence behind it.",
  },
  {
    id: "finding-fallacy-1",
    type: "fallacy",
    status: "open",
    spanText:
      "If we don't ban cars now, downtowns will become unlivable death zones",
    title: "This offers only two extremes",
    subtitle: "False dilemma",
    reason:
      "Ban now or disaster are not the only options. Congestion pricing, better transit, and partial bans sit in between.",
    confidence: "82%",
    example: '"Either we ban all phones in school or students will never learn."',
    suggestedRewrite:
      "Without action on downtown traffic, conditions for pedestrians may keep getting worse.",
  },
];

/** Static templates used by the seed demo and tests. */
export const MOCK_FINDINGS: Finding[] = MOCK_FINDING_TEMPLATES;

/**
 * Return mock findings whose span text appears in the argument.
 * Always returns fresh open findings — caller merges user resolution state.
 */
export function judgeText(text: string): Finding[] {
  return MOCK_FINDING_TEMPLATES.filter((finding) =>
    text.includes(finding.spanText),
  ).map((finding) => ({
    ...finding,
    status: "open" as const,
    selectedSourceId: undefined,
    disputeReason: undefined,
  }));
}
