# Showcase debate seed

Parliavent ships with **deterministic showcase debates** stored in Postgres. They replace the old frontend-only mock threads on the main feed.

## What gets seeded

Six debates with nested reply trees (`parentPostId`), judge findings, caveats, and (optionally) evidence:

| Slug | Motion |
|------|--------|
| `showcase-mobile-phones-cancer` | Do mobile phones increase cancer risk? |
| `showcase-vaccine-microchips` | Do vaccines contain microchips? |
| `showcase-congestion-pricing-emissions` | Does congestion pricing reduce emissions? |
| `showcase-god-exists` | Does God exist? |
| `showcase-ban-cars-downtown` | Should cities ban cars from downtown areas? |
| `showcase-ai-tech-jobs` | Will AI take all tech jobs? |

Each debate is a visible nested tree, e.g.:

```
starter
  reply 1
    reply 1.1
    reply 1.2
  reply 2
    reply 2.1
```

## Seed modes

### Light mode (fast, default)

```bash
npm run seed:showcase
```

- Uses **curated findings** from `scripts/seed-data/showcase-findings.ts` where defined
- Deterministic showcase sources on selected evidence-aligned replies
- Posts without curated findings (e.g. `vax-r2`) publish **without** judge findings
- Good for quick UI demos when Groq is unavailable

### Realistic mode (recommended for showcase realism)

**Two-phase seeding (recommended on Groq free tier)** — judge and evidence use separate models with independent rate limits:

```bash
# Phase 1: reset + judge only
npm run seed:showcase -- --reset-showcase --with-judge

# Phase 2: evidence only (no reset; enriches existing showcase posts)
npm run seed:showcase -- --with-evidence
```

**Single run** (heavy on Groq quotas):

```bash
npm run seed:showcase -- --with-judge
npm run seed:showcase -- --with-judge --with-evidence
```

Or use the npm shortcuts:

```bash
npm run seed:showcase:judge          # Groq judge on every post
npm run seed:showcase:realistic      # judge + live evidence
npm run seed:showcase:evidence-only  # evidence pass on existing showcase
```

### Groq model routing and pacing

Set in `.env.local` (see `.env.example`):

| Variable | Default | Purpose |
|----------|---------|---------|
| `GROQ_JUDGE_MODEL` | `llama-3.3-70b-versatile` | Model for `analyzeWithGroq` (judge) |
| `GROQ_VERIFIER_MODEL` | `llama-3.3-70b-versatile` | Model for `verifyEvidenceWithGroq` |
| `SEED_JUDGE_PACE_MS` | `18000` | Pause between judge calls in seed |
| `SEED_EVIDENCE_PACE_MS` | `22000` | Pause after each verifier call in seed |
| `SEED_MAX_EVIDENCE_PER_POST` | `2` | Max claim findings verified per post |

Use different models for judge vs verifier so free-tier TPM/TPD limits are independent (e.g. `GROQ_JUDGE_MODEL=llama-3.1-8b-instant` + `GROQ_VERIFIER_MODEL=llama-3.3-70b-versatile`).

The seed script logs active models at startup and prints Groq call/token totals at the end. Claims skipped due to the per-post evidence cap are logged and counted in the summary.

`--reset-showcase` alone deletes showcase debates without re-seeding (`npm run seed:showcase:reset`). Combined with `--with-judge` / `--with-evidence`, it deletes then seeds. Every normal seed run also replaces previous `showcase-*` debates automatically.

**Requires `GROQ_API_KEY`** and `USE_MOCK_JUDGE=false` (set automatically).

- **Every starter and reply** runs the same `analyzeArgument` helper as `/api/judge`
- Reply context includes `parentArgument`, `postType: "reply"`, `userStance: "unknown"`, debate `motion`, and `threadId`
- All returned findings are saved — nothing is dropped because a post was meant to look “clean”
- Claim findings without evidence show **Needs evidence** in the thread
- With `--with-evidence`, evidence runs on claim findings up to **`SEED_MAX_EVIDENCE_PER_POST`** per post (highest confidence first); remaining claims stay **Needs evidence**

## Hexclave user IDs

Posts are authored by three real Hexclave users. In Prisma, **`User.id` is the Hexclave user ID**.

| Key | Hexclave / `User.id` |
|-----|----------------------|
| u1 | `92922a59-c6da-45cf-b3ae-74666a0d4798` |
| u2 | `bcebfb2d-7639-431d-a4c0-1fdaa4d4abda` |
| u3 | `e072a62d-e6aa-459e-bfb0-f2ccf505ab84` |

## Commands

From `frontend/`:

```bash
# Light seed — curated findings, fast
npm run seed:showcase

# Realistic seed — Groq judge on every post
npm run seed:showcase:judge

# Realistic + live evidence on all claim findings
npm run seed:showcase:realistic

# Reset showcase debates only (slug starts with showcase-)
npm run seed:showcase:reset
```

**Idempotency:** each run deletes previous `showcase-*` debates first, then recreates them. User-created debates are never touched.

## Findings, evidence, and thread display

### Judge (`--with-judge`)

- Calls `analyzeArgument` with the same parameters as the compose flow
- Finding IDs are namespaced per post (`showcase-{postKey}-{findingId}`) to avoid collisions
- Open claim findings without evidence → **Needs evidence** badge and panel under the post
- Fallacy findings → **Possible fallacy** chip
- Clarity findings → **Clarity note** block

### Evidence (`--with-evidence`)

**With `--with-judge` (same run or after a judge-only pass):** runs on up to `SEED_MAX_EVIDENCE_PER_POST` claim findings per post (sorted by confidence).

**Evidence-only pass** (`npm run seed:showcase -- --with-evidence` without `--with-judge`): enriches existing showcase posts in the database without re-judging or resetting.

**Light mode only (no `--with-judge`):** runs on selected post keys from `SHOWCASE_EVIDENCE_POST_KEYS`.

Rules:

- Attach sources only when verdict is `supported` or `partially_supported` and `canAttachAsSupport` is true
- `unsupported`, `contradicted`, `too_broad`, `unclear` → public caveat (no supporting citation)
- Evidence failure → finding stays open → **Needs evidence**

### Feed cards

Counts reflect saved metadata:

- posts · findings · caveats · sourced claims · contested reasoning · need evidence
- Badges: Has caveats, Sourced, Contested, Needs evidence

## Verify every post went through judge

After `npm run seed:showcase -- --with-judge`, the script prints a summary table:

1. Per-debate totals (posts, findings, claims, evidence, sourced, caveats)
2. Per-post finding titles for posts with findings
3. Regression line for `vax-r2` (microchip needle claim)

In the UI:

1. Open **Do vaccines contain microchips?**
2. `vax-starter` should show a caveat on the microchip claim (with `--with-evidence`) or **Needs evidence** (judge only)
3. `vax-r2` should show **Needs evidence** for the manufacturing/supply-chain claim
4. Copy the `vax-r2` text into the reply composer — judge output should match the seeded post

## Debug: seeded post has fewer findings than manual compose

1. Confirm you used `--with-judge` (light mode skips judge for posts without curated findings)
2. Check `GROQ_API_KEY` and seed log for judge failures on that post key
3. Compare `parentArgument` — seed passes the direct parent post text; compose must use the same parent
4. Judge drops findings whose `spanText` is not an exact substring of the post — check for punctuation/whitespace drift
5. Re-run with `--with-judge` and inspect the printed summary for that `postKey`

## Verify in the UI

1. `npm run db:migrate`
2. `npm run seed:showcase:realistic` (or light mode)
3. `npm run dev` → open `/app` and sign in
4. Feed shows showcase debates with meaningful badges and counts
5. Open a debate → caveats, source notes, needs-evidence, and chips appear inline on posts
6. **Read full** shows the same review panel as the thread
7. Refresh — posts and metadata survive (Postgres)
