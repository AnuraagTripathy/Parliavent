import type { FindingType, JudgePostType, JudgeUserStance } from "@/lib/types";

export interface JudgeEvalContext {
  motion?: string;
  postType?: JudgePostType;
  parentArgument?: string;
  threadSummary?: string;
  userStance?: JudgeUserStance;
}

export interface JudgeEvalCase {
  id: string;
  label: string;
  text: string;
  context?: JudgeEvalContext;
  expected: {
    minFindings: number;
    maxFindings: number;
    /** At least one finding should match each listed type (when findings > 0). */
    shouldIncludeTypes?: FindingType[];
    /** No finding should use these types. */
    shouldNotIncludeTypes?: FindingType[];
    notes: string[];
  };
}

/**
 * Manual QA cases for the Groq judge prompt.
 * Run with USE_MOCK_JUDGE=false and compare panel output to expected notes.
 */
export const JUDGE_EVAL_CASES: JudgeEvalCase[] = [
  {
    id: "eval-ad-hominem-and-collapse",
    label: "Ad hominem + unsupported causal collapse",
    text: "Everyone who supports remote work is just lazy. If companies don't force everyone back into the office, productivity will collapse and the economy will fall apart.",
    expected: {
      minFindings: 1,
      maxFindings: 3,
      shouldIncludeTypes: ["fallacy", "claim"],
      notes: [
        "Should flag the personal attack (ad hominem or similar fallacy / clarity — not claim-needs-evidence).",
        "Should flag productivity/economy collapse as an unsupported causal claim.",
        "Total findings should stay around 2–3, not an exhaustive list.",
      ],
    },
  },
  {
    id: "eval-empirical-overclaim",
    label: "Specific empirical overclaim",
    text: "Studies prove congestion pricing always cuts emissions by 40% within one year.",
    expected: {
      minFindings: 1,
      maxFindings: 2,
      shouldIncludeTypes: ["claim"],
      notes: [
        "Should return a claim finding for the specific statistic and certainty.",
        "One finding is enough; do not over-flag.",
      ],
    },
  },
  {
    id: "eval-cautious-policy",
    label: "Cautious policy judgment",
    text: "Partial bans may work better than full bans if deliveries still need access.",
    expected: {
      minFindings: 0,
      maxFindings: 1,
      shouldNotIncludeTypes: ["claim"],
      notes: [
        "Should return 0 findings, or at most one light clarity finding.",
        "Must NOT be flagged as claim-needs-evidence.",
      ],
    },
  },
  {
    id: "eval-loaded-attribution",
    label: "Loaded attribution / too absolute",
    text: "Anyone who opposes this clearly doesn't care about pedestrians at all.",
    expected: {
      minFindings: 1,
      maxFindings: 2,
      shouldIncludeTypes: ["clarity"],
      notes: [
        "Should flag as clarity, loaded attribution, or overly absolute wording.",
        "Should NOT be labeled as false dilemma or another unrelated fallacy.",
        "A fallacy finding is acceptable only if the subtitle clearly fits (e.g. ad hominem) — not false dichotomy.",
      ],
    },
  },
  {
    id: "eval-irrelevant-starter",
    label: "Irrelevant starter (math tangent)",
    text: "99 + 1 can literally never be said to be 100",
    context: {
      motion: "Should cities ban cars from downtown areas?",
      postType: "starter",
      userStance: "unknown",
    },
    expected: {
      minFindings: 1,
      maxFindings: 2,
      shouldIncludeTypes: ["clarity"],
      shouldNotIncludeTypes: ["claim", "fallacy"],
      notes: [
        "Should return a clarity finding for unclear relevance to the motion.",
        "Must NOT be flagged as claim or fallacy.",
      ],
    },
  },
  {
    id: "eval-relevant-reply",
    label: "Relevant conditional reply",
    text: "That only works if transit is already good enough to replace car trips.",
    context: {
      motion: "Should cities ban cars from downtown areas?",
      postType: "reply",
      parentArgument:
        "European cities reduced car access and became more walkable.",
      userStance: "unknown",
    },
    expected: {
      minFindings: 0,
      maxFindings: 1,
      shouldNotIncludeTypes: ["clarity"],
      notes: [
        "Should treat this as a relevant reply to the parent argument.",
        "Must NOT flag unclear relevance (clarity).",
        "May return a claim finding in formal_motion mode only — not expected in structured_debate.",
      ],
    },
  },
  {
    id: "eval-relevant-factual-starter",
    label: "Relevant factual starter (Paris example)",
    text: "Paris has expanded low-traffic and pedestrian-friendly zones in recent years.",
    context: {
      motion: "Should cities ban cars from downtown areas?",
      postType: "starter",
      userStance: "unknown",
    },
    expected: {
      minFindings: 0,
      maxFindings: 1,
      shouldNotIncludeTypes: ["clarity"],
      notes: [
        "Should treat this as relevant to the motion — a factual example about urban car restrictions.",
        "May ask for a source (claim finding) but must NOT flag unclear relevance.",
      ],
    },
  },
];
