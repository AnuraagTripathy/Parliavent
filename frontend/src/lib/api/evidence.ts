import type {
  ClaimKind,
  ClaimVerdict,
  EvidenceJobCreateRequest,
  EvidenceJobCreateResponse,
  EvidenceJobPollResponse,
  EvidenceJobStage,
  EvidenceSearchMode,
  EvidenceSearchRequest,
  EvidenceSearchResponse,
  EvidenceSource,
  SupportLevel,
} from "@/lib/types";

export const EVIDENCE_ERROR_MESSAGE =
  "Couldn't search sources. Your draft is safe.";

export const EVIDENCE_JOB_FAILED_MESSAGE = "Evidence search failed.";

/** Give up polling a job after this long — a stuck job must not spin forever. */
export const EVIDENCE_JOB_MAX_WAIT_MS = 3 * 60 * 1000;

export const EVIDENCE_STAGE_COPY: Record<EvidenceJobStage, string> = {
  queued: "Preparing evidence search...",
  standard_pipeline: "Running standard evidence check...",
  searching: "Searching for sources...",
  fetching_pages: "Reading source pages...",
  extracting_passages: "Extracting relevant text...",
  ranking_passages: "Ranking evidence passages...",
  verifying: "Checking whether sources support the claim...",
  routing_evidence: "Reviewing whether deeper investigation is needed...",
  deep_classification: "Classifying claim for deep investigation...",
  deep_follow_up_search: "Running targeted follow-up search...",
  deep_source_review: "Reviewing additional sources...",
  deep_verification: "Verifying evidence from deep investigation...",
  completed: "Evidence review complete.",
  failed: "Evidence search failed.",
};

export const EVIDENCE_EMPTY_MESSAGE =
  "No useful sources found. Try narrowing the claim.";

export const EVIDENCE_UNSUPPORTED_WARNING =
  "These sources do not appear to support the claim.";

export const KEEP_AS_IS_CAVEAT_HINT =
  "Keeping this claim will post with a caveat that it lacks supporting evidence.";

const CLAIM_VERDICTS = new Set<ClaimVerdict>([
  "supported",
  "partially_supported",
  "contradicted",
  "unsupported",
  "too_broad",
  "unclear",
]);

const CLAIM_KINDS = new Set<ClaimKind>([
  "factual",
  "opinion",
  "mixed",
  "unclear",
]);

const SUPPORT_LEVELS = new Set<SupportLevel>([
  "supports",
  "partially_supports",
  "contradicts",
  "related_only",
  "unclear",
]);

function isValidEvidenceSource(value: unknown): value is EvidenceSource {
  if (!value || typeof value !== "object") return false;

  const source = value as EvidenceSource;
  return (
    typeof source.id === "string" &&
    typeof source.title === "string" &&
    typeof source.publisher === "string" &&
    typeof source.url === "string" &&
    typeof source.snippet === "string" &&
    typeof source.supportLevel === "string" &&
    SUPPORT_LEVELS.has(source.supportLevel) &&
    typeof source.credibility === "string" &&
    (source.credibility === "high" ||
      source.credibility === "medium" ||
      source.credibility === "low") &&
    typeof source.canAttachAsSupport === "boolean"
  );
}

function isValidEvidenceResponse(data: unknown): data is EvidenceSearchResponse {
  if (!data || typeof data !== "object") return false;

  const response = data as EvidenceSearchResponse;
  return (
    typeof response.claim === "string" &&
    typeof response.summary === "string" &&
    typeof response.claimKind === "string" &&
    CLAIM_KINDS.has(response.claimKind) &&
    typeof response.claimVerdict === "string" &&
    CLAIM_VERDICTS.has(response.claimVerdict) &&
    Array.isArray(response.sources) &&
    response.sources.every(isValidEvidenceSource)
  );
}

export async function fetchEvidenceSearch(
  params: EvidenceSearchRequest,
  signal?: AbortSignal,
): Promise<EvidenceSearchResponse> {
  const response = await fetch("/api/evidence/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Evidence search failed (${response.status})`);
  }

  const data: unknown = await response.json();

  if (!isValidEvidenceResponse(data)) {
    throw new Error("Invalid evidence search response");
  }

  return data;
}

const JOB_STATUSES = new Set(["queued", "running", "completed", "failed"]);
const JOB_STAGES = new Set([
  "queued",
  "standard_pipeline",
  "searching",
  "fetching_pages",
  "extracting_passages",
  "ranking_passages",
  "verifying",
  "routing_evidence",
  "deep_classification",
  "deep_follow_up_search",
  "deep_source_review",
  "deep_verification",
  "completed",
  "failed",
]);

function isValidJobPollResponse(data: unknown): data is EvidenceJobPollResponse {
  if (!data || typeof data !== "object") return false;

  const job = data as EvidenceJobPollResponse;
  return (
    typeof job.jobId === "string" &&
    typeof job.status === "string" &&
    JOB_STATUSES.has(job.status) &&
    typeof job.stage === "string" &&
    JOB_STAGES.has(job.stage) &&
    typeof job.progress === "number" &&
    (job.error == null || typeof job.error === "string") &&
    (job.result == null || isValidEvidenceResponse(job.result))
  );
}

function isValidJobCreateResponse(data: unknown): data is EvidenceJobCreateResponse {
  if (!data || typeof data !== "object") return false;
  const job = data as EvidenceJobCreateResponse;
  return typeof job.jobId === "string" && job.status === "queued";
}

export async function startEvidenceJob(
  params: EvidenceJobCreateRequest,
  signal?: AbortSignal,
): Promise<EvidenceJobCreateResponse> {
  const response = await fetch("/api/evidence/jobs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Evidence job creation failed (${response.status})`);
  }

  const data: unknown = await response.json();
  if (!isValidJobCreateResponse(data)) {
    throw new Error("Invalid evidence job create response");
  }

  return data;
}

export async function pollEvidenceJob(
  jobId: string,
  signal?: AbortSignal,
): Promise<EvidenceJobPollResponse> {
  const response = await fetch(`/api/evidence/jobs/${encodeURIComponent(jobId)}`, {
    cache: "no-store",
    signal,
  });

  if (!response.ok) {
    throw new Error(`Evidence job poll failed (${response.status})`);
  }

  const data: unknown = await response.json();
  if (!isValidJobPollResponse(data)) {
    throw new Error("Invalid evidence job poll response");
  }

  return data;
}

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }

    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);

    function onAbort() {
      clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    }

    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

export interface EvidenceSearchProgress {
  stage: EvidenceJobStage;
  progress: number;
  message: string;
}

export async function fetchEvidenceSearchWithJob(
  params: EvidenceSearchRequest & {
    findingId?: string;
    mode?: EvidenceSearchMode;
    autoEscalate?: boolean;
  },
  options?: {
    signal?: AbortSignal;
    onProgress?: (progress: EvidenceSearchProgress) => void;
    pollIntervalMs?: number;
  },
): Promise<EvidenceSearchResponse> {
  const pollIntervalMs = options?.pollIntervalMs ?? 1500;

  let created: EvidenceJobCreateResponse;
  try {
    created = await startEvidenceJob(
      {
        claim: params.claim,
        argumentContext: params.argumentText,
        threadId: params.threadId,
        findingId: params.findingId,
        mode: params.mode,
        autoEscalate: params.autoEscalate,
      },
      options?.signal,
    );
  } catch (error) {
    console.warn(
      "[fetchEvidenceSearchWithJob] jobs unavailable, falling back to sync search",
      error,
    );
    return fetchEvidenceSearch(
      {
        claim: params.claim,
        argumentText: params.argumentText,
        threadId: params.threadId,
        mode: params.mode,
        autoEscalate: params.autoEscalate,
      },
      options?.signal,
    );
  }

  const deadline = Date.now() + EVIDENCE_JOB_MAX_WAIT_MS;

  while (true) {
    if (Date.now() > deadline) {
      throw new Error(EVIDENCE_JOB_FAILED_MESSAGE);
    }

    const job = await pollEvidenceJob(created.jobId, options?.signal);
    options?.onProgress?.({
      stage: job.stage,
      progress: job.progress,
      message: EVIDENCE_STAGE_COPY[job.stage],
    });

    if (job.status === "completed") {
      if (!job.result || !isValidEvidenceResponse(job.result)) {
        throw new Error("Evidence job completed without a valid result");
      }
      return job.result;
    }

    if (job.status === "failed") {
      throw new Error(job.error ?? EVIDENCE_JOB_FAILED_MESSAGE);
    }

    await sleep(pollIntervalMs, options?.signal);
  }
}
