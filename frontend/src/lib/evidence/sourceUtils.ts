import { finalizeEvidenceSource } from "@/lib/evidence/sourceEligibility";
import type { EvidenceSource, SourceCredibility, SupportLevel } from "@/lib/types";

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

const HIGH_CREDIBILITY_DOMAINS = [
  "nature.com",
  "sciencedirect.com",
  "nih.gov",
  "cdc.gov",
  "cancer.gov",
  "who.int",
  "un.org",
  "oecd.org",
  "worldbank.org",
  "imf.org",
  "brookings.edu",
  "rand.org",
  "pewresearch.org",
  "cancerresearchuk.org",
  "cancer.org",
  "ncbi.nlm.nih.gov",
  "thelancet.com",
  "bmj.com",
  "nejm.org",
];

const MEDIUM_CREDIBILITY_DOMAINS = [
  "nytimes.com",
  "reuters.com",
  "bbc.com",
  "bbc.co.uk",
  "theguardian.com",
  "apnews.com",
  "economist.com",
  "wsj.com",
  "ft.com",
  "npr.org",
  "pbs.org",
  "cnn.com",
  "wikipedia.org",
  "statista.com",
  "forbes.com",
  "bloomberg.com",
];

const BLOCKED_DOMAINS = [
  "instagram.com",
  "facebook.com",
  "reddit.com",
  "tiktok.com",
  "youtube.com",
  "pinterest.com",
  "quora.com",
  "x.com",
  "twitter.com",
];

const LOW_CREDIBILITY_PATTERNS = [
  "medium.com",
  "blogspot.",
  "wordpress.com",
  "tumblr.com",
  ...BLOCKED_DOMAINS,
];

export interface TavilySearchResult {
  title: string;
  url: string;
  content: string;
  score?: number;
}

export function normalizeClaimText(claim: string): string {
  return claim.trim().toLowerCase().replace(/\s+/g, " ");
}

/** Build a simple keyword query from the claim and optional thread context. */
export function buildSearchQuery(
  claim: string,
  argumentText?: string,
  threadId?: string,
): string {
  const words = claim
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));

  const parts = [...words];

  if (threadId) {
    parts.push(...threadId.replace(/-/g, " ").split(/\s+/).filter(Boolean));
  }

  if (argumentText && parts.length < 6) {
    const contextWords = argumentText
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 4 && !STOP_WORDS.has(word))
      .slice(0, 4);
    parts.push(...contextWords);
  }

  const unique = [...new Set(parts)];
  return `${unique.join(" ")} evidence`.trim();
}

export function extractPublisher(url: string): string {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    const segments = hostname.split(".");
    if (segments.length >= 2) {
      const name = segments[segments.length - 2];
      return name.charAt(0).toUpperCase() + name.slice(1);
    }
    return hostname;
  } catch {
    return "Unknown";
  }
}

export function assessCredibility(url: string): SourceCredibility {
  let hostname = "";
  try {
    hostname = new URL(url).hostname.toLowerCase();
  } catch {
    return "low";
  }

  if (hostname.endsWith(".gov") || hostname.endsWith(".edu")) {
    return "high";
  }

  if (
    HIGH_CREDIBILITY_DOMAINS.some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`),
    )
  ) {
    return "high";
  }

  if (
    MEDIUM_CREDIBILITY_DOMAINS.some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`),
    )
  ) {
    return "medium";
  }

  if (hostname.endsWith(".org")) {
    return "medium";
  }

  if (LOW_CREDIBILITY_PATTERNS.some((pattern) => hostname.includes(pattern))) {
    return "low";
  }

  return "low";
}

export function isBlockedDomain(url: string): boolean {
  try {
    const hostname = new URL(url).hostname.toLowerCase().replace(/^www\./, "");
    return BLOCKED_DOMAINS.some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`),
    );
  } catch {
    return false;
  }
}

export function filterTavilyResults(
  results: TavilySearchResult[],
): TavilySearchResult[] {
  return results.filter((result) => !isBlockedDomain(result.url));
}

function sourceIdFromUrl(url: string, index: number): string {
  const slug = url
    .replace(/^https?:\/\//, "")
    .replace(/[^\w]+/g, "-")
    .slice(0, 40);
  return `evidence-${index}-${slug}`;
}

export function mapTavilyResultsToSources(
  _claim: string,
  results: TavilySearchResult[],
): EvidenceSource[] {
  return results.slice(0, 5).map((result, index) =>
    finalizeEvidenceSource({
      id: sourceIdFromUrl(result.url, index),
      title: result.title.trim() || "Untitled source",
      publisher: extractPublisher(result.url),
      url: result.url,
      snippet: result.content.trim(),
      supportLevel: "unclear" as SupportLevel,
      credibility: assessCredibility(result.url),
    }),
  );
}
