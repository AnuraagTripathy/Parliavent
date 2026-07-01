# Parliavent architecture

## Monorepo layout

```
parliavent/
├── docs/                    Product specs, API contract, build plan
├── frontend/                Next.js client (TypeScript, Tailwind)
│   ├── src/
│   │   ├── app/
│   │   ├── components/debate/
│   │   └── lib/
│   ├── public/
│   └── package.json
└── backend/                 Express API server
    ├── src/
    │   ├── index.ts
    │   ├── routes/
    │   ├── types.ts
    │   └── mockJudge.ts
    └── package.json
```

## Frontend

Next.js app with TypeScript and Tailwind. No shadcn — custom components only.

Default dev URL: `http://localhost:3000`

### State model

The frontend should maintain:

- argumentText
- findings
- attachedSources
- disputedFindings
- currentView: composer | review | published
- checkingState: idle | checking | complete

### Frontend file structure

```
frontend/src/app/page.tsx
frontend/src/app/globals.css
frontend/src/app/layout.tsx

frontend/src/components/debate/DebateApp.tsx
frontend/src/components/debate/ComposerShell.tsx
frontend/src/components/debate/ArgumentEditor.tsx
frontend/src/components/debate/FindingsPanel.tsx
frontend/src/components/debate/FindingCard.tsx
frontend/src/components/debate/ReadinessBar.tsx
frontend/src/components/debate/SourcePopover.tsx
frontend/src/components/debate/PublishedArgumentView.tsx
frontend/src/components/debate/DebateFeed.tsx
frontend/src/components/debate/IssueThread.tsx
frontend/src/components/debate/ThreadBranch.tsx

frontend/src/lib/types.ts
frontend/src/lib/mockJudge.ts
frontend/src/lib/applyUserEdit.ts
frontend/src/lib/highlightText.ts
frontend/src/lib/readiness.ts
```

## Backend

Express API server. Default dev URL: `http://localhost:3001`

Hosts the judge and evidence endpoints. The frontend should call the backend over HTTP — not import judge logic directly once Phase 5 is complete.

### Backend file structure

```
backend/src/index.ts
backend/src/types.ts
backend/src/mockJudge.ts
backend/src/routes/judge.ts
backend/src/routes/evidence.ts
```

## Core types

FindingType:
- claim
- fallacy
- clarity

FindingStatus:
- open
- resolved
- ignored
- disputed
- source_attached
- marked_opinion

Source:
- id
- title
- publisher
- url optional
- isSample

Finding:
- id
- type
- status
- spanText
- title
- subtitle optional
- reason
- confidence optional
- example optional
- suggestedRewrite optional
- sources optional
- selectedSourceId optional
- disputeReason optional

Shared between frontend and backend. Backend defines canonical API types in `backend/src/types.ts`. Frontend mirrors them in `frontend/src/lib/types.ts` until a shared package is introduced.

## Important implementation rule

All text changes must go through a user-approved function.

Do not directly mutate the argument text from a finding card unless the user clicked a specific action.

Use a function like:

```ts
applyUserApprovedEdit({
  text,
  spanText,
  replacement
})
```

This replaces only the intended span.

## Highlighting approach for MVP

Use a simple display-based editor first.

Option A:
Use a textarea and a separate preview/highlight layer.

Option B:
Use a contenteditable div with custom span rendering.

Prefer the simpler approach.

Do not use TipTap or Lexical yet unless needed later.

## Real-time behavior

For MVP:
- The seed argument can show findings immediately.
- Later, add a fake "checking" delay.
- Later, debounce judge checks after typing.

Do not call a real model yet.

## API boundary

The backend exposes:

```
POST /api/judge
POST /api/evidence/search
GET  /health
```

See `docs/api-contract.md` for full request/response shapes.

For now, the frontend still uses `frontend/src/lib/mockJudge.ts` directly. The backend returns matching mock findings from `backend/src/mockJudge.ts`.

## Current implementation status

Parliavent currently has:

- Static composer/review prototype
- Finding interactions
- Published view
- Next.js TypeScript backend route at `/src/app/api/judge/route.ts`
- Mock judge API returning findings based on known spans
- Debounced real-time checking from the frontend

The current judge is still mock-based. It is API-shaped so the internals can later be replaced with a real LLM judge without rewriting the frontend.

## Current judge flow

1. User edits argument text.
2. Frontend waits for the debounce window.
3. Frontend sends text to `POST /api/judge`.
4. API returns matching findings.
5. Frontend merges returned findings with existing finding state.
6. Existing statuses such as `source_attached`, `disputed`, and `marked_opinion` are preserved when the same finding still exists.
7. If a span disappears from the text, the corresponding finding disappears.
8. If no findings remain, the UI shows a clean state.
