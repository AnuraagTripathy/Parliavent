import { describe, expect, it } from "vitest";
import type { Finding } from "./types";
import {
  buildClaimCaveatsFromFindings,
  claimCaveatMessage,
  shouldShowClaimCaveat,
} from "./claimCaveats";

function finding(overrides: Partial<Finding> & Pick<Finding, "id" | "spanText">): Finding {
  return {
    type: "claim",
    status: "open",
    title: "A title",
    reason: "A reason",
    ...overrides,
  };
}

describe("claimCaveatMessage", () => {
  it("returns a message only for caveat-worthy verdicts", () => {
    expect(claimCaveatMessage("unsupported")).toBe(
      "Sources reviewed did not support this claim.",
    );
    expect(claimCaveatMessage("contradicted")).toBe(
      "Sources reviewed appear to contradict this claim.",
    );
    expect(claimCaveatMessage("supported")).toBeNull();
    expect(claimCaveatMessage("partially_supported")).toBeNull();
  });
});

describe("shouldShowClaimCaveat", () => {
  it("shows a caveat for open claims with a failing verdict", () => {
    expect(
      shouldShowClaimCaveat(
        finding({ id: "f1", spanText: "x", evidenceClaimVerdict: "unsupported" }),
      ),
    ).toBe(true);
  });

  it("shows a caveat for ignored claims with a failing verdict", () => {
    expect(
      shouldShowClaimCaveat(
        finding({
          id: "f1",
          spanText: "x",
          status: "ignored",
          evidenceClaimVerdict: "contradicted",
        }),
      ),
    ).toBe(true);
  });

  it("never shows caveats for non-claim findings", () => {
    expect(
      shouldShowClaimCaveat(
        finding({
          id: "f1",
          spanText: "x",
          type: "fallacy",
          evidenceClaimVerdict: "unsupported",
        }),
      ),
    ).toBe(false);
  });

  it("suppresses caveats once the user resolved the finding", () => {
    for (const status of ["source_attached", "resolved", "marked_opinion", "disputed"] as const) {
      expect(
        shouldShowClaimCaveat(
          finding({
            id: "f1",
            spanText: "x",
            status,
            evidenceClaimVerdict: "unsupported",
          }),
        ),
      ).toBe(false);
    }
  });

  it("requires a failing verdict", () => {
    expect(
      shouldShowClaimCaveat(finding({ id: "f1", spanText: "x" })),
    ).toBe(false);
    expect(
      shouldShowClaimCaveat(
        finding({ id: "f1", spanText: "x", evidenceClaimVerdict: "supported" }),
      ),
    ).toBe(false);
  });
});

describe("buildClaimCaveatsFromFindings", () => {
  it("collects caveats with the finding's id, span, and verdict", () => {
    const caveats = buildClaimCaveatsFromFindings([
      finding({
        id: "f1",
        spanText: "cars cause pollution",
        evidenceClaimVerdict: "unsupported",
      }),
      finding({ id: "f2", spanText: "other", evidenceClaimVerdict: "supported" }),
    ]);
    expect(caveats).toEqual([
      {
        id: "f1",
        spanText: "cars cause pollution",
        verdict: "unsupported",
        message: "Sources reviewed did not support this claim.",
      },
    ]);
  });
});
