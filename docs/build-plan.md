# Parliavent build plan

## Phase 1: Static prototype

Goal:
Render the main composer/review screen with mock findings.

Tasks:
1. Create project structure.
2. Create product docs.
3. Create TypeScript types.
4. Create mock judge data.
5. Create main DebateApp component.
6. Render composer/editor.
7. Render findings panel.
8. Render readiness bar.
9. Render static highlights.

Done when:
The app opens with the seed argument, three highlighted spans, and three finding cards.

## Phase 2: Interactions

Goal:
Make the findings usable.

Tasks:
1. Apply clarity suggestion.
2. Expand fallacy card.
3. Apply fallacy rewrite.
4. Keep as-is.
5. Dispute fallacy with reason.
6. Attach source.
7. Mark claim as opinion.
8. Update readiness meter.

Done when:
Every card can be resolved and the readiness meter updates.

## Phase 3: Published view

Goal:
Show the final post.

Tasks:
1. Add Post button.
2. Render final argument.
3. Show citations.
4. Show source list.
5. Show contested fallacy chips.
6. Show vetted byline.
7. Add Back to edit.

Done when:
The full demo flow works from composer to published view.

## Phase 4: Polish

Goal:
Make it feel slick.

Tasks:
1. Improve spacing, typography, and layout.
2. Add subtle transitions.
3. Improve highlight visuals.
4. Add loading/checking state.
5. Add clean empty state.
6. Make responsive.

Done when:
The prototype feels like a premium product demo.

## Phase 5: Real judge later

Goal:
Replace mock findings with real analysis.

Tasks:
1. Add /api/judge.
2. Add structured LLM output.
3. Add claim extraction.
4. Add evidence search.
5. Add source ranking.
6. Add fallacy detection.
7. Add schema validation.