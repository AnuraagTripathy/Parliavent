"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchJudge,
  JUDGE_DEBOUNCE_MS,
  JUDGE_ERROR_MESSAGE,
  JUDGE_MIN_CHARS,
  mergeFindings,
  type JudgeCallContext,
} from "@/lib/api/judge";
import { normalizeJudgeText } from "@/lib/normalizeJudgeText";
import type { CheckingState, Finding } from "@/lib/types";

function buildClientCacheKey(
  normalizedText: string,
  context: JudgeCallContext,
): string {
  return [
    normalizedText,
    context.mode ?? "structured_debate",
    context.motion ?? "",
    context.postType ?? "",
    normalizeJudgeText(context.parentArgument ?? ""),
    normalizeJudgeText(context.threadSummary ?? ""),
  ].join("\0");
}

export function useDebouncedJudge(
  text: string,
  judgeContext: JudgeCallContext = {},
) {
  const [findings, setFindings] = useState<Finding[]>([]);
  const [checkingState, setCheckingState] = useState<CheckingState>("idle");
  const [judgeError, setJudgeError] = useState<string | null>(null);
  const [isTooShort, setIsTooShort] = useState(false);

  const requestIdRef = useRef(0);
  const debounceTimeoutRef = useRef<number | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const cacheRef = useRef(new Map<string, Finding[]>());
  const textRef = useRef(text);
  const judgeContextRef = useRef(judgeContext);

  useEffect(() => {
    textRef.current = text;
  }, [text]);

  useEffect(() => {
    judgeContextRef.current = judgeContext;
  }, [judgeContext]);

  const runJudge = useCallback(
    async (
      rawText: string,
      requestId: number,
      signal: AbortSignal,
      context: JudgeCallContext,
    ) => {
      const normalized = normalizeJudgeText(rawText);

      if (normalized.length < JUDGE_MIN_CHARS) {
        if (requestId !== requestIdRef.current) return;
        setIsTooShort(true);
        setFindings([]);
        setJudgeError(null);
        setCheckingState("complete");
        return;
      }

      setIsTooShort(false);

      const cacheKey = buildClientCacheKey(normalized, context);
      const cached = cacheRef.current.get(cacheKey);
      if (cached) {
        if (requestId !== requestIdRef.current) return;
        setFindings((previous) => mergeFindings(previous, cached, rawText));
        setJudgeError(null);
        setCheckingState("complete");
        return;
      }

      setCheckingState("checking");
      setJudgeError(null);

      try {
        const { findings: nextFindings } = await fetchJudge({
          text: rawText,
          mode: context.mode ?? "structured_debate",
          threadId: context.threadId,
          motion: context.motion,
          postType: context.postType,
          parentArgument: context.parentArgument,
          threadSummary: context.threadSummary,
          userStance: context.userStance,
          signal,
        });

        if (signal.aborted || requestId !== requestIdRef.current) {
          return;
        }

        cacheRef.current.set(cacheKey, nextFindings);
        setFindings((previous) => mergeFindings(previous, nextFindings, rawText));
        setCheckingState("complete");
      } catch {
        if (signal.aborted || requestId !== requestIdRef.current) {
          return;
        }

        setJudgeError(JUDGE_ERROR_MESSAGE);
        setCheckingState("complete");
      }
    },
    [],
  );

  const cancelPendingJudge = useCallback(() => {
    if (debounceTimeoutRef.current !== null) {
      window.clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = null;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const startJudge = useCallback(
    (rawText: string) => {
      cancelPendingJudge();

      const controller = new AbortController();
      abortControllerRef.current = controller;
      const requestId = ++requestIdRef.current;

      void runJudge(rawText, requestId, controller.signal, judgeContextRef.current);
    },
    [cancelPendingJudge, runJudge],
  );

  const scheduleJudge = useCallback(
    (rawText: string) => {
      cancelPendingJudge();

      const controller = new AbortController();
      abortControllerRef.current = controller;

      debounceTimeoutRef.current = window.setTimeout(() => {
        debounceTimeoutRef.current = null;
        const requestId = ++requestIdRef.current;
        void runJudge(
          rawText,
          requestId,
          controller.signal,
          judgeContextRef.current,
        );
      }, JUDGE_DEBOUNCE_MS);
    },
    [cancelPendingJudge, runJudge],
  );

  const checkNow = useCallback(() => {
    startJudge(textRef.current);
  }, [startJudge]);

  useEffect(() => {
    scheduleJudge(text);

    return () => {
      cancelPendingJudge();
    };
  }, [text, judgeContext, scheduleJudge, cancelPendingJudge]);

  return {
    findings,
    setFindings,
    checkingState,
    judgeError,
    isTooShort,
    checkNow,
  };
}
