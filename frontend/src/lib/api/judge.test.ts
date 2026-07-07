import { describe, expect, it } from "vitest";
import type { Finding } from "@/lib/types";
import { mergeFindings } from "./judge";

function finding(overrides: Partial<Finding> & Pick<Finding, "id" | "spanText">): Finding {
  return {
    type: "claim",
    status: "open",
    title: "A title",
    reason: "A reason",
    ...overrides,
  };
}

describe("mergeFindings", () => {
  it("preserves resolution state when the id shifts but (type, spanText) matches", () => {
    const text = "Cars cause most urban pollution. Transit is underfunded.";
    const previous = [
      finding({
        id: "finding-claim-1",
        spanText: "Cars cause most urban pollution",
        status: "source_attached",
        selectedSourceId: "src-1",
      }),
    ];
    // Re-judge after the user added text: same span now arrives with a new id.
    const incoming = [
      finding({ id: "finding-claim-2", spanText: "Cars cause most urban pollution" }),
    ];

    const merged = mergeFindings(previous, incoming, text);
    expect(merged).toHaveLength(1);
    expect(merged[0].status).toBe("source_attached");
    expect(merged[0].selectedSourceId).toBe("src-1");
  });

  it("falls back to id matching and keeps preserved statuses across span rewording", () => {
    const text = "Cars cause the majority of urban pollution.";
    const previous = [
      finding({
        id: "finding-claim-1",
        spanText: "Cars cause the majority of urban pollution",
        status: "marked_opinion",
      }),
    ];
    const incoming = [
      finding({ id: "finding-claim-1", spanText: "majority of urban pollution" }),
    ];

    const merged = mergeFindings(previous, incoming, text);
    expect(merged[0].status).toBe("marked_opinion");
  });

  it("returns the fresh finding when an id-matched span changed and status was not preserved", () => {
    const text = "Cars cause the majority of urban pollution.";
    const previous = [
      finding({
        id: "finding-claim-1",
        spanText: "Cars cause the majority of urban pollution",
        status: "open",
        sourceCandidates: [],
      }),
    ];
    const incoming = [
      finding({ id: "finding-claim-1", spanText: "majority of urban pollution" }),
    ];

    const merged = mergeFindings(previous, incoming, text);
    expect(merged[0].status).toBe("open");
    expect(merged[0].sourceCandidates).toBeUndefined();
  });

  it("does not let one previous finding donate state to two incoming findings", () => {
    const text = "Cars cause pollution.";
    const previous = [
      finding({ id: "old", spanText: "Cars cause pollution", status: "resolved" }),
    ];
    const incoming = [
      finding({ id: "new-1", spanText: "Cars cause pollution" }),
      finding({ id: "new-2", spanText: "Cars cause pollution" }),
    ];

    const merged = mergeFindings(previous, incoming, text);
    expect(merged[0].status).toBe("resolved");
    expect(merged[1].status).toBe("open");
  });

  it("returns incoming findings untouched when nothing matches", () => {
    const text = "Entirely new argument text.";
    const previous = [
      finding({ id: "finding-claim-1", spanText: "old span", status: "resolved" }),
    ];
    const incoming = [finding({ id: "finding-claim-9", spanText: "new argument" })];

    const merged = mergeFindings(previous, incoming, text);
    expect(merged[0].status).toBe("open");
  });

  it("drops preserved state when neither span is still present in the text", () => {
    const text = "Completely rewritten argument.";
    const previous = [
      finding({ id: "finding-claim-1", spanText: "vanished span", status: "resolved" }),
    ];
    const incoming = [
      finding({ id: "finding-claim-1", spanText: "also not present" }),
    ];

    const merged = mergeFindings(previous, incoming, text);
    expect(merged[0].status).toBe("open");
  });
});
