"use client";

import { ArrowLeft, ExternalLink, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import {
  getCitationColor,
} from "@/lib/mockPublishedArguments";
import {
  buildSourceIndex,
  highlightCitations,
} from "@/lib/highlightCitations";
import { MOTION } from "@/lib/mockJudge";
import type { PublishedArgument } from "@/lib/types";

interface PublishedArgumentViewProps {
  argument: PublishedArgument;
  onBack: () => void;
}

export function PublishedArgumentView({
  argument,
  onBack,
}: PublishedArgumentViewProps) {
  const sourceIndex = buildSourceIndex(argument);
  const segments = highlightCitations(
    argument.text,
    argument.citations,
    sourceIndex,
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-8"
    >
      <button
        type="button"
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-1.5 text-[12px] font-medium text-[#6a6a66] transition-colors hover:text-[#1a1a18]"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to debate
      </button>

      <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[#9a9a96]">
        {MOTION}
      </p>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ececea] text-[12px] font-medium text-[#5a5a58]">
            {argument.author
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <p className="text-[14px] font-medium text-[#1a1a18]">
              {argument.author}
            </p>
            <p className="text-[11px] text-[#9a9a96]">{argument.postedAt}</p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 rounded-full border border-[#dce4ef] bg-[#f4f7fb] px-2.5 py-1 text-[11px] text-[#5a7a9e]">
          <ShieldCheck className="h-3 w-3" strokeWidth={1.75} />
          Vetted by Parliavent
        </span>
      </div>

      {(argument.contestedFallacies?.length ?? 0) > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {argument.contestedFallacies!.map((fallacy) => (
            <span
              key={fallacy}
              className="rounded-full border border-[#ebdede] bg-[#faf5f5] px-2.5 py-1 text-[11px] text-[#9e5a5a]"
            >
              Author contests: {fallacy.toLowerCase()}
            </span>
          ))}
        </div>
      )}

      {argument.caveats?.map((caveat) => (
        <p
          key={caveat}
          className="mb-4 text-[12px] italic text-[#8a8a86]"
        >
          {caveat}
        </p>
      ))}

      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        <article className="min-w-0 flex-1">
          <div className="rounded-xl border border-[#e4e4e0] bg-white px-6 py-8 shadow-[0_1px_2px_rgba(0,0,0,0.02)] sm:px-8 sm:py-10">
            <p className="whitespace-pre-wrap text-[19px] leading-[1.8] tracking-[-0.01em] text-[#1a1a18] sm:text-[20px]">
              {segments.map((segment, i) => {
                if (segment.citationIndex === undefined) {
                  return <span key={i}>{segment.text}</span>;
                }

                const color = getCitationColor(segment.citationIndex);
                const marker = segment.citationIndex + 1;
                const sourceId = `source-${argument.sources[segment.citationIndex]?.id}`;

                return (
                  <span key={i} className="relative">
                    <mark
                      className="rounded-[2px] underline decoration-2 underline-offset-[3px]"
                      style={{
                        backgroundColor: color.bg,
                        textDecorationColor: color.underline,
                      }}
                    >
                      {segment.text}
                    </mark>
                    <a
                      href={`#${sourceId}`}
                      className="ml-0.5 inline-flex align-super text-[10px] font-semibold no-underline transition-opacity hover:opacity-70"
                      style={{ color: color.marker }}
                      aria-label={`Source ${marker}`}
                    >
                      [{marker}]
                    </a>
                  </span>
                );
              })}
            </p>
          </div>
        </article>

        <aside className="w-full shrink-0 lg:w-[300px] xl:w-[340px]">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.14em] text-[#9a9a96]">
            Sources
          </p>

          <div className="flex flex-col gap-2.5">
            {argument.sources.map((source, index) => {
              const color = getCitationColor(index);
              const sourceId = `source-${source.id}`;

              return (
                <a
                  key={source.id}
                  id={sourceId}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group scroll-mt-24 rounded-lg border bg-white p-3.5 transition-colors hover:bg-[#fdfdfc]"
                  style={{ borderColor: color.ring }}
                >
                  <div className="mb-1.5 flex items-center gap-2">
                    <span
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-semibold"
                      style={{
                        backgroundColor: color.bg,
                        color: color.marker,
                      }}
                    >
                      {index + 1}
                    </span>
                    <span
                      className="text-[12px] font-medium leading-snug text-[#2a2a28] group-hover:underline"
                    >
                      {source.title}
                    </span>
                    <ExternalLink className="ml-auto h-3 w-3 shrink-0 text-[#b0b0ac] opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <p className="pl-7 text-[11px] text-[#8a8a86]">
                    {source.publisher}
                    {source.isSample && " · sample link"}
                  </p>
                </a>
              );
            })}
          </div>

          <p className="mt-4 text-[11px] leading-relaxed text-[#a8a8a4]">
            Highlighted phrases match the numbered source color in the text.
          </p>
        </aside>
      </div>
    </motion.div>
  );
}
