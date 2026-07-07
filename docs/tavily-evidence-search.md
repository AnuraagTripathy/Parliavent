# Parliavent Tavily evidence search

## Goal

Add user-triggered source search for claim findings.

When the judge returns a claim finding, the user can click "Find sources." The app searches for credible source candidates and lets the user choose one to attach.

Sources are never attached automatically.

## Provider

Provider: Tavily

## Backend

Use Next.js TypeScript Route Handlers.

Endpoint:

POST /api/evidence/search

## Environment variables

Add to `.env.local`:

TAVILY_API_KEY=your_tavily_key_here

Do not commit `.env.local`.

## Input

{
  "claim": "productivity will collapse and the economy will fall apart",
  "argumentText": "full argument text",
  "threadId": "remote-work"
}

## Output

{
  "claim": "...",
  "sources": [
    {
      "id": "source-1",
      "title": "string",
      "publisher": "string",
      "url": "string",
      "snippet": "string",
      "supportLevel": "supports" | "partially_supports" | "contradicts" | "related_only" | "unclear",
      "credibility": "high" | "medium" | "low"
    }
  ]
}

## Product rules

- Source search is user-triggered.
- Do not automatically search for every claim.
- Do not automatically attach sources.
- User must choose a source explicitly.
- If source search fails, keep the draft safe and show a quiet error.
- Do not add full crawling yet.
- Do not add database yet.
- Do not add FastAPI yet.

## V1 behavior

Claim card should show:

Find sources
Mark as opinion
Keep as-is

When user clicks Find sources:
1. Show loading state on that claim card.
2. Call POST /api/evidence/search.
3. Show 3-5 source candidates.
4. User clicks Use source.
5. Source attaches to the claim.
6. Claim becomes source_attached.
7. Citation marker appears in the argument/published view.

## Future behavior

Later we can add:
- source credibility scoring with LLM
- contradiction search
- full page crawling
- evidence synthesis
- Redis caching
- source verification agents

## Evidence Engine v2

The evidence system now goes beyond Tavily snippets.

Current pipeline:

1. Generate deterministic search queries:
   - support query
   - contradiction query
   - official/neutral query
2. Search Tavily across all queries.
3. Deduplicate URLs.
4. Filter blocked/social domains.
5. Fetch top source pages server-side.
6. Extract readable text from HTML.
7. Chunk text into passages.
8. Rank passages against the claim using deterministic scoring.
9. Verify support/contradiction with Groq using passages first and snippets second.
10. Return claim verdict, source support levels, rationale, and evidence passages.

The system does not automatically attach sources. Sources attach only after explicit user action.

If page fetching fails, the system falls back to snippet-based verification.