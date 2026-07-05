"use client";

import { Flame, MessageSquare, Plus } from "lucide-react";
import {
  formatDeskBangs,
  getHotIssues,
  MOCK_ISSUES,
} from "@/lib/mockFeed";
import type { Issue } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StaggerGroup, StaggerItem } from "@/components/ui/fade-in";

interface DebateFeedProps {
  onOpenIssue: (issueId: string) => void;
  onNewStarter: (issueId: string) => void;
}

function IssueCard({
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

export function DebateFeed({ onOpenIssue, onNewStarter }: DebateFeedProps) {
  const hotIssues = getHotIssues();
  const otherIssues = MOCK_ISSUES.filter((i) => !i.isHot);

  return (
    <div className="w-full px-4 py-8 md:px-8 lg:px-12 xl:px-16">
      <div className="mb-10">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Chamber floor
        </p>
        <h1 className="font-serif text-4xl font-medium tracking-tight text-foreground md:text-5xl">
          Popping now
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Live debates · vetted arguments · desk bangs when someone lands a point.
        </p>
      </div>

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
            <IssueCard
              issue={issue}
              onOpen={() => onOpenIssue(issue.id)}
              onNewStarter={() => onNewStarter(issue.id)}
            />
          </StaggerItem>
        ))}
      </StaggerGroup>

      {otherIssues.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            More issues
          </h2>
          <StaggerGroup className="grid w-full gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {otherIssues.map((issue) => (
              <StaggerItem key={issue.id}>
                <IssueCard
                  issue={issue}
                  onOpen={() => onOpenIssue(issue.id)}
                  onNewStarter={() => onNewStarter(issue.id)}
                />
              </StaggerItem>
            ))}
          </StaggerGroup>
        </section>
      )}
    </div>
  );
}
