import { runDeepInvestigation } from "@/lib/evidence/deepInvestigation";
import {
  mergeRouterIntoResponse,
  routeEvidence,
} from "@/lib/evidence/evidenceRouter";
import {
  searchEvidence,
  type EvidencePipelineStage,
} from "@/lib/evidence/searchEvidence";
import type {
  DeepInvestigationStage,
  EvidenceSearchMode,
  EvidenceSearchResponse,
} from "@/lib/types";

export type EvidenceEngineStage = EvidencePipelineStage | DeepInvestigationStage;

function normalizeMode(mode?: string): EvidenceSearchMode {
  if (mode === "deep" || mode === "agent") return "deep";
  if (mode === "pipeline") return "standard";
  return mode === "standard" ? "standard" : "standard";
}

async function runStandardWithRouter(params: {
  claim: string;
  argumentText?: string;
  threadId?: string;
  onStage?: (stage: EvidenceEngineStage) => void | Promise<void>;
}): Promise<EvidenceSearchResponse> {
  await params.onStage?.("standard_pipeline");
  const baseline = await searchEvidence({
    claim: params.claim,
    argumentText: params.argumentText,
    threadId: params.threadId,
    onStage: params.onStage as ((stage: EvidencePipelineStage) => void) | undefined,
  });

  await params.onStage?.("routing_evidence");
  const router = routeEvidence(params.claim, baseline);
  return mergeRouterIntoResponse(
    { ...baseline, evidenceMode: "standard" },
    router,
  );
}

export async function searchEvidenceWithMode(params: {
  claim: string;
  argumentText?: string;
  threadId?: string;
  mode?: EvidenceSearchMode | "pipeline" | "agent";
  autoEscalate?: boolean;
  onStage?: (stage: EvidenceEngineStage) => void | Promise<void>;
}): Promise<EvidenceSearchResponse> {
  const mode = normalizeMode(params.mode);

  if (mode === "deep") {
    await params.onStage?.("deep_classification");
    const result = await runDeepInvestigation({
      claim: params.claim,
      argumentText: params.argumentText,
      threadId: params.threadId,
      onStage: params.onStage,
    });
    return {
      ...result,
      evidenceMode: "deep",
      deepInvestigationAvailable: false,
      shouldEscalate: false,
    };
  }

  const standard = await runStandardWithRouter(params);

  if (!params.autoEscalate || !standard.shouldEscalate) {
    return standard;
  }

  await params.onStage?.("deep_classification");
  const deep = await runDeepInvestigation({
    claim: params.claim,
    argumentText: params.argumentText,
    threadId: params.threadId,
    baseline: standard,
    onStage: params.onStage,
  });

  return {
    ...deep,
    evidenceMode: "auto_escalated",
    shouldEscalate: true,
    escalationReason: standard.escalationReason,
    escalationSignals: standard.escalationSignals,
    deepInvestigationAvailable: false,
  };
}
