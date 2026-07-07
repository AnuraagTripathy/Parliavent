import type { ShowcaseDebateDef } from "./showcase-debates";

/** Featured grey-area ethics thread with multiple logical fallacy examples. */
export const GREY_AREA_SHOWCASE_DEBATE: ShowcaseDebateDef = {
  slug: "showcase-promise-vs-harm",
  motion: "Is it wrong to break a promise to prevent harm?",
  category: "Ethics",
  description:
    "Moral grey zones, emotional pressure, false dilemmas, and slippery-slope reasoning.",
  posts: [
    {
      key: "promise-starter",
      author: "u3",
      text: "Breaking a promise can be justified when keeping it would clearly cause serious harm, but that does not mean promises stop mattering in ordinary life.",
    },
    {
      key: "promise-r1",
      author: "u2",
      parentKey: "promise-starter",
      text: "The hard part is where you draw the line. If people redraw promises too easily, trust collapses.",
    },
    {
      key: "promise-r1-1",
      author: "u1",
      parentKey: "promise-r1",
      text: "Either you keep every promise no matter what or you basically have no integrity at all.",
    },
    {
      key: "promise-r1-2",
      author: "u3",
      parentKey: "promise-r1",
      text: "Integrity can still allow rare exceptions. The problem is treating every inconvenience like an emergency.",
    },
    {
      key: "promise-r2",
      author: "u1",
      parentKey: "promise-starter",
      text: "Imagine watching someone bleed out because your friend would not break a dinner promise to call for help. Anyone who hesitates clearly has no heart.",
    },
    {
      key: "promise-r2-1",
      author: "u2",
      parentKey: "promise-r2",
      text: "A vivid story can show why harm matters, but horror anecdotes do not by themselves define a general rule.",
    },
    {
      key: "promise-r2-2",
      author: "u1",
      parentKey: "promise-r2-1",
      text: "Fair. I was using a nightmare case to make the stakes obvious, not to settle every small tradeoff.",
    },
    {
      key: "promise-r3",
      author: "u2",
      parentKey: "promise-starter",
      text: "If we allow one exception, soon every broken promise will be excused and language will mean nothing.",
    },
    {
      key: "promise-r3-1",
      author: "u3",
      parentKey: "promise-r3",
      text: "That jumps from rare emergency exceptions to everyone lying whenever it is convenient.",
    },
  ],
};
