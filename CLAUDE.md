# CLAUDE.md — Parliavent

Operational guide for AI agents. Read `PROJECT.md` for the full architecture narrative and `GAPS.md` for known bugs/debt (ordered by severity) — check GAPS.md before "fixing" something that is already catalogued.

## Orientation in 30 seconds

- The git repo (github.com/AnuraagTripathy/Parliavent) has this directory as its root. Locally it may live inside a wrapper folder (`D:\projects\Parliavent\parliavent\`) — the wrapper is not part of the repo. The app is `frontend/` — a Next.js 16 full-stack app (App Router; API route handlers, no separate backend). `services/evidence-api/` is an **optional** Python FastAPI + Redis job queue.
- **There is no Express backend** (an early plan that was abandoned; its stale docs were deleted). All docs live in `docs/`: `DEPLOYMENT.md`, `product-rules.md`, `groq-ai-judge.md`, `tavily-evidence-search.md`, `evidence-jobs.md`, `judge-evals.md`, `showcase-seed.md`, `mock-data.md`, `design-direction.md`. For architecture, trust the code and PROJECT.md.
- Core loop: user drafts argument → debounced `POST /api/judge` (Groq LLM or mock) returns findings (`claim`/`fallacy`/`clarity`) anchored to exact `spanText` substrings → user resolves via explicit actions → publish persists post + findings + caveats to Postgres via Prisma.

## Commands (run from `frontend/`)

```bash
npm run dev            # dev server on :3000
npm run build          # production build (also the de-facto type check)
npm run lint           # eslint
npm run db:generate    # prisma generate (reads .env.local via scripts/with-env.mjs)
npm run db:migrate     # prisma migrate dev
npm run db:deploy      # prisma migrate deploy — for PRODUCTION databases (env from shell, not .env.local)
npm run db:studio      # prisma studio
npm run db:clear       # DELETES all debates + sources
npm run seed:showcase            # fast seed, curated findings, no Groq needed
npm run seed:showcase:realistic  # reset + Groq judge + live evidence (slow, burns quota)
npm run eval:evidence            # evidence-engine evals — needs GROQ_API_KEY + TAVILY_API_KEY
```

```bash
npm test               # vitest run — pure-function suites in src/**/*.test.ts
npm run test:watch     # vitest watch mode
```

Tests are co-located `*.test.ts` files (config: `vitest.config.ts`, node environment, `@` alias resolved). Import `describe`/`it`/`expect` from `vitest` explicitly — globals are off so `next build` type-checking stays clean. CI (`.github/workflows/ci.yml` at repo root) runs lint + test + build on every push. One-off scripts run with `tsx` (`npx tsx scripts/foo.ts`).

Optional evidence-jobs stack (start order matters — FastAPI calls back into Next.js):
```bash
docker run --name parliavent-redis -p 6379:6379 -d redis:7-alpine   # 1. Redis
cd services/evidence-api && .venv\Scripts\activate && python -m app.main   # 2. FastAPI :8000
npm run dev                                                          # 3. Next.js
```
If `FASTAPI_EVIDENCE_URL` is unset, the UI silently falls back to sync `POST /api/evidence/search` — this is normal, not a bug.

Judge QA is manual: see `docs/judge-evals.md` (7 canonical cases; paste into composer with `USE_MOCK_JUDGE=false`).

**Deployment:** Vercel (root directory `frontend`, Fluid compute on) + Neon/Render Postgres; optional FastAPI+Redis stack via repo-root `render.yaml`. Full steps in `docs/DEPLOYMENT.md`. `postinstall` runs `prisma generate`; migrations are run manually with `npm run db:deploy` (never during the Vercel build). Heavy routes export `maxDuration` (60 s judge, 300 s evidence) — keep these when editing those files.

## Environment (`frontend/.env.local`, template in `.env.example`)

`DATABASE_URL` (Postgres), `GROQ_API_KEY`, `GROQ_JUDGE_MODEL` / `GROQ_VERIFIER_MODEL` (separate on purpose — Groq free-tier limits are per model), `TAVILY_API_KEY`, `USE_MOCK_JUDGE`, Hexclave vars (`HEXCLAVE_SECRET_SERVER_KEY` etc.), optional `FASTAPI_EVIDENCE_URL` + `EVIDENCE_INTERNAL_SECRET` (must match `services/evidence-api/.env`).

## Gotchas (things that look one way but work another)

1. **The judge is MOCK by default.** `shouldUseMockJudge()` in `src/lib/judge/analyzeArgument.ts` returns true unless `USE_MOCK_JUDGE` is exactly the string `"false"`. If findings only appear for the seeded car-ban text, that's why.
2. **Judge/evidence results are cached in memory** (20 min / 30 min TTL) keyed on prompt version + model + text. If you change `src/lib/judge/prompts.ts` you MUST bump `JUDGE_PROMPT_VERSION`; if you change `src/lib/evidence/verifyPrompts.ts` bump `EVIDENCE_VERIFIER_PROMPT_VERSION`. Otherwise stale cached results mask your change. Restarting the dev server also clears them.
3. **Next.js 16: dynamic route `params` is a Promise.** Every handler does `const { id } = await params;`. Follow that pattern.
4. **The proxy (`src/proxy.ts`, Next 16's renamed middleware) does not protect `/api/*`.** It only gates `/app` and `/admin` pages. DB routes call `requireAuthUser(request)` from `src/lib/auth/session.ts` themselves (it also upserts the `User` row and returns `authorId` for ownership checks — mutation routes must 403 when `post.authorId !== auth.authorId`). `/api/judge` and evidence routes use `getOptionalAuthUser` (no upsert) + per-user rate limits from `src/lib/rateLimit.ts`.
5. **Hexclave is Stack Auth renamed.** Auth objects: `src/hexclave/client.ts` / `server.ts`; config in `hexclave.config.ts`; pages at `/sign-in`, `/sign-up`, `/account`, catch-all `/handler/[...hexclave]`. `User.id` in Postgres == Hexclave user id.
6. **Findings live in client state until publish.** Nothing is saved while composing; `persistPublishFlow` (`src/lib/api/persistence.ts`) saves findings → evidence → publish in sequence. Finding ids are LLM-generated and only unique per post, so server routes scope them (`${postId}-${id}`) via `src/lib/scopedIds.ts` — the client must address `/api/findings/[findingId]/evidence` with the scoped id (persistPublishFlow already does).
7. **`spanText` is the anchor for everything.** A finding whose `spanText` isn't an exact substring of the argument is silently discarded (`sanitizeAIFindings`). The sanitizer also records `spanStart` (character offset, not persisted) to disambiguate repeated phrases — `applyUserApprovedEdit` and `ArgumentEditor`'s highlight segmentation use it with a first-occurrence fallback. When testing judge changes, whitespace/punctuation drift makes findings vanish — that's by design.
8. **`ParliaventApp` is a client-side state machine, not routes.** Screens (`feed/issue/post/composer`) are React state; there are no URLs for them, refresh returns to the feed.
9. **The evidence router lives only in TS** (`src/lib/evidence/evidenceRouter.ts`, tested in `evidenceRouter.test.ts`). The old Python copy was deleted; the FastAPI worker fails jobs loudly if the pipeline result lacks `shouldEscalate` instead of re-deriving it.
10. **Prisma CLI needs `.env.local`** — always use the `npm run db:*` scripts (they go through `scripts/with-env.mjs`), not raw `npx prisma`.
11. **`confidence` is a string in app code ("82%") but Float in the DB.** Don't "fix" one side without the round-trip in `src/lib/db/mappers.ts`.
12. **Windows environment.** Shell is PowerShell; the Python venv is at `services/evidence-api/.venv/Scripts/`.

## Hard rules (never violate)

- **Never auto-apply text changes to the user's argument.** All mutations go through `applyUserApprovedEdit()` (`src/lib/applyUserEdit.ts`) triggered by an explicit user action. The judge returns findings only; it never writes the final argument. This is the product's core covenant (`docs/product-rules.md`).
- **Never auto-attach sources.** Attachment happens only via the user's "Use source" click, and only when `canAttachAsSupport` is true. `enforceAttachabilityForClaimVerdict` (`src/lib/evidence/sourceEligibility.ts`) forbids attaching support to `contradicted`/`unsupported` claims — do not weaken it.
- **Judge failures must fail quiet.** Preserve the draft, show the calm error (`JUDGE_ERROR_MESSAGE`), never show "Nothing to flag. Ready to post." when the judge errored (`getReadiness` handles this via `judgeUnavailable`).
- **Judge copy tone:** possibilities not accusations ("This could be read as a false dilemma", never "You committed a fallacy"). Fallacy name goes in `subtitle`, plain-language title in `title`.
- **Bump prompt version constants whenever prompt text changes** (see gotcha 2).
- **`prisma/schema.prisma` enums and `src/lib/types.ts` unions are manually mirrored** — change both or neither. After schema changes: `npm run db:migrate` then `npm run db:generate`.
- Generated/do-not-hand-edit: `prisma/migrations/**` (generated by migrate; never edit applied migrations), `next-env.d.ts`, `package-lock.json`, `.next/`.

## Conventions

- **Path alias:** `@/*` → `src/*`. Strict TypeScript; no `any` — unknown JSON is parsed via `unknown` + hand-rolled type-guard functions (`isFinding`, `isValidEvidenceResponse`); follow that pattern for new endpoints.
- **API route handler shape** (copy an existing route, e.g. `src/app/api/debates/route.ts`): parse JSON in try/catch → 400; validate every field explicitly → 400 with `{ error: string }`; auth via `requireAuthUser` → `unauthorizedResponse()`; business logic in try/catch → `console.error("[METHOD /api/path]", error)` + 500 generic message. Never leak internals in error bodies.
- **Client fetch wrappers** live in `src/lib/api/*` (`persistence.ts`, `judge.ts`, `evidence.ts`) — components never call `fetch` directly.
- **Business logic goes in `src/lib/`**, organized by domain (`judge/`, `evidence/`, `db/`, `auth/`); components in `components/debate/` are presentation + handlers only. UI primitives (button, card, textarea…) are shadcn-style in `components/ui/` with the `cn()` helper from `src/lib/utils.ts`.
- **Naming:** camelCase files for lib (`buildPostTree.ts`), PascalCase for components (`FindingCard.tsx`). DB terms: debate/post/finding; UI legacy terms: "issue" = debate slug, `PostKind` `"response"` = DB `PostType` `"reply"` — mapped in `src/lib/db/mappers.ts` (`postTypeFromKind`).
- **State management:** plain React `useState` lifted to `ParliaventApp`/`DebateApp` — no Redux/zustand/context stores. Server data is re-fetched via the `lib/api` wrappers; findings merge through `mergeFindings` to preserve user resolutions.
- **Styling:** Tailwind v4 utilities, dark theme tokens in `src/app/globals.css`. Design language: calm, muted, Linear/Vercel-like; finding colors amber=clarity, sky/blue=claim, red=fallacy (see `docs/design-direction.md`). No aggressive red warnings, no flashy animation.
- **LLM calls:** raw `fetch` to Groq with `response_format: json_object`, temperature ≤ 0.2, `AbortController` timeout, fenced-JSON-tolerant parsing, strict output sanitization, `recordGroqUsage()` after success. Copy `analyzeWithGroq.ts` or `verifyEvidenceWithGroq.ts` when adding a call.

## Where to look for what

| Task | Files |
|---|---|
| Judge behavior/calibration | `src/lib/judge/prompts.ts` (+ bump version), heuristics in `src/lib/judge/schema.ts` |
| Judge request flow | `useDebouncedJudge.ts` → `lib/api/judge.ts` → `app/api/judge/route.ts` → `lib/judge/analyzeArgument.ts` |
| Evidence pipeline | `lib/evidence/searchEvidence.ts` (standard), `deepInvestigation.ts` (deep), `searchEvidenceWithMode.ts` (entry), `evidenceRouter.ts` (escalation) |
| Evidence jobs/async | `lib/api/evidence.ts` (client), `app/api/evidence/jobs/*` (proxy), `services/evidence-api/app/*` (queue), `app/api/evidence/internal/search/route.ts` (worker callback) |
| Publish/persistence | `lib/api/persistence.ts`, `app/api/posts/[postId]/publish/route.ts`, `lib/db/mappers.ts` |
| Caveats & published review chrome | `lib/claimCaveats.ts`, `lib/publishedReviewFindings.ts`, `lib/citationsFromFindings.ts` |
| Composer UI | `components/debate/DebateApp.tsx` (state), `ArgumentEditor.tsx`, `FindingsPanel.tsx`, `FindingCard.tsx` (actions incl. Find sources) |
| App shell/navigation | `components/debate/ParliaventApp.tsx` |
| Seeding | `scripts/seed-showcase-debates.ts` + `scripts/seed-data/*`, doc at `docs/showcase-seed.md` |
