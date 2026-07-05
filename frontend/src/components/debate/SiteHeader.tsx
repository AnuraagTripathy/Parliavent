"use client";

import React from "react";
import { Landmark, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MenuToggleIcon } from "@/components/ui/menu-toggle-icon";
import { useScroll } from "@/components/ui/use-scroll";
import { cn } from "@/lib/utils";
import type { AppScreen } from "@/lib/types";

interface SiteHeaderProps {
  screen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  subtitle?: string;
  onCreateStarter?: () => void;
}

export function SiteHeader({
  screen,
  onNavigate,
  subtitle,
  onCreateStarter,
}: SiteHeaderProps) {
  const [open, setOpen] = React.useState(false);
  const scrolled = useScroll(10);

  const isFeedActive =
    screen === "feed" || screen === "issue" || screen === "post";

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function goHome() {
    setOpen(false);
    onNavigate("feed");
  }

  function handleCreate() {
    setOpen(false);
    onCreateStarter?.();
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 mx-auto w-full max-w-5xl border-b md:rounded-md md:border md:transition-all md:ease-out",
        scrolled && !open
          ? "border-border bg-background/95 shadow-lg shadow-black/20 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60 md:top-4 md:max-w-4xl"
          : "border-border/70 bg-background/85 backdrop-blur-md md:border-transparent md:bg-transparent md:backdrop-blur-none",
        open && "border-border bg-background/95",
      )}
    >
      <nav
        className={cn(
          "flex h-14 w-full items-center justify-between px-4 md:h-12 md:transition-all md:ease-out",
          scrolled && "md:px-3",
        )}
      >
        <button
          type="button"
          onClick={goHome}
          className="flex shrink-0 items-center gap-2.5"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Landmark className="h-4 w-4" strokeWidth={2.25} />
          </span>
          <span className="text-[15px] font-bold tracking-tight text-foreground">
            parliavent
          </span>
        </button>

        <div className="hidden items-center gap-1.5 md:flex">
          {subtitle && (
            <span className="mr-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {subtitle}
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={goHome}
            className={cn(
              "h-8 text-[13px]",
              isFeedActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground",
            )}
          >
            Home
          </Button>
          {onCreateStarter && (
            <Button size="sm" onClick={handleCreate} className="h-8 text-[13px]">
              <Plus className="mr-1.5 h-3.5 w-3.5" strokeWidth={2.5} />
              Create
            </Button>
          )}
        </div>

        <Button
          size="icon"
          variant="outline"
          onClick={() => setOpen(!open)}
          className="h-9 w-9 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <MenuToggleIcon open={open} className="size-5" duration={300} />
        </Button>
      </nav>

      <div
        className={cn(
          "fixed inset-x-0 bottom-0 top-14 z-50 flex flex-col overflow-hidden border-y border-border bg-background/95 backdrop-blur-lg md:hidden",
          open ? "block" : "hidden",
        )}
      >
        <div
          data-slot={open ? "open" : "closed"}
          className={cn(
            "data-[slot=open]:animate-in data-[slot=open]:zoom-in-95 data-[slot=closed]:animate-out data-[slot=closed]:zoom-out-95 ease-out",
            "flex h-full w-full flex-col justify-between gap-y-2 p-4",
          )}
        >
          <div className="grid gap-y-2">
            {subtitle && (
              <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                {subtitle}
              </p>
            )}
            <Button
              variant="ghost"
              onClick={goHome}
              className={cn(
                "justify-start",
                isFeedActive && "bg-accent text-accent-foreground",
              )}
            >
              Home
            </Button>
          </div>
          {onCreateStarter && (
            <Button onClick={handleCreate} className="w-full">
              <Plus className="mr-1.5 h-4 w-4" strokeWidth={2.5} />
              Create debate
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
