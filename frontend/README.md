# Parliavent frontend

Next.js client app. See root [`README.md`](../README.md) for monorepo overview.

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Structure

```
src/
├── app/              Next.js app router
├── components/debate/  UI components
└── lib/              Types, mocks, helpers
```

The judge will eventually call `backend` at `http://localhost:3001` instead of using `src/lib/mockJudge.ts` directly.
