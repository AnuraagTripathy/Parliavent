import type {
  Finding,
  JudgeMode,
  JudgePostType,
  JudgeRequest,
  JudgeResponse,
  JudgeUserStance,
} from "@/lib/types";
import { parseJudgeResponse } from "@/lib/validateJudgeResponse";

export const JUDGE_DEBOUNCE_MS = 1500;
export const JUDGE_MIN_CHARS = 40;
export const JUDGE_ERROR_MESSAGE =
  "Couldn't refresh review. Your draft is safe.";

export type FetchJudgeParams = JudgeRequest & {
  signal?: AbortSignal;
};

export interface JudgeCallContext {
  mode?: JudgeMode;
  threadId?: string;
  motion?: string;
  postType?: JudgePostType;
  parentArgument?: string;
  threadSummary?: string;
  userStance?: JudgeUserStance;
}

const PRESERVED_STATUSES = new Set<Finding["status"]>([
  "resolved",
  "ignored",
  "disputed",
  "source_attached",
  "marked_opinion",
]);

function spanKey(finding: Finding): string {
  return `${finding.type}\0${finding.spanText}`;
}

export function mergeFindings(
  previous: Finding[],
  incoming: Finding[],
  text: string,
): Finding[] {
  // LLM-generated ids ("finding-claim-1") are positional and shift when the
  // user edits earlier text, so identity is primarily (type, spanText); the
  // id is only a fallback. The claimed set stops one previous finding from
  // donating its resolution state to two incoming findings.
  const previousById = new Map(previous.map((finding) => [finding.id, finding]));
  const previousBySpan = new Map(
    previous.map((finding) => [spanKey(finding), finding]),
  );
  const claimed = new Set<Finding>();

  return incoming.map((finding) => {
    let existing: Finding | undefined = previousBySpan.get(spanKey(finding));
    if (!existing || claimed.has(existing)) {
      const byId = previousById.get(finding.id);
      existing = byId && !claimed.has(byId) ? byId : undefined;
    }
    if (!existing) {
      return finding;
    }
    claimed.add(existing);

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
      sourceCandidates: existing.sourceCandidates,
      claimKind: existing.claimKind,
      evidenceClaimVerdict: existing.evidenceClaimVerdict,
      evidenceSummary: existing.evidenceSummary,
      sources: existing.sources,
    };
  });
}
export async function fetchJudge({
  text,
  mode,
  threadId,
  motion,
  postType,
  parentArgument,
  threadSummary,
  userStance,
  signal,
}: FetchJudgeParams): Promise<JudgeResponse> {
  const response = await fetch("/api/judge", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text,
      mode,
      threadId,
      motion,
      postType,
      parentArgument,
      threadSummary,
      userStance,
    }),
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
