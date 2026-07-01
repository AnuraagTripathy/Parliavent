"use client";

interface ContestedChipProps {
  fallacyName: string;
  compact?: boolean;
}

const FALLACY_HINTS: Record<string, string> = {
  "appeal to moderation":
    "The judge flagged this as leaning on the middle ground as proof — neither extreme must be wrong.",
  "appeal to tradition":
    "The judge flagged this as assuming the past way is the right way without fresh evidence.",
  "false dilemma":
    "The judge flagged this as presenting only two options when more exist.",
};

export function ContestedChip({ fallacyName, compact = false }: ContestedChipProps) {
  const key = fallacyName.toLowerCase();
  const hint =
    FALLACY_HINTS[key] ??
    "The author disagreed with this fallacy flag and chose to post anyway.";

  return (
    <span
      title={hint}
      className={`inline-flex cursor-help items-center gap-1.5 rounded-md border border-amber-500/25 bg-amber-500/10 ${
        compact ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]"
      }`}
    >
      <span className="font-medium text-amber-400/90">Disputed</span>
      <span className="text-zinc-500">·</span>
      <span className="text-amber-200/70">{fallacyName}</span>
    </span>
  );
}
