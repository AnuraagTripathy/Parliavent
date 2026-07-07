import { cleanEvidenceText } from "@/lib/evidence/cleanEvidenceText";
import { extractTextFromHtml } from "@/lib/evidence/extractText";
import { fetchSinglePage } from "@/lib/evidence/pageFetcher";
import { rankPassagesForSources } from "@/lib/evidence/passageRanker";
import {
  enforceAttachabilityForClaimVerdict,
  finalizeEvidenceSource,
} from "@/lib/evidence/sourceEligibility";
import {
  assessCredibility,
  extractPublisher,
  filterTavilyResults,
  normalizeSourceUrl,
  type TavilySearchResult,
} from "@/lib/evidence/sourceUtils";
import { sortEvidenceSources } from "@/lib/evidence/sortEvidenceSources";
import {
  applyVerificationToSources,
  buildUnclearVerificationFallback,
} from "@/lib/evidence/verifySchema";
import { verifyEvidenceWithGroq } from "@/lib/evidence/verifyEvidenceWithGroq";
import { searchTavilyQuery } from "@/lib/evidence/searchWithTavily";
import {
  buildInitialSearchQueries,
  classifyInvestigationClaim,
} from "@/lib/evidence/agent/classifyInvestigationClaim";
import type {
  AgentTraceStep,
  DeepInvestigationStage,
  EvidenceSearchResponse,
} from "@/lib/types";
import type { EvidenceSource } from "@/lib/types";

const MAX_FOLLOW_UP_SEARCHES = 2;
const MAX_ADDITIONAL_FETCHES = 3;

export interface DeepInvestigationParams {
  claim: string;
  argumentText?: string;
  threadId?: string;
  baseline?: EvidenceSearchResponse;
  onStage?: (stage: DeepInvestigationStage) => void | Promise<void>;
}

function appendTrace(
  trace: AgentTraceStep[],
  stage: AgentTraceStep["stage"],
  summary: string,
): void {
  trace.push({ step: trace.length + 1, stage, summary });
}

function mapHitToSource(result: TavilySearchResult, index: number): EvidenceSource {
  return finalizeEvidenceSource({
    id: `deep-${index}-${normalizeSourceUrl(result.url).replace(/[^\w-]/g, "-").slice(0, 32)}`,
    title: cleanEvidenceText(result.title.trim()) || "Untitled source",
    publisher: extractPublisher(result.url),
    url: result.url,
    snippet: cleanEvidenceText(result.content.trim()),
    supportLevel: "unclear",
    credibility: assessCredibility(result.url),
  });
}

function mergeSources(
  baseline: EvidenceSource[],
  additional: EvidenceSource[],
): EvidenceSource[] {
  const merged = new Map<string, EvidenceSource>();
  for (const source of [...baseline, ...additional]) {
    const key = normalizeSourceUrl(source.url);
    if (!merged.has(key)) {
      merged.set(key, source);
    }
  }
  return [...merged.values()].slice(0, 8);
}

function buildFollowUpQueries(claim: string): string[] {
  const classification = classifyInvestigationClaim(claim);
  const queries = buildInitialSearchQueries(claim, classification);

  const numbers = claim.match(/\d+(?:\.\d+)?%?/g) ?? [];
  if (numbers.length > 0) {
    queries.push(`${claim} ${numbers.join(" ")} official data study`);
  }

  if (classification.preferOfficialSources) {
    queries.push(`${claim} site:gov OR site:edu official report`);
  }

  return [...new Set(queries)].slice(0, MAX_FOLLOW_UP_SEARCHES + 1);
}

function collectPassages(sources: EvidenceSource[]): string[] {
  return sources.flatMap((source) => source.evidencePassages ?? []).slice(0, 10);
}

function computeVerificationBasis(
  sources: EvidenceSource[],
): "passages" | "snippets" | "mixed" {
  const withPassages = sources.filter(
    (source) => (source.evidencePassages?.length ?? 0) > 0,
  ).length;
  if (withPassages === 0) return "snippets";
  if (withPassages === sources.length) return "passages";
  return "mixed";
}

/**
 * Bounded Deep Investigation v1 — targeted follow-up, not a free-form agent.
 */
export async function runDeepInvestigation(
  params: DeepInvestigationParams,
): Promise<EvidenceSearchResponse> {
  const trace: AgentTraceStep[] = [];
  const classification = classifyInvestigationClaim(params.claim);
  const baselineSources = params.baseline?.sources ?? [];

  await params.onStage?.("deep_classification");
  appendTrace(
    trace,
    "classification",
    `Classified claim as ${classification.categories.join(", ").replace(/_/g, " ")}.`,
  );

  let sources = [...baselineSources];
  let followUpCount = 0;
  let additionalFetches = 0;
  const fetchedText = new Map<string, string>();

  await params.onStage?.("deep_follow_up_search");
  const followUpQueries = buildFollowUpQueries(params.claim);

  for (const query of followUpQueries) {
    if (followUpCount >= MAX_FOLLOW_UP_SEARCHES) {
      break;
    }

    const hits = filterTavilyResults(await searchTavilyQuery(query));
    const newSources = hits.map((hit, index) =>
      mapHitToSource(hit, sources.length + index),
    );
    sources = mergeSources(sources, newSources);
    followUpCount += 1;

    appendTrace(
      trace,
      "follow_up_search",
      `Searched for targeted evidence: "${query.slice(0, 100)}".`,
    );
  }

  await params.onStage?.("deep_source_review");

  const prioritySources = [...sources].sort((a, b) => {
    const credRank = { high: 0, medium: 1, low: 2 };
    return credRank[a.credibility] - credRank[b.credibility];
  });

  for (const source of prioritySources) {
    if (additionalFetches >= MAX_ADDITIONAL_FETCHES) {
      break;
    }
    if (fetchedText.has(source.url)) {
      continue;
    }

    const fetched = await fetchSinglePage(source.url);
    additionalFetches += 1;

    if (!fetched.html) {
      continue;
    }

    const text = extractTextFromHtml(fetched.html);
    if (!text) {
      continue;
    }

    fetchedText.set(source.url, text);

    try {
      const host = new URL(source.url).hostname.replace(/^www\./, "");
      appendTrace(trace, "source_review", `Read ${host} for closer review.`);
    } catch {
      appendTrace(trace, "source_review", "Read an additional source page.");
    }
  }

  const passageInputs = sources
    .map((source) => {
      const text = fetchedText.get(source.url);
      if (!text) {
        return null;
      }
      return {
        sourceId: source.id,
        claim: params.claim,
        sourceTitle: source.title,
        sourceSnippet: source.snippet,
        extractedText: text,
      };
    })
    .filter((input): input is NonNullable<typeof input> => input !== null);

  const ranked = rankPassagesForSources(passageInputs);
  sources = sources.map((source) => ({
    ...source,
    evidencePassages: (ranked.get(source.id) ?? source.evidencePassages ?? []).map(
      cleanEvidenceText,
    ),
  }));

  if (passageInputs.length === 0 && sources.length > 0) {
    appendTrace(
      trace,
      "source_review",
      "Reviewed available snippets; page text was limited.",
    );
  }

  const verificationBasis = computeVerificationBasis(sources);

  await params.onStage?.("deep_verification");

  let result: EvidenceSearchResponse;

  try {
    const verified = await verifyEvidenceWithGroq({
      claim: params.claim,
      argumentText: params.argumentText,
      sources,
      verificationBasis,
    });

    const verifiedSources = enforceAttachabilityForClaimVerdict(
      applyVerificationToSources(sources, verified),
      verified.claimVerdict,
    );

    result = {
      claim: params.claim,
      claimKind: verified.claimKind,
      claimVerdict: verified.claimVerdict,
      summary: verified.summary,
      verificationBasis,
      evidencePassages: collectPassages(sources),
      sources: sortEvidenceSources(verifiedSources, verified.claimVerdict),
    };
  } catch (error) {
    console.error("[runDeepInvestigation] verifier failed", error);
    const fallback = buildUnclearVerificationFallback(params.claim, sources);
    result = {
      claim: params.claim,
      claimKind: fallback.claimKind,
      claimVerdict: fallback.claimVerdict,
      summary:
        "Deep investigation found sources but could not fully verify the claim.",
      verificationBasis,
      evidencePassages: collectPassages(sources),
      sources: applyVerificationToSources(sources, fallback),
    };
  }

  appendTrace(
    trace,
    "verdict",
    `Final verdict: ${result.claimVerdict.replace(/_/g, " ")}.`,
  );

  return {
    ...result,
    investigationTrace: trace,
  };
}
