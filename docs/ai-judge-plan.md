# Parliavent AI judge plan

## Goal

Turn the static judge into a real analysis engine.

The AI judge should analyze user-written arguments and return structured findings.

It should not rewrite the full argument.

## Pipeline

1. Receive argument text.
2. Split into candidate claims and argumentative moves.
3. Classify spans:
   - factual claim
   - opinion
   - emotional language
   - possible fallacy
   - vague or overbroad phrase
4. Return structured findings.
5. Frontend highlights the exact spans.
6. User decides what to do.

## First real AI version

Do not include web search yet.

The first AI version should only do:
- claim detection
- possible fallacy detection
- wording clarity suggestions
- plain-English explanations
- examples for fallacies

## Later evidence version

After the judge works, add evidence search.

Evidence search should:
- generate search queries
- retrieve sources
- rank credible sources
- decide whether the claim is supported, partially supported, contradicted, too broad, or unverifiable
- suggest narrower source-backed wording

## Output requirements

The model must return valid JSON matching the Finding type.

If output is invalid, the API should return an empty findings array rather than crashing.

## Product safety rule

The AI should phrase fallacies as possibilities, not certainties.

Good:
"This could be read as a false dilemma."

Bad:
"You committed a false dilemma."

## Voice preservation rule

The AI should suggest phrase-level or sentence-level edits only.

It should not produce a final approved argument.