"use client";

import Image from "next/image";
import {
  Flame,
  Gavel,
  MessageSquare,
  PenLine,
  Scale,
  ScrollText,
} from "lucide-react";
import { CTASection } from "@/components/ui/hero-dithering-card";
import { Hemicycle } from "@/components/ui/hemicycle";
import { Badge } from "@/components/ui/badge";
import { FadeIn, StaggerGroup, StaggerItem } from "@/components/ui/fade-in";
import { SHOWCASE_DEBATE_META } from "@/lib/showcaseMeta";

interface LandingPageProps {
  onEnterDebates: () => void;
  isSignedIn?: boolean;
}

const TICKER_ITEMS = [
  "Every claim gets checked",
  "Evidence over volume",
  "Attack the argument, not the person",
  "Change your mind in public",
  "Substance over slogans",
  "Desk bangs, not dunks",
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Write your argument",
    body: "Pick a debate and draft your case. No character-count games, no rage bait — just your best version of the point.",
    icon: PenLine,
  },
  {
    step: "02",
    title: "The judge reads it first",
    body: "Before you post, an AI judge flags shaky claims, possible fallacies, and loaded wording — as questions, not verdicts.",
    icon: Scale,
  },
  {
    step: "03",
    title: "You decide what changes",
    body: "Attach a source, take a suggested rewrite, mark it as opinion, or post as-is. Nothing changes without your click.",
    icon: ScrollText,
  },
];

const CONTRASTS = [
  { not: "Mindless pile-ons", instead: "Structured threads on real issues" },
  { not: "Winning the argument", instead: "Moving closer to what's true" },
  { not: "Heat without light", instead: "High-substance discussion" },
];

function Ticker() {
  const row = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="relative w-full overflow-hidden border-y border-border bg-primary py-3">
      <div className="animate-marquee flex w-max items-center">
        {[0, 1].map((half) => (
          <div key={half} className="flex items-center" aria-hidden={half === 1}>
            {row.map((item, i) => (
              <span
                key={`${half}-${i}`}
                className="flex items-center gap-6 whitespace-nowrap px-6 font-display text-xs font-semibold uppercase tracking-[0.26em] text-primary-foreground"
              >
                {item}
                <span className="h-1 w-1 rounded-full bg-primary-foreground/60" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

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
        ctaLabel={isSignedIn ? "Enter debates" : "Start debating"}
      />

      {/* ── What this is ────────────────────────────────────── */}
      <FadeIn className="relative w-full overflow-hidden px-4 py-24 md:px-8 lg:px-12 xl:px-16">
        <span
          aria-hidden="true"
          className="text-outline pointer-events-none absolute -right-8 -top-6 select-none font-display text-[10rem] font-bold leading-none opacity-[0.06] md:text-[16rem]"
        >
          01
        </span>

        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <p className="mb-4 font-display text-[11px] font-medium uppercase tracking-[0.3em] text-primary">
              What this is
            </p>
            <h2 className="mb-6 font-display text-4xl font-semibold uppercase leading-[1.05] tracking-tight text-foreground md:text-5xl">
              Arguments <span className="text-outline-primary">worth</span> having
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
              Most debate online is performance — quick jabs, cheap wins,
              nobody leaves smarter. Parliavent is built for the opposite:
              focused threads where claims get checked and the record shows
              what actually survived scrutiny.
            </p>
          </div>

          <StaggerGroup className="flex flex-col gap-3">
            {CONTRASTS.map((item) => (
              <StaggerItem key={item.not}>
                <div className="group grid grid-cols-[1fr_auto_1fr] items-center gap-4 border border-border bg-card px-6 py-5 transition-colors duration-300 hover:border-primary/40">
                  <p className="text-right text-sm font-medium text-muted-foreground/60 line-through decoration-destructive/50 decoration-2">
                    {item.not}
                  </p>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/30 bg-primary/10 font-display text-[10px] font-bold uppercase text-primary transition-transform duration-300 group-hover:rotate-12">
                    vs
                  </span>
                  <p className="text-sm font-semibold leading-snug text-foreground">
                    {item.instead}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </FadeIn>

      <Ticker />

      {/* ── How it works ────────────────────────────────────── */}
      <FadeIn
        id="how-it-works"
        className="relative w-full overflow-hidden border-t border-border px-4 py-24 md:px-8 lg:px-12 xl:px-16"
      >
        <span
          aria-hidden="true"
          className="text-outline pointer-events-none absolute -left-10 top-4 select-none font-display text-[10rem] font-bold leading-none opacity-[0.06] md:text-[16rem]"
        >
          02
        </span>

        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-center font-display text-[11px] font-medium uppercase tracking-[0.3em] text-primary">
            How it works
          </p>
          <h2 className="mb-14 text-center font-display text-4xl font-semibold uppercase tracking-tight text-foreground md:text-5xl">
            Checked before it <span className="text-outline-primary">posts</span>
          </h2>

          <StaggerGroup className="grid w-full gap-px overflow-hidden border border-border bg-border md:grid-cols-3">
            {HOW_IT_WORKS.map((item) => {
              const Icon = item.icon;
              return (
                <StaggerItem key={item.title} className="h-full">
                  <div className="group relative flex h-full flex-col bg-card p-8 transition-colors duration-300 hover:bg-accent md:p-10">
                    <span className="mb-6 font-display text-6xl font-semibold leading-none text-primary/20 transition-colors duration-300 group-hover:text-primary/50">
                      {item.step}
                    </span>
                    <div className="mb-4 flex h-11 w-11 items-center justify-center border border-primary/30 bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mb-3 text-lg font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {item.body}
                    </p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerGroup>
        </div>
      </FadeIn>

      {/* ── Live debates ────────────────────────────────────── */}
      <FadeIn className="relative w-full overflow-hidden border-t border-border bg-muted/20 px-4 py-24 md:px-8 lg:px-12 xl:px-16">
        <span
          aria-hidden="true"
          className="text-outline pointer-events-none absolute -right-8 bottom-0 select-none font-display text-[10rem] font-bold leading-none opacity-[0.06] md:text-[16rem]"
        >
          03
        </span>

        <div className="mx-auto max-w-6xl">
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-4 font-display text-[11px] font-medium uppercase tracking-[0.3em] text-primary">
                Live now
              </p>
              <h2 className="font-display text-4xl font-semibold uppercase tracking-tight text-foreground md:text-5xl">
                Open <span className="text-outline-primary">debates</span>
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                Real issues, vetted starters, replies that go deep — not wide
                for the sake of heat.
              </p>
            </div>
            <button
              type="button"
              onClick={onEnterDebates}
              className="shrink-0 text-sm font-medium text-primary underline decoration-primary/30 underline-offset-8 transition-colors hover:decoration-primary"
            >
              View all debates →
            </button>
          </div>

          <StaggerGroup className="grid w-full gap-4 md:grid-cols-2 xl:grid-cols-3">
            {previewDebates.map((issue) => (
              <StaggerItem key={issue.id} className="h-full">
                <button
                  type="button"
                  onClick={onEnterDebates}
                  className="group relative flex h-full w-full flex-col border border-border bg-card p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[6px_6px_0_0_rgba(236,78,2,0.35)]"
                >
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <Badge className="rounded-none bg-secondary font-display text-[10px] uppercase tracking-[0.18em] text-secondary-foreground hover:bg-secondary">
                      {issue.category}
                    </Badge>
                    {issue.isHot && (
                      <Badge className="gap-1 rounded-none border-transparent bg-primary/10 font-display text-[10px] uppercase tracking-[0.18em] text-primary hover:bg-primary/10">
                        <Flame className="h-3 w-3" />
                        Active
                      </Badge>
                    )}
                  </div>
                  <h3 className="mb-3 font-serif text-xl font-semibold leading-snug text-foreground">
                    {issue.title}
                  </h3>
                  <p className="mb-6 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {issue.description}
                  </p>
                  <div className="flex items-center gap-4 border-t border-border pt-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Gavel className="h-3.5 w-3.5 text-primary/70" />
                      {issue.deskBangs} desk bangs
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MessageSquare className="h-3.5 w-3.5" />
                      {issue.starterCount} starter
                    </span>
                  </div>
                </button>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </FadeIn>

      {/* ── Final CTA — the chamber awaits ──────────────────── */}
      <FadeIn className="relative w-full overflow-hidden border-t border-border px-4 pt-28 md:px-8 lg:px-12 xl:px-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(236,78,2,0.1)_0%,transparent_60%)]" />

        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
          <Image
            src="/parliavent-logo.png"
            alt="Parliavent"
            width={80}
            height={80}
            className="mb-8 h-20 w-20 object-contain"
          />
          <h2 className="mb-4 font-display text-4xl font-semibold uppercase leading-[1.05] tracking-tight text-foreground md:text-6xl">
            Leave with <span className="text-outline-primary">more</span> than
            you came with
          </h2>
          <p className="mb-10 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            You do not need to convert anyone. You need to think clearly, hear
            good objections, and update your view when the evidence warrants
            it. That is the whole point.
          </p>
          <button
            type="button"
            onClick={onEnterDebates}
            className="inline-flex h-14 items-center justify-center gap-3 rounded-full bg-primary px-12 text-base font-medium text-primary-foreground transition-all duration-300 hover:scale-[1.03] hover:bg-primary/90 hover:ring-4 hover:ring-primary/25 active:scale-[0.98]"
          >
            Step into the debates
          </button>
        </div>

        {/* Chamber seats close out the page */}
        <div className="pointer-events-none relative mx-auto -mb-10 mt-16 w-full max-w-5xl opacity-90">
          <Hemicycle className="h-auto w-full" />
        </div>
      </FadeIn>
    </div>
  );
}
