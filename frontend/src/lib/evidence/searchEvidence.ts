import { classifyClaimKind } from "@/lib/evidence/classifyClaimKind";
import { extractTextFromHtml } from "@/lib/evidence/extractText";
import { fetchPages } from "@/lib/evidence/pageFetcher";
import { rankPassagesForSources } from "@/lib/evidence/passageRanker";
import { planEvidenceQueries } from "@/lib/evidence/queryPlanner";
import {
  searchWithPlannedQueries,
  TavilyConfigError,
  TavilySearchError,
  type TavilySearchHit,
} from "@/lib/evidence/searchWithTavily";
import {
  filterTavilyResults,
  mapTavilyResultsToSources,
} from "@/lib/evidence/sourceUtils";
import {
  enforceAttachabilityForClaimVerdict,
  finalizeEvidenceSources,
} from "@/lib/evidence/sourceEligibility";
import { cleanEvidenceText } from "@/lib/evidence/cleanEvidenceText";
import { sortEvidenceSources } from "@/lib/evidence/sortEvidenceSources";
import {
  applyVerificationToSources,
  buildUnclearVerificationFallback,
} from "@/lib/evidence/verifySchema";
import { verifyEvidenceWithGroq } from "@/lib/evidence/verifyEvidenceWithGroq";
import type { EvidenceSearchResponse, EvidenceSource } from "@/lib/types";

export { TavilyConfigError, TavilySearchError };

export type EvidencePipelineStage =
  | "searching"
  | "fetching_pages"
  | "extracting_passages"
  | "ranking_passages"
  | "verifying";

type VerificationBasis = NonNullable<EvidenceSearchResponse["verificationBasis"]>;

interface SourceWithPassages extends EvidenceSource {
  evidencePassages?: string[];
}

function buildEmptyResponse(claim: string, summary: string): EvidenceSearchResponse {
  return {
    claim,
    claimKind: classifyClaimKind(claim),
    claimVerdict: "unclear",
    summary,
    sources: [],
  };
}

function mapHitsToSources(claim: string, hits: TavilySearchHit[]): EvidenceSource[] {
  const filtered = filterTavilyResults(hits);
  return finalizeEvidenceSources(mapTavilyResultsToSources(claim, filtered));
}

function computeVerificationBasis(
  sources: SourceWithPassages[],
): VerificationBasis {
  const withPassages = sources.filter(
    (source) => (source.evidencePassages?.length ?? 0) > 0,
  ).length;

  if (withPassages === 0) {
    return "snippets";
  }
  if (withPassages === sources.length) {
    return "passages";
  }
  return "mixed";
}

function collectResponsePassages(sources: SourceWithPassages[]): string[] {
  return sources.flatMap((source) => source.evidencePassages ?? []).slice(0, 10);
}

async function reportStage(
  onStage: ((stage: EvidencePipelineStage) => void | Promise<void>) | undefined,
  stage: EvidencePipelineStage,
): Promise<void> {
  if (!onStage) {
    return;
  }
  await onStage(stage);
}

export async function searchEvidence(params: {
  claim: string;
  argumentText?: string;
  threadId?: string;
  onStage?: (stage: EvidencePipelineStage) => void | Promise<void>;
}): Promise<EvidenceSearchResponse> {
  const plannedQueries = planEvidenceQueries(
    params.claim,
    params.argumentText,
    params.threadId,
  );

  await reportStage(params.onStage, "searching");
  const tavilyHits = await searchWithPlannedQueries(plannedQueries);
  const hitByUrl = new Map(tavilyHits.map((hit) => [hit.url, hit]));
  const baseSources = mapHitsToSources(params.claim, tavilyHits);

  if (baseSources.length === 0) {
    return buildEmptyResponse(
      params.claim,
      "No useful sources found after filtering low-quality results.",
    );
  }

  await reportStage(params.onStage, "fetching_pages");
  const fetchedPages = await fetchPages(baseSources.map((source) => source.url));

  await reportStage(params.onStage, "extracting_passages");
  const passageInputs = baseSources
    .map((source) => {
      const fetched = fetchedPages.get(source.url);
      if (!fetched?.html) {
        return null;
      }

      const extractedText = extractTextFromHtml(fetched.html);
      if (!extractedText) {
        return null;
      }

      const hit = hitByUrl.get(source.url);
      return {
        sourceId: source.id,
        claim: params.claim,
        sourceTitle: source.title,
        sourceSnippet: source.snippet,
        extractedText,
        foundViaContradiction: hit?.foundViaContradiction,
      };
    })
    .filter((input): input is NonNullable<typeof input> => input !== null);

  await reportStage(params.onStage, "ranking_passages");
  const rankedPassages = rankPassagesForSources(passageInputs);
  const sourcesWithPassages: SourceWithPassages[] = baseSources.map((source) => ({
    ...source,
    evidencePassages: (rankedPassages.get(source.id) ?? []).map(cleanEvidenceText),
  }));

  const verificationBasis = computeVerificationBasis(sourcesWithPassages);

  try {
    await reportStage(params.onStage, "verifying");
    const verified = await verifyEvidenceWithGroq({
      claim: params.claim,
      argumentText: params.argumentText,
      sources: sourcesWithPassages,
      verificationBasis,
    });

    const verifiedSources = enforceAttachabilityForClaimVerdict(
      applyVerificationToSources(sourcesWithPassages, verified),
      verified.claimVerdict,
    );

    return {
      claim: params.claim,
      claimKind: verified.claimKind,
      claimVerdict: verified.claimVerdict,
      summary: verified.summary,
      verificationBasis,
      evidencePassages: collectResponsePassages(sourcesWithPassages),
      sources: sortEvidenceSources(verifiedSources, verified.claimVerdict),
    };
  } catch (error) {
    console.error("[searchEvidence] verifier failed", error);
    const fallback = buildUnclearVerificationFallback(params.claim, baseSources);

    return {
      claim: params.claim,
      claimKind: fallback.claimKind,
      claimVerdict: fallback.claimVerdict,
      summary:
        verificationBasis === "snippets"
          ? fallback.summary
          : "Sources were found, but evidence could not be fully evaluated from the available page passages.",
      verificationBasis,
      evidencePassages: collectResponsePassages(sourcesWithPassages),
      sources: applyVerificationToSources(sourcesWithPassages, fallback),
    };
  }
}
