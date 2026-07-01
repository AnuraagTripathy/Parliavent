"use client";

import { motion } from "framer-motion";
import { formatDeskBangs } from "@/lib/mockFeed";

interface DeskBangButtonProps {
  count: number;
  banged: boolean;
  onToggle: () => void;
  layout?: "vertical" | "horizontal";
  size?: "sm" | "md";
}

export function DeskBangButton({
  count,
  banged,
  onToggle,
  layout = "vertical",
  size = "md",
}: DeskBangButtonProps) {
  const iconSize = size === "sm" ? "text-sm" : "text-base";
  const textSize = size === "sm" ? "text-[11px]" : "text-[12px]";
  const padding =
    layout === "vertical"
      ? size === "sm"
        ? "px-1.5 py-2"
        : "px-2 py-2.5"
      : "px-2 py-1.5";

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      title={banged ? "Withdraw desk bang" : "Bang desk — good point"}
      className={`group flex shrink-0 items-center justify-center gap-1.5 rounded-lg transition-all ${padding} ${
        layout === "vertical" ? "flex-col" : "flex-row"
      } ${
        banged
          ? "bg-teal-500/15 text-teal-400 ring-1 ring-teal-500/30"
          : "text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
      }`}
    >
      <motion.span
        key={banged ? "banged" : "idle"}
        initial={banged ? { scale: 1.35, rotate: -8 } : false}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 600, damping: 14 }}
        className={`leading-none ${iconSize}`}
        aria-hidden
      >
        🪑
      </motion.span>
      <span
        className={`font-bold tabular-nums ${textSize} ${
          banged ? "text-teal-400" : "text-zinc-500 group-hover:text-zinc-300"
        }`}
      >
        {formatDeskBangs(count)}
      </span>
      <span className="sr-only">
        {banged ? "You banged the desk" : "Bang desk"}
      </span>
    </button>
  );
}
