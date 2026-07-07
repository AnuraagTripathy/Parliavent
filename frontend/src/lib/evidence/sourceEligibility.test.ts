import { describe, expect, it } from "vitest";
import type { EvidenceSource, SupportLevel } from "@/lib/types";
import {
  computeCanAttachAsSupport,
  enforceAttachabilityForClaimVerdict,
  isAttachableUnderVerdict,
} from "./sourceEligibility";

function source(supportLevel: SupportLevel, canAttach: boolean): EvidenceSource {
  return {
    id: "src-1",
    title: "A source",
    publisher: "example.com",
    url: "https://example.com/a",
    snippet: "snippet",
    supportLevel,
    credibility: "medium",
    canAttachAsSupport: canAttach,
  };
}

describe("computeCanAttachAsSupport", () => {
  it("is true only for supporting levels", () => {
    expect(computeCanAttachAsSupport("supports")).toBe(true);
    expect(computeCanAttachAsSupport("partially_supports")).toBe(true);
    expect(computeCanAttachAsSupport("contradicts")).toBe(false);
    expect(computeCanAttachAsSupport("related_only")).toBe(false);
    expect(computeCanAttachAsSupport("unclear")).toBe(false);
  });
});

describe("isAttachableUnderVerdict", () => {
  it("forbids attaching support to contradicted or unsupported claims", () => {
    expect(isAttachableUnderVerdict("supports", "contradicted")).toBe(false);
    expect(isAttachableUnderVerdict("supports", "unsupported")).toBe(false);
  });

  it("allows supporting sources under other verdicts", () => {
    expect(isAttachableUnderVerdict("supports", "supported")).toBe(true);
    expect(isAttachableUnderVerdict("partially_supports", "partially_supported")).toBe(true);
    expect(isAttachableUnderVerdict("supports", "unclear")).toBe(true);
  });

  it("never allows non-supporting levels regardless of verdict", () => {
    expect(isAttachableUnderVerdict("related_only", "supported")).toBe(false);
    expect(isAttachableUnderVerdict("contradicts", "supported")).toBe(false);
  });
});

describe("enforceAttachabilityForClaimVerdict", () => {
  it("strips attachability when the claim verdict is contradicted", () => {
    const sources = enforceAttachabilityForClaimVerdict(
      [source("supports", true)],
      "contradicted",
    );
    expect(sources[0].canAttachAsSupport).toBe(false);
  });

  it("leaves sources untouched under passing verdicts", () => {
    const input = [source("supports", true)];
    expect(enforceAttachabilityForClaimVerdict(input, "supported")).toBe(input);
  });
});
