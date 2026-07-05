import {
  citationsFromFindings,
  sourcesFromFindings,
} from "./citationsFromFindings";
import {
  buildClaimCaveatsFromFindings,
  hasOpenNonCaveatedFindings,
} from "./claimCaveats";
import type { Finding, PostKind, PublishedArgument } from "./types";

export function buildPublishedArgument(params: {
  text: string;
  findings: Finding[];
  author?: string;
  kind?: PostKind;
  issueId?: string;
  parentId?: string;
}): PublishedArgument {
  const sources = sourcesFromFindings(params.findings);
  const citations = citationsFromFindings(params.findings);
  const claimCaveats = buildClaimCaveatsFromFindings(params.findings, params.text);

  const contestedFallacies = params.findings
    .filter((f) => f.type === "fallacy" && f.status === "disputed")
    .map((f) => f.subtitle)
    .filter((name): name is string => Boolean(name));

  const hasOtherOpenFindings = hasOpenNonCaveatedFindings(params.findings);

  return {
    id: `user-${Date.now()}`,
    author: params.author ?? "You",
    postedAt: "Just now",
    text: params.text,
    sources,
    citations,
    claimCaveats: claimCaveats.length > 0 ? claimCaveats : undefined,
    kind: params.kind,
    issueId: params.issueId,
    parentId: params.parentId,
    deskBangs: 0,
    userBanged: false,
    contestedFallacies:
      contestedFallacies.length > 0 ? contestedFallacies : undefined,
    caveats: hasOtherOpenFindings
      ? ["Posted with unresolved review item."]
      : undefined,
  };
}

export function formatByline(argument: PublishedArgument): string {
  const sourceCount = argument.sources.length;
  const contestedCount = argument.contestedFallacies?.length ?? 0;

  const sourceLabel =
    sourceCount === 1 ? "1 source attached" : `${sourceCount} sources attached`;
  const flagLabel =
    contestedCount === 1
      ? "1 flag contested"
      : `${contestedCount} flags contested`;

  return `Vetted, ${sourceLabel}, ${flagLabel}`;
}
