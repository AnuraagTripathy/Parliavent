# Parliavent design direction

Applies to **`frontend/`** — all UI lives in the Next.js client.

## Overall feel

Parliavent should feel cool, slick, modern, and credible.

It should feel like:
- Linear
- Vercel
- Stripe docs
- Arc browser settings
- A premium writing/research tool

It should not feel like:
- A school grading portal
- A moderation dashboard
- A government form
- A generic AI chatbot
- A Reddit clone

## Visual personality

- shadcn/ui primitives (`frontend/src/components/ui/`) themed with warm dark surfaces + vermillion accent (`#EC4E02`) in `globals.css`. App components compose these primitives.
- Tailwind is allowed.
- Use a modern grotesk/system sans-serif stack.
- **Current direction:** dark zinc surfaces, teal accents, bold type — edgy and readable.
- Hairline borders on `zinc-800`.
- Generous spacing.
- Soft rounded corners on cards; sharper on chips and buttons.
- Very subtle shadows only.
- Muted colors.
- No loud gradients.
- No cartoonish icons.
- No aggressive red warning states.

## Layout

Desktop review screen:
- Left side: user's argument, large and visually dominant.
- Right side: judge panel, quieter supporting chrome.
- Bottom: readiness meter and post action.

Mobile:
- Composer first.
- Findings below.
- Bottom action bar remains clear.

## Finding colors

Use color sparingly.

- Clarity/tone: muted amber
- Claim/evidence: muted blue
- Fallacy: muted red
- Resolved: muted green

The fallacy UI should not scream. It should feel serious but calm.

## Highlight style

Highlights should be subtle:
- Clarity: amber background wash
- Claim: blue underline or soft blue marker
- Fallacy: red underline/marker
- Resolved: faded highlight with small check

## Motion

Use subtle motion:
- Findings panel slides/fades in.
- Cards expand smoothly.
- Highlights transition softly.
- Readiness meter animates when resolved.
- No flashy animations.

## Product hierarchy

The user's argument is the hero.

The judge panel is secondary.

The product should visually communicate:

"You are still the author. The judge is here to help."