# Parliavent — Project Overview

> Written as a one-time knowledge transfer. Companion files: `GAPS.md` (known weaknesses, ordered by severity) and `CLAUDE.md` (operational instructions for AI agents).

## What this is

Parliavent is a debate platform where users write arguments that are reviewed by an AI "judge" **before** they post. The judge flags three kinds of issues in the draft:

- **claim** — factual assertions that need evidence
- **fallacy** — possible logical fallacies (phrased as possibilities, never accusations)
- **clarity** — vague, imprecise, or emotionally loaded wording

The user then resolves each finding through explicit actions (apply a suggested rewrite, find and attach a source, mark as opinion, dispute, or keep as-is) and publishes. The published view shows citations, contested-fallacy chips, and public caveats for unresolved or unsupported claims. The product's identity is "debate coach, not gatekeeper": posting is never blocked, but unresolved issues travel with the post as visible caveats.

The **single most important product rule**, repeated throughout `parliavent/docs/product-rules.md`: **the AI never rewrites or posts the user's argument automatically.** Every text change goes through `applyUserApprovedEdit()` after an explicit user click. Sources are never attached automatically either — the user must click "Use source".

Target users: people who want to debate contentious topics online with higher argument quality. The seeded showcase debates (phones/cancer, vaccine microchips, congestion pricing, etc.) show the intent: surfacing misinformation-style claims and walking them through evidence review.

## Repository layout

This directory is the git repository root (github.com/AnuraagTripathy/Parliavent). Locally it may sit inside a wrapper folder (e.g. `D:\projects\Parliavent\parliavent\`) — the wrapper is not part of the repo.

```
Parliavent/                  ← git repo root (this directory)
├── docs/                    ← product specs + DEPLOYMENT.md
├── render.yaml              ← Render blueprint (optional evidence stack; DB is on Neon)
├── frontend/                ← the real application: Next.js 16 full-stack app
│   ├── prisma/              ← schema + migrations (Postgres)
│   ├── scripts/             ← seed, evals, db helpers (run with tsx / node)
│   └── src/
│       ├── app/             ← pages + all API route handlers
│       ├── components/      ← debate/ (features), ui/ (shadcn-style primitives),
│       │                      auth/, admin/
│       ├── hexclave/        ← auth app objects (client.ts / server.ts)
│       ├── lib/             ← all business logic (judge/, evidence/, db/, api/, auth/)
│       └── proxy.ts         ← auth gate for /app and /admin only (Next 16 middleware)
└── services/
    └── evidence-api/        ← optional Python FastAPI + Redis job queue
```

**There is no Express backend.** An early plan had a separate `backend/` folder on port 3001 — it was abandoned and everything moved into Next.js route handlers. The stale docs describing it have been deleted.

## Tech stack and why

| Piece | Version | Why (inferred) |
|---|---|---|
| Next.js (App Router) + React 19 | 16.2.9 / 19.2.4 | One deployable for UI + API; route handlers replaced the planned Express backend |
| TypeScript (strict) | 5.x | Whole frontend is strictly typed; heavy use of union types as enums |
| Tailwind v4 + shadcn-style primitives | 4.x | Design direction: Linear/Vercel-like "premium tool" feel (`docs/design-direction.md`) |
| Prisma + PostgreSQL | 6.19.x | Persistence for debates/posts/findings/evidence/caveats |
| Hexclave (formerly Stack Auth) | `@hexclave/next` 1.0.45 | Hosted auth: sign-in/up pages, cookie token store, user objects. `User.id` in Postgres **is** the Hexclave user id |
| Groq API (llama-3.3-70b-versatile default) | REST, no SDK | Cheap/fast hosted LLM for two separate roles: the **judge** and the **evidence verifier**. Models are configurable separately (`GROQ_JUDGE_MODEL`, `GROQ_VERIFIER_MODEL`) because free-tier rate limits are per model |
| Tavily | REST, no SDK | Web search for evidence candidates |
| FastAPI + Redis (`services/evidence-api`) | 0.139 / redis 7 | **Optional** async job queue so evidence search shows staged progress instead of one long blocking request. The whole thing degrades gracefully to a synchronous path if not running |
| framer-motion, lucide-react | — | Page transitions and icons |

There is **no test framework installed**. The only quality gates are `eslint`, `tsc` (via `next build`), and manual eval scripts that hit live APIs.

## Architecture and data flow

```
Browser (React client components)
  │
  ├─ POST /api/judge ──────────────► analyzeArgument()
  │      (debounced 1.5s while          ├─ USE_MOCK_JUDGE != "false" → mockJudge (DEFAULT!)
  │       typing in composer)           └─ else → in-memory cache → Groq → sanitizeAIFindings()
  │
  ├─ POST /api/evidence/jobs ──► FastAPI ──► Redis (job hash, dedupe key)
  │      (user clicks "Find          │
  │       sources"; falls back       └─ worker POSTs back to Next.js:
  │       to sync /api/evidence/          /api/evidence/internal/search
  │       search if FastAPI down)          (X-Evidence-Internal-Secret header)
  │                                        └─ Evidence Engine v2 (TypeScript)
  │                                            queryPlanner → Tavily ×3 queries
  │                                            → fetch pages → extract → rank passages
  │                                            → Groq verifier → attachability rules
  │                                            → router (escalate to deep investigation?)
  │      UI polls GET /api/evidence/jobs/{id} every 1.5s for stage/progress
  │
  ├─ /api/debates, /api/debates/[id], /api/debates/[id]/posts,
  │  /api/posts/[postId] (DELETE draft), /api/posts/[postId]/findings,
  │  /api/posts/[postId]/publish, /api/findings/[findingId]/evidence
  │      └─ Prisma → PostgreSQL
  │
  └─ Hexclave auth: proxy.ts gates /app and /admin (redirect to /sign-in);
     every DB API route calls requireAuthUser() which also upserts the User row
```

### The judge flow (most polished part of the codebase)

1. `useDebouncedJudge` (client hook) waits 1500 ms after typing stops, requires ≥ 40 chars, checks a client-side cache, then POSTs to `/api/judge` with debate context (motion, postType, parentArgument…).
2. `analyzeArgument` checks `USE_MOCK_JUDGE` — **mock is the default**; Groq only runs when the env var is literally `"false"`. Then a 20-minute in-memory server cache keyed on `(promptVersion, model, mode, motion, postType, parentArgument, threadSummary, normalizedText)`.
3. `analyzeWithGroq` calls Groq with `JUDGE_SYSTEM_PROMPT` (a long, carefully calibrated prompt in `lib/judge/prompts.ts` — version string `JUDGE_PROMPT_VERSION` must be bumped whenever it changes, since cache keys include it) and retries 429s up to 6 times.
4. `sanitizeAIFindings` (`lib/judge/schema.ts`) is the **load-bearing safety net**: parses/normalizes JSON, **drops any finding whose `spanText` is not an exact substring of the argument**, dedupes exact and overlapping spans, applies heuristic "downgrades" (e.g. an "Appeal to Emotion" flag on a factual causal sentence becomes a claim finding; "bro" flagged as fallacy becomes clarity), caps at 5.
5. Client-side `mergeFindings` (`lib/api/judge.ts`) preserves user resolution state (`resolved`, `source_attached`, `disputed`, …) across judge re-runs **by finding id**, and drops findings whose spans no longer exist in the text.

### The evidence engine (most complex part)

`lib/evidence/searchEvidence.ts` is the standard pipeline: deterministic query planning (support + contradiction + official queries), Tavily search, URL dedupe, blocked-domain filtering (social media), server-side page fetching (8 s timeout, max 5 pages, skips PDFs), HTML text extraction, deterministic passage ranking, then a Groq **verifier** call that returns a claim verdict (`supported` … `contradicted` … `unclear`) and per-source support levels. If the verifier fails, everything degrades to `unclear` with snippet-based results rather than erroring.

Two hard business rules enforced in code (`lib/evidence/sourceEligibility.ts`):
- `canAttachAsSupport` is true **only** for `supports`/`partially_supports` sources.
- If the overall claim verdict is `contradicted` or `unsupported`, **no** source is attachable, even if the verifier mislabeled one.

On top of the standard pipeline sits an **evidence router** (`lib/evidence/evidenceRouter.ts`) — regex heuristics that detect risky claims (numbers, timelines, medical topics, causal/absolute language) and weak results, and decide whether to recommend/auto-run a bounded **deep investigation** (`lib/evidence/deepInvestigation.ts`: max 2 follow-up searches + 3 extra page fetches, emits a human-readable trace). ⚠️ The router is **duplicated line-for-line in Python** at `services/evidence-api/app/evidence_router.py` — see GAPS.md.

### Persistence & publish flow

Prisma models: `User` → `Post` (self-referencing reply tree) → `Finding` → `EvidenceResult` (1:1), `Source` + `FindingSource` (m:n with `isAttached`), `Caveat`. Findings live **client-side** during composition; they are only persisted at publish time by `persistPublishFlow` (`lib/api/persistence.ts`): save findings → save evidence per finding → `POST /publish`, which in one transaction upserts findings, deletes stale ones, sets `publishedAt`, and derives `Caveat` rows (claim-verdict caveats + a generic "Posted with unresolved review item"). Draft posts (`publishedAt = null`) are private to their author; the composer deletes abandoned drafts on back-navigation.

`lib/db/mappers.ts` converts Prisma rows into the app-level `PublishedArgument` shape, re-deriving review metadata (citations, needs-evidence notes, contested chips) from the saved findings.

### Frontend shell

`/` is a marketing landing page; `/app` (auth-required) mounts `ParliaventApp`, a **client-side screen state machine** (`feed | create | issue | post | composer`) — there is no URL routing inside the app, so refresh always lands on the feed and back-button doesn't work inside the app. `DebateApp` is the composer screen; `DebateFeed` lists saved debates from `/api/debates`; showcase debates (slug prefix `showcase-`) get special metadata from `lib/showcaseMeta.ts` and are created by `scripts/seed-showcase-debates.ts`.

## Key design decisions (inferred)

1. **User sovereignty over text.** `applyUserApprovedEdit` is the only mutation path for argument text; it replaces the first occurrence of the span. This is a product invariant, not a style choice.
2. **`spanText` as the anchor.** Findings point at exact substrings, not offsets. This makes highlighting robust to LLM inaccuracy (invalid spans are discarded) but fragile to duplicated phrases (first match wins).
3. **Mock-first, API-shaped boundaries.** Everything was built against mocks with real HTTP shapes, then internals were swapped (mock judge → Groq; sync evidence → jobs). The mock judge is still the fallback and the **default**.
4. **Trust nothing from the LLM.** Both Groq consumers parse with fenced-JSON tolerance, validate every field, and have deterministic fallbacks. Prompt-version strings invalidate caches.
5. **In-memory caches everywhere** (judge cache, evidence cache, client caches, Groq usage tracker). Fine for a single dev server; wrong for any multi-instance deployment.
6. **Graceful degradation as a pattern.** FastAPI down → sync search. Page fetch fails → snippet verification. Verifier fails → `unclear` verdict. Judge fails → quiet error, draft preserved, never a fake "ready to post".
7. **Findings are client-state until publish.** Avoids chatty persistence while typing, but means the server ultimately trusts whatever findings the client submits at publish time (see GAPS.md, security).

## Critical paths — handle with care

- `lib/judge/schema.ts` (`sanitizeAIFindings`) — all judge output safety flows through here.
- `lib/judge/prompts.ts` — behavior calibration lives in the prompt; **bump `JUDGE_PROMPT_VERSION` on any change**.
- `lib/api/judge.ts` (`mergeFindings`) — preserves user resolutions across re-judging; subtle and untested.
- `lib/evidence/sourceEligibility.ts` — enforces "you can't cite a source that doesn't support you".
- `app/api/posts/[postId]/publish/route.ts` — the transaction that makes a post public and derives caveats.
- `lib/db/mappers.ts` — DB → app-shape conversion used by every read path.
- `prisma/schema.prisma` + `lib/types.ts` — enums are duplicated between the two; they must stay in sync manually.

Safe to change casually: UI components in `components/debate/` and `components/ui/` (presentation only), copy strings, `showcaseMeta.ts`, seed data under `scripts/seed-data/`.

## Surprises and traps for newcomers

1. **`USE_MOCK_JUDGE` defaults to mock.** `shouldUseMockJudge()` returns true unless the env var is exactly `"false"`. If the judge only reacts to the seeded car-ban argument, this is why.
2. **Docs history.** Early phase-plan docs described an Express backend and "no auth / no DB" scope; those stale files were deleted in the repo cleanup. Everything remaining in `parliavent/docs/` (product-rules, groq-ai-judge, tavily-evidence-search, evidence-jobs, judge-evals, showcase-seed, mock-data, design-direction) reflects the current system.
3. **Hexclave = Stack Auth.** The auth vendor was renamed. Config in `hexclave.config.ts` + `src/hexclave/{client,server}.ts`; auth pages live at `/sign-in`, `/sign-up`, `/account` plus a catch-all `/handler/[...hexclave]`.
4. **Next.js 16 route handlers receive `params` as a `Promise`** — every dynamic route does `const { id } = await params`.
5. **The proxy (`src/proxy.ts`) only protects pages** (`/app`, `/admin`), not `/api/*`. DB routes call `requireAuthUser()` themselves; `/api/judge` and the evidence routes use `getOptionalAuthUser` + rate limits.
6. **The FastAPI worker calls back into Next.js.** Start order matters: Redis → FastAPI → Next.js. `EVIDENCE_INTERNAL_SECRET` must match on both sides; without `FASTAPI_EVIDENCE_URL` the UI silently uses the sync path.
7. **Two Groq models with separate env vars** (`GROQ_JUDGE_MODEL`, `GROQ_VERIFIER_MODEL`) so free-tier rate limits don't collide; seed scripts pace calls with `SEED_*_PACE_MS` sleeps.
8. **`confidence` is a string in app code ("82%") but a Float in Postgres** — `findingToCreateInput` parseFloats it, `toAppFinding` stringifies it back (losing the `%`).
9. **`deskBangs` (upvotes) are fake** — client-side state only, reset on reload.
10. **Some files have doubled blank lines** (`searchWithTavily.ts`, `worker.py`, `models.py`) from a past line-ending accident; don't copy that style.
