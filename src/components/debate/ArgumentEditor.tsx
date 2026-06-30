import type { Finding, FindingType } from "@/lib/types";
import { highlightText } from "@/lib/highlightText";

interface ArgumentEditorProps {
  text: string;
  findings: Finding[];
  onChange: (text: string) => void;
}

const highlightStyles: Record<FindingType, string> = {
  clarity: "bg-[#f5ead8] decoration-[#c9a96e]/40",
  claim: "bg-[#e8eef8] underline decoration-[#7a9cc4]/50 decoration-2 underline-offset-[3px]",
  fallacy:
    "bg-[#f8e8e8] underline decoration-[#c47a7a]/50 decoration-2 underline-offset-[3px]",
};

function HighlightedText({ text, findings }: { text: string; findings: Finding[] }) {
  const segments = highlightText(text, findings);

  return (
    <>
      {segments.map((segment, i) => {
        if (segment.types.length === 0) {
          return <span key={i}>{segment.text}</span>;
        }

        const className = segment.types
          .map((type) => highlightStyles[type])
          .join(" ");

        return (
          <mark
            key={i}
            className={`rounded-[2px] text-inherit ${className}`}
          >
            {segment.text}
          </mark>
        );
      })}
    </>
  );
}

export function ArgumentEditor({ text, findings, onChange }: ArgumentEditorProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-baseline justify-between">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#9a9a96]">
          Your argument
        </p>
        <p className="text-[11px] text-[#b0b0ac]">
          {text.length} characters
        </p>
      </div>

      <div className="relative flex-1 rounded-xl border border-[#e4e4e0] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden whitespace-pre-wrap break-words rounded-xl px-6 py-7 text-[19px] leading-[1.75] tracking-[-0.01em] text-[#1a1a18] sm:px-8 sm:py-8 sm:text-[20px]"
        >
          <HighlightedText text={text} findings={findings} />
        </div>

        <textarea
          value={text}
          onChange={(e) => onChange(e.target.value)}
          spellCheck
          className="relative min-h-[380px] w-full resize-none rounded-xl bg-transparent px-6 py-7 text-[19px] leading-[1.75] tracking-[-0.01em] text-transparent caret-[#1a1a18] outline-none selection:bg-[#d4e4f4]/60 sm:min-h-[440px] sm:px-8 sm:py-8 sm:text-[20px]"
        />
      </div>
    </div>
  );
}
