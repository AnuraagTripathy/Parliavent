"use client";

import {
  motion,
  useMotionTemplate,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PAGE_X = "px-4 md:px-8 lg:px-12 xl:px-16";

interface DebateThreadHeaderProps {
  title: string;
  description: string;
  category: string;
  starterCount: number;
  replyCount: number;
  sort: "top" | "new" | "contested";
  onSortChange: (sort: "top" | "new" | "contested") => void;
  onBack: () => void;
  onNewStarter?: () => void;
  collapse: MotionValue<number>;
}

export function DebateThreadHeader({
  title,
  description,
  category,
  starterCount,
  replyCount,
  sort,
  onSortChange,
  onBack,
  onNewStarter,
  collapse,
}: DebateThreadHeaderProps) {
  const backLabelWidth = useTransform(collapse, [0, 0.5], [72, 0]);
  const backLabelOpacity = useTransform(collapse, [0, 0.35], [1, 0]);
  const backRowHeight = useTransform(collapse, [0, 0.5], [28, 0]);
  const backRowMargin = useTransform(collapse, [0, 0.5], [12, 0]);
  const backRowOpacity = useTransform(collapse, [0, 0.4], [1, 0]);
  const compactBackWidth = useTransform(collapse, [0, 0.25, 0.6], [0, 0, 28]);
  const compactBackOpacity = useTransform(collapse, [0.2, 0.55], [0, 1]);

  const categoryOpacity = useTransform(collapse, [0, 0.4], [1, 0]);
  const categoryHeight = useTransform(collapse, [0, 0.45], [18, 0]);
  const categoryMargin = useTransform(collapse, [0, 0.45], [6, 0]);

  const detailsOpacity = useTransform(collapse, [0, 0.55], [1, 0]);
  const detailsGridRows = useTransform(collapse, [0, 1], ["1fr", "0fr"]);
  const detailsMarginTop = useTransform(collapse, [0, 1], [8, 0]);

  const titleScale = useTransform(collapse, [0, 1], [1, 0.7]);
  const titleY = useTransform(collapse, [0, 1], [0, -1]);
  const titleRowGap = useTransform(collapse, [0, 0.35, 0.55], [0, 0, 10]);
  const compactBackDisplay = useTransform(collapse, (value) =>
    value > 0.2 ? "inline-flex" : "none",
  );

  const fullStarterOpacity = useTransform(collapse, [0, 0.45], [1, 0]);
  const fullStarterScale = useTransform(collapse, [0, 0.45], [1, 0.92]);
  const iconStarterOpacity = useTransform(collapse, [0.4, 0.85], [0, 1]);
  const iconStarterScale = useTransform(collapse, [0.4, 0.85], [0.88, 1]);

  const headerPaddingTop = useTransform(collapse, [0, 1], [12, 8]);
  const tabsMarginTop = useTransform(collapse, [0, 1], [16, 0]);
  const tabsPaddingBottom = useTransform(collapse, [0, 1], [0, 0]);
  const headerShadow = useTransform(
    collapse,
    [0, 0.5, 1],
    [
      "0 0 0 rgba(0,0,0,0)",
      "0 6px 18px rgba(0,0,0,0.1)",
      "0 8px 24px rgba(0,0,0,0.14)",
    ],
  );

  const headerPaddingTopStyle = useMotionTemplate`${headerPaddingTop}px`;
  const tabsMarginTopStyle = useMotionTemplate`${tabsMarginTop}px`;
  const tabsPaddingBottomStyle = useMotionTemplate`${tabsPaddingBottom}px`;
  const backRowHeightStyle = useMotionTemplate`${backRowHeight}px`;
  const backRowMarginStyle = useMotionTemplate`${backRowMargin}px`;
  const categoryHeightStyle = useMotionTemplate`${categoryHeight}px`;
  const categoryMarginStyle = useMotionTemplate`${categoryMargin}px`;

  const compactBackWidthStyle = useMotionTemplate`${compactBackWidth}px`;

  return (
    <motion.header
      className="shrink-0 border-b border-border/80 bg-background/95 backdrop-blur-sm"
      style={{ boxShadow: headerShadow }}
    >
      <motion.div
        className={PAGE_X}
        style={{ paddingTop: headerPaddingTopStyle }}
      >
        <motion.div
          className="overflow-hidden"
          style={{
            height: backRowHeightStyle,
            marginBottom: backRowMarginStyle,
            opacity: backRowOpacity,
          }}
        >
          <button
            type="button"
            onClick={onBack}
            className="-ml-1 inline-flex items-center gap-1.5 rounded-md px-1 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
            <motion.span
              className="inline-block overflow-hidden whitespace-nowrap"
              style={{ width: backLabelWidth, opacity: backLabelOpacity }}
            >
              All debates
            </motion.span>
          </button>
        </motion.div>

        <motion.div className="flex items-start justify-between gap-4">
          <motion.div
            className="flex min-w-0 flex-1 items-start"
            style={{ gap: titleRowGap }}
          >
            <motion.button
              type="button"
              onClick={onBack}
              aria-label="All debates"
              className="mt-1 inline-flex shrink-0 items-center justify-center overflow-hidden rounded-md p-1 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              style={{
                width: compactBackWidthStyle,
                opacity: compactBackOpacity,
                display: compactBackDisplay,
              }}
            >
              <ArrowLeft className="h-4 w-4 shrink-0" />
            </motion.button>

            <motion.div
              className="min-w-0 flex-1"
              style={{
                scale: titleScale,
                y: titleY,
                transformOrigin: "0% 0%",
              }}
            >
              <motion.div
                className="overflow-hidden"
                style={{
                  height: categoryHeightStyle,
                  marginBottom: categoryMarginStyle,
                  opacity: categoryOpacity,
                }}
              >
                <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
                  {category}
                </span>
              </motion.div>
              <h1 className="truncate font-serif text-2xl font-medium leading-tight tracking-tight text-foreground md:text-3xl lg:text-4xl">
                {title}
              </h1>

              <motion.div
                className="grid overflow-hidden"
                style={{
                  gridTemplateRows: detailsGridRows,
                  marginTop: detailsMarginTop,
                  opacity: detailsOpacity,
                }}
              >
                <div className="min-h-0 overflow-hidden">
                  <p className="max-w-4xl text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span>
                      {starterCount}{" "}
                      {starterCount === 1 ? "starter" : "starters"}
                    </span>
                    <span aria-hidden>·</span>
                    <span>
                      {replyCount} {replyCount === 1 ? "reply" : "replies"}
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {onNewStarter && (
            <div className="relative h-9 shrink-0 sm:h-10">
              <motion.div
                className="absolute right-0 top-0"
                style={{
                  opacity: fullStarterOpacity,
                  scale: fullStarterScale,
                }}
              >
                <Button onClick={onNewStarter} className="hidden sm:inline-flex">
                  <Plus className="mr-1.5 h-4 w-4" strokeWidth={2.5} />
                  Post starter
                </Button>
                <Button onClick={onNewStarter} size="sm" className="sm:hidden">
                  <Plus className="h-4 w-4" strokeWidth={2.5} />
                </Button>
              </motion.div>
              <motion.div
                className="absolute right-0 top-0.5"
                style={{
                  opacity: iconStarterOpacity,
                  scale: iconStarterScale,
                }}
              >
                <Button
                  onClick={onNewStarter}
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-primary hover:bg-primary/10 hover:text-primary"
                  aria-label="Post starter"
                >
                  <Plus className="h-4 w-4" strokeWidth={2.5} />
                </Button>
              </motion.div>
            </div>
          )}
        </motion.div>
      </motion.div>

      <motion.div
        className={cn(PAGE_X, "flex items-center gap-6 border-t border-border/60")}
        style={{
          marginTop: tabsMarginTopStyle,
          paddingBottom: tabsPaddingBottomStyle,
        }}
      >
        {(
          [
            { id: "top", label: "Top" },
            { id: "new", label: "New" },
            { id: "contested", label: "Fallacies" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSortChange(tab.id)}
            className={cn(
              "-mb-px border-b-2 py-2.5 text-sm font-semibold transition-colors md:py-3",
              sort === tab.id
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </motion.div>
    </motion.header>
  );
}
