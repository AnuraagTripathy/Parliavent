import { describe, expect, it } from "vitest";
import type { EvidenceSearchResponse, EvidenceSource } from "@/lib/types";
import { routeEvidence } from "./evidenceRouter";

function source(overrides: Partial<EvidenceSource> = {}): EvidenceSource {
  return {
    id: "src-1",
    title: "A source",
    publisher: "example.com",
    url: "https://example.com/a",
    snippet: "snippet",
    supportLevel: "supports",
    credibility: "medium",
    canAttachAsSupport: true,
    ...overrides,
  };
}

function result(overrides: Partial<EvidenceSearchResponse> = {}): EvidenceSearchResponse {
  return {
    claim: "Public transit budgets shrank",
    claimKind: "factual",
    claimVerdict: "supported",
    summary: "summary",
    sources: [source()],
    verificationBasis: "passages",
    ...overrides,
  };
}

describe("routeEvidence", () => {
  it("never escalates simple opinion claims", () => {
    const routed = routeEvidence(
      "I think city parks are lovely",
      result({ claimKind: "opinion", claimVerdict: "unclear", sources: [] }),
    );
    expect(routed.shouldEscalate).toBe(false);
    expect(routed.recommendedMode).toBe("standard");
    expect(routed.escalationReason).toBe(
      "Simple opinion claim — standard check is sufficient.",
    );
  });

  it("does not escalate a cleanly supported result", () => {
    const routed = routeEvidence("Public transit budgets shrank", result());
    expect(routed.shouldEscalate).toBe(false);
    expect(routed.escalationReason).toBe(
      "Standard check completed with sufficient confidence.",
    );
  });

  it("escalates when the verdict is unclear", () => {
    const routed = routeEvidence(
      "Public transit budgets shrank",
      result({ claimVerdict: "unclear" }),
    );
    expect(routed.shouldEscalate).toBe(true);
    expect(routed.weakResultSignals).toContain("verdict_unclear");
    expect(routed.recommendedMode).toBe("deep");
  });

  it("flags factual claims left without attachable sources", () => {
    const routed = routeEvidence(
      "Public transit budgets shrank",
      result({
        claimVerdict: "partially_supported",
        sources: [source({ supportLevel: "related_only", canAttachAsSupport: false })],
      }),
    );
    expect(routed.shouldEscalate).toBe(true);
    expect(routed.weakResultSignals).toContain("no_attachable_sources");
  });

  it("escalates unresolved risky claims on risk signals alone", () => {
    // numeric + medical + causal risk signals; mixed claimKind and an
    // unattachable source keep the weak-signal detectors quiet.
    const routed = routeEvidence(
      "Vaccines cause cancer in 30% of cases",
      result({
        claimKind: "mixed",
        claimVerdict: "partially_supported",
        sources: [source({ supportLevel: "supports", canAttachAsSupport: false })],
      }),
    );
    expect(routed.weakResultSignals).toEqual([]);
    expect(routed.riskSignals).toEqual(
      expect.arrayContaining(["numeric", "medical_or_scientific", "causal"]),
    );
    expect(routed.shouldEscalate).toBe(true);
  });

  it("does not escalate risky claims that resolved cleanly", () => {
    const routed = routeEvidence(
      "Vaccines cause cancer in 30% of cases",
      result({ claimVerdict: "contradicted" }),
    );
    expect(routed.shouldEscalate).toBe(false);
  });

  it("flags snippet-only verification on unresolved results", () => {
    const routed = routeEvidence(
      "Public transit budgets shrank",
      result({
        claimVerdict: "partially_supported",
        verificationBasis: "snippets",
        sources: [source({ canAttachAsSupport: false })],
      }),
    );
    expect(routed.weakResultSignals).toContain("snippet_only_verification");
    expect(routed.shouldEscalate).toBe(true);
  });
});
