import type { ClaimVerdict, EvidenceSearchResponse } from "@/lib/types";

export interface EvidenceJobSummary {
  jobId: string;
  claim: string;
  status: "queued" | "running" | "completed" | "failed";
  stage: string;
  createdAt?: string | null;
  updatedAt?: string | null;
  completedAt?: string | null;
  latencyMs?: number | null;
  claimVerdict?: ClaimVerdict | null;
  verificationBasis?: EvidenceSearchResponse["verificationBasis"] | null;
  sourceCount?: number | null;
  attachableSourceCount?: number | null;
  cacheHit?: boolean | null;
  error?: string | null;
  result?: EvidenceSearchResponse | null;
}

export interface EvidenceJobListResponse {
  jobs: EvidenceJobSummary[];
}

function isValidJobSummary(value: unknown): value is EvidenceJobSummary {
  if (!value || typeof value !== "object") return false;
  const job = value as EvidenceJobSummary;
  return (
    typeof job.jobId === "string" &&
    typeof job.claim === "string" &&
    typeof job.status === "string" &&
    typeof job.stage === "string"
  );
}

export function isValidJobListResponse(
  data: unknown,
): data is EvidenceJobListResponse {
  if (!data || typeof data !== "object") return false;
  const payload = data as EvidenceJobListResponse;
  return Array.isArray(payload.jobs) && payload.jobs.every(isValidJobSummary);
}

export async function fetchEvidenceJobs(): Promise<EvidenceJobListResponse> {
  const response = await fetch("/api/evidence/jobs", { cache: "no-store" });
  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data &&
      typeof data === "object" &&
      "error" in data &&
      typeof (data as { error: unknown }).error === "string"
        ? (data as { error: string }).error
        : "Evidence job service is unavailable.";
    throw new Error(message);
  }

  if (!isValidJobListResponse(data)) {
    throw new Error("Invalid evidence jobs response");
  }

  return data;
}
