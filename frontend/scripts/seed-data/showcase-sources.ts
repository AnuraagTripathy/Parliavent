import type { ClaimVerdict, SourceCredibility, SupportLevel } from "../../src/lib/types";

export interface ShowcaseSourceDef {
  id: string;
  title: string;
  publisher: string;
  url?: string;
  snippet: string;
  credibility: SourceCredibility;
  supportLevel: SupportLevel;
  verdict: ClaimVerdict;
  summary: string;
  rationale: string;
}

export const SHOWCASE_SOURCES = {
  nciPhones: {
    id: "showcase-src-nci-phones",
    title: "Cell Phones and Cancer Risk",
    publisher: "National Cancer Institute",
    url: "https://www.cancer.gov/about-cancer/causes-prevention/risk/radiation/cell-phones-fact-sheet",
    snippet:
      "Studies thus far have not shown a consistent link between cell phone use and cancers of the brain, nerves, or other tissues of the head or neck.",
    credibility: "high",
    supportLevel: "supports",
    verdict: "supported",
    summary:
      "Major cancer authorities report no consistent evidence that typical mobile phone use clearly causes cancer.",
    rationale: "Supports the claim that normal mobile phone use has not been shown to clearly cause cancer.",
  },
  cdcVaccineIngredients: {
    id: "showcase-src-cdc-vax-ingredients",
    title: "Vaccine Ingredients",
    publisher: "CDC",
    url: "https://www.cdc.gov/vaccines/vac-gen/additives.htm",
    snippet:
      "Vaccine ingredients include antigens, adjuvants, preservatives, stabilizers, and residual amounts of substances used in production. Public ingredient lists do not describe microchips.",
    credibility: "high",
    supportLevel: "supports",
    verdict: "supported",
    summary:
      "Public vaccine ingredient and manufacturing information does not support hidden microchip claims.",
    rationale: "Supports the claim that public records do not document microchips in vaccines.",
  },
  congestionPricingPartial: {
    id: "showcase-src-congestion-partial",
    title: "Congestion pricing and traffic outcomes",
    publisher: "Transport policy review",
    url: "https://example.com/congestion-pricing-review",
    snippet:
      "Congestion pricing can reduce traffic volumes, with emissions effects varying by exemptions, transit quality, and city design.",
    credibility: "medium",
    supportLevel: "partially_supports",
    verdict: "partially_supported",
    summary:
      "Congestion pricing may reduce traffic and emissions, but outcomes depend on local design and exemptions.",
    rationale: "Partially supports a more careful congestion-pricing claim.",
  },
  pedestrianBusinessPartial: {
    id: "showcase-src-pedestrian-business",
    title: "Pedestrianization and local business outcomes",
    publisher: "Urban mobility journal",
    url: "https://example.com/pedestrian-business",
    snippet:
      "Some pedestrianization projects report improved foot traffic for local businesses, but results vary with delivery access and implementation details.",
    credibility: "medium",
    supportLevel: "partially_supports",
    verdict: "partially_supported",
    summary:
      "Some pedestrianization projects can help local business, but effects depend on implementation.",
    rationale: "Partially supports a nuanced economic claim about pedestrianization.",
  },
} satisfies Record<string, ShowcaseSourceDef>;
