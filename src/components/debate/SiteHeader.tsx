import type { AppScreen } from "@/lib/types";

interface SiteHeaderProps {
  screen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  subtitle?: string;
}

const navItems: { screen: AppScreen; label: string }[] = [
  { screen: "feed", label: "Debate" },
  { screen: "composer", label: "Write" },
];

export function SiteHeader({ screen, onNavigate, subtitle }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-[#e8e8e4] bg-[#fafaf8]/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 lg:px-8">
        <button
          type="button"
          onClick={() => onNavigate("feed")}
          className="flex items-center gap-3 text-left"
        >
          <span className="text-[13px] font-semibold tracking-tight text-[#1a1a18]">
            Parliavent
          </span>
          {subtitle && (
            <>
              <span className="h-3 w-px bg-[#dddcd8]" />
              <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#a8a8a4]">
                {subtitle}
              </span>
            </>
          )}
        </button>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.screen}
              type="button"
              onClick={() => onNavigate(item.screen)}
              className={`rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors ${
                screen === item.screen ||
                (screen === "argument" && item.screen === "feed")
                  ? "bg-[#ececea] text-[#1a1a18]"
                  : "text-[#6a6a66] hover:bg-[#f0f0ec] hover:text-[#3a3a38]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
