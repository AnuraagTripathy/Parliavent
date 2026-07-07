"use client";

import { BookOpen, Flame, Lightbulb, MessageSquare, Scale, Shield } from "lucide-react";
import { CTASection } from "@/components/ui/hero-dithering-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FadeIn, StaggerGroup, StaggerItem } from "@/components/ui/fade-in";
import { SHOWCASE_DEBATE_META } from "@/lib/showcaseMeta";

interface LandingPageProps {
  onEnterDebates: () => void;
  isSignedIn?: boolean;
}

const PRINCIPLES = [
  {
    title: "Toward truth, not victory",
    body: "The goal is a clearer picture of the issue — not beating someone in the replies. Desk bangs mark a good point, not a knockout.",
    icon: Scale,
  },
  {
    title: "Substance over slogans",
    body: "Claims get reviewed before you post. Attach sources, dispute flags honestly, and keep the thread at the level of the argument.",
    icon: Shield,
  },
  {
    title: "Learn in public",
    body: "Nested replies let anyone build on a thread. You can change your mind, refine your view, and leave with more than you arrived with.",
    icon: Lightbulb,
  },
];

const CONTRASTS = [
  {
    not: "Mindless pile-ons",
    instead: "Structured threads on real issues",
  },
  {
    not: "Winning the argument",
    instead: "Moving closer to what's true",
  },
  {
    not: "Heat without light",
    instead: "High-intellect discussion",
  },
];

export function LandingPage({ onEnterDebates, isSignedIn }: LandingPageProps) {
  const previewDebates = Object.entries(SHOWCASE_DEBATE_META)
    .slice(0, 3)
    .map(([slug, meta], index) => ({
      id: slug,
      title: meta.motion,
      description: meta.description,
      category: meta.category,
      deskBangs: 120 + index * 40,
      starterCount: 1,
      isHot: index === 0,
    }));

  return (
    <div className="w-full">
      <CTASection
        onStart={onEnterDebates}
        ctaLabel={isSignedIn ? "Enter the debates" : "Get started free"}
      />

      <FadeIn className="w-full px-4 py-20 md:px-8 lg:px-12 xl:px-16">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p className="mb-3 font-display text-[11px] font-medium uppercase tracking-[0.24em] text-primary">
            What this is
          </p>
          <h2 className="mb-5 font-serif text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-4xl">
            A forum for arguments worth having
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
            Most debate online is performance — quick jabs, cheap wins, and
            nobody leaves smarter. Parliavent is built for the opposite: slow,
            serious exchange where people engage ideas carefully and walk away
            with something they did not have before.
          </p>
        </div>

        <StaggerGroup className="grid w-full gap-4 md:grid-cols-3">
          {CONTRASTS.map((item) => (
            <StaggerItem key={item.not}>
            <Card
              className="h-full border-border/80 bg-card transition-transform duration-300 hover:-translate-y-0.5"
            >
              <CardContent className="p-6 md:p-8">
                <p className="mb-2 text-sm font-medium text-muted-foreground/70 line-through decoration-muted-foreground/40">
                  {item.not}
                </p>
                <p className="text-base font-semibold leading-snug text-foreground">
                  {item.instead}
                </p>
              </CardContent>
            </Card>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </FadeIn>

      <FadeIn className="w-full border-t border-border bg-muted/30 px-4 py-20 md:px-8 lg:px-12 xl:px-16">
        <p className="mb-3 text-center font-display text-[11px] font-medium uppercase tracking-[0.24em] text-primary">
          How we keep it civil
        </p>
        <h2 className="mb-12 text-center font-serif text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-4xl">
          Built for understanding
        </h2>
        <StaggerGroup className="grid w-full gap-6 md:grid-cols-3">
          {PRINCIPLES.map((principle, i) => {
            const Icon = principle.icon;
            return (
              <StaggerItem key={principle.title}>
              <Card className="h-full border-border/80 bg-card transition-transform duration-300 hover:-translate-y-0.5">
                <CardContent className="p-8">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {i + 1}
                  </p>
                  <h3 className="mb-2 text-lg font-semibold">{principle.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {principle.body}
                  </p>
                </CardContent>
              </Card>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </FadeIn>

      <FadeIn className="w-full px-4 py-16 md:px-8 lg:px-12 xl:px-16">
        <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 font-display text-[11px] font-medium uppercase tracking-[0.24em] text-primary">
              See it in practice
            </p>
            <h2 className="font-serif text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-4xl">
              Live discussions
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Real issues, vetted starters, and replies that go deep — not wide
              for the sake of heat.
            </p>
          </div>
          <button
            type="button"
            onClick={onEnterDebates}
            className="text-sm font-medium text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
          >
            View all issues →
          </button>
        </div>

        <StaggerGroup className="grid w-full gap-4 md:grid-cols-2 xl:grid-cols-3">
          {previewDebates.map((issue) => (
            <StaggerItem key={issue.id}>
            <Card
              className="h-full border-border/80 bg-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20"
            >
              <CardContent className="flex h-full flex-col p-6">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary">
                    {issue.category}
                  </Badge>
                  {issue.isHot && (
                    <Badge className="gap-1 border-transparent bg-primary/10 text-primary hover:bg-primary/10">
                      <Flame className="h-3 w-3" />
                      Active
                    </Badge>
                  )}
                </div>
                <h3 className="mb-2 text-lg font-semibold leading-snug text-foreground">
                  {issue.title}
                </h3>
                <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {issue.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>🪑 {issue.deskBangs}</span>
                  <span className="inline-flex items-center gap-1">
                    <MessageSquare className="h-3.5 w-3.5" />
                    {issue.starterCount} starters
                  </span>
                </div>
              </CardContent>
            </Card>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </FadeIn>

      <FadeIn className="w-full border-t border-border px-4 py-20 md:px-8 lg:px-12 xl:px-16">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <BookOpen className="mb-5 h-8 w-8 text-primary/80" />
          <h2 className="mb-4 font-serif text-2xl font-semibold tracking-[-0.02em] text-foreground md:text-3xl">
            Leave with more than you came with
          </h2>
          <p className="mb-8 text-base leading-relaxed text-muted-foreground">
            You do not need to convert anyone. You need to think clearly, hear
            good objections, and update your view when the evidence warrants it.
            That is the whole point.
          </p>
          <button
            type="button"
            onClick={onEnterDebates}
            className="text-sm font-semibold text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
          >
            Step into the debates →
          </button>
        </div>
      </FadeIn>
    </div>
  );
}
