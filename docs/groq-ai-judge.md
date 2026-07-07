# Parliavent Groq AI judge

## Goal

Replace the mock-only judge with a hosted AI judge using Groq.

The Groq judge should analyze arbitrary user arguments and return structured findings.

It should not perform evidence search yet.

## Provider

Provider: Groq  
Model: llama-3.3-70b-versatile

## Backend

The backend remains a Next.js TypeScript Route Handler.

Judge route:

/src/app/api/judge/route.ts

## Environment variables

Add these to `.env.local`:

GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
USE_MOCK_JUDGE=false

For fallback/demo mode:

USE_MOCK_JUDGE=true

## Product rules

The AI judge must never write a final approved argument.

It must only return findings.

Every finding must point to an exact substring from the user's argument.

If spanText is not an exact substring, discard the finding.

Fallacies should be phrased as possibilities, not certainties.

Good:
"This could be read as a false dilemma."

Bad:
"You committed a false dilemma."

## Finding types

- claim
- fallacy
- clarity



## Required finding fields

Each finding must include:

- id
- type
- status
- spanText
- title
- reason

Optional:

- subtitle
- confidence
- example
- suggestedRewrite
- sources



## Failure behavior

If Groq fails, times out, or returns malformed JSON:

- do not crash
- preserve the user's draft
- show the existing quiet judge error state
- do not show "Nothing to flag. Ready to post."



## Out of scope

Do not add:

- web search
- evidence agents
- database
- auth
- comments
- voting

## Current calibration behavior

The Groq judge is calibrated to avoid over-reviewing.

Expected behavior:
- Obvious personal attacks or extreme causal claims receive findings.
- Specific empirical claims with numbers, absolutes, or timelines receive claim findings.
- Cautious policy opinions using words like "may" or "if" usually receive no findings.
- Short arguments usually receive 0-2 findings.
- The judge should be quiet when the argument is already reasonable.
