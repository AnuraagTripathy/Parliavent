import { describe, expect, it } from "vitest";
import { scopedFindingId, scopedSourceId } from "./scopedIds";

describe("scopedFindingId", () => {
  it("prefixes the finding id with the post id", () => {
    expect(scopedFindingId("post-1", "finding-claim-1")).toBe(
      "post-1-finding-claim-1",
    );
  });

  it("is idempotent for already-scoped ids", () => {
    const scoped = scopedFindingId("post-1", "finding-claim-1");
    expect(scopedFindingId("post-1", scoped)).toBe(scoped);
  });

  it("scopes the same finding id differently per post", () => {
    expect(scopedFindingId("post-1", "finding-claim-1")).not.toBe(
      scopedFindingId("post-2", "finding-claim-1"),
    );
  });
});

describe("scopedSourceId", () => {
  it("prefixes the source id with the finding id and stays idempotent", () => {
    const scoped = scopedSourceId("post-1-finding-claim-1", "evidence-0-example");
    expect(scoped).toBe("post-1-finding-claim-1-evidence-0-example");
    expect(scopedSourceId("post-1-finding-claim-1", scoped)).toBe(scoped);
  });
});
