# Parliavent MVP scope

## MVP goal

Build one polished interactive prototype.

The prototype should prove the core loop:

User writes an argument → judge highlights issues → user resolves, keeps, or disputes issues → user posts → published view shows citations and caveats.

## In scope

- One debate motion:
  "Should cities ban cars from downtown areas?"

- Composer screen
- Real-time/mock judge highlights
- Findings panel
- Three finding types:
  - Claim needing evidence
  - Possible logical fallacy
  - Clarity/tone issue

- User actions:
  - Apply wording suggestion
  - Attach source
  - Mark as opinion
  - See fallacy explanation
  - Use fallacy fix
  - Keep as-is
  - Dispute fallacy
  - Post

- Published view:
  - Final user-authored argument
  - Citation markers
  - Source list
  - Contested fallacy chip
  - Vetted byline

## Out of scope for now

- Authentication
- User profiles
- Voting
- Comments
- Full Reddit-style forum
- Real database
- Real AI calls
- Real web search
- Real citation verification
- Multiple debate rooms
- Mobile app

## Build approach

Start with mock data only.

The first version should feel real, but the judge findings and sources can be hardcoded.

After the UI works, add:
1. Mock API route.
2. Real structured LLM output.
3. Real evidence search.
4. Forum/community features.