import type { Finding, ReadinessResult } from "./types";

const RESOLVED_STATUSES = new Set<Finding["status"]>([
  "resolved",
  "ignored",
  "disputed",
  "source_attached",
  "marked_opinion",
]);

export function getReadiness(findings: Finding[]): ReadinessResult {
  const total = findings.length;
  const resolved = findings.filter((f) => RESOLVED_STATUSES.has(f.status)).length;
  const percent = total === 0 ? 100 : Math.round((resolved / total) * 100);

  let label = "Ready to post";
  if (resolved === 0) {
    label = `${total} item${total === 1 ? "" : "s"} to review`;
  } else if (resolved < total) {
    label = `${total - resolved} item${total - resolved === 1 ? "" : "s"} remaining`;
  }

  return { resolved, total, percent, label };
}
