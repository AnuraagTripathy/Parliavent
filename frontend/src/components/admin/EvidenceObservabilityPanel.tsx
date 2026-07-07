"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown, RefreshCw } from "lucide-react";
import {
  fetchEvidenceJobs,
  type EvidenceJobSummary,
} from "@/lib/api/evidenceJobs";
import type { EvidenceSource } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const AUTO_REFRESH_MS = 5000;

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1)}…`;
}

function formatMs(ms: number | null | undefined): string {
  if (ms == null) return "—";
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <Card>
      <CardHeader className="p-4 pb-2">
        <CardDescription className="text-[11px] uppercase tracking-wide">
          {label}
        </CardDescription>
        <CardTitle className="text-2xl font-semibold">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}

function evidenceModeLabel(result: Record<string, unknown> | undefined): string {
  const mode = result?.evidenceMode;
  if (mode === "deep") return "Deep investigation";
  if (mode === "auto_escalated") return "Auto-escalated";
  return "Standard check";
}

function JobDetail({ job }: { job: EvidenceJobSummary }) {
  const result = job.result as Record<string, unknown> | undefined;
  const sources = (result?.sources ?? []) as EvidenceSource[];
  const trace = result?.investigationTrace as
    | Array<{ step: number; stage: string; summary: string }>
    | undefined;

  return (
    <div className="space-y-3 border-t border-border bg-muted/20 px-4 py-3">
      <div className="grid gap-2 sm:grid-cols-2">
        <p className="text-[11px] text-muted-foreground">
          <span className="font-semibold text-foreground/80">Mode: </span>
          {evidenceModeLabel(result)}
        </p>
        <p className="text-[11px] text-muted-foreground">
          <span className="font-semibold text-foreground/80">Should escalate: </span>
          {result?.shouldEscalate === true ? "Yes" : "No"}
        </p>
      </div>

      {typeof result?.escalationReason === "string" && result.escalationReason && (
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Escalation reason
          </p>
          <p className="text-[12px] leading-relaxed text-foreground/85">
            {result.escalationReason}
          </p>
        </div>
      )}

      {Array.isArray(result?.escalationSignals) && result.escalationSignals.length > 0 && (
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Escalation signals
          </p>
          <ul className="space-y-0.5">
            {(result.escalationSignals as string[]).map((signal) => (
              <li key={signal} className="text-[11px] text-muted-foreground">
                · {signal.replace(/_/g, " ")}
              </li>
            ))}
          </ul>
        </div>
      )}

      {typeof result?.summary === "string" && result.summary.length > 0 && (
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Summary
          </p>
          <p className="text-[12px] leading-relaxed text-foreground/85">
            {result.summary}
          </p>
        </div>
      )}

      {sources.length > 0 && (
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Sources
          </p>
          <ul className="space-y-2">
            {sources.map((source) => (
              <li
                key={source.id}
                className="rounded-md border border-border/70 bg-background/40 px-2.5 py-2"
              >
                <p className="text-[11px] font-medium text-foreground/90">
                  {source.title}
                </p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">
                  {source.supportLevel}
                  {source.canAttachAsSupport ? " · attachable" : ""}
                </p>
                {source.evidencePassages && source.evidencePassages.length > 0 && (
                  <p className="mt-1 line-clamp-3 text-[10px] leading-relaxed text-muted-foreground">
                    {source.evidencePassages[0]}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {trace && trace.length > 0 && (
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Investigation trace
          </p>
          <ol className="space-y-1.5">
            {trace.map((step) => (
              <li key={step.step} className="text-[11px] text-muted-foreground">
                <span className="font-medium text-foreground/85">
                  {step.step}. {step.stage.replace(/_/g, " ")}:
                </span>{" "}
                {step.summary}
              </li>
            ))}
          </ol>
        </div>
      )}

      {job.error && (
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-red-400/90">
            Error
          </p>
          <p className="whitespace-pre-wrap text-[11px] leading-relaxed text-red-300/90">
            {job.error}
          </p>
        </div>
      )}
    </div>
  );
}

function JobRow({ job }: { job: EvidenceJobSummary }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr
        className="cursor-pointer border-b border-border/60 hover:bg-muted/30"
        onClick={() => setExpanded((open) => !open)}
      >
        <td className="px-3 py-2.5 text-[11px] text-foreground/90">
          {truncate(job.claim, 48)}
        </td>
        <td className="px-3 py-2.5 text-[11px] text-muted-foreground">
          {evidenceModeLabel(job.result as Record<string, unknown> | undefined)}
        </td>
        <td className="px-3 py-2.5 text-[11px] text-muted-foreground">
          {(job.result as Record<string, unknown> | undefined)?.shouldEscalate === true
            ? "Yes"
            : "—"}
        </td>
        <td className="px-3 py-2.5 text-[11px] capitalize text-muted-foreground">
          {job.status}
        </td>
        <td className="px-3 py-2.5 text-[11px] text-muted-foreground">
          {job.stage}
        </td>
        <td className="px-3 py-2.5 text-[11px] text-muted-foreground">
          {job.claimVerdict ?? "—"}
        </td>
        <td className="px-3 py-2.5 text-[11px] text-muted-foreground">
          {job.verificationBasis ?? "—"}
        </td>
        <td className="px-3 py-2.5 text-[11px] text-muted-foreground">
          {job.sourceCount ?? "—"}
        </td>
        <td className="px-3 py-2.5 text-[11px] text-muted-foreground">
          {job.attachableSourceCount ?? "—"}
        </td>
        <td className="px-3 py-2.5 text-[11px] text-muted-foreground">
          {formatMs(job.latencyMs)}
        </td>
        <td className="px-3 py-2.5 text-[11px] text-red-300/90">
          {job.error ? truncate(job.error, 32) : "—"}
        </td>
        <td className="px-2 py-2.5 text-muted-foreground">
          <ChevronDown
            className={cn("h-3.5 w-3.5 transition-transform", expanded && "rotate-180")}
            strokeWidth={2}
          />
        </td>
      </tr>
      {expanded && (
        <tr className="border-b border-border/60">
          <td colSpan={12} className="p-0">
            <JobDetail job={job} />
          </td>
        </tr>
      )}
    </>
  );
}

export function EvidenceObservabilityPanel() {
  const [jobs, setJobs] = useState<EvidenceJobSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const loadJobs = useCallback(async () => {
    try {
      const data = await fetchEvidenceJobs();
      setJobs(data.jobs);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Evidence job service is unavailable.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadJobs();
  }, [loadJobs]);

  useEffect(() => {
    if (!autoRefresh) return;
    const timer = setInterval(() => {
      void loadJobs();
    }, AUTO_REFRESH_MS);
    return () => clearInterval(timer);
  }, [autoRefresh, loadJobs]);

  const stats = useMemo(() => {
    const completed = jobs.filter((job) => job.status === "completed");
    const failed = jobs.filter((job) => job.status === "failed");
    const latencies = completed
      .map((job) => job.latencyMs)
      .filter((value): value is number => typeof value === "number");
    const avgLatency =
      latencies.length > 0
        ? Math.round(latencies.reduce((sum, value) => sum + value, 0) / latencies.length)
        : null;
    const cacheHits = jobs.filter((job) => job.cacheHit === true).length;

    return {
      total: jobs.length,
      completed: completed.length,
      failed: failed.length,
      avgLatency,
      cacheHits,
    };
  }, [jobs]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Internal
          </p>
          <h1 className="mt-1 text-2xl font-bold text-foreground">
            Evidence job observability
          </h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Recent async evidence searches from Redis via FastAPI.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(event) => setAutoRefresh(event.target.checked)}
              className="rounded border-border"
            />
            Auto-refresh (5s)
          </label>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void loadJobs()}
            className="h-8 gap-1.5 text-[11px]"
          >
            <RefreshCw className="h-3.5 w-3.5" strokeWidth={2} />
            Refresh
          </Button>
          <Button variant="ghost" size="sm" asChild className="h-8 text-[11px]">
            <Link href="/">Back to app</Link>
          </Button>
        </div>
      </div>

      {error && (
        <Card className="mb-6 border-red-500/25 bg-red-500/5">
          <CardContent className="p-4 text-[13px] text-red-300/90">
            {error}
          </CardContent>
        </Card>
      )}

      {!error && !loading && jobs.length === 0 && (
        <Card className="mb-6 border-dashed">
          <CardContent className="p-6 text-center text-[13px] text-muted-foreground">
            Run an evidence search to see jobs here.
          </CardContent>
        </Card>
      )}

      {!error && jobs.length > 0 && (
        <>
          <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <SummaryCard label="Recent jobs" value={stats.total} />
            <SummaryCard label="Completed" value={stats.completed} />
            <SummaryCard label="Failed" value={stats.failed} />
            <SummaryCard label="Avg latency" value={formatMs(stats.avgLatency)} />
            <SummaryCard label="Cache hits" value={stats.cacheHits} />
          </div>

          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-base">Recent jobs</CardTitle>
              <CardDescription className="text-[12px]">
                Click a row to expand summary, sources, and errors.
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto p-0 pb-2">
              <table className="w-full min-w-[1100px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-border bg-muted/30 text-[10px] uppercase tracking-wide text-muted-foreground">
                    <th className="px-3 py-2 font-medium">Claim</th>
                    <th className="px-3 py-2 font-medium">Mode</th>
                    <th className="px-3 py-2 font-medium">Escalate</th>
                    <th className="px-3 py-2 font-medium">Status</th>
                    <th className="px-3 py-2 font-medium">Stage</th>
                    <th className="px-3 py-2 font-medium">Verdict</th>
                    <th className="px-3 py-2 font-medium">Basis</th>
                    <th className="px-3 py-2 font-medium">Sources</th>
                    <th className="px-3 py-2 font-medium">Attach</th>
                    <th className="px-3 py-2 font-medium">Latency</th>
                    <th className="px-3 py-2 font-medium">Error</th>
                    <th className="px-3 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <JobRow key={job.jobId} job={job} />
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </>
      )}

      {loading && !error && (
        <p className="text-[13px] text-muted-foreground">Loading jobs…</p>
      )}
    </div>
  );
}
