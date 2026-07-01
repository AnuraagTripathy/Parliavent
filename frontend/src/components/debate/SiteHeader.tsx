import { Plus } from "lucide-react";
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
  const isFeedActive =
    screen === "feed" || screen === "issue" || screen === "post";

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3 lg:px-0">
        <button
          type="button"
          onClick={() => onNavigate("feed")}
          className="flex shrink-0 items-center gap-2.5"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-sm">
            🏛
          </span>
          <span className="hidden text-[15px] font-bold tracking-tight text-zinc-50 sm:inline">
            parliavent
          </span>
        </button>

        <div className="hidden min-w-0 flex-1 sm:block">
          <div className="mx-auto max-w-sm rounded-lg border border-zinc-800 bg-zinc-900/60 px-3.5 py-2">
            <input
              type="search"
              placeholder="Search issues..."
              className="w-full bg-transparent text-[13px] text-zinc-200 outline-none placeholder:text-zinc-600"
              readOnly
            />
          </div>
        </div>

        <nav className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate("feed")}
            className={`rounded-lg px-3 py-1.5 text-[13px] font-semibold transition-colors ${
              isFeedActive
                ? "bg-zinc-800 text-zinc-50"
                : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
            }`}
          >
            Home
          </button>
          {onCreateStarter && (
            <button
              type="button"
              onClick={onCreateStarter}
              className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-100 px-3 py-1.5 text-[12px] font-bold text-zinc-950 transition-colors hover:bg-white"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
              <span className="hidden sm:inline">Create</span>
            </button>
          )}
        </nav>

        {subtitle && (
          <span className="hidden text-[10px] font-semibold uppercase tracking-widest text-zinc-600 lg:inline">
            {subtitle}
          </span>
        )}
      </div>
    </header>
  );
}
