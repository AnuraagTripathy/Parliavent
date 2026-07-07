import { existsSync, readFileSync } from "node:fs";
import { EVIDENCE_EVAL_CASES, type EvidenceEvalCase } from "../src/lib/evidence/evalCases";
import { searchEvidenceWithMode } from "../src/lib/evidence/searchEvidenceWithMode";
import type {
  ClaimVerdict,
  EvidenceResultMode,
  EvidenceSearchResponse,
} from "../src/lib/types";

type EvalRunMode = "standard" | "deep" | "auto";

/** Map eval expected tags to router signal ids. */
const EVAL_SIGNAL_ALIASES: Record<string, string[]> = {
  medical_or_scientific: ["medical_or_scientific"],
  causal: ["causal"],
  numeric: ["numeric"],
  timeline: ["timeline"],
  absolute_language: ["absolute_language"],
  broad_or_vague: ["broad_or_vague"],
};

function loadEnvFiles(): void {
  for (const file of [".env.local", ".env"]) {
    if (!existsSync(file)) continue;

    for (const rawLine of readFileSync(file, "utf8").split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;

      const eq = line.indexOf("=");
      if (eq === -1) continue;

      const key = line.slice(0, eq).trim();
      let value = line.slice(eq + 1).trim();

      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  }
}

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    console.error(`Missing required environment variable: ${name}`);
    console.error("Set it in .env.local or export it before running evals.");
    process.exit(1);
  }
  return value;
}

interface ModeRunResult {
  caseId: string;
  runMode: EvalRunMode;
  response: EvidenceSearchResponse;
  pass: boolean;
  failures: string[];
  latencyMs: number;
  falseSupportFailure: boolean;
  routerDidEscalate: boolean;
  escalationSignals: string[];
  evidenceMode?: EvidenceResultMode;
  autoEscalated: boolean;
}

interface CompareRow {
  caseId: string;
  claim: string;
  expectedVerdicts: ClaimVerdict[];
  routerShouldEscalate: boolean;
  routerDidEscalate: boolean;
  standard: ModeRunResult;
  deep: ModeRunResult;
  auto: ModeRunResult;
  winner: string;
}

function evaluateCase(
  evalCase: EvidenceEvalCase,
  response: EvidenceSearchResponse,
): { pass: boolean; failures: string[] } {
  const failures: string[] = [];

  if (!evalCase.expectedVerdicts.includes(response.claimVerdict)) {
    failures.push(
      `verdict "${response.claimVerdict}" not in [${evalCase.expectedVerdicts.join(", ")}]`,
    );
  }

  const attachableSources = response.sources.filter(
    (source) => source.canAttachAsSupport,
  );

  if (evalCase.mustNotHaveSupportingSource && attachableSources.length > 0) {
    failures.push(
      `expected no attachable supporting sources, got ${attachableSources.length}`,
    );
  }

  if (
    evalCase.mustHaveAtLeastOneAttachableSource &&
    attachableSources.length === 0
  ) {
    failures.push("expected at least one attachable supporting source, got 0");
  }

  if (
    evalCase.mustNotBeFullySupported &&
    response.claimVerdict === "supported"
  ) {
    failures.push('expected claimVerdict not to be "supported"');
  }

  return { pass: failures.length === 0, failures };
}

function hasFalseSupportFailure(
  evalCase: EvidenceEvalCase,
  response: EvidenceSearchResponse,
): boolean {
  const attachable = response.sources.filter((s) => s.canAttachAsSupport).length;
  if (evalCase.mustNotHaveSupportingSource && attachable > 0) return true;
  if (evalCase.mustNotBeFullySupported && response.claimVerdict === "supported") {
    return true;
  }
  return false;
}

function claimHasCausalLanguage(claim: string): boolean {
  return /\b(cause|causes|caused|induce|lead to|linked to)\b/i.test(claim);
}

function expectedSignalMatched(
  expectedTag: string,
  actualSignals: string[],
  claim: string,
): boolean {
  if (expectedTag === "causal" && claimHasCausalLanguage(claim)) {
    const aliases = EVAL_SIGNAL_ALIASES.causal;
    if (aliases.some((alias) => actualSignals.includes(alias))) {
      return true;
    }
  }

  const aliases = EVAL_SIGNAL_ALIASES[expectedTag] ?? [expectedTag];
  return aliases.some((alias) => actualSignals.includes(alias));
}

function signalsMatchExpected(
  evalCase: EvidenceEvalCase,
  actualSignals: string[],
): boolean {
  if (!evalCase.expectedEscalationSignals?.length) {
    return true;
  }
  return evalCase.expectedEscalationSignals.every((tag) =>
    expectedSignalMatched(tag, actualSignals, evalCase.claim),
  );
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1)}…`;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const CASE_DELAY_MS = 15_000;
const MAX_UNCLEAR_RETRIES = 2;

async function runEvalMode(
  claim: string,
  runMode: EvalRunMode,
): Promise<EvidenceSearchResponse> {
  const params =
    runMode === "deep"
      ? { claim, mode: "deep" as const }
      : runMode === "auto"
        ? { claim, mode: "standard" as const, autoEscalate: true }
        : { claim, mode: "standard" as const, autoEscalate: false };

  let response = await searchEvidenceWithMode(params);

  for (let attempt = 1; attempt <= MAX_UNCLEAR_RETRIES; attempt++) {
    if (response.claimVerdict !== "unclear") break;
    console.warn(
      `  [${runMode}] unclear — retry ${attempt}/${MAX_UNCLEAR_RETRIES} after ${CASE_DELAY_MS / 1000}s...`,
    );
    await sleep(CASE_DELAY_MS);
    response = await searchEvidenceWithMode(params);
  }

  return response;
}

async function runModeForCase(
  evalCase: EvidenceEvalCase,
  runMode: EvalRunMode,
): Promise<ModeRunResult> {
  const startedAt = Date.now();
  const response = await runEvalMode(evalCase.claim, runMode);
  const latencyMs = Date.now() - startedAt;
  const { pass, failures } = evaluateCase(evalCase, response);

  return {
    caseId: evalCase.id,
    runMode,
    response,
    pass,
    failures,
    latencyMs,
    falseSupportFailure: hasFalseSupportFailure(evalCase, response),
    routerDidEscalate: response.shouldEscalate ?? false,
    escalationSignals: response.escalationSignals ?? [],
    evidenceMode: response.evidenceMode,
    autoEscalated: response.evidenceMode === "auto_escalated",
  };
}

function pickWinner(
  standard: ModeRunResult,
  deep: ModeRunResult,
  auto: ModeRunResult,
): string {
  if (standard.pass && !deep.pass && !auto.pass) return "standard";
  if (standard.pass && !deep.pass && auto.pass) return "auto";
  if (standard.pass && deep.pass && !auto.pass) return "deep";
  if (standard.pass && !deep.pass) return "regression";
  if (standard.pass && !auto.pass && deep.pass) return "deep";

  const passers: Array<{ mode: EvalRunMode; result: ModeRunResult }> = [];
  if (standard.pass) passers.push({ mode: "standard", result: standard });
  if (deep.pass) passers.push({ mode: "deep", result: deep });
  if (auto.pass) passers.push({ mode: "auto", result: auto });

  if (passers.length === 0) return "none";

  if (passers.length >= 2) {
    passers.sort((a, b) => a.result.latencyMs - b.result.latencyMs);
    const fastest = passers[0];
    const second = passers[1];
    if (second.result.latencyMs - fastest.result.latencyMs < 2000) {
      return "tie";
    }
    return fastest.mode;
  }

  return passers[0].mode;
}

function parseCliMode(): EvalRunMode[] | "compare" {
  const modeArgIndex = process.argv.findIndex((arg) => arg === "--mode");
  if (modeArgIndex !== -1) {
    const value = process.argv[modeArgIndex + 1];
    if (value === "standard" || value === "deep" || value === "auto") {
      return [value];
    }
    console.error(`Unknown --mode value: ${value}. Use standard, deep, or auto.`);
    process.exit(1);
  }

  if (process.argv.includes("--compare")) return "compare";

  // Legacy flags
  if (process.argv.includes("--all-modes")) return ["standard", "deep", "auto"];
  if (process.argv.includes("--deep")) return ["deep"];
  if (process.argv.includes("--auto-escalate") || process.argv.includes("--auto")) {
    return ["auto"];
  }

  return ["standard"];
}

function printSingleModeTable(results: ModeRunResult[]): void {
  const caseById = new Map(EVIDENCE_EVAL_CASES.map((c) => [c.id, c]));
  const headers = [
    "ID",
    "Mode",
    "Claim",
    "Expected",
    "Actual",
    "Pass",
    "Router",
    "Signals",
    "Attach",
    "Latency",
  ];

  const rows = results.map((result) => {
    const evalCase = caseById.get(result.caseId)!;
    const signalOk = signalsMatchExpected(evalCase, result.escalationSignals);
    return [
      result.caseId,
      result.runMode,
      truncate(evalCase.claim, 28),
      evalCase.expectedVerdicts.join("|"),
      result.response.claimVerdict,
      result.pass ? "PASS" : "FAIL",
      result.routerDidEscalate ? "escalate" : "std",
      signalOk ? "ok" : "miss",
      String(result.response.sources.filter((s) => s.canAttachAsSupport).length),
      `${result.latencyMs}ms`,
    ];
  });

  const widths = headers.map((header, index) =>
    Math.max(header.length, ...rows.map((row) => row[index].length)),
  );
  const formatRow = (cells: string[]) =>
    cells.map((cell, i) => cell.padEnd(widths[i])).join("  ");

  console.log(formatRow(headers));
  console.log(widths.map((w) => "-".repeat(w)).join("  "));
  for (const row of rows) {
    console.log(formatRow(row));
  }

  for (const result of results.filter((r) => !r.pass)) {
    console.log(`\nFailures for ${result.caseId} [${result.runMode}]:`);
    for (const failure of result.failures) {
      console.log(`  - ${failure}`);
    }
  }
}

function printCompareTable(rows: CompareRow[]): void {
  const headers = [
    "Claim",
    "Expected",
    "Std",
    "Deep",
    "Auto",
    "Std✓",
    "Deep✓",
    "Auto✓",
    "Router",
    "Exp",
    "DidEsc",
    "Signals",
    "Std ms",
    "Deep ms",
    "Auto ms",
    "Winner",
  ];

  const formatMode = (r: ModeRunResult) => r.response.claimVerdict;
  const formatPass = (r: ModeRunResult) => (r.pass ? "Y" : "N");

  const tableRows = rows.map((row) => [
    truncate(row.claim, 24),
    row.expectedVerdicts.join("|"),
    formatMode(row.standard),
    formatMode(row.deep),
    formatMode(row.auto),
    formatPass(row.standard),
    formatPass(row.deep),
    formatPass(row.auto),
    row.standard.routerDidEscalate ? "yes" : "no",
    row.routerShouldEscalate ? "exp" : "—",
    row.auto.autoEscalated ? "yes" : "no",
    truncate(row.standard.escalationSignals.join(",") || "—", 20),
    String(row.standard.latencyMs),
    String(row.deep.latencyMs),
    String(row.auto.latencyMs),
    row.winner,
  ]);

  const widths = headers.map((header, index) =>
    Math.max(header.length, ...tableRows.map((row) => row[index].length)),
  );
  const formatRow = (cells: string[]) =>
    cells.map((cell, i) => cell.padEnd(widths[i])).join("  ");

  console.log(formatRow(headers));
  console.log(widths.map((w) => "-".repeat(w)).join("  "));
  for (const row of tableRows) {
    console.log(formatRow(row));
  }
}

function printRouterMetrics(rows: CompareRow[]): void {
  const routerDecisions = rows.map((row) => ({
    expected: row.routerShouldEscalate,
    routerSays: row.standard.routerDidEscalate,
    didEscalate: row.auto.autoEscalated,
    caseId: row.caseId,
    signals: row.standard.escalationSignals,
    evalCase: EVIDENCE_EVAL_CASES.find((c) => c.id === row.caseId)!,
  }));

  const routerRecommended = routerDecisions.filter((d) => d.routerSays);
  const expectedEscalate = routerDecisions.filter((d) => d.expected);

  const precisionHits = routerRecommended.filter((d) => d.expected).length;
  const recallHits = expectedEscalate.filter((d) => d.routerSays).length;

  const missedHard = expectedEscalate
    .filter((d) => !d.routerSays)
    .map((d) => d.caseId);
  const unnecessary = routerRecommended
    .filter((d) => !d.expected)
    .map((d) => d.caseId);
  const unnecessaryAuto = routerDecisions
    .filter((d) => d.didEscalate && !d.expected)
    .map((d) => d.caseId);

  const autoEscalated = rows.filter((r) => r.auto.autoEscalated).length;

  console.log("\n=== Router metrics (from standard run) ===");
  console.log(
    `  router shouldEscalate yes: ${routerRecommended.length}/${rows.length}`,
  );
  console.log(
    `  precision: ${precisionHits}/${routerRecommended.length || 0} (router yes when expected)`,
  );
  console.log(
    `  recall: ${recallHits}/${expectedEscalate.length || 0} (expected cases router caught)`,
  );
  console.log(`  missed hard cases: ${missedHard.length ? missedHard.join(", ") : "none"}`);
  console.log(
    `  unnecessary router escalations: ${unnecessary.length ? unnecessary.join(", ") : "none"}`,
  );
  console.log(
    `  unnecessary auto escalations: ${unnecessaryAuto.length ? unnecessaryAuto.join(", ") : "none"}`,
  );
  console.log(`  auto-escalated cases (didEscalate): ${autoEscalated}/${rows.length}`);

  for (const d of routerDecisions) {
    if (!d.evalCase.expectedEscalationSignals?.length) continue;
    const ok = signalsMatchExpected(d.evalCase, d.signals);
    if (!ok) {
      console.log(
        `  signal mismatch ${d.caseId}: expected [${d.evalCase.expectedEscalationSignals.join(", ")}] got [${d.signals.join(", ")}]`,
      );
    }
  }
}

function printQualityMetrics(
  mode: "single" | "compare",
  standard: ModeRunResult[],
  deep: ModeRunResult[] = [],
  auto: ModeRunResult[] = [],
  compareRows: CompareRow[] = [],
): void {
  const summarize = (results: ModeRunResult[], label: string) => {
    if (results.length === 0) return;
    const passed = results.filter((r) => r.pass).length;
    const avgLatency = Math.round(
      results.reduce((sum, r) => sum + r.latencyMs, 0) / results.length,
    );
    const falseSupport = results.filter((r) => r.falseSupportFailure).length;
    console.log(`  ${label} pass rate: ${passed}/${results.length}`);
    console.log(`  ${label} avg latency: ${avgLatency}ms`);
    console.log(`  ${label} false support failures: ${falseSupport}`);
  };

  console.log("\n=== Quality metrics ===");
  summarize(standard, "standard");
  if (mode === "compare") {
    summarize(deep, "deep");
    summarize(auto, "auto");

    const deepRegressions = compareRows.filter(
      (r) => r.standard.pass && !r.deep.pass,
    );
    const autoRegressions = compareRows.filter(
      (r) => r.standard.pass && !r.auto.pass,
    );

    console.log(`  deep regressions (std pass, deep fail): ${deepRegressions.length}`);
    for (const r of deepRegressions) {
      console.log(
        `    ${r.caseId}: std=${r.standard.response.claimVerdict} deep=${r.deep.response.claimVerdict}`,
      );
    }
    console.log(`  auto regressions (std pass, auto fail): ${autoRegressions.length}`);
    for (const r of autoRegressions) {
      console.log(
        `    ${r.caseId}: std=${r.standard.response.claimVerdict} auto=${r.auto.response.claimVerdict}`,
      );
    }
  }
}

async function runSingleMode(modes: EvalRunMode[]): Promise<void> {
  const results: ModeRunResult[] = [];

  for (const evalCase of EVIDENCE_EVAL_CASES) {
    for (const runMode of modes) {
      if (results.length > 0) await sleep(CASE_DELAY_MS);
      console.log(`Running ${evalCase.id} [${runMode}]...`);
      results.push(await runModeForCase(evalCase, runMode));
    }
  }

  printSingleModeTable(results);

  if (modes.includes("standard") && modes.length === 1) {
    const compareLike: CompareRow[] = results.map((r) => {
      const evalCase = EVIDENCE_EVAL_CASES.find((c) => c.id === r.caseId)!;
      return {
        caseId: r.caseId,
        claim: evalCase.claim,
        expectedVerdicts: evalCase.expectedVerdicts,
        routerShouldEscalate: evalCase.shouldEscalate,
        routerDidEscalate: r.routerDidEscalate,
        standard: r,
        deep: r,
        auto: r,
        winner: r.pass ? "standard" : "none",
      };
    });
    printRouterMetrics(compareLike);
  }

  printQualityMetrics(
    "single",
    results.filter((r) => r.runMode === "standard"),
    results.filter((r) => r.runMode === "deep"),
    results.filter((r) => r.runMode === "auto"),
  );

  const passed = results.filter((r) => r.pass).length;
  console.log(`\nTotal: ${passed} passed, ${results.length - passed} failed (${results.length} runs)`);
  if (passed < results.length) process.exit(1);
}

async function runCompareMode(): Promise<void> {
  const compareRows: CompareRow[] = [];

  for (const evalCase of EVIDENCE_EVAL_CASES) {
    if (compareRows.length > 0) await sleep(CASE_DELAY_MS);

    console.log(`\nCompare: ${evalCase.id}`);
    console.log("  running standard...");
    const standard = await runModeForCase(evalCase, "standard");
    await sleep(CASE_DELAY_MS);

    console.log("  running deep...");
    const deep = await runModeForCase(evalCase, "deep");
    await sleep(CASE_DELAY_MS);

    console.log("  running auto...");
    const auto = await runModeForCase(evalCase, "auto");

    compareRows.push({
      caseId: evalCase.id,
      claim: evalCase.claim,
      expectedVerdicts: evalCase.expectedVerdicts,
      routerShouldEscalate: evalCase.shouldEscalate,
      routerDidEscalate: standard.routerDidEscalate,
      standard,
      deep,
      auto,
      winner: pickWinner(standard, deep, auto),
    });
  }

  printCompareTable(compareRows);
  printRouterMetrics(compareRows);
  printQualityMetrics(
    "compare",
    compareRows.map((r) => r.standard),
    compareRows.map((r) => r.deep),
    compareRows.map((r) => r.auto),
    compareRows,
  );

  const allResults = compareRows.flatMap((r) => [r.standard, r.deep, r.auto]);
  const passed = allResults.filter((r) => r.pass).length;
  console.log(
    `\nTotal: ${passed} passed, ${allResults.length - passed} failed (${allResults.length} runs)`,
  );

  const anyRegression = compareRows.some(
    (r) => r.winner === "regression" || r.winner === "none",
  );
  if (passed < allResults.length || anyRegression) {
    process.exit(1);
  }
}

async function main(): Promise<void> {
  loadEnvFiles();
  requireEnv("TAVILY_API_KEY");
  requireEnv("GROQ_API_KEY");

  const cliMode = parseCliMode();

  console.log(`Evidence eval — ${EVIDENCE_EVAL_CASES.length} cases`);
  console.log(
    cliMode === "compare"
      ? "Mode: compare (standard + deep + auto per case)"
      : `Mode: ${(cliMode as EvalRunMode[]).join(", ")}`,
  );
  console.log("");

  if (cliMode === "compare") {
    await runCompareMode();
  } else {
    await runSingleMode(cliMode);
  }
}

main().catch((error) => {
  console.error("Evidence eval run failed:", error);
  process.exit(1);
});
