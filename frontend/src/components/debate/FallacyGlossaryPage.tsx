"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, Lightbulb } from "lucide-react";
import { AuthUserButton } from "@/components/auth/AuthUserButton";
import { AppHeader } from "@/components/ui/app-header";
import { StaggerGroup, StaggerItem } from "@/components/ui/fade-in";
import {
  fallacyGuideSlug,
  getAllFallacyGuides,
} from "@/lib/fallacyGuide";
import { cn } from "@/lib/utils";

export function FallacyGlossaryPage() {
  const router = useRouter();
  const fallacies = getAllFallacyGuides();

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const target = document.getElementById(hash);
    if (!target) return;
    window.requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        links={[
          {
            label: "Debates",
            onClick: () => router.push("/app"),
          },
          {
            label: "Fallacies",
            onClick: () => router.push("/app/fallacies"),
            active: true,
          },
        ]}
        onLogoClick={() => router.push("/")}
        onCreate={() => router.push("/app")}
        createLabel="Create debate"
        authSlot={<AuthUserButton />}
      />

      <div className="h-14" aria-hidden />

      <div className="px-4 pb-16 pt-8 md:px-8 lg:px-12 xl:px-16">
        <Link
          href="/app"
          className="mb-6 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to debates
        </Link>

        <div className="mb-10 max-w-3xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Reference
          </p>
          <h1 className="font-serif text-3xl font-medium tracking-tight text-foreground md:text-4xl lg:text-5xl">
            Logical fallacy guide
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
            Plain-language definitions for the reasoning patterns Parliavent flags
            in debates. Each card explains what the fallacy is and gives a simple
            everyday example.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {fallacies.length} fallacies
          </p>
        </div>

        <StaggerGroup className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {fallacies.map((entry) => {
            const slug = fallacyGuideSlug(entry.name);
            return (
              <StaggerItem key={entry.name}>
                <article
                  id={slug}
                  className={cn(
                    "group flex h-full scroll-mt-28 flex-col rounded-xl border border-border/80 bg-card p-5 transition-all duration-200",
                    "hover:border-orange-500/30 hover:bg-card/90 hover:shadow-lg hover:shadow-black/20",
                  )}
                >
                  <div className="mb-3 flex items-start gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-orange-500/25 bg-orange-500/10 text-orange-400">
                      <BookOpen className="h-4 w-4" strokeWidth={2} />
                    </span>
                    <h2 className="pt-0.5 font-serif text-lg font-medium leading-snug text-foreground">
                      {entry.name}
                    </h2>
                  </div>

                  <p className="mb-4 text-sm leading-relaxed text-foreground/90">
                    {entry.definition}
                  </p>

                  <div className="mt-auto rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5">
                    <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      <Lightbulb className="h-3 w-3" />
                      Simple example
                    </div>
                    <p className="text-xs italic leading-relaxed text-muted-foreground">
                      {entry.analogy}
                    </p>
                  </div>
                </article>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </div>
  );
}
