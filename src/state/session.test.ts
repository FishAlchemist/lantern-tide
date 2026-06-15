import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  applyStoredMotion,
  decideEntrance,
  isReturningVisitor,
  loadMotionPref,
  markEntered,
  prefersReducedMotion,
  setMotionPref,
  timeSinceLastVisit,
} from "./session";

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

/** jsdom doesn't implement matchMedia; inject it for tests (§12 reduced-motion check). */
function stubReducedMotion(matches: boolean): void {
  vi.stubGlobal("matchMedia", (query: string) => {
    const mql: Pick<MediaQueryList, "matches" | "media"> = {
      matches,
      media: query,
    };
    return mql as unknown as MediaQueryList;
  });
}

describe("decideEntrance (§10 shortened return entrance)", () => {
  beforeEach(() => {
    localStorage.clear();
    stubReducedMotion(false);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("first visit → full (the full tunnel)", () => {
    expect(decideEntrance(0)).toBe("full");
  });

  it("prefers-reduced-motion → instant (no movement, §12)", () => {
    stubReducedMotion(true);
    markEntered(0, "library");
    expect(decideEntrance(HOUR)).toBe("instant");
  });

  it("back within hours → threshold-soft", () => {
    markEntered(0, "library");
    expect(decideEntrance(HOUR)).toBe("threshold-soft");
  });

  it("back after days → threshold-warm", () => {
    markEntered(0, "library");
    expect(decideEntrance(2 * DAY)).toBe("threshold-warm");
  });

  it("long absence (over a week) → treated as a fresh arrival, full", () => {
    markEntered(0, "library");
    expect(decideEntrance(10 * DAY)).toBe("full");
  });
});

describe("persistent state (§8 adapter / §10)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("after markEntered, isReturningVisitor is true", () => {
    expect(isReturningVisitor()).toBe(false);
    markEntered(123, "cafe");
    expect(isReturningVisitor()).toBe(true);
  });

  it("with no visit record, timeSinceLastVisit returns null", () => {
    expect(timeSinceLastVisit(999)).toBeNull();
  });

  it("timeSinceLastVisit computes the time away", () => {
    markEntered(1000, "library");
    expect(timeSinceLastVisit(1000 + HOUR)).toBe(HOUR);
  });
});

describe("motion preference (§12 detailed ⇄ simple, overrides the OS)", () => {
  beforeEach(() => {
    localStorage.clear();
    stubReducedMotion(false);
    delete document.documentElement.dataset["motion"];
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    delete document.documentElement.dataset["motion"];
  });

  it("with no explicit choice, follows the OS setting", () => {
    expect(prefersReducedMotion()).toBe(false);
    stubReducedMotion(true);
    expect(prefersReducedMotion()).toBe(true);
  });

  it("an explicit 'full' choice plays, overriding the OS reduce setting", () => {
    stubReducedMotion(true);
    setMotionPref("full");
    expect(prefersReducedMotion()).toBe(false);
  });

  it("an explicit 'reduced' choice calms, overriding the OS", () => {
    setMotionPref("reduced");
    expect(prefersReducedMotion()).toBe(true);
  });

  it("remembers the choice and re-applies it on a later boot", () => {
    expect(loadMotionPref()).toBeNull();
    setMotionPref("reduced");
    expect(loadMotionPref()).toBe("reduced");
    // a fresh load: the attribute is gone until applyStoredMotion re-applies it.
    delete document.documentElement.dataset["motion"];
    applyStoredMotion();
    expect(document.documentElement.dataset["motion"]).toBe("reduced");
    expect(prefersReducedMotion()).toBe(true);
  });

  it("applyStoredMotion leaves the page on the OS default when no choice exists", () => {
    applyStoredMotion();
    expect(document.documentElement.dataset["motion"]).toBeUndefined();
  });
});
