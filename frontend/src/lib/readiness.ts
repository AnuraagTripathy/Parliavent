import type { Finding, ReadinessResult } from "./types";

const RESOLVED_STATUSES = new Set<Finding["status"]>([
  "resolved",
  "ignored",
  "disputed",
  "source_attached",
  "marked_opinion",
]);

export interface ReadinessOptions {
  /** Judge failed and there are no findings to review — do not show a clean ready state. */
  judgeUnavailable?: boolean;
}

export function getReadiness(
  findings: Finding[],
  options?: ReadinessOptions,
): ReadinessResult {
  if (options?.judgeUnavailable && findings.length === 0) {
    return {
      resolved: 0,
      total: 0,
      percent: 0,
      label: "Review unavailable",
    };
  }

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
