import { describe, expect, it } from "vitest";
import { SPACE_NAMESPACES, loadSpace } from "./registry";

/* The space registry auto-discovers spaces from the folder layout (so adding a
   space is dropping in a folder, with no router/loader edits). The entry is a
   <name>.space.ts file; <name> is the namespace, flat however deeply the folder
   nests (street/cafe/cafe.space.ts → "cafe"). These lock the convention with
   subset checks, so adding a new space never breaks them. */
describe("space registry (auto-discovery from the folder layout)", () => {
  it("discovers each space's .space.ts entry as a namespace", () => {
    for (const ns of [
      "street",
      "library",
      "cafe",
      "lookout",
      "paperboat",
      "stillroom",
    ]) {
      expect(SPACE_NAMESPACES).toContain(ns);
    }
  });

  it("counts only *.space.ts entries — not _shared, helpers, or the registry", () => {
    // _shared holds scene.ts / space-shell.ts — no .space.ts among them.
    expect(SPACE_NAMESPACES).not.toContain("_shared");
    expect(SPACE_NAMESPACES).not.toContain("scene");
    expect(SPACE_NAMESPACES).not.toContain("space-shell");
    expect(SPACE_NAMESPACES).not.toContain("registry");
  });

  it("hands back a lazy loader for a known space, undefined for an unknown one", () => {
    // A function, not an invoked import: the space's chunk stays unfetched here.
    expect(typeof loadSpace("cafe")).toBe("function");
    expect(loadSpace("does-not-exist")).toBeUndefined();
  });
});
