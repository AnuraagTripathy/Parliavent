# Deployment (free tier: Vercel + Render/Neon)

Parliavent deploys as **one Next.js app on Vercel** (UI + API routes) plus a **Postgres database**. The Python evidence-jobs stack (FastAPI + Redis on Render) is optional — without it the app transparently falls back to synchronous evidence search.

```
Vercel (free Hobby)          Render or Neon (free)
┌──────────────────────┐     ┌──────────────┐
│ Next.js app + API    │ ──▶ │ Postgres     │
└──────────┬───────────┘     └──────────────┘
           │ optional        Render (free, optional)
           └───────────────▶ ┌──────────────────────┐
                             │ FastAPI + Key Value  │
                             └──────────────────────┘
```

## 1. Database

**Recommended: [Neon](https://neon.tech) free tier** — free Postgres that does not expire.

**If you use Render Postgres instead:** the free instance **expires 30 days after creation**; after a 14-day grace period Render deletes it *and all data*. Fine for a demo, not for anything you want to keep. (The `render.yaml` blueprint intentionally does not provision a database — add a `databases:` section yourself if you want one.)

Either way, copy the **connection string** (must include `?sslmode=require` for most hosts; Neon/Render include it).

Run migrations against it from your machine:

```bash
cd frontend
DATABASE_URL="<prod-connection-string>" npx prisma migrate deploy
# optional demo content:
DATABASE_URL="<prod-connection-string>" npm run seed:showcase
```

(PowerShell: `$env:DATABASE_URL="<...>"; npx prisma migrate deploy`)

## 2. Hexclave (auth)

In the [Hexclave dashboard](https://app.hexclave.com) for the project:

1. Add your production URL (e.g. `https://parliavent.vercel.app`) to **trusted domains / allowed callback URLs**.
2. Copy the **project ID** and a **secret server key** for the env vars below.

## 3. Vercel

1. Import the Git repository into Vercel.
2. **Set Root Directory to `frontend`** (Settings → General). Framework preset: Next.js. No custom build command needed — `postinstall` runs `prisma generate` automatically.
3. Confirm **Fluid compute is enabled** (Settings → Functions) — it is the default for new projects and is required for the 300 s evidence-search routes (`maxDuration` is already set in code).
4. Add environment variables (Production):

| Variable | Value |
|---|---|
| `DATABASE_URL` | Postgres connection string from step 1 |
| `NEXT_PUBLIC_HEXCLAVE_PROJECT_ID` | Hexclave project ID |
| `NEXT_PUBLIC_HEXCLAVE_API_URL` | `https://api.stack-auth.com` |
| `HEXCLAVE_PROJECT_ID` | same project ID |
| `HEXCLAVE_API_URL` | `https://api.stack-auth.com` |
| `HEXCLAVE_SECRET_SERVER_KEY` | secret server key (never commit) |
| `GROQ_API_KEY` | from console.groq.com |
| `USE_MOCK_JUDGE` | `false` (otherwise the judge only reacts to seeded demo text) |
| `TAVILY_API_KEY` | from tavily.com (evidence search; omit to disable) |
| `GROQ_JUDGE_MODEL` | optional, e.g. `llama-3.1-8b-instant` |
| `GROQ_VERIFIER_MODEL` | optional, e.g. `llama-3.3-70b-versatile` |

5. Deploy. Smoke-test: sign up → create a debate → judge findings appear → publish → post shows in the feed.

**Migrations on later schema changes:** run `prisma migrate deploy` against the prod `DATABASE_URL` (step 1) before or right after deploying code that needs the new schema. It is deliberately *not* part of the Vercel build.

## 4. Optional: async evidence stack (Render)

Skip this entirely for a first deploy — the UI falls back to sync `/api/evidence/search` when `FASTAPI_EVIDENCE_URL` is unset.

1. In Render: **New → Blueprint**, point it at this repository (`render.yaml` at the repo root). It creates `parliavent-evidence-api` (FastAPI) + `parliavent-jobs` (Key Value).
2. Set the prompted env vars: `NEXTJS_BASE_URL` = your Vercel URL, `EVIDENCE_INTERNAL_SECRET` = a long random string (e.g. `openssl rand -hex 32`).
3. On Vercel, add: `FASTAPI_EVIDENCE_URL` = the Render service URL, `EVIDENCE_INTERNAL_SECRET` = the same value. Redeploy.

Free-tier behavior: the service spins down after 15 idle minutes; the first evidence job after that waits ~1 min for cold start. The Key Value store is non-persistent — in-flight jobs are lost on restart, which is acceptable (the client gives up after 3 minutes and the user can retry).

## Known free-tier limitations (accepted)

- **In-memory caches and rate limits** (judge/evidence caches, rate limiter) are per-serverless-instance on Vercel: cache hit rates drop and rate limits are per-instance rather than global. Functional, just less efficient. Redis-backed versions are a future upgrade (GAPS #11).
- **Groq/Tavily free-tier quotas** are the real throughput ceiling; the app already retries/degrades gracefully.
- **Render free Postgres expiry** — see step 1; prefer Neon.

## CI

`.github/workflows/ci.yml` runs lint + tests + build on every push. Keep it green; Vercel deploys independently of CI, so treat a red CI as "do not merge".
