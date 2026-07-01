# Real-time checking

## Goal

Parliavent should feel alive while the user writes.

The user should see issues appear as highlights and cards, but the app should not feel naggy or slow.

## Behavior

Do not call the judge on every keystroke.

Use debouncing:

1. User types.
2. Wait 800-1200ms after typing stops.
3. Show subtle "checking" state.
4. Call judge.
5. Update findings.

## MVP real-time behavior

For now:
- Use /api/judge with mock responses.
- If the text contains known mock spans, return those findings.
- If spans are removed, remove those findings.
- If nothing is found, show clean state:
  "Nothing to flag. Ready to post."

## UX rules

- Do not flash warnings aggressively.
- Do not move the user's cursor.
- Do not auto-rewrite text.
- Do not cover the editor while typing.
- Keep the judge panel calm.

## Future behavior

Later:
- Run cheap local checks instantly.
- Run LLM judge after debounce.
- Run evidence search only for factual claims.
- Show evidence search as a slower secondary state.