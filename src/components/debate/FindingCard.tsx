import type { Finding, FindingType } from "@/lib/types";
import { AlertTriangle, BookOpen, MessageCircle } from "lucide-react";

interface FindingCardProps {
  finding: Finding;
}

const typeConfig: Record<
  FindingType,
  { label: string; icon: typeof BookOpen; accent: string; border: string; dot: string }
> = {
  clarity: {
    label: "Clarity",
    icon: MessageCircle,
    accent: "text-[#9a7b3c]",
    border: "border-[#ebe3d4]",
    dot: "bg-[#c9a96e]",
  },
  claim: {
    label: "Claim",
    icon: BookOpen,
    accent: "text-[#5a7a9e]",
    border: "border-[#dce4ef]",
    dot: "bg-[#7a9cc4]",
  },
  fallacy: {
    label: "Fallacy",
    icon: AlertTriangle,
    accent: "text-[#9e5a5a]",
    border: "border-[#ebdede]",
    dot: "bg-[#c47a7a]",
  },
};

export function FindingCard({ finding }: FindingCardProps) {
  const config = typeConfig[finding.type];
  const Icon = config.icon;

  return (
    <article
      className={`rounded-lg border bg-[#fafaf8] p-4 ${config.border}`}
    >
      <div className="mb-2.5 flex items-center gap-2">
        <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
        <span className={`text-[10px] font-medium uppercase tracking-[0.12em] ${config.accent}`}>
          {config.label}
        </span>
        {finding.confidence && (
          <span className="ml-auto text-[10px] text-[#a8a8a4]">
            {finding.confidence} confidence
          </span>
        )}
      </div>

      <div className="mb-2 flex items-start gap-2">
        <Icon className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${config.accent}`} strokeWidth={1.75} />
        <div>
          <h3 className="text-[13px] font-medium leading-snug text-[#3a3a38]">
            {finding.title}
          </h3>
          {finding.subtitle && (
            <p className="mt-0.5 text-[11px] text-[#8a8a86]">{finding.subtitle}</p>
          )}
        </div>
      </div>

      <p className="mb-3 text-[12px] leading-relaxed text-[#6a6a66]">
        {finding.reason}
      </p>

      <blockquote className="mb-3 rounded border-l-2 border-[#e4e4e0] bg-white/60 py-1 pl-2.5 pr-1 text-[11px] italic leading-relaxed text-[#7a7a76]">
        &ldquo;{finding.spanText}&rdquo;
      </blockquote>

      {finding.example && (
        <p className="mb-3 text-[11px] leading-relaxed text-[#8a8a86]">
          <span className="font-medium text-[#6a6a66]">Example: </span>
          {finding.example}
        </p>
      )}

      {finding.suggestedRewrite && (
        <div className="rounded-md border border-[#ececea] bg-white px-2.5 py-2">
          <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.1em] text-[#a8a8a4]">
            Suggested wording
          </p>
          <p className="text-[12px] leading-relaxed text-[#4a4a48]">
            {finding.suggestedRewrite}
          </p>
        </div>
      )}

      {finding.sources && finding.sources.length > 0 && (
        <div className="mt-3 space-y-1.5">
          <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#a8a8a4]">
            Sample sources
          </p>
          {finding.sources.map((source) => (
            <div
              key={source.id}
              className="rounded-md border border-[#ececea] bg-white px-2.5 py-1.5"
            >
              <p className="text-[11px] font-medium text-[#4a4a48]">{source.title}</p>
              <p className="text-[10px] text-[#9a9a96]">
                {source.publisher}
                {source.isSample && " · sample"}
              </p>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
