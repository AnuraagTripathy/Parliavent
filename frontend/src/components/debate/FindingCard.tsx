"use client";

import { useState } from "react";
import type { Finding, FindingType } from "@/lib/types";
import { AlertTriangle, BookOpen, Check, MessageCircle } from "lucide-react";
import { SourcePopover } from "./SourcePopover";

interface FindingCardProps {
  finding: Finding;
  onUseSuggestion: (findingId: string) => void;
  onKeepAsIs: (findingId: string) => void;
  onAttachSource: (findingId: string, sourceId: string) => void;
  onMarkAsOpinion: (findingId: string) => void;
  onDispute: (findingId: string, reason: string) => void;
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

const statusLabels: Partial<Record<Finding["status"], string>> = {
  resolved: "Suggestion applied",
  ignored: "Kept as-is",
  disputed: "Disputed",
  source_attached: "Source attached",
  marked_opinion: "Marked as opinion",
};

function ActionButton({
  children,
  onClick,
  variant = "default",
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "primary" | "muted";
}) {
  const styles = {
    default:
      "border-[#e4e4e0] bg-white text-[#4a4a48] hover:border-[#d0d0cc] hover:bg-[#fafaf8]",
    primary:
      "border-[#1a1a18] bg-[#1a1a18] text-white hover:bg-[#2a2a28]",
    muted:
      "border-transparent bg-transparent text-[#8a8a86] hover:text-[#4a4a48]",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md border px-2.5 py-1.5 text-[11px] font-medium transition-colors ${styles[variant]}`}
    >
      {children}
    </button>
  );
}

export function FindingCard({
  finding,
  onUseSuggestion,
  onKeepAsIs,
  onAttachSource,
  onMarkAsOpinion,
  onDispute,
}: FindingCardProps) {
  const config = typeConfig[finding.type];
  const Icon = config.icon;
  const isOpen = finding.status === "open";
  const statusLabel = statusLabels[finding.status];

  const [fallacyExpanded, setFallacyExpanded] = useState(false);
  const [sourcePickerOpen, setSourcePickerOpen] = useState(false);
  const [disputeOpen, setDisputeOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState("");

  function handleDisputeSubmit() {
    const trimmed = disputeReason.trim();
    if (!trimmed) return;
    onDispute(finding.id, trimmed);
    setDisputeOpen(false);
    setDisputeReason("");
  }

  return (
    <article
      className={`rounded-lg border bg-[#fafaf8] p-4 ${config.border} ${!isOpen ? "opacity-80" : ""}`}
    >
      <div className="mb-2.5 flex items-center gap-2">
        <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
        <span className={`text-[10px] font-medium uppercase tracking-[0.12em] ${config.accent}`}>
          {config.label}
        </span>
        {finding.confidence && isOpen && (
          <span className="ml-auto text-[10px] text-[#a8a8a4]">
            {finding.confidence} confidence
          </span>
        )}
        {statusLabel && (
          <span className="ml-auto flex items-center gap-1 text-[10px] text-[#8ab89a]">
            <Check className="h-3 w-3" strokeWidth={2} />
            {statusLabel}
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

      {finding.type === "clarity" && finding.suggestedRewrite && isOpen && (
        <div className="mb-3 rounded-md border border-[#ececea] bg-white px-2.5 py-2">
          <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.1em] text-[#a8a8a4]">
            Suggested wording
          </p>
          <p className="text-[12px] leading-relaxed text-[#4a4a48]">
            {finding.suggestedRewrite}
          </p>
        </div>
      )}

      {finding.type === "fallacy" && fallacyExpanded && (
        <>
          {finding.subtitle && (
            <p className="mb-2 text-[11px] text-[#8a8a86]">
              <span className="font-medium text-[#6a6a66]">Fallacy: </span>
              {finding.subtitle}
            </p>
          )}
          {finding.confidence && (
            <p className="mb-2 text-[11px] text-[#8a8a86]">
              <span className="font-medium text-[#6a6a66]">Confidence: </span>
              {finding.confidence}
            </p>
          )}
          {finding.example && (
            <p className="mb-3 text-[11px] leading-relaxed text-[#8a8a86]">
              <span className="font-medium text-[#6a6a66]">Example: </span>
              {finding.example}
            </p>
          )}
          {finding.suggestedRewrite && (
            <div className="mb-3 rounded-md border border-[#ececea] bg-white px-2.5 py-2">
              <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.1em] text-[#a8a8a4]">
                Suggested wording
              </p>
              <p className="text-[12px] leading-relaxed text-[#4a4a48]">
                {finding.suggestedRewrite}
              </p>
            </div>
          )}
        </>
      )}

      {finding.status === "disputed" && finding.disputeReason && (
        <p className="mb-3 rounded-md border border-[#ebdede] bg-white/60 px-2.5 py-2 text-[11px] leading-relaxed text-[#7a7a76]">
          <span className="font-medium text-[#6a6a66]">Your dispute: </span>
          {finding.disputeReason}
        </p>
      )}

      {isOpen && finding.type === "clarity" && (
        <div className="flex flex-wrap gap-2">
          <ActionButton variant="primary" onClick={() => onUseSuggestion(finding.id)}>
            Use suggestion
          </ActionButton>
          <ActionButton onClick={() => onKeepAsIs(finding.id)}>Keep as-is</ActionButton>
        </div>
      )}

      {isOpen && finding.type === "claim" && (
        <>
          <div className="flex flex-wrap gap-2">
            <ActionButton onClick={() => setSourcePickerOpen((open) => !open)}>
              Attach source
            </ActionButton>
            <ActionButton onClick={() => onMarkAsOpinion(finding.id)}>
              Mark as opinion
            </ActionButton>
            <ActionButton variant="muted" onClick={() => onKeepAsIs(finding.id)}>
              Keep as-is
            </ActionButton>
          </div>
          {sourcePickerOpen && finding.sources && (
            <SourcePopover
              sources={finding.sources}
              onSelect={(sourceId) => {
                onAttachSource(finding.id, sourceId);
                setSourcePickerOpen(false);
              }}
              onClose={() => setSourcePickerOpen(false)}
            />
          )}
        </>
      )}

      {isOpen && finding.type === "fallacy" && (
        <>
          <div className="flex flex-wrap gap-2">
            {!fallacyExpanded && (
              <ActionButton onClick={() => setFallacyExpanded(true)}>
                See fix
              </ActionButton>
            )}
            {fallacyExpanded && finding.suggestedRewrite && (
              <ActionButton variant="primary" onClick={() => onUseSuggestion(finding.id)}>
                Use this wording
              </ActionButton>
            )}
            <ActionButton
              variant={fallacyExpanded ? "default" : "muted"}
              onClick={() => onKeepAsIs(finding.id)}
            >
              Keep as-is
            </ActionButton>
            {!disputeOpen && (
              <ActionButton variant="muted" onClick={() => setDisputeOpen(true)}>
                Dispute
              </ActionButton>
            )}
          </div>

          {disputeOpen && (
            <div className="mt-3 space-y-2">
              <textarea
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                placeholder="Why do you disagree with this finding?"
                rows={2}
                className="w-full resize-none rounded-md border border-[#e4e4e0] bg-white px-2.5 py-2 text-[12px] leading-relaxed text-[#4a4a48] outline-none focus:border-[#c47a7a]/50"
              />
              <div className="flex gap-2">
                <ActionButton variant="primary" onClick={handleDisputeSubmit}>
                  Submit dispute
                </ActionButton>
                <ActionButton
                  variant="muted"
                  onClick={() => {
                    setDisputeOpen(false);
                    setDisputeReason("");
                  }}
                >
                  Cancel
                </ActionButton>
              </div>
            </div>
          )}
        </>
      )}
    </article>
  );
}
