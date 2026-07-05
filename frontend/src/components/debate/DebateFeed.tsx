"use client";

import { useEffect, useState } from "react";
import { Bookmark, Flame, MessageSquare, Plus } from "lucide-react";
import { listDebates } from "@/lib/api/persistence";
import {
  formatDeskBangs,
  getHotIssues,
  MOCK_ISSUES,
} from "@/lib/mockFeed";
import type { Issue, JudgeMode, SavedDebateSummary } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StaggerGroup, StaggerItem } from "@/components/ui/fade-in";

interface DebateFeedProps {
  onOpenIssue: (issueId: string) => void;
  onNewStarter: (issueId: string) => void;
  onOpenSavedDebate: (debateId: string) => void;
  refreshKey?: number;
}

const MODE_LABELS: Record<JudgeMode, string> = {
  open_floor: "Open floor",
  structured_debate: "Structured",
  formal_motion: "Formal motion",
};

function formatSavedDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

function SavedDebateCard({
  debate,
  onOpen,
}: {
  debate: SavedDebateSummary;
  onOpen: () => void;
}) {
  const isPublished = Boolean(debate.starterPost?.publishedAt);
  const preview =
    debate.starterPost?.preview ||
    "Starter argument saved — open to continue review.";

  return (
    <Card className="flex h-full flex-col overflow-hidden border-primary/20 bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20">
      <button type="button" onClick={onOpen} className="flex-1 px-6 py-5 text-left">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge className="gap-1 border-transparent bg-primary/10 text-primary hover:bg-primary/10">
            <Bookmark className="h-3 w-3" strokeWidth={2.5} />
            Saved
          </Badge>
          <Badge variant="secondary" className="text-[11px] uppercase tracking-wide">
            {MODE_LABELS[debate.mode]}
          </Badge>
          <Badge
            variant="outline"
            className={`text-[11px] ${
              isPublished
                ? "border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                : "border-amber-500/30 text-amber-600 dark:text-amber-400"
            }`}
          >
            {isPublished ? "Published" : "Draft"}
          </Badge>
          <span className="text-[11px] text-muted-foreground">
            {formatSavedDate(debate.updatedAt)}
          </span>
        </div>

        <h2 className="mb-2 text-xl font-semibold leading-snug text-foreground">
          {debate.motion}
        </h2>
        <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {preview}
        </p>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <MessageSquare className="h-3.5 w-3.5" strokeWidth={2} />
            {debate.postCount} {debate.postCount === 1 ? "post" : "posts"}
          </span>
          {debate.findingCount > 0 && (
            <span>{debate.findingCount} findings</span>
          )}
          {debate.caveatCount > 0 && (
            <span>{debate.caveatCount} caveats</span>
          )}
        </div>
      </button>

      <div className="border-t border-border">
        <Button
          variant="ghost"
          onClick={onOpen}
          className="h-11 w-full rounded-none text-xs font-semibold"
        >
          {isPublished ? "Open published post" : "Continue review"}
        </Button>
      </div>
    </Card>
  );
}

function DemoIssueCard({
  issue,
  onOpen,
  onNewStarter,
}: {
  issue: Issue;
  onOpen: () => void;
  onNewStarter: () => void;
}) {
  return (
    <Card className="flex h-full flex-col overflow-hidden border-border/80 bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20">
      <button type="button" onClick={onOpen} className="flex-1 px-6 py-5 text-left">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className="text-[11px] uppercase tracking-wide text-muted-foreground"
          >
            Demo
          </Badge>
          <Badge variant="secondary" className="text-[11px] uppercase tracking-wide">
            {issue.category}
          </Badge>
          {issue.isHot && (
            <Badge className="gap-1 border-transparent bg-primary/10 text-primary hover:bg-primary/10">
              <Flame className="h-3 w-3" strokeWidth={2.5} />
              Hot
            </Badge>
          )}
          <span className="text-[11px] text-muted-foreground">{issue.lastActive}</span>
        </div>

        <h2 className="mb-2 text-xl font-semibold leading-snug text-foreground">
          {issue.title}
        </h2>
        <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {issue.description}
        </p>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 font-medium">
            <span aria-hidden>🪑</span>
            {formatDeskBangs(issue.deskBangs)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MessageSquare className="h-3.5 w-3.5" strokeWidth={2} />
            {issue.starterCount} starters · {issue.responseCount} replies
          </span>
        </div>
      </button>

      <div className="flex border-t border-border">
        <Button
          variant="ghost"
          onClick={onOpen}
          className="h-11 flex-1 rounded-none text-xs font-semibold"
        >
          Open thread
        </Button>
        <Button
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            onNewStarter();
          }}
          className="h-11 flex-1 rounded-none border-l border-border text-xs font-semibold text-primary hover:bg-primary/5 hover:text-primary"
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" strokeWidth={2.5} />
          Starter
        </Button>
      </div>
    </Card>
  );
}

export function DebateFeed({
  onOpenIssue,
  onNewStarter,
  onOpenSavedDebate,
  refreshKey = 0,
}: DebateFeedProps) {
  const [savedDebates, setSavedDebates] = useState<SavedDebateSummary[]>([]);
  const [isLoadingSaved, setIsLoadingSaved] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoadingSaved(true);
    setLoadError(null);

    listDebates()
      .then(({ debates }) => {
        if (!cancelled) setSavedDebates(debates);
      })
      .catch((err) => {
        console.warn("Could not load saved debates:", err);
        if (!cancelled) {
          setLoadError(
            "Saved debates could not be loaded. If this is your first time, run npm run db:migrate in the frontend folder.",
          );
          setSavedDebates([]);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoadingSaved(false);
      });

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const hotIssues = getHotIssues();
  const otherIssues = MOCK_ISSUES.filter((i) => !i.isHot);

  return (
    <div className="w-full px-4 py-8 md:px-8 lg:px-12 xl:px-16">
      <div className="mb-10">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Chamber floor
        </p>
        <h1 className="font-serif text-4xl font-medium tracking-tight text-foreground md:text-5xl">
          Debates
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Your saved debates from Postgres · demo threads for exploring the product.
        </p>
      </div>

      <section className="mb-14">
        <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Saved debates
        </h2>
        <p className="mb-5 text-sm text-muted-foreground">
          Custom debates you created — persisted in your local database.
        </p>

        {loadError && (
          <p className="mb-4 text-sm text-muted-foreground">{loadError}</p>
        )}

        {isLoadingSaved && (
          <p className="text-sm text-muted-foreground">Loading saved debates…</p>
        )}

        {!isLoadingSaved && !loadError && savedDebates.length === 0 && (
          <Card className="border-dashed border-border/80 bg-muted/20 px-6 py-10 text-center">
            <p className="text-sm text-muted-foreground">
              Create a debate to see it here.
            </p>
          </Card>
        )}

        {!isLoadingSaved && savedDebates.length > 0 && (
          <StaggerGroup className="grid w-full gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {savedDebates.map((debate) => (
              <StaggerItem key={debate.id}>
                <SavedDebateCard
                  debate={debate}
                  onOpen={() => onOpenSavedDebate(debate.id)}
                />
              </StaggerItem>
            ))}
          </StaggerGroup>
        )}
      </section>

      <section>
        <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Demo debates
        </h2>
        <p className="mb-5 text-sm text-muted-foreground">
          Sample issues with mock threads — not stored in Postgres.
        </p>

        <div className="mb-8 flex gap-6 border-b border-border">
          {(["hot", "new", "top"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              className={`-mb-px border-b-2 pb-3 text-sm font-semibold capitalize transition-colors ${
                tab === "hot"
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "hot" ? "Popping" : tab}
            </button>
          ))}
        </div>

        <StaggerGroup className="grid w-full gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {hotIssues.map((issue) => (
            <StaggerItem key={issue.id}>
              <DemoIssueCard
                issue={issue}
                onOpen={() => onOpenIssue(issue.id)}
                onNewStarter={() => onNewStarter(issue.id)}
              />
            </StaggerItem>
          ))}
        </StaggerGroup>

        {otherIssues.length > 0 && (
          <div className="mt-10">
            <h3 className="mb-5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              More demo issues
            </h3>
            <StaggerGroup className="grid w-full gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {otherIssues.map((issue) => (
                <StaggerItem key={issue.id}>
                  <DemoIssueCard
                    issue={issue}
                    onOpen={() => onOpenIssue(issue.id)}
                    onNewStarter={() => onNewStarter(issue.id)}
                  />
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        )}
      </section>
    </div>
  );
}
