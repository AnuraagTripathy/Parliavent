# Parliavent architecture

## App type

Next.js app with TypeScript and Tailwind.

No shadcn.

Use custom components.

## State model

The app should maintain:

- argumentText
- findings
- attachedSources
- disputedFindings
- currentView: composer | review | published
- checkingState: idle | checking | complete

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

## File structure

Use this structure:

/src/app/page.tsx
/src/app/globals.css

/src/components/debate/DebateApp.tsx
/src/components/debate/ComposerHeader.tsx
/src/components/debate/ArgumentEditor.tsx
/src/components/debate/FindingsPanel.tsx
/src/components/debate/FindingCard.tsx
/src/components/debate/ReadinessBar.tsx
/src/components/debate/SourcePopover.tsx
/src/components/debate/PublishedView.tsx

/src/lib/types.ts
/src/lib/mockJudge.ts
/src/lib/applyUserEdit.ts
/src/lib/highlightText.ts
/src/lib/readiness.ts

## Important implementation rule

All text changes must go through a user-approved function.

Do not directly mutate the argument text from a finding card unless the user clicked a specific action.

Use a function like:

applyUserApprovedEdit({
  text,
  spanText,
  replacement
})

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

## Future API design

Later add:

POST /api/judge

Input:
{
  text: string;
  mode: "open_floor" | "structured_debate" | "formal_motion";
}

Output:
{
  findings: Finding[];
}

For now, use mockJudge.ts.