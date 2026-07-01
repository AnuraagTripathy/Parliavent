"use client";

import { useEffect, useRef, useState } from "react";
import {
  fetchJudge,
  JUDGE_DEBOUNCE_MS,
  JUDGE_ERROR_MESSAGE,
  JUDGE_THREAD_ID,
  mergeFindings,
} from "@/lib/api/judge";
import type { CheckingState, Finding } from "@/lib/types";

export function useDebouncedJudge(text: string) {
  const [findings, setFindings] = useState<Finding[]>([]);
  const [checkingState, setCheckingState] = useState<CheckingState>("idle");
  const [judgeError, setJudgeError] = useState<string | null>(null);
  const isFirstCheck = useRef(true);
  const requestIdRef = useRef(0);

  useEffect(() => {
    const controller = new AbortController();
    const delay = isFirstCheck.current ? 0 : JUDGE_DEBOUNCE_MS;
    isFirstCheck.current = false;

    const timeoutId = window.setTimeout(async () => {
      const requestId = ++requestIdRef.current;
      setCheckingState("checking");
      setJudgeError(null);

      try {
        const { findings: nextFindings } = await fetchJudge({
          text,
          mode: "structured_debate",
          threadId: JUDGE_THREAD_ID,
          signal: controller.signal,
        });

        if (controller.signal.aborted || requestId !== requestIdRef.current) {
          return;
        }

        setFindings((previous) => mergeFindings(previous, nextFindings, text));
        setCheckingState("complete");
      } catch {
        if (controller.signal.aborted || requestId !== requestIdRef.current) {
          return;
        }

        setJudgeError(JUDGE_ERROR_MESSAGE);
        setCheckingState("complete");
      }
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [text]);

  return { findings, setFindings, checkingState, judgeError };
}
