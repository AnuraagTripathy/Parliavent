"use client";

import { useCallback, useMemo, useState } from "react";
import { applyUserApprovedEdit } from "@/lib/applyUserEdit";
import { buildPublishedArgument } from "@/lib/buildPublishedArgument";
import { citationsFromFindings, sourcesFromFindings } from "@/lib/citationsFromFindings";
import { SEED_ARGUMENT, SEED_RESPONSE } from "@/lib/mockJudge";
import { getOverlappingOpenFindings } from "@/lib/spanOverlap";
import { useDebouncedJudge } from "@/lib/useDebouncedJudge";
import type {
  ComposerContext,
  CurrentView,
  Finding,
  PublishedArgument,
} from "@/lib/types";
import { ArgumentEditor } from "./ArgumentEditor";
import { ComposerShell } from "./ComposerShell";
import { FindingsPanel } from "./FindingsPanel";
import { PublishedArgumentView } from "./PublishedArgumentView";
import { ReadinessBar } from "./ReadinessBar";

interface DebateAppProps {
  context: ComposerContext;
  onBack: () => void;
  onPosted: (post: PublishedArgument) => void;
  onFinished: () => void;
}

export function DebateApp({ context, onBack, onPosted, onFinished }: DebateAppProps) {
  const initialText = context.mode === "response" ? SEED_RESPONSE : SEED_ARGUMENT;
  const [argumentText, setArgumentText] = useState(initialText);
  const {
    findings,
    setFindings,
    checkingState,
    judgeError,
    isTooShort,
    checkNow,
  } = useDebouncedJudge(argumentText);
  const [currentView, setCurrentView] = useState<CurrentView>("composer");
  const [pendingOverlapApply, setPendingOverlapApply] = useState<string | null>(
    null,
  );

  const citations = useMemo(() => citationsFromFindings(findings), [findings]);
  const attachedSources = useMemo(() => sourcesFromFindings(findings), [findings]);

  const updateFinding = useCallback(
    (findingId: string, patch: Partial<Finding>) => {
      setFindings((prev) =>
        prev.map((f) => (f.id === findingId ? { ...f, ...patch } : f)),
      );
    },
    [setFindings],
  );

  const applySuggestion = useCallback(
    (findingId: string) => {
      const finding = findings.find((f) => f.id === findingId);
      if (!finding?.suggestedRewrite) return;

      setArgumentText((text) =>
        applyUserApprovedEdit({
          text,
          spanText: finding.spanText,
          replacement: finding.suggestedRewrite!,
        }),
      );

      setFindings((prev) =>
        prev.map((f) =>
          f.id === findingId ? { ...f, status: "resolved" as const } : f,
        ),
      );
      setPendingOverlapApply(null);
    },
    [findings, setFindings],
  );

  const requestApplySuggestion = useCallback(
    (findingId: string) => {
      const finding = findings.find((f) => f.id === findingId);
      if (!finding?.suggestedRewrite) return;

      const overlapping = getOverlappingOpenFindings(finding, findings);
      if (overlapping.length > 0) {
        setPendingOverlapApply(findingId);
        return;
      }

      applySuggestion(findingId);
    },
    [findings, applySuggestion],
  );

  const keepAsIs = useCallback(
    (findingId: string) => {
      updateFinding(findingId, { status: "ignored" });
    },
    [updateFinding],
  );

  const attachSource = useCallback(
    (findingId: string, sourceId: string) => {
      updateFinding(findingId, {
        status: "source_attached",
        selectedSourceId: sourceId,
      });
    },
    [updateFinding],
  );

  const markAsOpinion = useCallback(
    (findingId: string) => {
      updateFinding(findingId, { status: "marked_opinion" });
    },
    [updateFinding],
  );

  const disputeFinding = useCallback(
    (findingId: string, reason: string) => {
      updateFinding(findingId, { status: "disputed", disputeReason: reason });
    },
    [updateFinding],
  );

  const publishedArgument = useMemo(
    () =>
      buildPublishedArgument({
        text: argumentText,
        findings,
        kind: context.mode,
        issueId: context.issueId,
        parentId: context.parentId,
      }),
    [argumentText, findings, context],
  );

  const handlePost = useCallback(() => {
    onPosted(publishedArgument);
    setCurrentView("published");
  }, [onPosted, publishedArgument]);

  if (currentView === "published") {
    return (
      <PublishedArgumentView
        argument={publishedArgument}
        variant="author"
        onBack={() => setCurrentView("composer")}
        onDone={onFinished}
      />
    );
  }

  return (
    <ComposerShell context={context} onBack={onBack}>
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-0 px-4 pb-28 pt-6 lg:flex-row lg:gap-8 lg:px-8 lg:pb-8">
        <section className="min-h-[420px] flex-1 lg:min-h-0">
          <ArgumentEditor
            text={argumentText}
            findings={findings}
            citations={citations}
            attachedSources={attachedSources}
            onChange={setArgumentText}
            label={
              context.mode === "response" ? "Your response" : "Your argument"
            }
          />
        </section>

        <aside className="w-full shrink-0 lg:w-[340px] xl:w-[380px]">
          <FindingsPanel
            findings={findings}
            checkingState={checkingState}
            judgeError={judgeError}
            isTooShort={isTooShort}
            onCheckNow={checkNow}
            pendingOverlapApply={pendingOverlapApply}
            onConfirmOverlapApply={() => {
              if (pendingOverlapApply) {
                applySuggestion(pendingOverlapApply);
              }
            }}
            onCancelOverlapApply={() => setPendingOverlapApply(null)}
            onUseSuggestion={requestApplySuggestion}
            onKeepAsIs={keepAsIs}
            onAttachSource={attachSource}
            onMarkAsOpinion={markAsOpinion}
            onDispute={disputeFinding}
          />
        </aside>
      </div>

      <ReadinessBar
        findings={findings}
        judgeError={judgeError}
        isTooShort={isTooShort}
        onPost={handlePost}
        postLabel={context.mode === "response" ? "Post response" : "Post starter"}
      />
    </ComposerShell>
  );
}
