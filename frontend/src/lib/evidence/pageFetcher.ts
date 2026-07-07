import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { isBlockedDomain } from "@/lib/evidence/sourceUtils";

export const PAGE_FETCH_TIMEOUT_MS = 8_000;
export const MAX_PAGES_TO_FETCH = 5;
export const MAX_RESPONSE_BYTES = 2 * 1024 * 1024;
const MAX_REDIRECTS = 3;

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

function isPrivateIpv4(ip: string): boolean {
  const parts = ip.split(".").map(Number);
  if (
    parts.length !== 4 ||
    parts.some((n) => !Number.isInteger(n) || n < 0 || n > 255)
  ) {
    return true;
  }
  const [a, b] = parts;
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) || // CGNAT 100.64.0.0/10
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 169 && b === 254) // link-local / cloud metadata
  );
}

function isPrivateIp(ip: string): boolean {
  if (isIP(ip) === 4) {
    return isPrivateIpv4(ip);
  }
  const lower = ip.toLowerCase();
  if (lower === "::" || lower === "::1") return true;
  if (lower.startsWith("fc") || lower.startsWith("fd")) return true; // ULA fc00::/7
  if (lower.startsWith("fe80")) return true; // link-local
  if (lower.startsWith("::ffff:")) {
    const mapped = lower.slice("::ffff:".length);
    if (isIP(mapped) === 4) return isPrivateIpv4(mapped);
  }
  return false;
}

/**
 * SSRF guard: evidence URLs come from an external search API, so never let a
 * fetch reach localhost, private networks, or cloud metadata endpoints.
 * Checks IP literals directly and resolves hostnames via DNS. (A DNS
 * rebinding TOCTOU window remains — acceptable for this threat model since
 * there are no internal HTTP services in the deployment.)
 */
async function isPrivateHost(hostname: string): Promise<boolean> {
  const bare = hostname.replace(/^\[|\]$/g, "").toLowerCase();

  if (
    bare === "localhost" ||
    bare.endsWith(".localhost") ||
    bare.endsWith(".local") ||
    bare.endsWith(".internal")
  ) {
    return true;
  }

  if (isIP(bare)) {
    return isPrivateIp(bare);
  }

  try {
    const addresses = await lookup(bare, { all: true });
    if (addresses.length === 0) return true;
    return addresses.some((entry) => isPrivateIp(entry.address));
  } catch {
    // Unresolvable hosts can't be fetched anyway; treat as unsafe.
    return true;
  }
}

/** Read at most maxBytes of the body; truncate (don't fail) past the cap. */
async function readBodyCapped(
  response: Response,
  maxBytes: number,
): Promise<string> {
  const reader = response.body?.getReader();
  if (!reader) {
    const text = await response.text();
    return text.length > maxBytes ? text.slice(0, maxBytes) : text;
  }

  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    chunks.push(value);
    if (total >= maxBytes) {
      await reader.cancel().catch(() => undefined);
      break;
    }
  }

  const combined = new Uint8Array(Math.min(total, maxBytes));
  let offset = 0;
  for (const chunk of chunks) {
    const remaining = combined.length - offset;
    if (remaining <= 0) break;
    combined.set(
      remaining >= chunk.byteLength ? chunk : chunk.subarray(0, remaining),
      offset,
    );
    offset += Math.min(chunk.byteLength, remaining);
  }
  return new TextDecoder().decode(combined);
}

export async function fetchSinglePage(url: string): Promise<FetchedPage> {
  let currentUrl = url;

  // Redirects are followed manually so every hop is re-validated against the
  // blocked-domain list and the SSRF guard.
  for (let redirects = 0; redirects <= MAX_REDIRECTS; redirects++) {
    if (!isFetchableUrl(currentUrl)) {
      return { url, html: null, skipped: true, skipReason: "invalid_url" };
    }

    if (isBlockedDomain(currentUrl)) {
      return { url, html: null, skipped: true, skipReason: "blocked_domain" };
    }

    if (isPdfUrl(currentUrl)) {
      return { url, html: null, skipped: true, skipReason: "pdf" };
    }

    if (await isPrivateHost(new URL(currentUrl).hostname)) {
      return { url, html: null, skipped: true, skipReason: "private_host" };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      PAGE_FETCH_TIMEOUT_MS,
    );

    try {
      const response = await fetch(currentUrl, {
        method: "GET",
        headers: {
          Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
          "User-Agent": FETCH_USER_AGENT,
        },
        signal: controller.signal,
        redirect: "manual",
      });

      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get("location");
        if (!location) {
          return { url, html: null, error: `HTTP ${response.status}` };
        }
        currentUrl = new URL(location, currentUrl).toString();
        continue;
      }

      if (!response.ok) {
        return { url, html: null, error: `HTTP ${response.status}` };
      }

      const contentType = response.headers.get("content-type") ?? "";
      if (contentType.includes("application/pdf")) {
        return { url, html: null, skipped: true, skipReason: "pdf" };
      }

      if (
        !contentType.includes("text/html") &&
        !contentType.includes("text/plain")
      ) {
        return {
          url,
          html: null,
          error: `unsupported_content_type:${contentType.split(";")[0]}`,
        };
      }

      const html = await readBodyCapped(response, MAX_RESPONSE_BYTES);
      return { url, html };
    } catch (error) {
      const message =
        error instanceof Error && error.name === "AbortError"
          ? "timeout"
          : error instanceof Error
            ? error.message
            : "fetch_failed";

      return { url, html: null, error: message };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  return { url, html: null, error: "too_many_redirects" };
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
