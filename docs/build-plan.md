## Completed phases

Completed:
- Phase 1: Static prototype
- Phase 2: Interactions
- Phase 3: Published view
- Phase 5: Mock API boundary
- Phase 6: Debounced real-time checking

Current next phase:
- QA/refactor pass before adding real AI

Do not start real AI or evidence search until the judge flow has passed QA.

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