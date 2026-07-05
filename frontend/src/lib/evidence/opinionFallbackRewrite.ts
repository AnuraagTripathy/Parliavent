/**
 * Deterministic fallback when a factual claim has no judge suggestedRewrite.
 * Softens the claim into an explicit personal view — never auto-applied.
 */
export function buildOpinionFallbackRewrite(claim: string): string {
  const cleaned = claim.trim().replace(/\s+/g, " ");
  const lower = cleaned.toLowerCase();

  if (/\b(cancer|health risk|phones?|mobile)\b/i.test(lower)) {
    return "I'm personally concerned about possible health risks from mobile phones, but I don't have evidence for the stronger claim as written.";
  }

  if (/\b(congestion pricing|emissions?)\b/i.test(lower) && /\d+%/.test(lower)) {
    return "I believe congestion pricing can help reduce traffic and emissions, but I'm not sure the exact impact would match the figure stated here.";
  }

  if (/\b(low[- ]traffic|traffic zones?|paris)\b/i.test(lower)) {
    return "In my view, low-traffic zones like Paris's seem to improve city streets, though I'd want to narrow the claim before treating it as established fact.";
  }

  if (/\b(europe|european)\b/i.test(lower) && /\b(nicer|better|nicer)\b/i.test(lower)) {
    return "I personally think European cities often feel more livable than many American ones, though that's my impression rather than a proven fact.";
  }

  const softened = cleaned
    .replace(
      /\b(literally|prove[sd]?|always|never|clearly|definitely|certainly|bruh|tbh|imo)\b/gi,
      "",
    )
    .replace(/\s+/g, " ")
    .replace(/^[,.\s]+|[,.\s]+$/g, "")
    .trim();

  const core = softened || cleaned;

  if (/\bi (think|believe|feel)\b/i.test(core)) {
    return `${core.charAt(0).toUpperCase()}${core.slice(1)} — though I'd treat this as a personal take rather than a settled fact.`;
  }

  return `In my view, ${core} — though I'd treat this as a personal take rather than a settled fact.`;
}
