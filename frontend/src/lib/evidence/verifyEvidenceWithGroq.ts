import { getGroqModel } from "@/lib/judge/analyzeWithGroq";
import type { EvidenceSource } from "@/lib/types";
import {
  buildEvidenceVerifierUserPrompt,
  EVIDENCE_VERIFIER_SYSTEM_PROMPT,
} from "./verifyPrompts";
import {
  parseVerifiedEvidenceOutput,
  type VerifiedEvidenceResult,
} from "./verifySchema";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const REQUEST_TIMEOUT_MS = 25_000;

function getGroqApiKey(): string | null {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  return apiKey || null;
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

export async function verifyEvidenceWithGroq(params: {
  claim: string;
  argumentText?: string;
  sources: EvidenceSource[];
}): Promise<VerifiedEvidenceResult> {
  const apiKey = getGroqApiKey();
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured");
  }

  const sourceIds = new Set(params.sources.map((source) => source.id));
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
        model: getGroqModel(),
        temperature: 0.1,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: EVIDENCE_VERIFIER_SYSTEM_PROMPT },
          {
            role: "user",
            content: buildEvidenceVerifierUserPrompt({
              claim: params.claim,
              argumentText: params.argumentText,
              sources: params.sources,
            }),
          },
        ],
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new Error(
        `Groq verifier failed (${response.status})${detail ? `: ${detail.slice(0, 200)}` : ""}`,
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

    const parsed = parseVerifiedEvidenceOutput(
      extractJsonContent(content),
      sourceIds,
      params.claim,
    );

    if (!parsed) {
      throw new Error("Groq verifier returned invalid JSON");
    }

    return parsed;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Groq verifier timed out");
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
