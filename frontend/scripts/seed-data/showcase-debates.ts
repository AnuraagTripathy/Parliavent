import type { ShowcaseUserKey } from "./showcase-users";
import { GREY_AREA_SHOWCASE_DEBATE } from "./showcase-grey-area";

export interface ShowcasePostDef {
  key: string;
  author: ShowcaseUserKey;
  text: string;
  /** Parent post key; omit for root starter. */
  parentKey?: string;
}

export interface ShowcaseDebateDef {
  slug: string;
  motion: string;
  category: string;
  description: string;
  posts: ShowcasePostDef[];
}

export const SHOWCASE_DEBATES: ShowcaseDebateDef[] = [
  GREY_AREA_SHOWCASE_DEBATE,
  {
    slug: "showcase-mobile-phones-cancer",
    motion: "Do mobile phones increase cancer risk?",
    category: "Health",
    description:
      "Misinformation vs evidence-aligned replies on mobile phone radiation and cancer risk.",
    posts: [
      {
        key: "phones-starter",
        author: "u1",
        text: "Mobile phones literally cause cancer, and anyone ignoring that is pretending radiation is harmless.",
      },
      {
        key: "phones-r1",
        author: "u2",
        parentKey: "phones-starter",
        text: "That is a much stronger claim than the evidence supports. Reliable cancer organizations generally say normal mobile phone use has not been shown to clearly cause cancer.",
      },
      {
        key: "phones-r1-1",
        author: "u1",
        parentKey: "phones-r1",
        text: "But phones emit radiation, and radiation causes cancer, so it seems obvious that phones are dangerous.",
      },
      {
        key: "phones-r1-2",
        author: "u3",
        parentKey: "phones-r1",
        text: "The important distinction is ionizing versus non-ionizing radiation. A source talking about radiation in general does not automatically support a cancer claim about phones.",
      },
      {
        key: "phones-r2",
        author: "u3",
        parentKey: "phones-starter",
        text: "A more careful version would be that long-term health effects should keep being studied, not that phones literally cause cancer.",
      },
      {
        key: "phones-r2-1",
        author: "u1",
        parentKey: "phones-r2",
        text: "That sounds weaker, but it is probably more defensible than what I wrote.",
      },
    ],
  },
  {
    slug: "showcase-vaccine-microchips",
    motion: "Do vaccines contain microchips?",
    category: "Health",
    description:
      "Conspiracy claims, burden of proof, and manufacturing realities.",
    posts: [
      {
        key: "vax-starter",
        author: "u1",
        text: "Vaccines contain microchips and the government has been hiding it.",
      },
      {
        key: "vax-r1",
        author: "u3",
        parentKey: "vax-starter",
        text: "That claim needs extraordinary evidence. Public vaccine ingredients, manufacturing processes, and dosing information do not support the microchip claim.",
      },
      {
        key: "vax-r1-1",
        author: "u1",
        parentKey: "vax-r1",
        text: "Of course they would not list the microchips publicly if they were hiding them.",
      },
      {
        key: "vax-r1-2",
        author: "u2",
        parentKey: "vax-r1",
        text: "That moves the claim outside normal evidence standards. If every missing piece of evidence is treated as proof of a coverup, the claim cannot be tested.",
      },
      {
        key: "vax-r2",
        author: "u2",
        parentKey: "vax-starter",
        text: "Even setting politics aside, microchips small enough to pass through needles and function inside the body would still require evidence from manufacturing, supply chains, or independent testing.",
      },
      {
        key: "vax-r2-1",
        author: "u3",
        parentKey: "vax-r2",
        text: "Exactly. Parliavent should treat this as unsupported unless a source directly shows the specific mechanism, not just suspicion.",
      },
    ],
  },
  {
    slug: "showcase-congestion-pricing-emissions",
    motion: "Does congestion pricing reduce emissions?",
    category: "Policy",
    description:
      "Numeric overclaims, city-specific evidence, and safer wording.",
    posts: [
      {
        key: "congestion-starter",
        author: "u2",
        text: "Studies prove congestion pricing always cuts emissions by 40% within one year.",
      },
      {
        key: "congestion-r1",
        author: "u1",
        parentKey: "congestion-starter",
        text: "A safer claim is that congestion pricing can reduce traffic and may reduce emissions depending on city design, exemptions, and transit alternatives.",
      },
      {
        key: "congestion-r1-1",
        author: "u3",
        parentKey: "congestion-r1",
        text: "That distinction matters because a city with strong transit and a city with weak transit could see very different outcomes.",
      },
      {
        key: "congestion-r1-2",
        author: "u2",
        parentKey: "congestion-r1",
        text: "Fair, the 40% within one year part is the part that probably needs a very specific source.",
      },
      {
        key: "congestion-r2",
        author: "u3",
        parentKey: "congestion-starter",
        text: "I still think congestion pricing usually helps because it reduces unnecessary car trips, but 'always' is doing too much work here.",
      },
      {
        key: "congestion-r2-1",
        author: "u2",
        parentKey: "congestion-r2",
        text: "Yeah, 'always' makes it sound universal when the evidence is probably city-specific.",
      },
    ],
  },
  {
    slug: "showcase-god-exists",
    motion: "Does God exist?",
    category: "Philosophy",
    description:
      "Grey-area reasoning, circular arguments, and faith vs public proof.",
    posts: [
      {
        key: "god-starter",
        author: "u3",
        text: "The universe having order and consciousness makes belief in God reasonable, but it does not prove God in a laboratory sense.",
      },
      {
        key: "god-r1",
        author: "u2",
        parentKey: "god-starter",
        text: "That makes God one possible explanation, but it does not show that God is more likely than naturalistic explanations.",
      },
      {
        key: "god-r1-1",
        author: "u3",
        parentKey: "god-r1",
        text: "I agree it does not prove probability mathematically. My point is more that theism can be rational without being experimentally proven.",
      },
      {
        key: "god-r1-2",
        author: "u1",
        parentKey: "god-r1",
        text: "But if neither side can prove it conclusively, disbelief is also not automatically the rational default.",
      },
      {
        key: "god-r2",
        author: "u1",
        parentKey: "god-starter",
        text: "God obviously exists because the Bible says God exists.",
      },
      {
        key: "god-r2-1",
        author: "u2",
        parentKey: "god-r2",
        text: "That is circular unless someone already accepts the Bible as authoritative. It may work within a faith tradition, but not as a public argument.",
      },
      {
        key: "god-r2-2",
        author: "u1",
        parentKey: "god-r2-1",
        text: "That's fair. I should probably frame it as a faith-based reason, not proof that should convince everyone.",
      },
    ],
  },
  {
    slug: "showcase-ban-cars-downtown",
    motion: "Should cities ban cars from downtown areas?",
    category: "Urban policy",
    description:
      "Policy tradeoffs, accessibility, and economic overclaims.",
    posts: [
      {
        key: "cars-starter",
        author: "u1",
        text: "Cities should restrict cars downtown because dense pedestrian zones can improve safety, air quality, and local business activity.",
      },
      {
        key: "cars-r1",
        author: "u2",
        parentKey: "cars-starter",
        text: "That only works if transit is reliable enough to replace car trips for workers, disabled residents, and deliveries.",
      },
      {
        key: "cars-r1-1",
        author: "u1",
        parentKey: "cars-r1",
        text: "I agree a full ban would be too blunt. Emergency access, delivery windows, and disability access would need exceptions.",
      },
      {
        key: "cars-r1-2",
        author: "u3",
        parentKey: "cars-r1",
        text: "The debate should probably distinguish car-free streets, congestion zones, and delivery restrictions because they have different tradeoffs.",
      },
      {
        key: "cars-r2",
        author: "u3",
        parentKey: "cars-starter",
        text: "Banning cars always makes every city richer within a year.",
      },
      {
        key: "cars-r2-1",
        author: "u2",
        parentKey: "cars-r2",
        text: "That is too broad. A city might benefit economically, but 'every city' and 'within a year' need very specific evidence.",
      },
      {
        key: "cars-r2-2",
        author: "u3",
        parentKey: "cars-r2-1",
        text: "Fair. A better claim is that some pedestrianization projects can help local business, but the effect depends on implementation.",
      },
    ],
  },
  {
    slug: "showcase-ai-tech-jobs",
    motion: "Will AI take all tech jobs?",
    category: "Technology",
    description:
      "Labor-market predictions, hiring ladders, and tasks versus jobs.",
    posts: [
      {
        key: "ai-starter",
        author: "u1",
        text: "AI is going to take basically every tech job within five years. Junior engineers are already obsolete because companies can just use coding agents instead.",
      },
      {
        key: "ai-r1",
        author: "u2",
        parentKey: "ai-starter",
        text: "AI will probably change entry-level software work, but replacing all tech jobs is a much stronger claim than current evidence supports.",
      },
      {
        key: "ai-r1-1",
        author: "u3",
        parentKey: "ai-r1",
        text: "The bigger risk is that teams hire fewer juniors because AI raises the expected output per engineer, even if it does not fully replace engineers.",
      },
      {
        key: "ai-r1-2",
        author: "u1",
        parentKey: "ai-r1",
        text: "I still think the timeline is faster than people expect, especially for boilerplate frontend and CRUD work.",
      },
      {
        key: "ai-r2",
        author: "u3",
        parentKey: "ai-starter",
        text: "Tasks are not the same as jobs. Coding agents may automate parts of engineering while making product judgment, debugging, and ownership more important.",
      },
      {
        key: "ai-r2-1",
        author: "u1",
        parentKey: "ai-r2",
        text: "But if one senior with agents can do what five juniors used to do, companies may still hire fewer people.",
      },
      {
        key: "ai-r2-2",
        author: "u2",
        parentKey: "ai-r2-1",
        text: "That is the strongest version of the concern: not that every job disappears, but that the hiring ladder changes.",
      },
    ],
  },
];

export function isShowcaseSlug(slug: string): boolean {
  return slug.startsWith("showcase-");
}
