# Parliavent API contract

## Purpose

The frontend should not depend directly on hardcoded mock data forever.

All argument analysis should eventually go through an API-shaped boundary so mock analysis, real LLM analysis, and evidence search can be swapped without rewriting the UI.

## Judge endpoint

POST /api/judge

### Input

{
  "text": "Cities need to ban cars downtown...",
  "mode": "structured_debate",
  "threadId": "cars-downtown"
}

### Output

{
  "findings": [
    {
      "id": "fallacy-1",
      "type": "fallacy",
      "status": "open",
      "spanText": "If we don't ban cars now, downtowns will become unlivable death zones",
      "title": "This offers only two extremes",
      "subtitle": "False dilemma",
      "reason": "Ban now or disaster are not the only options.",
      "confidence": 0.82,
      "example": "Either we ban all phones in school or students will never learn.",
      "suggestedRewrite": "Without action on downtown traffic, conditions for pedestrians may keep getting worse.",
      "severity": "medium"
    }
  ]
}

## Finding types

- claim
- fallacy
- clarity

## Finding statuses

- open
- resolved
- ignored
- disputed
- source_attached
- marked_opinion

## Important rule

The judge API can suggest edits, but it must never apply them.

The frontend is responsible for requiring an explicit user action before any suggested text changes the user's argument.

## Future evidence endpoint

POST /api/evidence/search

### Input

{
  "claim": "Copenhagen restricted car access in its city center starting in the 1960s"
}

### Output

{
  "verdict": "partially_supported",
  "summary": "The claim is directionally supported, but the exact phrasing needs narrowing.",
  "sources": [
    {
      "title": "Copenhagen bicycle account, 2023",
      "publisher": "City of Copenhagen",
      "url": "...",
      "credibility": "high"
    }
  ]
}