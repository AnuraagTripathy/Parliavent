import type { Citation, Finding, FindingType, Source } from "@/lib/types";
import { buildSourceIndex } from "@/lib/highlightCitations";
import { highlightText } from "@/lib/highlightText";

interface ArgumentEditorProps {
  text: string;
  findings: Finding[];
  citations?: Citation[];
  attachedSources?: Source[];
  onChange: (text: string) => void;
  label?: string;
}

const highlightStyles: Record<FindingType, string> = {
  clarity: "bg-[#f5ead8] decoration-[#c9a96e]/40",
  claim: "bg-[#e8eef8] underline decoration-[#7a9cc4]/50 decoration-2 underline-offset-[3px]",
  fallacy:
    "bg-[#f8e8e8] underline decoration-[#c47a7a]/50 decoration-2 underline-offset-[3px]",
};

interface DisplaySegment {
  text: string;
  types: FindingType[];
  citationIndex?: number;
  showCitationMarker?: boolean;
}

function buildDisplaySegments(
  text: string,
  findings: Finding[],
  citations: Citation[],
  sourceIndex: Map<string, number>,
): DisplaySegment[] {
  const breakpoints = new Set<number>([0, text.length]);
  const highlightSpans: { start: number; end: number; type: FindingType }[] =
    [];
  const citationSpans: {
    start: number;
    end: number;
    citationIndex: number;
  }[] = [];

  for (const finding of findings.filter((f) => f.status === "open")) {
    const start = text.indexOf(finding.spanText);
    if (start === -1) continue;
    const end = start + finding.spanText.length;
    breakpoints.add(start);
    breakpoints.add(end);
    highlightSpans.push({ start, end, type: finding.type });
  }

  for (const citation of citations) {
    const start = text.indexOf(citation.spanText);
    if (start === -1) continue;
    const end = start + citation.spanText.length;
    breakpoints.add(start);
    breakpoints.add(end);
    const citationIndex = sourceIndex.get(citation.sourceId);
    if (citationIndex !== undefined) {
      citationSpans.push({ start, end, citationIndex });
    }
  }

  const sorted = Array.from(breakpoints).sort((a, b) => a - b);
  const segments: DisplaySegment[] = [];

  for (let i = 0; i < sorted.length - 1; i++) {
    const start = sorted[i];
    const end = sorted[i + 1];
    if (start === end) continue;

    const types = [
      ...new Set(
        highlightSpans
          .filter((s) => s.start <= start && s.end >= end)
          .map((s) => s.type),
      ),
    ];

    const citationMatch = citationSpans.find(
      (s) => s.start <= start && s.end >= end,
    );

    segments.push({
      text: text.slice(start, end),
      types,
      citationIndex: citationMatch?.citationIndex,
      showCitationMarker: citationSpans.some((s) => s.end === end),
    });
  }

  return segments.length > 0 ? segments : [{ text, types: [] }];
}

function ArgumentDisplay({
  text,
  findings,
  citations,
  attachedSources,
}: {
  text: string;
  findings: Finding[];
  citations: Citation[];
  attachedSources: Source[];
}) {
  const sourceIndex = buildSourceIndex({
    id: "",
    author: "",
    postedAt: "",
    text,
    sources: attachedSources,
    citations,
  });

  const segments = buildDisplaySegments(text, findings, citations, sourceIndex);

  return (
    <>
      {segments.map((segment, i) => {
        const content =
          segment.types.length === 0 ? (
            <span>{segment.text}</span>
          ) : (
            <mark
              className={`rounded-[2px] text-inherit ${segment.types
                .map((type) => highlightStyles[type])
                .join(" ")}`}
            >
              {segment.text}
            </mark>
          );

        if (segment.showCitationMarker && segment.citationIndex !== undefined) {
          return (
            <span key={i}>
              {content}
              <sup
                className="ml-0.5 text-[10px] font-medium text-[#5a7a9e]"
                title={
                  attachedSources[segment.citationIndex]?.title ?? "Source"
                }
              >
                [{segment.citationIndex + 1}]
              </sup>
            </span>
          );
        }

        return <span key={i}>{content}</span>;
      })}
    </>
  );
}

export function ArgumentEditor({
  text,
  findings,
  citations = [],
  attachedSources = [],
  onChange,
  label = "Your argument",
}: ArgumentEditorProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-baseline justify-between">
        <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-600">
          {label}
        </p>
        <p className="text-[11px] text-zinc-700">
          {text.length} chars
        </p>
      </div>

      <div className="relative flex-1 rounded-xl border border-zinc-800 bg-zinc-900/60 shadow-inner shadow-black/20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden whitespace-pre-wrap break-words rounded-xl px-6 py-7 text-[19px] leading-[1.75] tracking-[-0.01em] text-zinc-100 sm:px-8 sm:py-8 sm:text-[20px]"
        >
          <ArgumentDisplay
            text={text}
            findings={findings}
            citations={citations}
            attachedSources={attachedSources}
          />
        </div>

        <textarea
          value={text}
          onChange={(e) => onChange(e.target.value)}
          spellCheck
          className="relative min-h-[380px] w-full resize-none rounded-xl bg-transparent px-6 py-7 text-[19px] leading-[1.75] tracking-[-0.01em] text-transparent caret-teal-400 outline-none selection:bg-teal-500/20 sm:min-h-[440px] sm:px-8 sm:py-8 sm:text-[20px]"
        />
      </div>
    </div>
  );
}
