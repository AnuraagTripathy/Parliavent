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

## Phase 5: Mock API boundary

Goal:
Move from local mock data to an API-shaped judge.

Tasks:
1. Create POST /api/judge.
2. Return mock findings from the endpoint.
3. Update frontend to call /api/judge.
4. Add loading/checking state.
5. Add error fallback.

Done when:
The UI no longer imports mock findings directly inside the main app flow.

## Phase 6: Real-time checking

Goal:
Make the judge feel live while typing.

Tasks:
1. Add debounced checking.
2. Show subtle checking state.
3. Remove findings when spans disappear.
4. Show clean state when no findings are found.
5. Preserve resolved findings where possible.

Done when:
Editing the argument updates the review panel without manually refreshing.

## Phase 7: Real AI judge

Goal:
Replace mock judge internals with structured LLM analysis.

Tasks:
1. Add model call.
2. Add JSON schema validation.
3. Extract factual claims.
4. Detect possible fallacies.
5. Suggest wording improvements.
6. Return frontend-compatible findings.

Done when:
New user-written arguments receive non-hardcoded findings.

## Phase 8: Evidence search

Goal:
Attach credible sources to factual claims.

Tasks:
1. Generate search queries from claims.
2. Retrieve web results.
3. Rank source credibility.
4. Return support verdict.
5. Suggest source-backed rewrites.

Done when:
Claim cards can show real source candidates.