# Parliavent

Debate platform where arguments are vetted before posting.

## Repository layout

```
parliavent/
├── docs/           Product specs, API contract, build plan
├── frontend/       Next.js app (TypeScript, Tailwind)
└── backend/        Express API (judge + evidence endpoints)
```

## Quick start

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Backend

```bash
cd backend
npm install
npm run dev
```

API runs at [http://localhost:3001](http://localhost:3001).

The frontend still uses local mock data for the MVP demo. The backend exposes the API shape defined in `docs/api-contract.md` for the next integration phase.

## Documentation

All product and technical docs live in [`docs/`](./docs/):

- [`docs/product-rules.md`](./docs/product-rules.md) — core product constraints
- [`docs/architecture.md`](./docs/architecture.md) — monorepo structure and state model
- [`docs/api-contract.md`](./docs/api-contract.md) — frontend ↔ backend contract
- [`docs/build-plan.md`](./docs/build-plan.md) — phased delivery plan
