import { classifyClaimKind } from "@/lib/evidence/classifyClaimKind";
import {
  searchWithTavily,
  TavilyConfigError,
  TavilySearchError,
} from "@/lib/evidence/searchWithTavily";
import {
  filterTavilyResults,
  mapTavilyResultsToSources,
} from "@/lib/evidence/sourceUtils";
import { finalizeEvidenceSources } from "@/lib/evidence/sourceEligibility";
import {
  applyVerificationToSources,
  buildUnclearVerificationFallback,
} from "@/lib/evidence/verifySchema";
import { verifyEvidenceWithGroq } from "@/lib/evidence/verifyEvidenceWithGroq";
import type { EvidenceSearchResponse } from "@/lib/types";

export { TavilyConfigError, TavilySearchError };

function buildEmptyResponse(claim: string, summary: string): EvidenceSearchResponse {
  return {
    claim,
    claimKind: classifyClaimKind(claim),
    claimVerdict: "unclear",
    summary,
    sources: [],
  };
}

export async function searchEvidence(params: {
  claim: string;
  argumentText?: string;
  threadId?: string;
}): Promise<EvidenceSearchResponse> {
  const tavilyResults = await searchWithTavily({
    claim: params.claim,
    argumentText: params.argumentText,
    threadId: params.threadId,
  });

  const filteredResults = filterTavilyResults(tavilyResults);
  const baseSources = finalizeEvidenceSources(
    mapTavilyResultsToSources(params.claim, filteredResults),
  );

  if (baseSources.length === 0) {
    return buildEmptyResponse(
      params.claim,
      "No useful sources found after filtering low-quality results.",
    );
  }

  try {
    const verified = await verifyEvidenceWithGroq({
      claim: params.claim,
      argumentText: params.argumentText,
      sources: baseSources,
    });

    return {
      claim: params.claim,
      claimKind: verified.claimKind,
      claimVerdict: verified.claimVerdict,
      summary: verified.summary,
      sources: applyVerificationToSources(baseSources, verified),
    };
  } catch (error) {
    console.error("[searchEvidence] verifier failed", error);
    const fallback = buildUnclearVerificationFallback(params.claim, baseSources);

    return {
      claim: params.claim,
      claimKind: fallback.claimKind,
      claimVerdict: fallback.claimVerdict,
      summary: fallback.summary,
      sources: applyVerificationToSources(baseSources, fallback),
    };
  }
}
