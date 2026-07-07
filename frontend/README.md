# Parliavent frontend

Full-stack Next.js app (App Router) — UI and API route handlers in one deployable. There is no separate backend service; the optional Python evidence-jobs queue lives in `../services/evidence-api/`.

See repo-root `PROJECT.md` for architecture, `CLAUDE.md` for commands/conventions, and `GAPS.md` for known issues.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
```

Copy `.env.example` to `.env.local` first — you need at least `DATABASE_URL` (Postgres) and the Hexclave auth vars. `GROQ_API_KEY`/`TAVILY_API_KEY` enable the real judge and evidence search; without `USE_MOCK_JUDGE=false` the judge runs in mock mode.

## Checks

```bash
npm run lint
npm test
npm run build
```
