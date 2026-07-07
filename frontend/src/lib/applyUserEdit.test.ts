import { describe, expect, it } from "vitest";
import { applyUserApprovedEdit } from "./applyUserEdit";

describe("applyUserApprovedEdit", () => {
  it("replaces the first occurrence when no anchor is given", () => {
    expect(
      applyUserApprovedEdit({
        text: "cars are bad and cars are bad",
        spanText: "cars are bad",
        replacement: "cars are loud",
      }),
    ).toBe("cars are loud and cars are bad");
  });

  it("replaces the anchored occurrence when spanStart is valid", () => {
    const text = "cars are bad and cars are bad";
    expect(
      applyUserApprovedEdit({
        text,
        spanText: "cars are bad",
        replacement: "cars are loud",
        spanStart: text.lastIndexOf("cars are bad"),
      }),
    ).toBe("cars are bad and cars are loud");
  });

  it("falls back to first occurrence when the anchor is stale", () => {
    expect(
      applyUserApprovedEdit({
        text: "cars are bad and cars are bad",
        spanText: "cars are bad",
        replacement: "cars are loud",
        spanStart: 3, // text at offset 3 no longer matches the span
      }),
    ).toBe("cars are loud and cars are bad");
  });

  it("returns the text unchanged when the span is absent", () => {
    expect(
      applyUserApprovedEdit({
        text: "nothing to see here",
        spanText: "missing span",
        replacement: "anything",
      }),
    ).toBe("nothing to see here");
  });
});
