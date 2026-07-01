"use client";

import { useEffect, useRef, useState } from "react";
import {
  fetchJudge,
  JUDGE_DEBOUNCE_MS,
  JUDGE_THREAD_ID,
  mergeFindings,
} from "@/lib/api/judge";
import type { CheckingState, Finding } from "@/lib/types";

const JUDGE_ERROR_MESSAGE = "Couldn't refresh review. Your text is safe.";

export function useDebouncedJudge(text: string) {
  const [findings, setFindings] = useState<Finding[]>([]);
  const [checkingState, setCheckingState] = useState<CheckingState>("idle");
  const [judgeError, setJudgeError] = useState<string | null>(null);
  const isFirstCheck = useRef(true);

  useEffect(() => {
    const controller = new AbortController();
    const delay = isFirstCheck.current ? 0 : JUDGE_DEBOUNCE_MS;
    isFirstCheck.current = false;

    const timeoutId = window.setTimeout(async () => {
      setCheckingState("checking");
      setJudgeError(null);

      try {
        const { findings: nextFindings } = await fetchJudge({
          text,
          mode: "structured_debate",
          threadId: JUDGE_THREAD_ID,
          signal: controller.signal,
        });

        setFindings((previous) => mergeFindings(previous, nextFindings, text));
        setCheckingState("complete");
      } catch {
        if (!controller.signal.aborted) {
          setJudgeError(JUDGE_ERROR_MESSAGE);
          setCheckingState("complete");
        }
      }
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [text]);

  return { findings, setFindings, checkingState, judgeError };
}
