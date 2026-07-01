import { judgeText } from "@/lib/mockJudge";
import type { Finding, JudgeMode } from "@/lib/types";
import { analyzeWithGroq } from "./analyzeWithGroq";

export function shouldUseMockJudge(): boolean {
  return process.env.USE_MOCK_JUDGE !== "false";
}

export async function analyzeArgument(params: {
  text: string;
  mode: JudgeMode;
  threadId?: string;
}): Promise<Finding[]> {
  if (shouldUseMockJudge()) {
    return judgeText(params.text);
  }

  return analyzeWithGroq(params);
}
