import { describe, expect, it } from "vitest";
import { MAX_FINDINGS, sanitizeAIFindings } from "./schema";

function rawFinding(overrides: Record<string, unknown>): Record<string, unknown> {
  return {
    type: "claim",
    spanText: "placeholder",
    title: "A title",
    reason: "A reason",
    ...overrides,
  };
}

describe("sanitizeAIFindings", () => {
  it("returns [] for invalid payload shapes", () => {
    expect(sanitizeAIFindings(null, "text")).toEqual([]);
    expect(sanitizeAIFindings("nope", "text")).toEqual([]);
    expect(sanitizeAIFindings({}, "text")).toEqual([]);
    expect(sanitizeAIFindings({ findings: "not-an-array" }, "text")).toEqual([]);
  });

  it("drops findings whose span is not an exact substring of the text", () => {
    const text = "Public transit reduces congestion.";
    const result = sanitizeAIFindings(
      { findings: [rawFinding({ spanText: "not in the text" })] },
      text,
    );
    expect(result).toEqual([]);
  });

  it("records spanStart for the anchored occurrence", () => {
    const text = "First sentence. Public transit reduces congestion.";
    const span = "Public transit reduces congestion.";
    const result = sanitizeAIFindings(
      { findings: [rawFinding({ spanText: span })] },
      text,
    );
    expect(result).toHaveLength(1);
    expect(result[0].spanStart).toBe(text.indexOf(span));
  });

  it("dedupes exact (type, spanText) duplicates", () => {
    const text = "Public transit reduces congestion.";
    const span = "reduces congestion";
    const result = sanitizeAIFindings(
      {
        findings: [
          rawFinding({ id: "a", spanText: span }),
          rawFinding({ id: "b", spanText: span }),
        ],
      },
      text,
    );
    expect(result).toHaveLength(1);
  });

  it("keeps the broadest span when same-type findings overlap", () => {
    const text = "Studies show 80% of pollution comes from cars in cities.";
    const broad = "Studies show 80% of pollution comes from cars";
    const narrow = "80% of pollution";
    const result = sanitizeAIFindings(
      {
        findings: [
          rawFinding({ id: "narrow", spanText: narrow }),
          rawFinding({ id: "broad", spanText: broad }),
        ],
      },
      text,
    );
    expect(result).toHaveLength(1);
    expect(result[0].spanText).toBe(broad);
  });

  it("downgrades informal-register fallacies to clarity", () => {
    const text = "bro cars are ruining this city";
    const result = sanitizeAIFindings(
      {
        findings: [
          rawFinding({
            type: "fallacy",
            spanText: "bro",
            title: "Informal tone",
            reason: "This informal tone can undermine credibility.",
          }),
        ],
      },
      text,
    );
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("clarity");
    expect(result[0].title).toBe("Consider clearer wording");
  });

  it("downgrades scare-language fallacies on factual claims to claims", () => {
    const text = "radiation from phones causes cancer in children, wake up";
    const result = sanitizeAIFindings(
      {
        findings: [
          rawFinding({
            type: "fallacy",
            spanText: "radiation from phones causes cancer in children",
            subtitle: "Appeal to fear",
            title: "Fear-based argument",
            reason: "Uses alarming language.",
          }),
        ],
      },
      text,
    );
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("claim");
    expect(result[0].title).toBe("This claim needs evidence");
  });

  it("downgrades precision issues mislabeled as claims to clarity", () => {
    const text = "we need better transit before anything else";
    const result = sanitizeAIFindings(
      {
        findings: [
          rawFinding({
            type: "claim",
            spanText: "we need better transit",
            title: "Vague phrasing",
            reason: "You should clarify what kind of transit improvements you mean.",
          }),
        ],
      },
      text,
    );
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("clarity");
  });

  it("caps output at MAX_FINDINGS", () => {
    const words = ["alpha", "bravo", "charlie", "delta", "echo", "foxtrot", "golf"];
    const text = words.join(" ");
    const result = sanitizeAIFindings(
      { findings: words.map((word) => rawFinding({ spanText: word })) },
      text,
    );
    expect(result).toHaveLength(MAX_FINDINGS);
  });

  it("generates ids when missing and uniquifies duplicates", () => {
    const text = "alpha bravo";
    const result = sanitizeAIFindings(
      {
        findings: [
          rawFinding({ spanText: "alpha", id: undefined }),
          rawFinding({ spanText: "bravo", id: "finding-claim-1" }),
        ],
      },
      text,
    );
    expect(result).toHaveLength(2);
    const ids = result.map((f) => f.id);
    expect(new Set(ids).size).toBe(2);
  });
});
