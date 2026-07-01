import type { Issue, PublishedArgument } from "./types";

export const MOCK_ISSUES: Issue[] = [
  {
    id: "issue-cars",
    title: "Should cities ban cars from downtown areas?",
    description:
      "Traffic, livability, and access — what should downtown policy look like?",
    category: "Urban policy",
    starterCount: 4,
    responseCount: 12,
    deskBangs: 847,
    lastActive: "12m ago",
    isHot: true,
  },
  {
    id: "issue-ubi",
    title: "Is universal basic income feasible at national scale?",
    description:
      "Funding, incentives, and whether pilots tell us anything useful.",
    category: "Economics",
    starterCount: 6,
    responseCount: 31,
    deskBangs: 1204,
    lastActive: "34m ago",
    isHot: true,
  },
  {
    id: "issue-ai-jobs",
    title: "Will AI replace most white-collar jobs within a decade?",
    description:
      "Automation timelines, reskilling, and what history suggests.",
    category: "Technology",
    starterCount: 8,
    responseCount: 44,
    deskBangs: 2103,
    lastActive: "1h ago",
    isHot: true,
  },
  {
    id: "issue-nuclear",
    title: "Should we build more nuclear power plants now?",
    description: "Climate targets, cost, safety, and grid reliability.",
    category: "Energy",
    starterCount: 3,
    responseCount: 9,
    deskBangs: 412,
    lastActive: "3h ago",
  },
  {
    id: "issue-remote",
    title: "Is mandatory return-to-office good for companies?",
    description: "Productivity claims, culture, and worker preference.",
    category: "Work",
    starterCount: 5,
    responseCount: 18,
    deskBangs: 623,
    lastActive: "5h ago",
  },
];

export const MOCK_POSTS: PublishedArgument[] = [
  {
    id: "arg-maya",
    kind: "starter",
    issueId: "issue-cars",
    author: "Maya Chen",
    postedAt: "2 days ago",
    deskBangs: 142,
    userBanged: false,
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
    id: "resp-alex-1",
    kind: "response",
    issueId: "issue-cars",
    parentId: "arg-maya",
    author: "Alex Rivera",
    postedAt: "1 day ago",
    deskBangs: 67,
    userBanged: true,
    text: "The Copenhagen comparison ignores scale. American downtowns were built around the car — you can't retrofit a century of sprawl with bike lanes. Congestion pricing keeps access for deliveries and emergency vehicles while still cutting traffic.",
    sources: [
      {
        id: "src-london-1",
        title: "Central London congestion charge: ten-year impact assessment",
        publisher: "Transport for London",
        url: "https://tfl.gov.uk/corporate/publications-and-reports/congestion-charge",
        isSample: true,
      },
    ],
    citations: [
      {
        id: "cite-resp-1",
        spanText:
          "Congestion pricing keeps access for deliveries and emergency vehicles while still cutting traffic",
        sourceId: "src-london-1",
      },
    ],
  },
  {
    id: "resp-sam-1",
    kind: "response",
    issueId: "issue-cars",
    parentId: "arg-maya",
    author: "Sam Okoye",
    postedAt: "18h ago",
    deskBangs: 28,
    userBanged: false,
    text: "Partial bans sound reasonable until you ask who gets priced out. Delivery drivers, nurses on night shift, disabled residents — a downtown ban without massive transit investment is regressive.",
    sources: [],
    citations: [],
    caveats: ["Posted with unresolved review item."],
  },
  {
    id: "resp-maya-to-alex",
    kind: "response",
    issueId: "issue-cars",
    parentId: "resp-alex-1",
    author: "Maya Chen",
    postedAt: "20h ago",
    deskBangs: 41,
    userBanged: false,
    text: "Fair point on scale — but Copenhagen wasn't always bike-first either. They built the infrastructure over decades. The question isn't whether American cities can flip overnight, it's whether partial bans plus investment are a viable path here too.",
    sources: [],
    citations: [],
  },
  {
    id: "resp-james-to-alex",
    kind: "response",
    issueId: "issue-cars",
    parentId: "resp-alex-1",
    author: "James Okonkwo",
    postedAt: "14h ago",
    deskBangs: 19,
    userBanged: false,
    text: "Congestion pricing and partial bans aren't mutually exclusive. London did pricing first, then expanded low-traffic zones. Alex is right that a blanket ban removes flexibility — but that doesn't mean doing nothing.",
    sources: [],
    citations: [],
  },
  {
    id: "resp-elena-to-sam",
    kind: "response",
    issueId: "issue-cars",
    parentId: "resp-sam-1",
    author: "Elena Vasquez",
    postedAt: "12h ago",
    deskBangs: 33,
    userBanged: false,
    text: "This is the equity argument that actually matters. Any policy needs exemptions or subsidies for the people Sam named — otherwise partial bans just shift the burden onto workers who can't work from home.",
    sources: [],
    citations: [],
  },
  {
    id: "arg-james",
    kind: "starter",
    issueId: "issue-cars",
    author: "James Okonkwo",
    postedAt: "4 days ago",
    deskBangs: 89,
    userBanged: false,
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
    kind: "starter",
    issueId: "issue-cars",
    author: "Elena Vasquez",
    postedAt: "1 week ago",
    deskBangs: 54,
    userBanged: false,
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
  {
    id: "arg-ubi-1",
    kind: "starter",
    issueId: "issue-ubi",
    author: "Priya Sharma",
    postedAt: "6h ago",
    deskBangs: 203,
    userBanged: false,
    text: "Finland's two-year basic income pilot showed recipients reported less stress and no significant drop in employment. The cost argument assumes we add UBI on top of every existing program — most serious proposals replace a patchwork of means-tested benefits.",
    sources: [
      {
        id: "src-ubi-1",
        title: "Finland basic income experiment: final results",
        publisher: "Kela Research",
        isSample: true,
      },
    ],
    citations: [
      {
        id: "cite-ubi-1",
        spanText:
          "Finland's two-year basic income pilot showed recipients reported less stress and no significant drop in employment",
        sourceId: "src-ubi-1",
      },
    ],
  },
  {
    id: "arg-ai-1",
    kind: "starter",
    issueId: "issue-ai-jobs",
    author: "Marcus Webb",
    postedAt: "45m ago",
    deskBangs: 318,
    userBanged: false,
    text: "Every prior automation wave created more jobs than it destroyed — but with a painful transition period. AI may compress that transition into years instead of decades. The question isn't whether jobs disappear forever, but whether we can retrain fast enough.",
    sources: [],
    citations: [],
    contestedFallacies: ["Appeal to tradition"],
  },
];

export function getIssue(id: string) {
  return MOCK_ISSUES.find((i) => i.id === id);
}

export function getPost(id: string) {
  return MOCK_POSTS.find((p) => p.id === id);
}

export function getStartersForIssue(issueId: string) {
  return MOCK_POSTS.filter(
    (p) => p.issueId === issueId && p.kind === "starter",
  );
}

export function getResponsesForStarter(starterId: string) {
  return MOCK_POSTS.filter(
    (p) => p.parentId === starterId && p.kind === "response",
  );
}

export function getHotIssues() {
  return MOCK_ISSUES.filter((i) => i.isHot);
}

export function formatDeskBangs(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  }
  return String(count);
}
