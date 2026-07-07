"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Bookmark, BookOpen, Flame, HelpCircle, MessageSquare, ShieldAlert, Users } from "lucide-react";
import { listDebates } from "@/lib/api/persistence";
import { isShowcaseSlug, showcaseDebateSortIndex } from "@/lib/showcaseMeta";
import type { JudgeMode, SavedDebateSummary } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StaggerGroup, StaggerItem } from "@/components/ui/fade-in";

interface DebateFeedProps {
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

function DebateCard({
  debate,
  onOpen,
}: {
  debate: SavedDebateSummary;
  onOpen: () => void;
}) {
  const isShowcase = isShowcaseSlug(debate.slug);
  const isPublished = Boolean(debate.starterPost?.publishedAt);
  const preview =
    debate.starterPost?.preview ||
    "Starter argument saved — open to continue review.";

  return (
    <Card className="flex h-full flex-col overflow-hidden border-border/80 bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20">
      <button type="button" onClick={onOpen} className="flex-1 px-6 py-5 text-left">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {isShowcase ? (
            <Badge className="gap-1 border-transparent bg-primary/10 text-primary hover:bg-primary/10">
              <Flame className="h-3 w-3" strokeWidth={2.5} />
              Showcase
            </Badge>
          ) : debate.isYours ? (
            <Badge className="gap-1 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary">
              <Bookmark className="h-3 w-3" strokeWidth={2.5} />
              Yours
            </Badge>
          ) : (
            <Badge className="gap-1 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary">
              <Users className="h-3 w-3" strokeWidth={2.5} />
              Community
            </Badge>
          )}
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

        <div className="mb-3 flex flex-wrap gap-1.5">
          {debate.hasCaveats && (
            <Badge
              variant="outline"
              className="gap-1 border-amber-500/30 bg-amber-500/10 text-[10px] text-amber-600 dark:text-amber-400"
            >
              <ShieldAlert className="h-3 w-3" />
              Has caveats
            </Badge>
          )}
          {debate.hasSourced && (
            <Badge
              variant="outline"
              className="gap-1 border-sky-500/30 bg-sky-500/10 text-[10px] text-sky-600 dark:text-sky-400"
            >
              <BookOpen className="h-3 w-3" />
              Sourced
            </Badge>
          )}
          {debate.hasContested && (
            <Badge
              variant="outline"
              className="gap-1 border-orange-500/30 bg-orange-500/10 text-[10px] text-orange-600 dark:text-orange-400"
            >
              <AlertTriangle className="h-3 w-3" />
              Logical fallacies
            </Badge>
          )}
          {debate.hasNeedsEvidence && (
            <Badge
              variant="outline"
              className="gap-1 border-violet-500/30 bg-violet-500/10 text-[10px] text-violet-600 dark:text-violet-400"
            >
              <HelpCircle className="h-3 w-3" />
              Needs evidence
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-muted-foreground">
          {debate.starterPost?.authorName && (
            <span>by {debate.starterPost.authorName}</span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <MessageSquare className="h-3.5 w-3.5" strokeWidth={2} />
            {debate.postCount} {debate.postCount === 1 ? "post" : "posts"}
          </span>
          {debate.reviewNoteCount > 0 && (
            <span>
              {debate.reviewNoteCount}{" "}
              {debate.reviewNoteCount === 1 ? "review note" : "review notes"}
            </span>
          )}
          {debate.caveatCount > 0 && (
            <span>
              {debate.caveatCount}{" "}
              {debate.caveatCount === 1 ? "caveat" : "caveats"}
            </span>
          )}
          {debate.sourcedClaimCount > 0 && (
            <span>
              {debate.sourcedClaimCount} sourced{" "}
              {debate.sourcedClaimCount === 1 ? "claim" : "claims"}
            </span>
          )}
          {debate.contestedCount > 0 && (
            <span>
              {debate.contestedCount}{" "}
              {debate.contestedCount === 1
                ? "logical fallacy"
                : "logical fallacies"}
            </span>
          )}
          {debate.needsEvidenceCount > 0 && (
            <span>
              {debate.needsEvidenceCount} need evidence
            </span>
          )}
        </div>
      </button>

      <div className="border-t border-border">
        <Button
          variant="ghost"
          onClick={onOpen}
          className="h-11 w-full rounded-none text-xs font-semibold"
        >
          {isPublished ? "Open debate thread" : "Continue review"}
        </Button>
      </div>
    </Card>
  );
}

export function DebateFeed({
  onOpenSavedDebate,
  refreshKey = 0,
}: DebateFeedProps) {
  const [debates, setDebates] = useState<SavedDebateSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setLoadError(null);

    listDebates()
      .then(({ debates: loaded }) => {
        if (!cancelled) setDebates(loaded);
      })
      .catch((err) => {
        console.warn("Could not load debates:", err);
        if (!cancelled) {
          setLoadError(
            "Debates could not be loaded. Run npm run db:migrate and npm run seed:showcase in the frontend folder.",
          );
          setDebates([]);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const showcaseDebates = debates
    .filter((d) => isShowcaseSlug(d.slug))
    .sort(
      (a, b) =>
        showcaseDebateSortIndex(a.slug) - showcaseDebateSortIndex(b.slug),
    );
  const yourDebates = debates.filter(
    (d) => !isShowcaseSlug(d.slug) && d.isYours,
  );
  const communityDebates = debates.filter(
    (d) => !isShowcaseSlug(d.slug) && !d.isYours,
  );

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
          Interesting debates from the community — and your own when you create
          them.
        </p>
      </div>

      {loadError && (
        <p className="mb-4 text-sm text-muted-foreground">{loadError}</p>
      )}

      {isLoading && (
        <p className="text-sm text-muted-foreground">Loading debates…</p>
      )}

      {!isLoading && !loadError && debates.length === 0 && (
        <Card className="border-dashed border-border/80 bg-muted/20 px-6 py-10 text-center">
          <p className="text-sm text-muted-foreground">
            No debates yet. Run{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
              npm run seed:showcase
            </code>{" "}
            or create your own debate.
          </p>
        </Card>
      )}

      {!isLoading && yourDebates.length > 0 && (
        <section className="mb-14">
          <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Your debates
          </h2>
          <p className="mb-5 text-sm text-muted-foreground">
            Debates and drafts you created.
          </p>
          <StaggerGroup className="grid w-full gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {yourDebates.map((debate) => (
              <StaggerItem key={debate.id}>
                <DebateCard
                  debate={debate}
                  onOpen={() => onOpenSavedDebate(debate.id)}
                />
              </StaggerItem>
            ))}
          </StaggerGroup>
        </section>
      )}

      {!isLoading && communityDebates.length > 0 && (
        <section className="mb-14">
          <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Community debates
          </h2>
          <p className="mb-5 text-sm text-muted-foreground">
            Published debates started by other members — jump in with a reply.
          </p>
          <StaggerGroup className="grid w-full gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {communityDebates.map((debate) => (
              <StaggerItem key={debate.id}>
                <DebateCard
                  debate={debate}
                  onOpen={() => onOpenSavedDebate(debate.id)}
                />
              </StaggerItem>
            ))}
          </StaggerGroup>
        </section>
      )}

      {!isLoading && showcaseDebates.length > 0 && (
        <section>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Showcase debates
          </h2>
          <p className="mb-5 text-sm text-muted-foreground">
            Curated threads with review notes, caveats, and nested replies.
          </p>
          <StaggerGroup className="grid w-full gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {showcaseDebates.map((debate) => (
              <StaggerItem key={debate.id}>
                <DebateCard
                  debate={debate}
                  onOpen={() => onOpenSavedDebate(debate.id)}
                />
              </StaggerItem>
            ))}
          </StaggerGroup>
        </section>
      )}
    </div>
  );
}
