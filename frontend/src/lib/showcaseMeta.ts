export interface ShowcaseDebateMeta {
  motion: string;
  category: string;
  description: string;
}

/** Feed order for showcase cards — first item appears top-left. */
export const SHOWCASE_DEBATE_SLUG_ORDER = [
  "showcase-promise-vs-harm",
  "showcase-mobile-phones-cancer",
  "showcase-vaccine-microchips",
  "showcase-congestion-pricing-emissions",
  "showcase-god-exists",
  "showcase-ban-cars-downtown",
  "showcase-ai-tech-jobs",
] as const;

export const SHOWCASE_DEBATE_META: Record<string, ShowcaseDebateMeta> = {
  "showcase-promise-vs-harm": {
    motion: "Is it wrong to break a promise to prevent harm?",
    category: "Ethics",
    description:
      "Moral grey zones, emotional pressure, false dilemmas, and slippery-slope reasoning.",
  },
  "showcase-mobile-phones-cancer": {
    motion: "Do mobile phones increase cancer risk?",
    category: "Health",
    description:
      "Misinformation vs evidence-aligned replies on mobile phone radiation and cancer risk.",
  },
  "showcase-vaccine-microchips": {
    motion: "Do vaccines contain microchips?",
    category: "Health",
    description:
      "Conspiracy claims, burden of proof, and manufacturing realities.",
  },
  "showcase-congestion-pricing-emissions": {
    motion: "Does congestion pricing reduce emissions?",
    category: "Policy",
    description:
      "Numeric overclaims, city-specific evidence, and safer wording.",
  },
  "showcase-god-exists": {
    motion: "Does God exist?",
    category: "Philosophy",
    description:
      "Grey-area reasoning, circular arguments, and faith vs public proof.",
  },
  "showcase-ban-cars-downtown": {
    motion: "Should cities ban cars from downtown areas?",
    category: "Urban policy",
    description: "Policy tradeoffs, accessibility, and economic overclaims.",
  },
  "showcase-ai-tech-jobs": {
    motion: "Will AI take all tech jobs?",
    category: "Technology",
    description:
      "Labor-market predictions, hiring ladders, and tasks versus jobs.",
  },
};

export function isShowcaseSlug(slug: string): boolean {
  return slug.startsWith("showcase-");
}

export function getShowcaseMeta(slug: string): ShowcaseDebateMeta | undefined {
  return SHOWCASE_DEBATE_META[slug];
}

export function showcaseDebateSortIndex(slug: string): number {
  const index = SHOWCASE_DEBATE_SLUG_ORDER.indexOf(
    slug as (typeof SHOWCASE_DEBATE_SLUG_ORDER)[number],
  );
  return index === -1 ? SHOWCASE_DEBATE_SLUG_ORDER.length : index;
}
