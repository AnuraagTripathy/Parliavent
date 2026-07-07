export type InvestigationClaimCategory =
  | "empirical"
  | "causal"
  | "numeric"
  | "timeline"
  | "policy"
  | "medical_scientific"
  | "broad_vague"
  | "opinion";

export interface InvestigationClassification {
  categories: InvestigationClaimCategory[];
  primaryCategory: InvestigationClaimCategory;
  publicSummary: string;
  searchStrategy: string;
  preferOfficialSources: boolean;
  needsContradictionSearch: boolean;
}

const MEDICAL_TERMS = [
  "cancer",
  "vaccine",
  "disease",
  "virus",
  "clinical",
  "medical",
  "health",
  "drug",
  "treatment",
  "symptom",
  "diagnosis",
  "microchip",
  "radiation",
  "phone",
  "5g",
];

const CAUSAL_PATTERNS = [
  /\bcause[sd]?\b/i,
  /\blead[s]?\s+to\b/i,
  /\bresult[s]?\s+in\b/i,
  /\bbecause\s+of\b/i,
  /\bdue\s+to\b/i,
  /\bmake[s]?\s+.+\s+(sick|ill|worse|better)\b/i,
];

const NUMERIC_PATTERN = /\d+(?:\.\d+)?%?/;
const TIMELINE_PATTERNS = [
  /\bwithin\s+\d+/i,
  /\b(in|over|after|before)\s+\d+\s+(day|week|month|year)/i,
  /\b\d{4}\b/,
  /\brecent\s+years?\b/i,
  /\blast\s+(year|decade|month)/i,
];

const POLICY_TERMS = [
  "policy",
  "pricing",
  "regulation",
  "law",
  "legislation",
  "congestion",
  "traffic",
  "zone",
  "ban",
  "mandate",
  "tax",
  "subsidy",
  "pedestrian",
  "low-traffic",
];

const OPINION_PATTERNS = [
  /\bi\s+think\b/i,
  /\bi\s+believe\b/i,
  /\bin\s+my\s+(view|opinion)\b/i,
  /\bway\s+nicer\b/i,
  /\bbetter\s+than\b/i,
  /\bworse\s+than\b/i,
];

const BROAD_VAGUE_PATTERNS = [
  /\b(always|never|everyone|everybody|all\s+cities)\b/i,
  /\bway\s+(nicer|better|worse)\b/i,
  /\b(europe|they|their)\b/i,
  /\bdoes\s+it\b/i,
  /\bstudies\s+prove\b/i,
];

function detectCategories(claim: string): InvestigationClaimCategory[] {
  const lower = claim.toLowerCase();
  const categories = new Set<InvestigationClaimCategory>();

  if (MEDICAL_TERMS.some((term) => lower.includes(term))) {
    categories.add("medical_scientific");
  }

  if (CAUSAL_PATTERNS.some((pattern) => pattern.test(claim))) {
    categories.add("causal");
  }

  if (NUMERIC_PATTERN.test(claim)) {
    categories.add("numeric");
  }

  if (TIMELINE_PATTERNS.some((pattern) => pattern.test(claim))) {
    categories.add("timeline");
  }

  if (POLICY_TERMS.some((term) => lower.includes(term))) {
    categories.add("policy");
  }

  if (OPINION_PATTERNS.some((pattern) => pattern.test(claim))) {
    categories.add("opinion");
  }

  if (BROAD_VAGUE_PATTERNS.some((pattern) => pattern.test(claim))) {
    categories.add("broad_vague");
  }

  if (categories.size === 0) {
    categories.add("empirical");
  }

  return [...categories];
}

function pickPrimaryCategory(
  categories: InvestigationClaimCategory[],
): InvestigationClaimCategory {
  const priority: InvestigationClaimCategory[] = [
    "medical_scientific",
    "causal",
    "numeric",
    "timeline",
    "policy",
    "broad_vague",
    "opinion",
    "empirical",
  ];

  for (const category of priority) {
    if (categories.includes(category)) {
      return category;
    }
  }

  return "empirical";
}

function buildPublicSummary(
  categories: InvestigationClaimCategory[],
  primary: InvestigationClaimCategory,
): string {
  const labels: Record<InvestigationClaimCategory, string> = {
    empirical: "empirical factual",
    causal: "causal",
    numeric: "numeric",
    timeline: "timeline",
    policy: "policy",
    medical_scientific: "medical/scientific",
    broad_vague: "broad or vague",
    opinion: "opinion-like",
  };

  const primaryLabel = labels[primary];
  const extras = categories
    .filter((category) => category !== primary)
    .map((category) => labels[category]);

  if (extras.length === 0) {
    return `Classified as ${primaryLabel} claim`;
  }

  return `Classified as ${primaryLabel} claim (${extras.join(", ")})`;
}

function buildSearchStrategy(primary: InvestigationClaimCategory): string {
  switch (primary) {
    case "medical_scientific":
      return "Prefer official health organizations and peer-reviewed sources; search for causation evidence and debunks.";
    case "causal":
      return "Require causal evidence, not mere correlation or topic overlap; include contradiction search.";
    case "numeric":
      return "Search for the exact number, unit, and timeframe; verify precision in source passages.";
    case "timeline":
      return "Search for dated events and explicit timeframes matching the claim.";
    case "policy":
      return "Search official government and municipal sources plus recent policy reporting.";
    case "broad_vague":
      return "Treat as likely too broad unless sources support a narrower, testable version.";
    case "opinion":
      return "Look for factual sub-claims; opinion framing may limit attachable support.";
    default:
      return "Search for direct evidence addressing the exact claim wording.";
  }
}

export function classifyInvestigationClaim(claim: string): InvestigationClassification {
  const categories = detectCategories(claim);
  const primaryCategory = pickPrimaryCategory(categories);

  const needsContradictionSearch =
    categories.includes("causal") ||
    categories.includes("medical_scientific") ||
    categories.includes("numeric") ||
    /\bprove[sd]?\b/i.test(claim) ||
    /\bcontain[s]?\b/i.test(claim);

  const preferOfficialSources =
    categories.includes("medical_scientific") ||
    categories.includes("policy") ||
    categories.includes("timeline");

  return {
    categories,
    primaryCategory,
    publicSummary: buildPublicSummary(categories, primaryCategory),
    searchStrategy: buildSearchStrategy(primaryCategory),
    preferOfficialSources,
    needsContradictionSearch,
  };
}

export function buildInitialSearchQueries(
  claim: string,
  classification: InvestigationClassification,
): string[] {
  const queries: string[] = [claim];

  if (classification.needsContradictionSearch) {
    queries.push(`${claim} evidence against debunk myth`);
  }

  if (classification.preferOfficialSources) {
    queries.push(`${claim} site:gov OR site:who.int OR site:edu official`);
  }

  if (classification.categories.includes("numeric")) {
    const numbers = claim.match(/\d+(?:\.\d+)?%?/g) ?? [];
    if (numbers.length > 0) {
      queries.push(`${claim} ${numbers.join(" ")} study data`);
    }
  }

  return [...new Set(queries)].slice(0, 3);
}
