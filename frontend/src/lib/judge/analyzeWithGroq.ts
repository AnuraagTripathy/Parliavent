import type { Finding, JudgeMode } from "@/lib/types";
import { sanitizeAIFindings } from "./schema";
import { buildJudgeUserPrompt, JUDGE_SYSTEM_PROMPT } from "./prompts";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "llama-3.3-70b-versatile";
const REQUEST_TIMEOUT_MS = 30_000;

function getGroqConfig() {
  const apiKey = process.env.GROQ_API_KEY;
  const model = process.env.GROQ_MODEL?.trim() || DEFAULT_MODEL;

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

export async function analyzeWithGroq(params: {
  text: string;
  mode: JudgeMode;
  threadId?: string;
}): Promise<Finding[]> {
  const { apiKey, model } = getGroqConfig();
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
            content: buildJudgeUserPrompt(params.text, params.mode, params.threadId),
          },
        ],
      }),
      signal: controller.signal,
    });

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
    return sanitizeAIFindings(parsed, params.text);
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Groq request timed out");
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
