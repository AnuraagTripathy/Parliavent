import { describe, expect, it } from "vitest";
import { isValidFindingInput } from "./findingInput";

function validFinding(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    id: "finding-claim-1",
    type: "claim",
    status: "open",
    spanText: "cars cause pollution",
    title: "This claim needs evidence",
    reason: "Readers will expect a source.",
    ...overrides,
  };
}

describe("isValidFindingInput", () => {
  it("accepts a minimal valid finding", () => {
    expect(isValidFindingInput(validFinding())).toBe(true);
  });

  it("accepts valid optional fields and ignores extra client-only fields", () => {
    expect(
      isValidFindingInput(
        validFinding({
          claimKind: "factual",
          subtitle: "sub",
          confidence: "82%",
          suggestedRewrite: "better wording",
          sourceCandidates: [{ anything: true }],
          spanStart: 12,
        }),
      ),
    ).toBe(true);
  });

  it("rejects non-objects", () => {
    expect(isValidFindingInput(null)).toBe(false);
    expect(isValidFindingInput("finding")).toBe(false);
  });

  it("rejects unknown enum values", () => {
    expect(isValidFindingInput(validFinding({ type: "insult" }))).toBe(false);
    expect(isValidFindingInput(validFinding({ status: "vetted" }))).toBe(false);
    expect(isValidFindingInput(validFinding({ claimKind: "certain" }))).toBe(false);
  });

  it("rejects empty or oversized ids and empty spans", () => {
    expect(isValidFindingInput(validFinding({ id: "  " }))).toBe(false);
    expect(isValidFindingInput(validFinding({ id: "x".repeat(201) }))).toBe(false);
    expect(isValidFindingInput(validFinding({ spanText: "" }))).toBe(false);
  });

  it("rejects wrong types on optional fields", () => {
    expect(isValidFindingInput(validFinding({ subtitle: 42 }))).toBe(false);
    expect(isValidFindingInput(validFinding({ disputeReason: {} }))).toBe(false);
  });
});
