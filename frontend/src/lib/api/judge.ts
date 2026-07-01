import type { Finding, JudgeMode, JudgeResponse } from "@/lib/types";
import { parseJudgeResponse } from "@/lib/validateJudgeResponse";

export const JUDGE_DEBOUNCE_MS = 900;
export const JUDGE_THREAD_ID = "cars-downtown";
export const JUDGE_ERROR_MESSAGE =
  "Couldn't refresh review. Your draft is safe.";

export interface FetchJudgeParams {
  text: string;
  mode: JudgeMode;
  threadId?: string;
  signal?: AbortSignal;
}

const PRESERVED_STATUSES = new Set<Finding["status"]>([
  "resolved",
  "ignored",
  "disputed",
  "source_attached",
  "marked_opinion",
]);

export function mergeFindings(
  previous: Finding[],
  incoming: Finding[],
  text: string,
): Finding[] {
  const previousById = new Map(previous.map((finding) => [finding.id, finding]));

  return incoming.map((finding) => {
    const existing = previousById.get(finding.id);
    if (!existing) {
      return finding;
    }

    const spanStillPresent =
      text.includes(finding.spanText) || text.includes(existing.spanText);
    if (!spanStillPresent) {
      return finding;
    }

    if (
      !PRESERVED_STATUSES.has(existing.status) &&
      existing.spanText !== finding.spanText
    ) {
      return finding;
    }

    return {
      ...finding,
      status: existing.status,
      selectedSourceId: existing.selectedSourceId,
      disputeReason: existing.disputeReason,
    };
  });
}
export async function fetchJudge({
  text,
  mode,
  threadId,
  signal,
}: FetchJudgeParams): Promise<JudgeResponse> {
  const response = await fetch("/api/judge", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, mode, threadId }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Judge request failed (${response.status})`);
  }

  const data: unknown = await response.json();
  const parsed = parseJudgeResponse(data);
  if (!parsed) {
    throw new Error("Invalid judge response");
  }

  return parsed;
}
