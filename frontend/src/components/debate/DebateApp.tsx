"use client";

import { useCallback, useMemo, useState } from "react";
import { applyUserApprovedEdit } from "@/lib/applyUserEdit";
import { persistPublishFlow, createDebatePost } from "@/lib/api/persistence";
import { buildPublishedArgument } from "@/lib/buildPublishedArgument";
import { citationsFromFindings, sourcesFromFindings } from "@/lib/citationsFromFindings";
import {
  canMarkClaimAsOpinion,
  classifyClaimKind,
} from "@/lib/evidence/classifyClaimKind";
import { SEED_RESPONSE } from "@/lib/mockJudge";
import { getPost } from "@/lib/mockFeed";
import { getOverlappingOpenFindings } from "@/lib/spanOverlap";
import { useDebouncedJudge } from "@/lib/useDebouncedJudge";
import type {
  ComposerContext,
  CurrentView,
  EvidenceSearchResponse,
  EvidenceSource,
  Finding,
  PublishedArgument,
  Source,
} from "@/lib/types";
import { ArgumentEditor } from "./ArgumentEditor";
import { ComposerShell } from "./ComposerShell";
import { FindingsPanel } from "./FindingsPanel";
import { ParentArgumentPanel } from "./ParentArgumentPanel";
import { PublishedArgumentView } from "./PublishedArgumentView";
import { ReadinessBar } from "./ReadinessBar";

interface DebateAppProps {
  context: ComposerContext;
  authorName: string;
  onBack: () => void;
  onPosted: (post: PublishedArgument) => void;
  onFinished: () => void;
}

export function DebateApp({ context, authorName, onBack, onPosted, onFinished }: DebateAppProps) {
  const useMockSeed =
    context.mode === "response" &&
    !context.isSavedDebate &&
    !context.debateId;
  const initialText =
    context.mode === "response"
      ? useMockSeed
        ? SEED_RESPONSE
        : (context.initialText ?? "")
      : (context.initialText ?? "");
  const [argumentText, setArgumentText] = useState(initialText);
  const judgeContext = useMemo(() => {
    const parentArgument =
      context.parentArgument ??
      (context.parentId ? getPost(context.parentId)?.text : undefined);

    return {
      mode: context.judgeMode ?? "structured_debate",
      threadId: context.debateId ?? context.issueId,
      motion: context.issueTitle,
      postType:
        context.mode === "response"
          ? ("reply" as const)
          : ("starter" as const),
      parentArgument,
      userStance: "unknown" as const,
    };
  }, [context]);
  const {
    findings,
    setFindings,
    checkingState,
    judgeError,
    isTooShort,
    checkNow,
  } = useDebouncedJudge(argumentText, judgeContext);
  const [currentView, setCurrentView] = useState<CurrentView>("composer");
  const [pendingOverlapApply, setPendingOverlapApply] = useState<string | null>(
    null,
  );
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [publishedArgument, setPublishedArgument] =
    useState<PublishedArgument | null>(null);

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
          spanStart: finding.spanStart,
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

  const applyRewrite = useCallback(
    (findingId: string, replacement: string) => {
      const finding = findings.find((f) => f.id === findingId);
      if (!finding) return;

      setArgumentText((text) =>
        applyUserApprovedEdit({
          text,
          spanText: finding.spanText,
          replacement,
          spanStart: finding.spanStart,
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

  const setSourceSearchResult = useCallback(
    (findingId: string, result: EvidenceSearchResponse) => {
      updateFinding(findingId, {
        sourceCandidates: result.sources,
        claimKind: result.claimKind,
        evidenceClaimVerdict: result.claimVerdict,
        evidenceSummary: result.summary,
        evidenceShouldEscalate: result.shouldEscalate,
        evidenceEscalationReason: result.escalationReason,
        evidenceEscalationSignals: result.escalationSignals,
        evidenceInvestigationTrace: result.investigationTrace,
        evidenceMode: result.evidenceMode,
      });
    },
    [updateFinding],
  );

  const attachEvidenceSource = useCallback(
    (findingId: string, evidenceSource: EvidenceSource) => {
      if (!evidenceSource.canAttachAsSupport) {
        return;
      }
      const source: Source = {
        id: evidenceSource.id,
        title: evidenceSource.title,
        publisher: evidenceSource.publisher,
        url: evidenceSource.url,
        isSample: false,
      };
      updateFinding(findingId, {
        status: "source_attached",
        selectedSourceId: evidenceSource.id,
        sources: [source],
      });
    },
    [updateFinding],
  );

  const markAsOpinion = useCallback(
    (findingId: string) => {
      setFindings((prev) =>
        prev.map((f) => {
          if (f.id !== findingId) return f;
          // Factual claims must go through the "Revise as opinion" flow —
          // never silently dismissed as opinion.
          const kind = f.claimKind ?? classifyClaimKind(f.spanText);
          if (f.type === "claim" && !canMarkClaimAsOpinion(kind)) return f;
          return { ...f, status: "marked_opinion" as const };
        }),
      );
    },
    [setFindings],
  );

  const disputeFinding = useCallback(
    (findingId: string, reason: string) => {
      updateFinding(findingId, { status: "disputed", disputeReason: reason });
    },
    [updateFinding],
  );

  const draftPublishedArgument = useMemo(
    () =>
      buildPublishedArgument({
        text: argumentText,
        findings,
        kind: context.mode,
        issueId: context.issueId,
        parentId: context.parentId,
        id: context.dbPostId,
        debateId: context.debateId,
        dbPostId: context.dbPostId,
        author: context.debateId || context.isSavedDebate ? authorName : undefined,
      }),
    [argumentText, findings, context, authorName],
  );

  const handlePost = useCallback(async () => {
    setPublishError(null);

    if (context.debateId && context.isSavedDebate) {
      setIsPublishing(true);
      try {
        let postId = context.dbPostId;

        if (!postId) {
          if (context.mode === "response" && context.parentDbPostId) {
            const { post } = await createDebatePost({
              debateId: context.debateId,
              postType: "reply",
              parentPostId: context.parentDbPostId,
              text: argumentText,
              authorName,
            });
            postId = post.id;
          } else if (context.mode === "starter") {
            const { post } = await createDebatePost({
              debateId: context.debateId,
              postType: "starter",
              text: argumentText,
              authorName,
            });
            postId = post.id;
          }
        }

        if (!postId) {
          throw new Error("Could not save post");
        }

        const saved = await persistPublishFlow(
          postId,
          argumentText,
          findings,
          authorName,
        );
        setPublishedArgument(saved);
        onPosted(saved);
        setCurrentView("published");
      } catch (err) {
        setPublishError(
          err instanceof Error ? err.message : "Failed to publish post",
        );
      } finally {
        setIsPublishing(false);
      }
      return;
    }

    if (context.dbPostId) {
      setIsPublishing(true);
      try {
        const saved = await persistPublishFlow(
          context.dbPostId,
          argumentText,
          findings,
          authorName,
        );
        setPublishedArgument(saved);
        onPosted(saved);
        setCurrentView("published");
      } catch (err) {
        setPublishError(
          err instanceof Error ? err.message : "Failed to publish post",
        );
      } finally {
        setIsPublishing(false);
      }
      return;
    }

    onPosted(draftPublishedArgument);
    setPublishedArgument(draftPublishedArgument);
    setCurrentView("published");
  }, [
    argumentText,
    context.dbPostId,
    draftPublishedArgument,
    findings,
    context.debateId,
    context.isSavedDebate,
    context.mode,
    context.parentDbPostId,
    onPosted,
  ]);

  if (currentView === "published" && publishedArgument) {
    return (
      <PublishedArgumentView
        argument={publishedArgument}
        variant="author"
        onBack={() => setCurrentView("composer")}
        onDone={onFinished}
      />
    );
  }

  const parentArgumentText =
    context.parentArgument ??
    (context.parentId ? getPost(context.parentId)?.text : undefined);

  return (
    <ComposerShell context={context} onBack={onBack}>
      <div className="flex w-full flex-1 flex-col gap-6 px-4 pb-28 pt-6 md:px-8 lg:px-12 xl:px-16 lg:pb-10">
        <section className="mx-auto w-full max-w-4xl">
          {context.mode === "response" && parentArgumentText && (
            <ParentArgumentPanel
              text={parentArgumentText}
              author={context.parentAuthor}
            />
          )}
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

        <section className="mx-auto w-full max-w-6xl">
          <FindingsPanel
            findings={findings}
            argumentText={argumentText}
            threadId={context.issueId}
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
            onSourceSearchResult={setSourceSearchResult}
            onAttachEvidenceSource={attachEvidenceSource}
            onApplyRewrite={applyRewrite}
            onMarkAsOpinion={markAsOpinion}
            onDispute={disputeFinding}
          />
        </section>
      </div>

      <ReadinessBar
        findings={findings}
        judgeError={judgeError}
        isTooShort={isTooShort}
        onPost={() => void handlePost()}
        postLabel={context.mode === "response" ? "Post response" : "Post starter"}
        isPosting={isPublishing}
        postError={publishError}
      />
    </ComposerShell>
  );
}
