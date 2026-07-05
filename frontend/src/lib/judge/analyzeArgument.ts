import { judgeText } from "@/lib/mockJudge";
import type { Finding, JudgeRequest } from "@/lib/types";
import { analyzeWithGroq, getGroqModel } from "./analyzeWithGroq";
import {
  getJudgeCacheHit,
  normalizeJudgeText,
  setJudgeCache,
} from "./judgeCache";
import { JUDGE_PROMPT_VERSION } from "./prompts";

export function shouldUseMockJudge(): boolean {
  return process.env.USE_MOCK_JUDGE !== "false";
}

export async function analyzeArgument(
  params: JudgeRequest,
): Promise<Finding[]> {
  if (shouldUseMockJudge()) {
    return judgeText(params.text);
  }

  const model = getGroqModel();
  const cacheParams = {
    normalizedText: normalizeJudgeText(params.text),
    mode: params.mode,
    motion: params.motion,
    postType: params.postType,
    parentArgument: params.parentArgument,
    threadSummary: params.threadSummary,
    model,
    promptVersion: JUDGE_PROMPT_VERSION,
  };

  const cached = getJudgeCacheHit(cacheParams);
  if (cached) {
    return cached;
  }

  const findings = await analyzeWithGroq(params);
  setJudgeCache(cacheParams, findings);

  return findings;
}
