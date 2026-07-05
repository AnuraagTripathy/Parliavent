export const MAX_PASSAGES_PER_SOURCE = 2;
export const MAX_PASSAGES_GLOBAL = 10;

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "been",
  "but",
  "by",
  "did",
  "do",
  "does",
  "for",
  "from",
  "had",
  "has",
  "have",
  "if",
  "in",
  "is",
  "it",
  "its",
  "of",
  "on",
  "or",
  "that",
  "the",
  "their",
  "they",
  "this",
  "to",
  "was",
  "were",
  "will",
  "with",
  "you",
  "your",
  "our",
  "we",
]);

const CONTRADICTION_TERMS = [
  "no evidence",
  "not support",
  "does not support",
  "do not support",
  "unlikely",
  "no clear link",
  "no link",
  "myth",
  "debunk",
  "false",
  "overstated",
  "not proven",
  "insufficient",
  "contradict",
  "refute",
];

export interface PassageRankingInput {
  sourceId: string;
  claim: string;
  sourceTitle: string;
  sourceSnippet: string;
  extractedText: string;
  foundViaContradiction?: boolean;
}

interface ScoredPassage {
  sourceId: string;
  text: string;
  score: number;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s%]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));
}

function extractNumbersAndEntities(claim: string): string[] {
  const numbers = claim.match(/\d+(?:\.\d+)?%?/g) ?? [];
  const capitalized = claim.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*/g) ?? [];
  const acronyms = claim.match(/\b[A-Z]{2,}\b/g) ?? [];
  return [...new Set([...numbers, ...capitalized, ...acronyms])];
}

function splitIntoPassages(text: string): string[] {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter((part) => part.length >= 80);

  if (paragraphs.length > 0) {
    return paragraphs;
  }

  const sentences: string[] = [];
  let buffer = "";

  for (const sentence of text.split(/(?<=[.!?])\s+/)) {
    const trimmed = sentence.trim();
    if (!trimmed) continue;

    buffer = buffer ? `${buffer} ${trimmed}` : trimmed;
    if (buffer.length >= 280) {
      sentences.push(buffer);
      buffer = "";
    }
  }

  if (buffer) {
    sentences.push(buffer);
  }

  return sentences.length > 0 ? sentences : [text.trim()].filter(Boolean);
}

function overlapScore(passageTokens: string[], referenceTokens: string[]): number {
  if (referenceTokens.length === 0) return 0;

  const passageSet = new Set(passageTokens);
  let overlap = 0;
  for (const token of referenceTokens) {
    if (passageSet.has(token)) {
      overlap += 1;
    }
  }

  return overlap / referenceTokens.length;
}

function scorePassage(
  passage: string,
  claimTokens: string[],
  entities: string[],
  titleTokens: string[],
  snippetTokens: string[],
  foundViaContradiction: boolean,
): number {
  const passageLower = passage.toLowerCase();
  const passageTokens = tokenize(passage);

  let score = overlapScore(passageTokens, claimTokens) * 4;
  score += overlapScore(passageTokens, titleTokens) * 1.5;
  score += overlapScore(passageTokens, snippetTokens) * 2;

  for (const entity of entities) {
    if (passageLower.includes(entity.toLowerCase())) {
      score += entity.match(/\d/) ? 2.5 : 1.5;
    }
  }

  if (foundViaContradiction) {
    for (const term of CONTRADICTION_TERMS) {
      if (passageLower.includes(term)) {
        score += 1.5;
      }
    }
  }

  if (passage.length >= 120 && passage.length <= 900) {
    score += 0.5;
  }

  return score;
}

function rankPassagesForSource(input: PassageRankingInput): ScoredPassage[] {
  const claimTokens = tokenize(input.claim);
  const titleTokens = tokenize(input.sourceTitle);
  const snippetTokens = tokenize(input.sourceSnippet);
  const entities = extractNumbersAndEntities(input.claim);
  const passages = splitIntoPassages(input.extractedText);

  return passages
    .map((text) => ({
      sourceId: input.sourceId,
      text,
      score: scorePassage(
        text,
        claimTokens,
        entities,
        titleTokens,
        snippetTokens,
        Boolean(input.foundViaContradiction),
      ),
    }))
    .filter((passage) => passage.score > 0)
    .sort((a, b) => b.score - a.score);
}

/**
 * Rank passages per source and apply a global cap across all sources.
 */
export function rankPassagesForSources(
  inputs: PassageRankingInput[],
): Map<string, string[]> {
  const allRanked = inputs
    .flatMap((input) => rankPassagesForSource(input))
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_PASSAGES_GLOBAL);

  const result = new Map<string, string[]>();
  for (const input of inputs) {
    result.set(input.sourceId, []);
  }

  const perSourceCount = new Map<string, number>();
  for (const passage of allRanked) {
    const count = perSourceCount.get(passage.sourceId) ?? 0;
    if (count >= MAX_PASSAGES_PER_SOURCE) {
      continue;
    }

    const existing = result.get(passage.sourceId) ?? [];
    existing.push(passage.text);
    result.set(passage.sourceId, existing);
    perSourceCount.set(passage.sourceId, count + 1);
  }

  return result;
}
