export type FindingType = "claim" | "fallacy" | "clarity";

export type FindingStatus =
  | "open"
  | "resolved"
  | "ignored"
  | "disputed"
  | "source_attached"
  | "marked_opinion";

export type CurrentView = "composer" | "review" | "published";

export type CheckingState = "idle" | "checking" | "complete";

export type PostKind = "starter" | "response";

export type FeedSort = "hot" | "new" | "top";

export interface Source {
  id: string;
  title: string;
  publisher: string;
  url?: string;
  isSample: boolean;
}

export interface Finding {
  id: string;
  type: FindingType;
  status: FindingStatus;
  spanText: string;
  title: string;
  subtitle?: string;
  reason: string;
  confidence?: string;
  example?: string;
  suggestedRewrite?: string;
  sources?: Source[];
  selectedSourceId?: string;
  disputeReason?: string;
}

export interface ReadinessResult {
  resolved: number;
  total: number;
  percent: number;
  label: string;
}

export interface Citation {
  id: string;
  spanText: string;
  sourceId: string;
}

export interface PublishedArgument {
  id: string;
  author: string;
  postedAt: string;
  text: string;
  sources: Source[];
  citations: Citation[];
  contestedFallacies?: string[];
  caveats?: string[];
  kind?: PostKind;
  issueId?: string;
  parentId?: string;
  deskBangs?: number;
  userBanged?: boolean;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: string;
  starterCount: number;
  responseCount: number;
  deskBangs: number;
  lastActive: string;
  isHot?: boolean;
}

export interface ComposerContext {
  mode: PostKind;
  issueId: string;
  issueTitle: string;
  parentId?: string;
  parentAuthor?: string;
  parentPreview?: string;
}

export type AppScreen =
  | "feed"
  | "issue"
  | "post"
  | "composer"
  | "argument";
