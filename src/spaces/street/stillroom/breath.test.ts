import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  addCharge,
  BASE_CHARGE,
  clearRhythm,
  decayCharge,
  DEFAULT_RHYTHM,
  loadLight,
  loadRhythm,
  PACES,
  rhythmAtCalm,
  saveLight,
  saveRhythm,
  SWITCH_REST_HOLD_MS,
  SWITCH_SHRINK_MS,
  switchRestPlan,
  type Rhythm,
} from "./breath";

const DAY = 24 * 60 * 60 * 1000;

/* The stillroom leads, you follow: one `calm` dial eases the breath from a
   moderate start to the calm target. These lock that the dial is safe at every
   point (a longer out-breath the whole way, inside the band) and the local
   persistence of wherever you settle. */

function expectRhythm(actual: Rhythm | null, expected: Rhythm): void {
  expect(actual).not.toBeNull();
  if (actual === null) return;
  expect(actual.inhale).toBeCloseTo(expected.inhale, 5);
  expect(actual.hold).toBeCloseTo(expected.hold, 5);
  expect(actual.exhale).toBeCloseTo(expected.exhale, 5);
  expect(actual.rest).toBeCloseTo(expected.rest, 5);
}

describe("rhythmAtCalm (the lead-you-slower dial)", () => {
  it("meets you at the moderate start (calm 0)", () => {
    expectRhythm(rhythmAtCalm(0), { inhale: 3, hold: 0, exhale: 4.2, rest: 1 });
  });

  it("eases to the calm target (calm 1)", () => {
    expectRhythm(rhythmAtCalm(1), DEFAULT_RHYTHM);
  });

  it("only ever lengthens toward calm (monotonic as calm rises)", () => {
    const a = rhythmAtCalm(0);
    const b = rhythmAtCalm(0.5);
    const c = rhythmAtCalm(1);
    const period = (r: Rhythm) => r.inhale + r.hold + r.exhale + r.rest;
    expect(period(a)).toBeLessThan(period(b));
    expect(period(b)).toBeLessThan(period(c));
  });

  it("keeps the out-breath ≥ 1.4× the in-breath all the way (the calming lever)", () => {
    for (let c = 0; c <= 1.0001; c += 0.1) {
      const r = rhythmAtCalm(c);
      expect(r.exhale).toBeGreaterThanOrEqual(r.inhale * 1.4 - 1e-9);
    }
  });

  it("stays inside the relaxing band, and clamps an out-of-range dial", () => {
    for (let c = 0; c <= 1.0001; c += 0.1) {
      const r = rhythmAtCalm(c);
      const period = r.inhale + r.hold + r.exhale + r.rest;
      expect(period).toBeGreaterThanOrEqual(4);
      expect(period).toBeLessThanOrEqual(16);
    }
    expectRhythm(rhythmAtCalm(-1), rhythmAtCalm(0)); // clamps below 0
    expectRhythm(rhythmAtCalm(2), rhythmAtCalm(1)); // clamps above 1
  });
});

describe("PACES (the five named paces beside the lead)", () => {
  beforeEach(() => {
    localStorage.clear();
  });
  afterEach(() => {
    localStorage.clear();
  });

  const period = (r: Rhythm): number => r.inhale + r.hold + r.exhale + r.rest;

  it("offers five distinct paces", () => {
    expect(PACES).toHaveLength(5);
    expect(new Set(PACES.map((p) => p.id)).size).toBe(5);
  });

  it("each pace is a valid, persistable rhythm (round-trips through the store)", () => {
    for (const p of PACES) {
      saveRhythm(p.rhythm);
      expect(loadRhythm()).toEqual(p.rhythm); // passes isRhythm and reads back intact
    }
  });

  it("ladders from a light, quick breath to a slow, deep one (periods only grow)", () => {
    const periods = PACES.map((p) => period(p.rhythm));
    periods.slice(1).forEach((cur, idx) => {
      const prev = periods[idx]; // the period just before cur
      expect(prev).toBeDefined();
      if (prev !== undefined) expect(cur).toBeGreaterThan(prev);
    });
  });

  it("keeps the out-breath ≥ the in-breath at every rung (the calming lever)", () => {
    for (const p of PACES) {
      expect(p.rhythm.exhale).toBeGreaterThanOrEqual(p.rhythm.inhale);
    }
  });

  it("includes the lead's calm target as one of the paces", () => {
    expect(PACES.find((p) => p.id === "calm")?.rhythm).toEqual(DEFAULT_RHYTHM);
  });
});

describe("switchRestPlan (the pace-switch rest interlude, capped for comfort)", () => {
  it("from an active beat: a full contraction then the full ~3s hold", () => {
    const p = switchRestPlan(-1);
    expect(p.shrinkMs).toBe(SWITCH_SHRINK_MS);
    expect(p.holdMs).toBe(SWITCH_REST_HOLD_MS);
  });

  it("already at rest: no contraction, and only tops the pause up to the cap", () => {
    const fresh = switchRestPlan(0);
    expect(fresh.shrinkMs).toBe(0);
    expect(fresh.holdMs).toBe(SWITCH_REST_HOLD_MS);

    const half = switchRestPlan(1500);
    expect(half.shrinkMs).toBe(0);
    expect(half.holdMs).toBe(SWITCH_REST_HOLD_MS - 1500); // tops up, not a fresh hold
    expect(half.holdMs).toBeLessThan(fresh.holdMs);
  });

  it("never holds at empty past the cap — the breath-hold worry (already at rest counts)", () => {
    for (const rested of [0, 500, 1000, 2000, 2900, 3000, 5000]) {
      const p = switchRestPlan(rested);
      // total time held at empty = what was already paused + the topped-up hold
      const totalAtEmpty = Math.min(rested, SWITCH_REST_HOLD_MS) + p.holdMs;
      expect(totalAtEmpty).toBeLessThanOrEqual(SWITCH_REST_HOLD_MS);
    }
  });

  it("once past the cap, adds no further hold (just breathe in)", () => {
    expect(switchRestPlan(SWITCH_REST_HOLD_MS).holdMs).toBe(0);
    expect(switchRestPlan(9999).holdMs).toBe(0);
  });
});

describe("persistence (local only, §8)", () => {
  beforeEach(() => {
    localStorage.clear();
  });
  afterEach(() => {
    localStorage.clear();
  });

  it("returns null when nothing is saved", () => {
    expect(loadRhythm()).toBeNull();
  });

  it("round-trips a saved rhythm", () => {
    const r: Rhythm = { inhale: 3, hold: 1.5, exhale: 4.2, rest: 1 };
    saveRhythm(r);
    expect(loadRhythm()).toEqual(r);
  });

  it("forgets the rhythm on clear (back to default)", () => {
    saveRhythm({ inhale: 3, hold: 1.5, exhale: 4.2, rest: 1 });
    clearRhythm();
    expect(loadRhythm()).toBeNull();
  });

  it("ignores corrupt or implausible stored data", () => {
    localStorage.setItem("lt.breath", "not json at all");
    expect(loadRhythm()).toBeNull();
    localStorage.setItem("lt.breath", JSON.stringify({ inhale: 3 }));
    expect(loadRhythm()).toBeNull();
    localStorage.setItem(
      "lt.breath",
      JSON.stringify({ inhale: 99, hold: 99, exhale: 99, rest: 99 }),
    );
    expect(loadRhythm()).toBeNull(); // period out of the sane guard
  });
});

describe("the refined light (ebbs with time away, §1/§10)", () => {
  beforeEach(() => {
    localStorage.clear();
  });
  afterEach(() => {
    localStorage.clear();
  });

  it("a first visit starts from the faint ember", () => {
    expect(decayCharge(null, 1000)).toBe(BASE_CHARGE);
  });

  it("does not dim when no time has passed", () => {
    expect(decayCharge({ charge: 0.8, at: 1000 }, 1000)).toBeCloseTo(0.8, 5);
  });

  it("halves the lamp every ~2 days away", () => {
    const saved = { charge: 0.8, at: 0 };
    expect(decayCharge(saved, 2 * DAY)).toBeCloseTo(0.4, 5);
    expect(decayCharge(saved, 4 * DAY)).toBeCloseTo(0.2, 5);
  });

  it("never falls quite to black (a memory of the light remains)", () => {
    expect(decayCharge({ charge: 1, at: 0 }, 60 * DAY)).toBe(0.05);
  });

  it("each out-breath adds light, capped at full", () => {
    expect(addCharge(0.3)).toBeCloseTo(0.4, 5);
    expect(addCharge(0.95)).toBe(1);
  });

  it("round-trips a saved lamp, and ignores corrupt data", () => {
    saveLight(0.6, 1234);
    expect(loadLight()).toEqual({ charge: 0.6, at: 1234 });
    localStorage.setItem("lt.light", "not json");
    expect(loadLight()).toBeNull();
  });
});
