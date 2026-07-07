"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ReviewChipTone = "amber" | "orange" | "violet" | "sky" | "muted";

const PANEL_WIDTH = 352; // 22rem
const VIEWPORT_MARGIN = 12;

const TONE_CHIP: Record<
  ReviewChipTone,
  { border: string; bg: string; hover: string; label: string; subtitle: string }
> = {
  amber: {
    border: "border-amber-500/30",
    bg: "bg-amber-500/10",
    hover: "hover:bg-amber-500/15",
    label: "text-amber-400",
    subtitle: "text-amber-300/90",
  },
  orange: {
    border: "border-orange-500/30",
    bg: "bg-orange-500/10",
    hover: "hover:bg-orange-500/15",
    label: "text-orange-400",
    subtitle: "text-orange-300/90",
  },
  violet: {
    border: "border-violet-500/30",
    bg: "bg-violet-500/10",
    hover: "hover:bg-violet-500/15",
    label: "text-violet-400",
    subtitle: "text-violet-300/90",
  },
  sky: {
    border: "border-sky-500/30",
    bg: "bg-sky-500/10",
    hover: "hover:bg-sky-500/15",
    label: "text-sky-400",
    subtitle: "text-sky-300/90",
  },
  muted: {
    border: "border-border/80",
    bg: "bg-muted/30",
    hover: "hover:bg-muted/50",
    label: "text-muted-foreground",
    subtitle: "text-foreground/80",
  },
};

interface ReviewChipPopoverProps {
  label: string;
  subtitle?: string;
  tone: ReviewChipTone;
  compact?: boolean;
  panelTitle?: string;
  children: React.ReactNode;
}

function computePanelStyle(trigger: HTMLElement): CSSProperties {
  const rect = trigger.getBoundingClientRect();
  const width = Math.min(PANEL_WIDTH, window.innerWidth - VIEWPORT_MARGIN * 2);
  const gap = 6;

  let left = rect.left;
  if (left + width > window.innerWidth - VIEWPORT_MARGIN) {
    left = window.innerWidth - width - VIEWPORT_MARGIN;
  }
  if (left < VIEWPORT_MARGIN) {
    left = VIEWPORT_MARGIN;
  }

  let top = rect.bottom + gap;
  const maxHeight = window.innerHeight - top - VIEWPORT_MARGIN;
  if (maxHeight < 160 && rect.top > window.innerHeight / 2) {
    top = Math.max(VIEWPORT_MARGIN, rect.top - gap);
  }

  return {
    position: "fixed",
    top,
    left,
    width,
    maxHeight: Math.max(160, window.innerHeight - top - VIEWPORT_MARGIN),
    zIndex: 60,
  };
}

export function ReviewChipPopover({
  label,
  subtitle,
  tone,
  compact = false,
  panelTitle,
  children,
}: ReviewChipPopoverProps) {
  const [open, setOpen] = useState(false);
  const [panelStyle, setPanelStyle] = useState<CSSProperties>({});
  const [mounted, setMounted] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const styles = TONE_CHIP[tone];

  useEffect(() => {
    setMounted(true);
  }, []);

  const updatePanelPosition = () => {
    if (!triggerRef.current) return;
    setPanelStyle(computePanelStyle(triggerRef.current));
  };

  useLayoutEffect(() => {
    if (!open) return;
    updatePanelPosition();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (rootRef.current?.contains(target)) return;
      if (
        target instanceof Element &&
        target.closest(`[data-review-chip-panel="${panelId}"]`)
      ) {
        return;
      }
      setOpen(false);
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    function handleReposition() {
      updatePanelPosition();
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [open, panelId]);

  const panel = open ? (
    <div
      id={panelId}
      role="dialog"
      aria-label={panelTitle ?? label}
      data-review-chip-panel={panelId}
      style={panelStyle}
      className="overflow-y-auto rounded-xl border border-border bg-card p-3 shadow-xl shadow-black/40"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          {panelTitle ?? label}
        </p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Close"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      {children}
    </div>
  ) : null;

  return (
    <div ref={rootRef} className="relative inline-flex max-w-full">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          setOpen((value) => !value);
        }}
        className={cn(
          "inline-flex max-w-full items-center gap-1 rounded-md border text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          styles.border,
          styles.bg,
          styles.hover,
          compact ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]",
        )}
      >
        <span className={cn("font-medium", styles.label)}>{label}</span>
        {subtitle && (
          <>
            <span className="text-muted-foreground">·</span>
            <span className={cn("truncate", styles.subtitle)}>{subtitle}</span>
          </>
        )}
        <ChevronDown
          className={cn(
            "h-3 w-3 shrink-0 text-muted-foreground/70 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {mounted && panel ? createPortal(panel, document.body) : null}
    </div>
  );
}

export function ReviewChipPanelBody({
  spanText,
  message,
  title,
  compact = false,
}: {
  spanText?: string;
  message?: string;
  title?: string;
  compact?: boolean;
}) {
  const textSize = compact ? "text-[11px]" : "text-xs";

  return (
    <div className="space-y-2">
      {spanText && (
        <p className={cn("italic leading-relaxed text-foreground/85", textSize)}>
          &ldquo;{spanText}&rdquo;
        </p>
      )}
      {title && (
        <p className={cn("font-medium text-foreground/80", textSize)}>{title}</p>
      )}
      {message && (
        <p className={cn("leading-relaxed text-muted-foreground", textSize)}>
          {message}
        </p>
      )}
    </div>
  );
}
