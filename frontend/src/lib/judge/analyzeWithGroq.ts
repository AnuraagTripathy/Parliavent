import { recordGroqUsage } from "@/lib/groq/groqUsageTracker";
import type { Finding, JudgeRequest } from "@/lib/types";
import { sanitizeAIFindings } from "./schema";
import { buildJudgeUserPrompt, JUDGE_SYSTEM_PROMPT } from "./prompts";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
export const DEFAULT_GROQ_MODEL = "llama-3.3-70b-versatile";
export const DEFAULT_GROQ_JUDGE_MODEL = DEFAULT_GROQ_MODEL;
export const DEFAULT_GROQ_VERIFIER_MODEL = DEFAULT_GROQ_MODEL;
const REQUEST_TIMEOUT_MS = 30_000;
const MAX_RATE_LIMIT_RETRIES = 6;
/** Cumulative cap on retry sleeps so one judge call can't hold a request open for minutes. */
const MAX_TOTAL_RETRY_WAIT_MS = 20_000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseRateLimitWaitMs(detail: string, response: Response): number {
  const retryAfter = response.headers.get("retry-after");
  if (retryAfter) {
    const seconds = Number.parseFloat(retryAfter);
    if (Number.isFinite(seconds)) {
      return Math.ceil(seconds * 1000) + 250;
    }
  }

  const msMatch = detail.match(/try again in (\d+)\s*ms/i);
  if (msMatch) {
    return Number.parseInt(msMatch[1], 10) + 500;
  }

  const secMatch = detail.match(/try again in ([\d.]+)\s*s/i);
  if (secMatch) {
    return Math.ceil(Number.parseFloat(secMatch[1]) * 1000) + 500;
  }

  return 8_000;
}

export function getGroqJudgeModel(): string {
  return (
    process.env.GROQ_JUDGE_MODEL?.trim() ||
    process.env.GROQ_MODEL?.trim() ||
    DEFAULT_GROQ_JUDGE_MODEL
  );
}

export function getGroqVerifierModel(): string {
  return (
    process.env.GROQ_VERIFIER_MODEL?.trim() || DEFAULT_GROQ_VERIFIER_MODEL
  );
}

function getGroqConfig() {
  const apiKey = process.env.GROQ_API_KEY;
  const model = getGroqJudgeModel();

  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured");
  }

  return { apiKey, model };
}

function extractJsonContent(content: string): unknown {
  const trimmed = content.trim();
  const fenceMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);

  try {
    return JSON.parse(fenceMatch ? fenceMatch[1] : trimmed);
  } catch {
    throw new Error("Groq returned non-JSON content");
  }
}

export async function analyzeWithGroq(params: JudgeRequest): Promise<Finding[]> {
  const { apiKey, model } = getGroqConfig();

  const debateContext = {
    threadId: params.threadId,
    motion: params.motion,
    postType: params.postType,
    parentArgument: params.parentArgument,
    threadSummary: params.threadSummary,
    userStance: params.userStance,
  };

  const userPrompt = buildJudgeUserPrompt(
    params.text,
    params.mode,
    debateContext,
  );
  const inputChars =
    JUDGE_SYSTEM_PROMPT.length + userPrompt.length;

  let lastError: Error | null = null;
  let totalRetryWaitMs = 0;

  for (let attempt = 0; attempt <= MAX_RATE_LIMIT_RETRIES; attempt += 1) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          temperature: 0.2,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: JUDGE_SYSTEM_PROMPT },
            {
              role: "user",
              content: userPrompt,
            },
          ],
        }),
        signal: controller.signal,
      });

      if (response.status === 429 && attempt < MAX_RATE_LIMIT_RETRIES) {
        const detail = await response.text().catch(() => "");
        const waitMs = parseRateLimitWaitMs(detail, response);
        // Wording deliberately avoids "(429)"/"rate limit" so the catch
        // below treats this as non-retryable.
        if (totalRetryWaitMs + waitMs > MAX_TOTAL_RETRY_WAIT_MS) {
          throw new Error(
            `Groq retry budget exhausted on ${model}; giving up`,
          );
        }
        console.warn(
          `[Groq] Rate limited on ${model}; retrying in ${waitMs}ms (${attempt + 1}/${MAX_RATE_LIMIT_RETRIES})`,
        );
        totalRetryWaitMs += waitMs;
        await sleep(waitMs);
        continue;
      }

      if (!response.ok) {
        const detail = await response.text().catch(() => "");
        throw new Error(
          `Groq request failed (${response.status})${detail ? `: ${detail.slice(0, 200)}` : ""}`,
        );
      }

      const payload: unknown = await response.json();
      if (
        !payload ||
        typeof payload !== "object" ||
        !Array.isArray((payload as { choices?: unknown }).choices)
      ) {
        throw new Error("Groq returned an unexpected response shape");
      }

      const choices = (payload as { choices: Array<{ message?: { content?: string } }> })
        .choices;
      const content = choices[0]?.message?.content;

      if (!content) {
        throw new Error("Groq returned empty content");
      }

      const parsed = extractJsonContent(content);
      recordGroqUsage(model, inputChars, content.length);
      return sanitizeAIFindings(parsed, params.text);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        lastError = new Error("Groq request timed out");
      } else if (error instanceof Error) {
        lastError = error;
      } else {
        lastError = new Error("Groq request failed");
      }

      const retryable =
        lastError.message.includes("(429)") ||
        lastError.message.toLowerCase().includes("rate limit");

      if (
        !retryable ||
        attempt >= MAX_RATE_LIMIT_RETRIES ||
        totalRetryWaitMs + 8_000 > MAX_TOTAL_RETRY_WAIT_MS
      ) {
        throw lastError;
      }

      totalRetryWaitMs += 8_000;
      await sleep(8_000);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  throw lastError ?? new Error("Groq request failed");
}
