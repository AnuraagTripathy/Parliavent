import { isBlockedDomain } from "@/lib/evidence/sourceUtils";

export const PAGE_FETCH_TIMEOUT_MS = 8_000;
export const MAX_PAGES_TO_FETCH = 5;

const FETCH_USER_AGENT =
  "ParliaventEvidenceBot/2.0 (+https://parliavent.local; evidence-verification)";

export interface FetchedPage {
  url: string;
  html: string | null;
  error?: string;
  skipped?: boolean;
  skipReason?: string;
}

function isPdfUrl(url: string): boolean {
  try {
    const pathname = new URL(url).pathname.toLowerCase();
    return pathname.endsWith(".pdf");
  } catch {
    return url.toLowerCase().includes(".pdf");
  }
}

function isFetchableUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

async function fetchSinglePage(url: string): Promise<FetchedPage> {
  if (!isFetchableUrl(url)) {
    return {
      url,
      html: null,
      skipped: true,
      skipReason: "invalid_url",
    };
  }

  if (isBlockedDomain(url)) {
    return {
      url,
      html: null,
      skipped: true,
      skipReason: "blocked_domain",
    };
  }

  if (isPdfUrl(url)) {
    return {
      url,
      html: null,
      skipped: true,
      skipReason: "pdf",
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), PAGE_FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
        "User-Agent": FETCH_USER_AGENT,
      },
      signal: controller.signal,
      redirect: "follow",
    });

    if (!response.ok) {
      return {
        url,
        html: null,
        error: `HTTP ${response.status}`,
      };
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (contentType.includes("application/pdf")) {
      return {
        url,
        html: null,
        skipped: true,
        skipReason: "pdf",
      };
    }

    if (!contentType.includes("text/html") && !contentType.includes("text/plain")) {
      return {
        url,
        html: null,
        error: `unsupported_content_type:${contentType.split(";")[0]}`,
      };
    }

    const html = await response.text();
    return { url, html };
  } catch (error) {
    const message =
      error instanceof Error && error.name === "AbortError"
        ? "timeout"
        : error instanceof Error
          ? error.message
          : "fetch_failed";

    return {
      url,
      html: null,
      error: message,
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Fetch up to MAX_PAGES_TO_FETCH candidate pages in parallel.
 * Failures are returned per-URL; the pipeline should fall back to snippets.
 */
export async function fetchPages(urls: string[]): Promise<Map<string, FetchedPage>> {
  const uniqueUrls = [...new Set(urls)].slice(0, MAX_PAGES_TO_FETCH);
  const results = await Promise.all(uniqueUrls.map((url) => fetchSinglePage(url)));

  return new Map(results.map((result) => [result.url, result]));
}
