"use client";

import React from "react";
import { Landmark, Plus } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MenuToggleIcon } from "@/components/ui/menu-toggle-icon";
import { useScroll } from "@/components/ui/use-scroll";

export interface AppHeaderLink {
  label: string;
  onClick: () => void;
  active?: boolean;
}

interface AppHeaderProps {
  links?: AppHeaderLink[];
  onLogoClick?: () => void;
  onCreate?: () => void;
  createLabel?: string;
  authSlot?: React.ReactNode;
}

export function AppHeader({
  links = [],
  onLogoClick,
  onCreate,
  createLabel = "Create",
  authSlot,
}: AppHeaderProps) {
  const [open, setOpen] = React.useState(false);
  const scrolled = useScroll(10);

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function closeAnd(fn?: () => void) {
    setOpen(false);
    fn?.();
  }

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 w-full border-b transition-all duration-200 ease-out",
          scrolled && !open
            ? "border-border bg-background/95 shadow-lg shadow-black/30 backdrop-blur-lg supports-[backdrop-filter]:bg-background/80"
            : "border-border/60 bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/75",
          open && "border-border bg-background/95",
        )}
      >
        <nav className="flex h-14 w-full items-center justify-between px-4 md:px-8 lg:px-12 xl:px-16">
          <button
            type="button"
            onClick={() => closeAnd(onLogoClick)}
            className="flex shrink-0 items-center gap-2.5"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Landmark className="h-4 w-4" strokeWidth={2.25} />
            </span>
            <span className="text-[15px] font-bold tracking-tight text-foreground">
              parliavent
            </span>
          </button>

          <div className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <Button
                key={link.label}
                variant="ghost"
                size="sm"
                onClick={() => link.onClick()}
                className={cn(
                  "h-9 text-[13px]",
                  link.active && "bg-accent text-accent-foreground",
                )}
              >
                {link.label}
              </Button>
            ))}
            {onCreate && (
              <Button size="sm" onClick={onCreate} className="ml-1 h-9 text-[13px]">
                <Plus className="mr-1.5 h-3.5 w-3.5" strokeWidth={2.5} />
                {createLabel}
              </Button>
            )}
            {authSlot && <div className="ml-2">{authSlot}</div>}
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
              {links.map((link) => (
                <button
                  key={link.label}
                  type="button"
                  className={buttonVariants({
                    variant: "ghost",
                    className: cn(
                      "justify-start",
                      link.active && "bg-accent text-accent-foreground",
                    ),
                  })}
                  onClick={() => closeAnd(link.onClick)}
                >
                  {link.label}
                </button>
              ))}
            </div>
            {onCreate && (
              <Button onClick={() => closeAnd(onCreate)} className="w-full">
                <Plus className="mr-1.5 h-4 w-4" strokeWidth={2.5} />
                {createLabel}
              </Button>
            )}
            {authSlot && <div className="flex justify-center pt-2">{authSlot}</div>}
          </div>
        </div>
      </header>
      <div className="h-14 w-full shrink-0" aria-hidden />
    </>
  );
}
