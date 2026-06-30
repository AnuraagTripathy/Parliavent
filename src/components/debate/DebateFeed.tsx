import { ArrowRight, FileText } from "lucide-react";
import { MOTION } from "@/lib/mockJudge";
import { MOCK_PUBLISHED_ARGUMENTS } from "@/lib/mockPublishedArguments";
import type { PublishedArgument } from "@/lib/types";

interface DebateFeedProps {
  onOpenArgument: (id: string) => void;
  onWrite: () => void;
}

function ArgumentPreviewCard({
  argument,
  onOpen,
}: {
  argument: PublishedArgument;
  onOpen: () => void;
}) {
  const sourceCount = argument.sources.length;
  const preview =
    argument.text.length > 180
      ? `${argument.text.slice(0, 180).trim()}…`
      : argument.text;

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group w-full rounded-xl border border-[#e4e4e0] bg-white p-5 text-left shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-colors hover:border-[#d8d8d4] hover:bg-[#fdfdfc]"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ececea] text-[11px] font-medium text-[#5a5a58]">
            {argument.author
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <p className="text-[13px] font-medium text-[#2a2a28]">
              {argument.author}
            </p>
            <p className="text-[11px] text-[#9a9a96]">{argument.postedAt}</p>
          </div>
        </div>
        <span className="flex items-center gap-1 text-[11px] text-[#7a9cc4]">
          <FileText className="h-3 w-3" strokeWidth={1.75} />
          {sourceCount} source{sourceCount === 1 ? "" : "s"}
        </span>
      </div>

      <p className="mb-4 text-[15px] leading-relaxed text-[#3a3a38]">
        {preview}
      </p>

      <span className="inline-flex items-center gap-1 text-[12px] font-medium text-[#5a5a58] group-hover:text-[#1a1a18]">
        Read argument
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </button>
  );
}

export function DebateFeed({ onOpenArgument, onWrite }: DebateFeedProps) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 lg:px-8">
      <div className="mb-8">
        <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[#9a9a96]">
          Motion
        </p>
        <h1 className="text-2xl font-medium leading-snug tracking-tight text-[#1a1a18] sm:text-[28px]">
          {MOTION}
        </h1>
        <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-[#6a6a66]">
          {MOCK_PUBLISHED_ARGUMENTS.length} arguments posted. Sourced claims are
          color-mapped to their references in each post.
        </p>
      </div>

      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#9a9a96]">
          Arguments
        </p>
        <button
          type="button"
          onClick={onWrite}
          className="rounded-lg border border-[#d8d8d4] bg-[#1a1a18] px-3.5 py-1.5 text-[12px] font-medium text-white transition-colors hover:bg-[#2a2a28]"
        >
          Write yours
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {MOCK_PUBLISHED_ARGUMENTS.map((argument) => (
          <ArgumentPreviewCard
            key={argument.id}
            argument={argument}
            onOpen={() => onOpenArgument(argument.id)}
          />
        ))}
      </div>
    </div>
  );
}
