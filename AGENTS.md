<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

The frontend lives in `frontend/`. This version of Next.js has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `frontend/node_modules/next/dist/docs/` before writing any frontend code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Monorepo layout

- `docs/` — product and technical documentation (repo root)
- `frontend/` — Next.js client app
- `backend/` — Express API server

Do not add application code at the repository root.
