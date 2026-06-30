import type { PublishedArgument } from "./types";

export const CITATION_PALETTE = [
  { bg: "#e8eef8", underline: "#7a9cc4", marker: "#5a7a9e", ring: "#dce4ef" },
  { bg: "#e6f0ec", underline: "#7aab96", marker: "#4a8a72", ring: "#d4e8df" },
  { bg: "#ebe8f4", underline: "#9a8cc4", marker: "#6a5a9e", ring: "#e0dce8" },
  { bg: "#f0ebe6", underline: "#b49a7a", marker: "#8a725a", ring: "#e8e0d8" },
] as const;

export function getCitationColor(sourceIndex: number) {
  return CITATION_PALETTE[sourceIndex % CITATION_PALETTE.length];
}

export const MOCK_PUBLISHED_ARGUMENTS: PublishedArgument[] = [
  {
    id: "arg-maya",
    author: "Maya Chen",
    postedAt: "2 days ago",
    text: "Copenhagen restricted car access in its city center starting in the 1960s. Today, over 60% of trips downtown happen by bike or foot. Partial bans paired with transit investment tend to work better than an overnight blanket ban — cities need time to build alternatives before cutting off access entirely.",
    sources: [
      {
        id: "src-cph-1",
        title: "Copenhagen bicycle account, 2023",
        publisher: "City of Copenhagen",
        url: "https://www.copenhagen.dk/en/policy/bicycle-account",
        isSample: true,
      },
      {
        id: "src-partial-1",
        title: "Gradual car reduction vs. sudden bans: a comparative review",
        publisher: "Journal of Urban Mobility",
        url: "https://example.com/urban-mobility/partial-bans",
        isSample: true,
      },
    ],
    citations: [
      {
        id: "cite-1",
        spanText: "over 60% of trips downtown happen by bike or foot",
        sourceId: "src-cph-1",
      },
      {
        id: "cite-2",
        spanText:
          "Partial bans paired with transit investment tend to work better than an overnight blanket ban",
        sourceId: "src-partial-1",
      },
    ],
  },
  {
    id: "arg-james",
    author: "James Okonkwo",
    postedAt: "4 days ago",
    text: "Congestion pricing in London's central zone cut traffic 27% in the first year while maintaining access for deliveries and emergency vehicles. A full ban would remove that flexibility. Revenue from the charge also funded bus network improvements across the city.",
    sources: [
      {
        id: "src-london-1",
        title: "Central London congestion charge: ten-year impact assessment",
        publisher: "Transport for London",
        url: "https://tfl.gov.uk/corporate/publications-and-reports/congestion-charge",
        isSample: true,
      },
      {
        id: "src-london-2",
        title: "How congestion pricing revenue funded London bus expansion",
        publisher: "Centre for London",
        url: "https://example.com/centre-for-london/congestion-revenue",
        isSample: true,
      },
    ],
    citations: [
      {
        id: "cite-3",
        spanText:
          "Congestion pricing in London's central zone cut traffic 27% in the first year while maintaining access for deliveries and emergency vehicles",
        sourceId: "src-london-1",
      },
      {
        id: "cite-4",
        spanText:
          "Revenue from the charge also funded bus network improvements across the city",
        sourceId: "src-london-2",
      },
    ],
  },
  {
    id: "arg-elena",
    author: "Elena Vasquez",
    postedAt: "1 week ago",
    text: "Barcelona's superblocks program reduced noise pollution by 4 decibels in pilot neighborhoods without banning cars citywide. Residents reported higher satisfaction with street life after the changes. I think a downtown ban goes too far, but we should copy what actually worked in Barcelona first.",
    sources: [
      {
        id: "src-bcn-1",
        title: "Superblocks pilot evaluation: environmental and social outcomes",
        publisher: "Barcelona City Council",
        url: "https://example.com/barcelona/superblocks-evaluation",
        isSample: true,
      },
      {
        id: "src-bcn-2",
        title: "Resident satisfaction survey, superblocks districts",
        publisher: "Barcelona Urban Ecology Agency",
        url: "https://example.com/barcelona/superblocks-survey",
        isSample: true,
      },
    ],
    citations: [
      {
        id: "cite-5",
        spanText:
          "Barcelona's superblocks program reduced noise pollution by 4 decibels in pilot neighborhoods without banning cars citywide",
        sourceId: "src-bcn-1",
      },
      {
        id: "cite-6",
        spanText:
          "Residents reported higher satisfaction with street life after the changes",
        sourceId: "src-bcn-2",
      },
    ],
    contestedFallacies: ["Appeal to moderation"],
    caveats: ["Posted with unresolved review item."],
  },
];

export function getPublishedArgument(id: string) {
  return MOCK_PUBLISHED_ARGUMENTS.find((a) => a.id === id);
}
