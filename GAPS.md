# Parliavent — Gaps and Weaknesses Audit

Honest audit, ordered by severity (most important first). Every item says what it is, where it lives, why it matters, and a fix scoped small enough to execute as a single task. Paths are relative to `parliavent/frontend/` unless noted.

---

## 1. CRITICAL — No ownership checks on publish/findings/evidence routes (broken access control)

> **STATUS: FIXED (2026-07-06).** All three routes (plus the post DELETE route) now return 403 unless `post.authorId === auth.authorId`. Null-author posts are immutable.

**What:** `POST /api/posts/[postId]/publish`, `POST /api/posts/[postId]/findings`, and `POST /api/findings/[findingId]/evidence` verify that the caller is *signed in* but never that the caller *owns the post*. Publish is worst: it overwrites `text`, replaces all findings, and sets `authorId`/`authorName` to the **caller**, effectively letting any authenticated user hijack and rewrite anyone's post.

**Where:**
- `src/app/api/posts/[postId]/publish/route.ts` (no author check anywhere; sets `authorId: auth.authorId` on line ~110)
- `src/app/api/posts/[postId]/findings/route.ts` (calls `requireAuthUser` then ignores the result)
- `src/app/api/findings/[findingId]/evidence/route.ts` (same)

**Why it matters:** Full write access to other users' content for any registered account. Also lets users forge the "reviewed/vetted" presentation (see item 4).

**Fix (single task):** In each route, after loading the post (for the evidence route, load `finding.post` via include), return 403 unless `post.authorId === auth.authorId` (or `post.authorId === null` during a transition period). Mirror the pattern already used in `src/app/api/posts/[postId]/route.ts` DELETE.

---

## 2. CRITICAL — Finding IDs are client/LLM-generated and globally colliding; publish can corrupt other posts' findings

> **STATUS: FIXED (2026-07-06).** Finding ids are now scoped per post (`${postId}-${id}`) and source ids per finding via `src/lib/scopedIds.ts`, applied in the publish/findings/evidence routes; `persistPublishFlow` addresses evidence saves by the scoped id. (Client-side `mergeFindings` id instability — item 13 — is still open.)

**What:** Finding primary keys come from the LLM/sanitizer (`finding-claim-1`, `finding-fallacy-1`, …) and are only unique *within one post* (`ensureUniqueIds` in `src/lib/judge/schema.ts`). The publish and findings routes do `prisma.finding.upsert({ where: { id: finding.id }, ... })`. When two posts (any two users) both have a finding named `finding-claim-1` — which is the common case — the second publish **updates the first post's finding row** (the update path does not set `postId`), overwriting its content and leaving the second post without that finding. The seed script namespaces IDs (`showcase-{postKey}-{findingId}`) precisely because of this, but the live publish flow does not.

**Where:**
- `src/app/api/posts/[postId]/publish/route.ts` (upsert loop)
- `src/app/api/posts/[postId]/findings/route.ts` (identical loop)
- Same pattern for `Source` ids in `src/app/api/findings/[findingId]/evidence/route.ts` — `source.upsert({ where: { id } })` with client-supplied ids lets one user rewrite the title/publisher/url of a `Source` row cited by other posts.

**Why it matters:** Silent cross-user data corruption in normal operation, no attacker needed.

**Fix (single task):** Namespace finding ids server-side before upserting (e.g. `${postId}-${finding.id}`) in both routes, and namespace source ids per finding (or switch findings to `@default(cuid())` and match by `(postId, spanText, type)` instead). Keep the mapping so the response returns the ids the client knows.

---

## 3. HIGH — AI/quota endpoints are completely unauthenticated

> **STATUS: MOSTLY FIXED (2026-07-06).** `/api/judge`, `/api/evidence/search`, and `/api/evidence/jobs` (POST + GET, incl. `[jobId]`) now require a signed-in user, with per-user in-memory rate limits (`src/lib/rateLimit.ts`: judge 120/h, evidence 20/h shared across search+jobs). **Still open:** the FastAPI service itself remains unauthenticated on `0.0.0.0:8000` — bind to `127.0.0.1` and require the internal secret if that stack is ever deployed.

**What:** `POST /api/judge`, `POST /api/evidence/search`, `POST /api/evidence/jobs`, and `GET /api/evidence/jobs` (which returns the last 50 jobs *including other users' claims and results*) require no auth. `src/proxy.ts` (Next 16 middleware) only matches `/app/:path*` and `/admin/:path*`.

**Where:** `src/proxy.ts`; `src/app/api/judge/route.ts`; `src/app/api/evidence/search/route.ts`; `src/app/api/evidence/jobs/route.ts` and `[jobId]/route.ts`. Also the FastAPI service itself (`parliavent/services/evidence-api/app/main.py`) exposes unauthenticated `POST/GET /evidence/jobs` on `0.0.0.0:8000` — only the `PATCH .../stage` endpoint checks the shared secret.

**Why it matters:** Anyone can burn the Groq and Tavily quotas/budget (each evidence search = 3 Tavily queries + up to 5 page fetches + 1–2 Groq calls), and enumerate what other users are fact-checking. There is no rate limiting anywhere.

**Fix (single task):** Add `requireAuthUser(request)` (from `src/lib/auth/session.ts`) at the top of the judge and evidence route handlers, mirroring the debates routes. Separately, bind FastAPI to `127.0.0.1` by default in `app/config.py` and require the internal secret on job creation/list.

---

## 4. HIGH — Server trusts client-supplied findings and evidence wholesale at publish

> **STATUS: FIRST INCREMENT DONE (2026-07-06).** `isValidFindingInput` (`src/lib/db/findingInput.ts`) whitelists `type`/`status`/`claimKind`; publish drops findings whose `spanText` isn't in the submitted text; the evidence route whitelists `claimKind` and recomputes `canAttachAsSupport`/`isAttached` server-side (`isAttachableUnderVerdict`). **Still open:** server-side re-verification of evidence content (fabricated verdicts/summaries/sources are shape-valid).

**What:** The entire review state (findings, statuses like `source_attached`, evidence verdicts, source lists with `canAttachAsSupport: true`) is client state that gets persisted verbatim at publish. A user can bypass the UI and POST fabricated findings/evidence — e.g. a fake `source_attached` finding citing a made-up "high credibility" source — and the published view renders it as if the AI review vetted it. `isFinding()` only checks that fields are strings; `type`/`status` aren't validated against enums (invalid values become Prisma runtime errors → 500 instead of 400).

**Where:** `src/app/api/posts/[postId]/publish/route.ts`, `src/app/api/posts/[postId]/findings/route.ts`, `src/app/api/findings/[findingId]/evidence/route.ts`; client trust surface defined in `src/lib/api/persistence.ts` (`persistPublishFlow`).

**Why it matters:** The product's entire value proposition is that the review chrome (citations, caveats, "sourced" badges) is trustworthy. Right now it is user-controlled data. Severity: high for integrity, though it requires deliberate abuse rather than accident.

**Fix (single task, first increment):** Validate `type`/`status`/`claimKind` against explicit whitelists in `isFinding` (return 400), enforce `spanText` is a substring of the submitted text, and recompute `canAttachAsSupport` server-side via `computeCanAttachAsSupport` + `enforceAttachabilityForClaimVerdict` (`src/lib/evidence/sourceEligibility.ts`) instead of trusting the boolean. Full server-side re-verification of evidence is a larger follow-up.

---

## 5. HIGH — Zero automated tests

> **STATUS: LARGELY FIXED (2026-07-06).** Vitest is installed (`npm test` / `npm run test:watch`, config in `vitest.config.ts`); suites cover `sanitizeAIFindings`, `mergeFindings`, `applyUserApprovedEdit`, `routeEvidence`, `claimCaveats`, `scopedIds`, `rateLimit`, `sourceEligibility`, and `findingInput` (the `highlightText` suite was removed with that dead module in the repo cleanup). CI (`.github/workflows/ci.yml`) runs lint + test + build on every push. **Still open:** `db/mappers` round-trip tests and publish-route transaction tests (need a test DB or mocked Prisma).

**What:** There is no test framework, no test files (`**/*.{test,spec}.*` matches nothing), and no CI config. The only checks are ESLint and `next build`. The "evals" (`npm run eval:evidence`, `docs/judge-evals.md`) require live Groq/Tavily keys and human judgment.

**Where:** Whole repo; `package.json` has no test script.

**Untested critical paths, in priority order:**
1. `src/lib/judge/schema.ts` — `sanitizeAIFindings` (span filtering, dedupe, downgrade heuristics). Pure function, high fan-in.
2. `src/lib/api/judge.ts` — `mergeFindings` (resolution-state preservation across re-judging).
3. `src/lib/applyUserEdit.ts`, `src/lib/spanOverlap.ts` — the only text-mutation path.
4. `src/lib/evidence/evidenceRouter.ts` — escalation decisions (this is what the Python copy silently drifts from).
5. `src/lib/claimCaveats.ts` + `src/lib/publishedReviewFindings.ts` — what caveats get published.
6. `src/lib/db/mappers.ts` — DB→app conversions.
7. Publish route transaction behavior (needs a test DB or mocked Prisma).

**Fix (single task):** `npm i -D vitest`, add `"test": "vitest run"`, and write the first suite for `sanitizeAIFindings` covering: non-substring span dropped, overlap dedupe keeps broadest, informal-register fallacy downgraded to clarity, scare-language fallacy downgraded to claim, 5-finding cap. Each subsequent numbered item above is its own follow-up task.

---

## 6. HIGH — Evidence router duplicated line-for-line in TypeScript and Python

> **STATUS: FIXED (2026-07-06).** `services/evidence-api/app/evidence_router.py` is deleted. `worker.py` no longer re-derives escalation — it fails the job loudly if the Next.js pipeline result is missing `shouldEscalate`. The TS router is now the single implementation and has a test suite.

**What:** The escalation heuristics (regex sets, signal detection, escalation decision, reason strings) exist twice: `src/lib/evidence/evidenceRouter.ts` and `parliavent/services/evidence-api/app/evidence_router.py`. They are already only *mostly* identical (the Python version lacks `RISK_SIGNAL_IDS`/`WEAK_SIGNAL_IDS`, label maps are structured differently). Any tuning done in one will silently diverge from the other.

**Where:** files above; the Python copy is invoked from `app/worker.py` only when the Next.js result lacks `shouldEscalate` — which, given `searchEvidenceWithMode` always runs the TS router for standard mode, means the Python copy is nearly dead code already.

**Why it matters:** Behavioral drift between the sync path and the jobs path; double maintenance burden.

**Fix (single task):** Delete `evidence_router.py` and the `route_evidence`/`merge_router_into_result` call in `worker.py` (the TS engine already attaches router output). If a guard is wanted, have the worker fail loudly when `shouldEscalate` is missing instead of re-deriving it.

---

## 7. MEDIUM-HIGH — SSRF surface and unbounded fetch in the page fetcher

> **STATUS: FIXED (2026-07-06).** `fetchSinglePage` now rejects private/loopback/link-local/metadata hosts (IP literals + DNS resolution), caps response bodies at 2 MB via streaming, and follows at most 3 redirects manually with every hop re-validated.

**What:** `fetchSinglePage` fetches any http(s) URL returned by Tavily (and follows redirects) from the server, with no private-IP/localhost filtering and no response size cap (`response.text()` on arbitrary pages). Deep investigation fetches more URLs from follow-up queries.

**Where:** `src/lib/evidence/pageFetcher.ts`; `src/lib/evidence/deepInvestigation.ts`.

**Why it matters:** A crafted/compromised search result (or a poisoned Tavily response) can make the server request internal endpoints (cloud metadata, intranet) or allocate hundreds of MB for a huge page. Mitigated somewhat because URLs come from Tavily rather than directly from users — hence medium-high, not critical.

**Fix (single task):** In `fetchSinglePage`, (a) resolve and reject hosts whose IPs are private/loopback/link-local ranges, (b) stream the body and abort past ~2 MB, (c) cap redirects. All three fit in that one file.

---

## 8. MEDIUM — `/admin/evidence` has no admin gate

**What:** The evidence observability dashboard (recent jobs, claims, verdicts, latencies for *all* users) only requires being signed in — the proxy matches `/admin/:path*` with the same check as `/app`.

**Where:** `src/proxy.ts`; `src/app/admin/evidence/page.tsx`.

**Fix (single task):** Add an allowlist check (env var of admin user IDs, or a Hexclave team/permission) in the page's server component before rendering; return 404 otherwise.

---

## 9. MEDIUM — `applyUserApprovedEdit` and citation anchoring break on repeated phrases

> **STATUS: FIXED (2026-07-06).** `Finding.spanStart` (optional, not persisted) is captured in `filterFindingsBySpan` when the judge anchors a span; `applyUserApprovedEdit` and `ArgumentEditor`'s highlight segmentation (`buildDisplaySegments`) use it and fall back to first-occurrence when the offset is stale. Published-view chip anchoring still uses first-occurrence (spans come from the DB without offsets) — acceptable since published text no longer changes.

**What:** Findings anchor to `spanText` substrings. `applyUserApprovedEdit` replaces the **first** occurrence; if the flagged phrase appears twice, the wrong instance can be rewritten. Same ambiguity affects highlight rendering and `mergeFindings`' span-presence check (`text.includes(...)`).

**Where:** `src/lib/applyUserEdit.ts`; `src/lib/highlightText.ts`; `src/lib/api/judge.ts`.

**Why it matters:** Editing the user's argument incorrectly violates the core product rule (user sovereignty over text).

**Fix (single task):** Extend `Finding` with an optional occurrence index or character offset captured at highlight time, and make `applyUserApprovedEdit` accept `occurrence?: number`. Falling back to first-occurrence keeps current behavior.

---

## 10. MEDIUM — Slug generation race and N+1 loop on debate creation

> **STATUS: FIXED (2026-07-06).** The pre-check loop is gone; `POST /api/debates` now attempts the create directly and retries on Prisma `P2002` (3 sequential suffixes, then random suffixes, 6 attempts max).

**What:** `POST /api/debates` loops `while (await prisma.debate.findUnique({ where: { slug } })) suffix++` — a check-then-act race: two concurrent creates with the same motion both pass the check and one crashes with a unique-constraint 500. Also unbounded queries for popular motions.

**Where:** `src/app/api/debates/route.ts` (~line 105).

**Fix (single task):** Wrap the create in a retry-on-P2002 loop (catch Prisma unique violation, increment suffix, retry up to N times), removing the pre-check entirely.

---

## 11. MEDIUM — In-memory caches and job dedupe assume a single long-lived process

> **STATUS: PARTIALLY FIXED (2026-07-06).** Both TS caches now cap at 500 entries with oldest-first eviction (`JUDGE_CACHE_MAX_ENTRIES`, `EVIDENCE_CACHE_MAX_ENTRIES`). **Still open:** FastAPI `JobStore` stale-job dedupe (deferred — the jobs stack is not part of the v1 deployment) and moving caches to Redis if the app ever runs multi-instance.

**What:** Judge cache (`src/lib/judge/judgeCache.ts`), evidence cache (`src/lib/evidence/evidenceCache.ts`), and the Groq usage tracker are module-level `Map`s. They are unbounded except for TTL pruning on access, reset on every deploy/restart, and are per-instance (wrong results possible behind a load balancer only in the sense of wasted quota, not correctness). FastAPI's `BackgroundTasks` runs jobs in-process: if the process dies mid-job the Redis hash stays `running` forever (until the 30-min TTL), and the dedupe key keeps returning the stuck job.

**Where:** files above; `parliavent/services/evidence-api/app/main.py` + `redis_store.py`.

**Why it matters:** Fine for local dev, a trap for any real deployment (serverless especially: caches will basically never hit).

**Fix (single task):** Add a max-entry cap (e.g. 500, evict oldest) to both TS caches, and in `JobStore.create_job` treat a deduped job as stale (create a new one) if `status in (queued, running)` and `updatedAt` is older than ~5 minutes. Moving caches to Redis is a separate, larger task.

---

## 12. MEDIUM — Stale/contradictory documentation actively misleads

> **STATUS: FIXED (2026-07-06, repo cleanup).** The seven stale/superseded docs (`architecture.md`, `mvp-scope.md`, `build-plan.md`, `api-contract.md`, `persistence-plan.md`, `ai-judge-plan.md`, `realtime-checking.md`) were deleted; `frontend/README.md` rewritten to match reality; `context_only` → `related_only` corrected in `tavily-evidence-search.md`; `showcase-seed.md` moved to `parliavent/docs/`; `parliavent/.gitignore` rewritten without `backend/` references.

**What:**
- `parliavent/docs/architecture.md` and `docs/mvp-scope.md` describe an Express backend on port 3001 (`backend/src/...`) that does not exist, and say "no auth / no database / no real AI" — all false now.
- `frontend/README.md` links to a root `README.md` that doesn't exist and repeats the Express plan.
- `docs/tavily-evidence-search.md` documents `supportLevel: "context_only"` — code uses `related_only` (`src/lib/types.ts`).
- `docs/showcase-seed.md` lives at the **repo root** `docs/` while every other doc lives in `parliavent/docs/`.
- `parliavent/.gitignore` still references `backend/`.

**Why it matters:** A new engineer or model reading docs first (as instructed) will build a wrong mental model — this audit nearly did.

**Fix (single task):** Update `architecture.md` to describe the current Next.js-only architecture (or add a prominent "HISTORICAL — see PROJECT.md" banner to the stale phase docs), fix the README link, correct `context_only`→`related_only`, and move `docs/showcase-seed.md` into `parliavent/docs/`.

---

## 13. MEDIUM — `mergeFindings` keys resolution state on unstable LLM-generated ids

> **STATUS: FIXED (2026-07-06).** `mergeFindings` now matches by `(type, spanText)` first with id fallback, and a claimed-set prevents one previous finding from donating state to two incoming findings.

**What:** User resolution state (`source_attached`, `disputed`, …) survives re-judging only if the new response reuses the same finding `id`. Ids come from the model; nothing guarantees stability across runs (the cache helps only for identical text). Editing an unrelated sentence can re-run the judge, get `finding-claim-2` renamed to `finding-claim-1`, and silently drop the user's attached source.

**Where:** `src/lib/api/judge.ts` (`mergeFindings`); id assignment in `src/lib/judge/schema.ts`.

**Fix (single task):** Match findings by `(type, spanText)` first and fall back to id, inside `mergeFindings`. This is a pure-function change (and a great first unit-test target — see item 5).

---

## 14. LOW-MEDIUM — Legacy/orphaned draft posts with `authorId: null` are writable by anyone

> **STATUS: FIXED (2026-07-06).** Policy chosen: null-author posts are immutable (strict `post.authorId !== auth.authorId` → 403 on delete and publish). The duplicate null-check was removed.

**What:** `DELETE /api/posts/[postId]` only enforces ownership `if (post.authorId && ...)` — null-author posts (pre-auth data, or `SetNull` after user deletion) can be deleted by any signed-in user. The publish route (item 1) would likewise let anyone claim them. There's also a duplicated dead `if (!post)` check in the DELETE handler.

**Where:** `src/app/api/posts/[postId]/route.ts`.

**Fix (single task):** Decide a policy (null-author posts immutable except by admin), enforce it, and delete the duplicate null-check.

---

## 15. LOW-MEDIUM — Evidence job polling can loop forever; sync evidence search can run for minutes

> **STATUS: FIXED (2026-07-06).** `fetchEvidenceSearchWithJob` gives up after 3 minutes (`EVIDENCE_JOB_MAX_WAIT_MS`) with the calm failure message, and `analyzeWithGroq` caps cumulative 429-retry sleep at 20 s (`MAX_TOTAL_RETRY_WAIT_MS`). Deployment prep also added `maxDuration` exports (60 s judge, 300 s evidence routes) so Vercel doesn't kill long searches.

**What:** `fetchEvidenceSearchWithJob` polls `while (true)` with no cap; a stuck job (item 11) means the "Find sources" button spins until tab close. The sync path (`searchEvidence` + judge `analyzeWithGroq` 429-retry loop: up to 6 retries × up to ~8 s sleep) can hold a request open past typical serverless limits.

**Where:** `src/lib/api/evidence.ts` (`fetchEvidenceSearchWithJob`); `src/lib/judge/analyzeWithGroq.ts`.

**Fix (single task):** Add a deadline (e.g. 3 minutes / 120 polls) to the polling loop that throws `EVIDENCE_JOB_FAILED_MESSAGE`, and cap total retry wait in `analyzeWithGroq` (e.g. abandon after 20 s cumulative).

---

## 16. LOW — Type-system duplication and lossy `confidence` round-trip

**What:** Every Prisma enum (`FindingType`, `FindingStatus`, `ClaimVerdict`, `SupportLevel`, …) is re-declared as a string union in `src/lib/types.ts`, bridged by `as` casts in `src/lib/db/mappers.ts` — drift compiles fine. `Finding.confidence` is a string in app code (`"82%"`), a `Float?` in Postgres; `findingToCreateInput` does `parseFloat("82%")` → `82`, and `toAppFinding` returns `"82"` (percent sign lost, and a hypothetical `0.82` input would round-trip as `"0.82"` while the UI elsewhere renders `82%`).

**Where:** `src/lib/types.ts`, `prisma/schema.prisma`, `src/lib/db/mappers.ts` (`findingToCreateInput`, `toAppFinding`).

**Fix (single task):** Import Prisma's generated enum types into `types.ts` (`import type { FindingType } from "@prisma/client"`) or add a compile-time assertion linking the two; normalize confidence to a number 0–100 at the sanitizer boundary and format `%` only in the UI.

---

## 17. LOW — Dead code, deprecated shims, and copy-paste utilities

> **STATUS: MOSTLY FIXED (2026-07-06, repo cleanup).** Deleted: `searchWithTavily()` (and the doubled blank lines in that file), `mockPublishedArguments.ts` (citation palette moved to `src/lib/citationColors.ts`), `getGroqModel()`, `createReply`/`CreateReplyRequest`, `debateModeFromJudgeMode`, `scripts/debug-vax-r2.ts`, `highlightText.ts` (production-dead; its `spanStart` anchoring now lives in `ArgumentEditor.buildDisplaySegments`), six unimported components (`ThreadBranch`, `SourcePopover`, `PostCard`, `SiteHeader`, `header-2`, `ContestedChip`), unused imports/params across the codebase, and the dead `requestApplyRewrite` callback in `DebateApp`. **Still open:** `normalizeMode` copy-paste (4 files), `STOP_WORDS` triplication (`queryPlanner`/`sourceUtils`/`passageRanker`), the `.env`-loader copy-paste in scripts, doubled blank lines in the Python files, and `authorName` sent-but-ignored in client payloads.

**What/Where:**
- `searchWithTavily()` (the original single-query function) in `src/lib/evidence/searchWithTavily.ts` — superseded by `searchWithPlannedQueries`; only its errors classes are used elsewhere. Verify no importer of the function remains, then delete it.
- `src/lib/mockPublishedArguments.ts` — marked `@deprecated`, superseded by `mockFeed`.
- `getGroqModel()` (deprecated alias) in `analyzeWithGroq.ts`; `createReply` (deprecated) in `src/lib/api/persistence.ts`; `debateModeFromJudgeMode` in `mappers.ts` is an identity function.
- `normalizeMode` in `src/lib/evidence/searchEvidenceWithMode.ts` contains `mode === "standard" ? "standard" : "standard"`. The same mode-normalization function is copy-pasted in 4 files (`searchEvidenceWithMode.ts`, both evidence routes, jobs route).
- `STOP_WORDS` duplicated in `queryPlanner.ts` and `sourceUtils.ts`; the `.env` file loader is copy-pasted into `scripts/with-env.mjs`, `scripts/clear-debates.mjs`, and `scripts/run-evidence-evals.ts` (and likely the seed script).
- `scripts/debug-vax-r2.ts` — a one-off debug script committed to the repo.
- Doubled blank lines (bad line-ending edit artifact) throughout `src/lib/evidence/searchWithTavily.ts`, `services/evidence-api/app/worker.py`, `app/models.py`.
- `authorName` is sent in request bodies by `src/lib/api/persistence.ts` but every route derives it server-side from the auth user and ignores the field.

**Why it matters:** Noise for humans and models; deprecated paths get picked up by code search and imitated.

**Fix (single task each):** Delete dead functions/files, extract one `normalizeEvidenceMode` and one shared `loadEnvFiles` helper, reformat the double-spaced files, drop `authorName` from client payloads.

---

## 18. LOW — Half-finished features visible in the data model and UI

**What/Where:**
- `deskBangs` (upvotes) — client-only state in `ParliaventApp.tsx`, always `0` from the DB (`mappers.ts` hardcodes it), reset on reload. Sorting replies by `deskBangs` (`buildPostTree.ts` `getChildren`) is therefore meaningless for saved posts.
- `threadSummary` and `userStance` are plumbed through the entire judge stack (types, prompts, cache keys) but no caller ever sets them to anything but `undefined`/`"unknown"`.
- `FeedSort` (`hot | new | top`) and the `Issue` type + `MOCK_ISSUES` in `src/lib/mockFeed.ts` — remnants of the mock feed era, partially unused.
- `postedAt` uses `Date.toLocaleString()` server-side (`mappers.ts`), so displayed timestamps depend on server locale and differ from client expectations.
- No pagination anywhere: `GET /api/debates` loads every debate with all posts, findings, sources, and caveats in one query; the feed will degrade with data growth.

**Fix (scoped tasks):** Either persist desk-bangs (new `PostReaction` model) or remove the affordance; delete `threadSummary`/`userStance` plumbing or wire real values; return ISO timestamps and format client-side; add `take`/cursor pagination to the debates list query.

---

## 19. LOW — Secrets and environment hygiene

> **STATUS: FIXED (2026-07-06, deployment prep).** Both the Next.js internal-search route and the FastAPI `verify_internal_secret` now treat the documented placeholder (`change-me-to-a-long-random-string`) as "not configured" and refuse to authorize; `.venv/` is explicitly listed in `parliavent/.gitignore`. The Hexclave project ID in `.env.example` is public by design.

**What:** `.gitignore` (`.env*`, `!.env.example`) correctly excludes `frontend/.env.local` and `services/evidence-api/.env`, which both exist locally and contain live keys — good. But: `.env.example` ships a real Hexclave project ID (public by design, still worth noting); `EVIDENCE_INTERNAL_SECRET`'s documented default is `change-me-to-a-long-random-string` and nothing warns if it's left as-is; the Python venv lives inside the repo tree (`services/evidence-api/.venv/`, untracked only thanks to the venv's own gitignore).

**Where:** `frontend/.env.example`, `parliavent/docs/evidence-jobs.md`, `services/evidence-api/`.

**Fix (single task):** In `verify_internal_secret` (FastAPI) and the internal-search route, refuse to run when the secret equals the documented placeholder; add `services/evidence-api/.venv/` to `parliavent/.gitignore` explicitly.
