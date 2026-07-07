export interface FallacyGuideEntry {
  /** Canonical display name */
  name: string;
  /** One sentence a non-expert can understand */
  definition: string;
  /** Everyday analogy — not about the debate topic */
  analogy: string;
}

const FALLACY_GUIDE: Record<string, FallacyGuideEntry> = {
  "ad hominem": {
    name: "Ad hominem",
    definition:
      "Attacking the person making the argument instead of addressing what they actually said.",
    analogy:
      'Like saying "You failed math, so your restaurant review must be wrong" — the person\'s flaws do not automatically disprove their point.',
  },
  "false dilemma": {
    name: "False dilemma",
    definition:
      "Presenting only two extreme options when other reasonable choices exist.",
    analogy:
      '"Either we never leave the house or we will definitely get hit by a car." Most days look nothing like either extreme.',
  },
  "false dichotomy": {
    name: "False dichotomy",
    definition:
      "Treating a complex issue as if there are only two sides, when the middle ground or other paths are realistic.",
    analogy:
      '"You are either with us or against us" — that skips every mixed, partial, or different position someone might hold.',
  },
  "straw man": {
    name: "Straw man",
    definition:
      "Misrepresenting someone's position to make it easier to knock down.",
    analogy:
      'They said "we should eat less sugar," and you argue against "never eating anything sweet again" — a harder position they never took.',
  },
  "slippery slope": {
    name: "Slippery slope",
    definition:
      "Assuming one small step will inevitably lead to an extreme outcome without showing why each step must follow.",
    analogy:
      '"If homework is optional once, schools will stop teaching entirely." One change does not automatically cause the worst-case ending.',
  },
  "appeal to moderation": {
    name: "Appeal to moderation",
    definition:
      "Assuming the middle option is correct just because it sounds balanced, not because evidence supports it.",
    analogy:
      'One person says 0°C, another says 100°C, so you insist room temperature must be 50°C — the average is not automatically right.',
  },
  "appeal to tradition": {
    name: "Appeal to tradition",
    definition:
      "Arguing something is good or true mainly because it is old or has always been done that way.",
    analogy:
      '"We have always had a landline, so smartphones must be a bad idea." Longstanding habit is not proof on its own.',
  },
  "appeal to authority": {
    name: "Appeal to authority",
    definition:
      "Treating a claim as true because a famous or expert person said it, without evidence for the claim itself.",
    analogy:
      'A celebrity endorses a diet pill, so it must work — fame in one field does not prove medical facts.',
  },
  "appeal to emotion": {
    name: "Appeal to emotion",
    definition:
      "Trying to win the point by stirring fear, pity, or outrage instead of giving reasons.",
    analogy:
      'Showing sad photos to prove a tax policy is wrong — feelings can matter, but they are not a substitute for reasoning.',
  },
  "appeal to popularity": {
    name: "Appeal to popularity",
    definition:
      "Assuming something is true or good because many people believe it or do it.",
    analogy:
      '"Millions of people bought it, so it must be high quality." Crowds can be wrong.',
  },
  bandwagon: {
    name: "Bandwagon",
    definition:
      "Arguing that you should agree because everyone else does.",
    analogy:
      '"All my friends are doing it, so it must be fine." Popularity is not proof.',
  },
  "hasty generalization": {
    name: "Hasty generalization",
    definition:
      "Drawing a broad conclusion from too few examples.",
    analogy:
      'One rude cashier means "this whole chain hates customers." A single case rarely represents everyone.',
  },
  "red herring": {
    name: "Red herring",
    definition:
      "Introducing an unrelated topic to distract from the original question.",
    analogy:
      'Asked whether the project is on budget, they answer with a long story about office coffee — that does not answer the question.',
  },
  "circular reasoning": {
    name: "Circular reasoning",
    definition:
      "Using the conclusion as its own proof, without independent support.",
    analogy:
      '"This book is true because the book says it is true." The claim and the reason are the same thing.',
  },
  "begging the question": {
    name: "Begging the question",
    definition:
      "Assuming the very thing you are trying to prove, hidden inside the argument.",
    analogy:
      '"Cheating is wrong because it is unethical." That restates the claim without giving a new reason.',
  },
  "tu quoque": {
    name: "Tu quoque",
    definition:
      'Deflecting criticism by saying "you do it too," instead of answering the criticism.',
    analogy:
      'Caught speeding, you say "well, you rolled a stop sign once" — that does not make speeding okay.',
  },
  "genetic fallacy": {
    name: "Genetic fallacy",
    definition:
      "Judging an idea only by where it came from, not by whether it is sound.",
    analogy:
      'Dismissing good safety advice because it came from a rival company — the source does not automatically make the advice false.',
  },
  "loaded question": {
    name: "Loaded question",
    definition:
      "Asking a question that sneaks in an unproven assumption, so any direct answer accepts it.",
    analogy:
      '"Have you stopped making careless mistakes?" assumes you were making them, whether you say yes or no.',
  },
  "false cause": {
    name: "False cause",
    definition:
      "Assuming that because one thing followed another, the first caused the second.",
    analogy:
      'You wore lucky socks and won the game, so the socks caused the win — timing together is not proof of cause.',
  },
  "post hoc": {
    name: "Post hoc",
    definition:
      "Blaming or crediting an earlier event just because it happened before the outcome.",
    analogy:
      'Crime fell after a new mayor took office, so the mayor alone must have fixed it — many other factors could be involved.',
  },
  equivocation: {
    name: "Equivocation",
    definition:
      "Sliding between two different meanings of the same word within one argument.",
    analogy:
      '"Banks are beside rivers, so you should keep your money in a river." The word "bank" changed meaning mid-argument.',
  },
  "whataboutism": {
    name: "Whataboutism",
    definition:
      "Responding to a criticism by pointing at someone else's unrelated wrongdoing.",
    analogy:
      'Asked to fix a leaky roof at home, you say "what about the neighbor\'s messy yard?" — that avoids your own issue.',
  },
};

const ALIASES: Record<string, string> = {
  "ad hominem attack": "ad hominem",
  "personal attack": "ad hominem",
  "either or": "false dilemma",
  "either-or": "false dilemma",
  "false dichotomy": "false dichotomy",
  "false dilemma": "false dilemma",
  "strawman": "straw man",
  "straw-man": "straw man",
  "slippery-slope": "slippery slope",
  "middle ground fallacy": "appeal to moderation",
  "appeal to the middle": "appeal to moderation",
  "appeal to common practice": "appeal to tradition",
  "appeal to the people": "appeal to popularity",
  "bandwagon fallacy": "bandwagon",
  "appeal to fear": "appeal to emotion",
  "appeal to pity": "appeal to emotion",
  "distraction": "red herring",
  "circular argument": "circular reasoning",
  "begging the question": "begging the question",
  "you too": "tu quoque",
  "what about": "whataboutism",
  "post hoc ergo propter hoc": "post hoc",
  "correlation is not causation": "false cause",
};

const GENERIC_GUIDE: FallacyGuideEntry = {
  name: "Logical fallacy",
  definition:
    "A pattern of reasoning that looks persuasive but does not actually support the conclusion.",
  analogy:
    'Like a broken scale that always reads "heavy" — the display feels official, but it is not measuring what you think.',
};

export function normalizeFallacyKey(raw: string): string {
  return raw
    .toLowerCase()
    .trim()
    .replace(/[’']/g, "")
    .replace(/\s+/g, " ");
}

export function getFallacyGuide(rawName: string): FallacyGuideEntry {
  const key = normalizeFallacyKey(rawName);
  const alias = ALIASES[key];
  const canonical = alias ?? key;
  return FALLACY_GUIDE[canonical] ?? { ...GENERIC_GUIDE, name: rawName.trim() || GENERIC_GUIDE.name };
}

export function getAllFallacyGuides(): FallacyGuideEntry[] {
  const seen = new Set<string>();
  const entries: FallacyGuideEntry[] = [];

  for (const entry of Object.values(FALLACY_GUIDE)) {
    if (seen.has(entry.name)) continue;
    seen.add(entry.name);
    entries.push(entry);
  }

  return entries.sort((a, b) => a.name.localeCompare(b.name));
}

export function fallacyGuideSlug(name: string): string {
  return normalizeFallacyKey(name).replace(/\s+/g, "-");
}
