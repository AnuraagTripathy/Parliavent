import type { PlannedQueries } from "@/lib/evidence/queryPlanner";
import {
  normalizeSourceUrl,
  type TavilySearchResult,
} from "@/lib/evidence/sourceUtils";

export class TavilyConfigError extends Error {
  constructor() {
    super("Tavily API key not configured");
    this.name = "TavilyConfigError";
  }
}

export class TavilySearchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TavilySearchError";
  }
}

interface TavilyApiResponse {
  results?: TavilySearchResult[];
  error?: string;
}

const MAX_CANDIDATE_URLS = 5;

export async function searchTavilyQuery(query: string): Promise<TavilySearchResult[]> {
  const apiKey = process.env.TAVILY_API_KEY?.trim();
  if (!apiKey) {
    throw new TavilyConfigError();
  }

  let response: Response;
  try {
    response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        query,
        max_results: 5,
        search_depth: "basic",
      }),
    });
  } catch (error) {
    console.error("[searchTavilyQuery] network error", error);
    throw new TavilySearchError("Tavily request failed");
  }

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    console.error("[searchTavilyQuery] API error", response.status, body);
    throw new TavilySearchError(`Tavily returned ${response.status}`);
  }

  let data: TavilyApiResponse;
  try {
    data = (await response.json()) as TavilyApiResponse;
  } catch {
    throw new TavilySearchError("Invalid Tavily response");
  }

  if (data.error) {
    throw new TavilySearchError(data.error);
  }

  return Array.isArray(data.results) ? data.results : [];
}

export interface TavilySearchHit extends TavilySearchResult {
  foundViaContradiction?: boolean;
  foundViaOfficial?: boolean;
}

/**
 * Run Tavily for support, contradiction, and official queries.
 * Deduplicates by normalized URL and returns up to 5 candidates.
 */
export async function searchWithPlannedQueries(
  queries: PlannedQueries,
): Promise<TavilySearchHit[]> {
  const [supportResults, contradictionResults, officialResults] =
    await Promise.all([
      searchTavilyQuery(queries.support),
      searchTavilyQuery(queries.contradiction),
      searchTavilyQuery(queries.official),
    ]);

  const merged = new Map<string, TavilySearchHit>();

  const addResults = (
    results: TavilySearchResult[],
    flags: { foundViaContradiction?: boolean; foundViaOfficial?: boolean },
  ) => {
    for (const result of results) {
      const key = normalizeSourceUrl(result.url);
      const existing = merged.get(key);
      if (existing) {
        merged.set(key, {
          ...existing,
          score: Math.max(existing.score ?? 0, result.score ?? 0),
          foundViaContradiction:
            existing.foundViaContradiction || flags.foundViaContradiction,
          foundViaOfficial: existing.foundViaOfficial || flags.foundViaOfficial,
        });
        continue;
      }

      merged.set(key, {
        ...result,
        foundViaContradiction: flags.foundViaContradiction,
        foundViaOfficial: flags.foundViaOfficial,
      });
    }
  };

  addResults(supportResults, {});
  addResults(contradictionResults, { foundViaContradiction: true });
  addResults(officialResults, { foundViaOfficial: true });

  return [...merged.values()]
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, MAX_CANDIDATE_URLS);
}
