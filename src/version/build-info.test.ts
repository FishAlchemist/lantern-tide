import { describe, expect, it } from "vitest";
import {
  APP_VERSION,
  commitUrl,
  GIT_SHA,
  isResolvedSha,
  releaseUrl,
  REPO_URL,
  shortSha,
  versionLabel,
} from "./build-info";

/* The corner version badge is a pure read of two strings stamped in at build
   time (the version + the commit SHA). These lock the small helpers that turn
   them into a label and the two GitHub links the badge offers. */

describe("the build constants are present", () => {
  it("exposes a non-empty version and SHA (a placeholder is still a string)", () => {
    expect(typeof APP_VERSION).toBe("string");
    expect(APP_VERSION.length).toBeGreaterThan(0);
    expect(typeof GIT_SHA).toBe("string");
    expect(GIT_SHA.length).toBeGreaterThan(0);
  });
});

describe("versionLabel (the chip text, matching the tag shape)", () => {
  it("prefixes a 'v', like the git tag", () => {
    expect(versionLabel("0.3.0")).toBe("v0.3.0");
    expect(versionLabel("1.0.0")).toBe("v1.0.0");
  });
});

describe("isResolvedSha (is this a real commit, or a no-git placeholder?)", () => {
  it("accepts a full or abbreviated lowercase hex SHA", () => {
    expect(isResolvedSha("5871e7b")).toBe(true);
    expect(isResolvedSha("0123456789abcdef0123456789abcdef01234567")).toBe(
      true,
    );
  });
  it("rejects the dev placeholder and anything non-hex", () => {
    expect(isResolvedSha("unknown")).toBe(false);
    expect(isResolvedSha("")).toBe(false);
    expect(isResolvedSha("ABC1234")).toBe(false); // uppercase is not a git oid
    expect(isResolvedSha("zzzzzzz")).toBe(false);
    expect(isResolvedSha("12345")).toBe(false); // too short to be meaningful
  });
});

describe("shortSha (display form)", () => {
  it("clips a real SHA to seven characters by default", () => {
    expect(shortSha("0123456789abcdef0123456789abcdef01234567")).toBe(
      "0123456",
    );
    expect(shortSha("0123456789abcdef", 4)).toBe("0123");
  });
  it("leaves a non-resolved value untouched, so a dev build still reads", () => {
    expect(shortSha("unknown")).toBe("unknown");
  });
});

describe("the GitHub links the badge hands out", () => {
  it("releaseUrl points at the version's tag page (where the notes live)", () => {
    expect(releaseUrl("0.3.0")).toBe(`${REPO_URL}/releases/tag/v0.3.0`);
  });
  it("commitUrl points at the commit page for a SHA", () => {
    expect(commitUrl("5871e7b")).toBe(`${REPO_URL}/commit/5871e7b`);
  });
});
