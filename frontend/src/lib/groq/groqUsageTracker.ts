interface ModelUsage {
  calls: number;
  estimatedTokens: number;
}

const usageByModel = new Map<string, ModelUsage>();

export function resetGroqUsageTracker(): void {
  usageByModel.clear();
}

/** Rough token estimate: ~4 characters per token. */
export function recordGroqUsage(
  model: string,
  inputChars: number,
  outputChars: number,
): void {
  const current = usageByModel.get(model) ?? { calls: 0, estimatedTokens: 0 };
  current.calls += 1;
  current.estimatedTokens += Math.ceil((inputChars + outputChars) / 4);
  usageByModel.set(model, current);
}

export function getGroqUsageSummary(): Array<{
  model: string;
  calls: number;
  estimatedTokens: number;
}> {
  return [...usageByModel.entries()]
    .map(([model, stats]) => ({ model, ...stats }))
    .sort((a, b) => b.calls - a.calls);
}

export function formatGroqUsageSummary(): string[] {
  const rows = getGroqUsageSummary();
  if (rows.length === 0) {
    return ["  (no Groq API calls recorded)"];
  }
  return rows.map(
    (row) =>
      `  ${row.model}: ${row.calls} call(s), ~${row.estimatedTokens.toLocaleString()} tokens`,
  );
}
