/* ════════════════════════════════════════════════════════════════
   The stillroom's breathing rhythm — the testable core
   ────────────────────────────────────────────────────────────────
   The room leads, you follow. One `calm` dial (0..1) eases the breath from a
   moderate start to a calm target; you settle wherever it suits you, and that's
   remembered. Kept apart from the DOM so the dial and the persistence can be
   unit-tested.

   The numbers are distilled from the research the design rests on — a relaxing
   pace sits near 5–6 breaths/min (period ~10–12s); a gently longer exhale aids
   subjective calm. So the dial meets you at a slightly quicker, easy-to-follow
   pace and draws you down toward that calm shape, the out-breath the longer one
   the whole way. This is a quiet companion, not a medical tool: no sensors, no
   diagnosis, no claims — just a comfortable pace to breathe with.
   ════════════════════════════════════════════════════════════════ */

import { store } from "../../../platform/adapter";
import type { PaceId } from "../../../i18n/messages";

/** A breathing rhythm to follow, in seconds. */
export interface Rhythm {
  inhale: number;
  hold: number;
  exhale: number;
  rest: number;
}

/* ── The lead-you-slower pace dial (a guide, never a test) ─────────────────────
   The stillroom leads, you follow. Rather than measuring you, it meets you at a
   moderate, easy-to-follow pace and eases the breath longer over the first
   minute — drawing you down toward the calm target — and you can settle wherever
   it sits comfortably (your lungs, your call). One dial, `calm` 0..1, spans it:

     calm 0  → START_RHYTHM   a moderate pace that meets a slightly-quick breath
     calm 1  → DEFAULT_RHYTHM  the calm target (~5 breaths/min, a longer exhale)

   Both ends sit inside the relaxing band and keep the out-breath ≥1.4× the
   in-breath (the calming lever) the whole way, so *every* point along the dial is
   safe — no per-breath measuring, clamping, or "did I do it right". */

// The moderate starting pace (~7 breaths/min): easy to fall in with when you
// arrive a little quick, the out-breath already the longer one.
const START_RHYTHM: Rhythm = { inhale: 3, hold: 0, exhale: 4.2, rest: 1 };

// The calm target (~5 breaths/min): where the lead eases to if you just let it.
export const DEFAULT_RHYTHM: Rhythm = {
  inhale: 4,
  hold: 1,
  exhale: 6,
  rest: 1,
};

const STORE_KEY = "lt.breath";

function round1(x: number): number {
  return Math.round(x * 10) / 10;
}

function clampNum(x: number, lo: number, hi: number): number {
  return Math.min(Math.max(x, lo), hi);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** The rhythm at a point along the lead-you-slower dial (calm 0..1): a straight
 *  ease from the moderate start to the calm target. Monotonic — it only ever
 *  lengthens toward calm — and safe at every point (endpoints in-band, exhale
 *  stays ≥1.4× the inhale throughout). */
export function rhythmAtCalm(calm: number): Rhythm {
  const c = clampNum(calm, 0, 1);
  return {
    inhale: round1(lerp(START_RHYTHM.inhale, DEFAULT_RHYTHM.inhale, c)),
    hold: round1(lerp(START_RHYTHM.hold, DEFAULT_RHYTHM.hold, c)),
    exhale: round1(lerp(START_RHYTHM.exhale, DEFAULT_RHYTHM.exhale, c)),
    rest: DEFAULT_RHYTHM.rest, // a steady one-beat rest at both ends
  };
}

/* ── The five named paces (the lead is still the default; these are a shortcut) ─
   A small menu beside the lead, for someone who already knows what suits them.
   They ladder from a light, quick breath to a slow, deep one — covering where
   most people sit; anyone outside just lets the room lead and settles (their own
   custom pace). The out-breath is never shorter than the in-breath at any rung
   (the calming lever holds). The lineage is only noted here, for the developer —
   the room shows warm names, never the jargon. */

/** A pace you can jump straight to: a stable key (its warm name lives in the
 *  locale bundle) and the rhythm it sets. */
export interface Pace {
  id: PaceId;
  rhythm: Rhythm;
}

export const PACES: readonly Pace[] = [
  // a light, quick breath — least effort, smallest lungs, or just-arrived
  { id: "gentle", rhythm: { inhale: 3, hold: 0, exhale: 4, rest: 1 } }, // ~7.5/min
  // an even in and out — the calm resonance most people settle near
  { id: "coherent", rhythm: { inhale: 5, hold: 0, exhale: 5, rest: 0 } }, // 6/min
  // a longer out-breath — the lead's own calm target
  { id: "calm", rhythm: DEFAULT_RHYTHM }, // 5/min
  // an even square with held beats — steady, a touch more structure
  { id: "box", rhythm: { inhale: 4, hold: 4, exhale: 4, rest: 4 } }, // 3.75/min
  // a long hold and a long release — the slowest, for winding right down
  { id: "deep", rhythm: { inhale: 4, hold: 7, exhale: 8, rest: 0 } }, // ~3.2/min
];

/* ── Switching pace: the rest interlude (kept short enough to stay comfortable) ──
   On a switch the ring first contracts fluidly to its smallest, then holds at the
   empty-lung rest ("歇") a moment before the new in-breath. That held part is the
   only breath-hold, so it's capped: a switch made *while already at rest* tops the
   pause up to the cap rather than stacking a fresh full hold on top of the one in
   progress — so the time held at empty never runs past the cap (a longer hold is
   an uncomfortable breath-hold). The shrink is breathing out, not a hold, so it
   sits outside the cap. */
export const SWITCH_SHRINK_MS = 1000; // the fluid contraction to the smallest (a gentle exhale-down)
export const SWITCH_REST_HOLD_MS = 3000; // the empty-lung hold ("歇"): the comfort cap on the breath-hold

/** Plan a pace-switch interlude, in ms. `restedMs` is how long the breath has
 *  already been paused at the empty rest, or a negative value if it wasn't at
 *  rest (an active beat). From an active beat: a full contraction then the full
 *  hold. Already at rest: no contraction, and the hold is only what's left to
 *  reach the cap — so the *total* time at empty stays within SWITCH_REST_HOLD_MS. */
export function switchRestPlan(restedMs: number): {
  shrinkMs: number;
  holdMs: number;
} {
  if (restedMs < 0) {
    return { shrinkMs: SWITCH_SHRINK_MS, holdMs: SWITCH_REST_HOLD_MS };
  }
  const already = clampNum(restedMs, 0, SWITCH_REST_HOLD_MS);
  return { shrinkMs: 0, holdMs: SWITCH_REST_HOLD_MS - already };
}

function isRhythm(value: unknown): value is Rhythm {
  if (typeof value !== "object" || value === null) return false;
  const r = value as Record<string, unknown>;
  const fields = [r["inhale"], r["hold"], r["exhale"], r["rest"]];
  if (
    !fields.every((n) => typeof n === "number" && Number.isFinite(n) && n >= 0)
  ) {
    return false;
  }
  const period =
    (r["inhale"] as number) +
    (r["hold"] as number) +
    (r["exhale"] as number) +
    (r["rest"] as number);
  return period >= 4 && period <= 30; // sane guard against corrupt data
}

/** Read the saved personal rhythm, or null if none / unreadable. */
export function loadRhythm(): Rhythm | null {
  const raw = store().get(STORE_KEY);
  if (raw === null || raw.length === 0) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isRhythm(parsed)) return null;
    return {
      inhale: parsed.inhale,
      hold: parsed.hold,
      exhale: parsed.exhale,
      rest: parsed.rest,
    };
  } catch {
    return null;
  }
}

/** Persist the personal rhythm (local only — single machine, §8). */
export function saveRhythm(r: Rhythm): void {
  store().set(STORE_KEY, JSON.stringify({ v: 1, ...r }));
}

/** Forget the personal rhythm (back to the default). The Store has no delete,
 *  so an empty value is written and read back as "none". */
export function clearRhythm(): void {
  store().set(STORE_KEY, "");
}

/* ── The refined light (§1 "distil the deep into a flicker of steady light") ──
   Each out-breath distils a little light that stays in the steady core. It
   persists locally and ebbs with time away — the tide has its rise and fall, so
   the lamp dims while you're out in it, and you breathe it back up on return
   (§10's "return breathes with how long you were away", carried into the light).
   charge is 0..1; a fresh visitor starts from a faint ember. */

/** A remembered lamp: how bright (0..1), and when it was last refined (ms). */
export interface LightState {
  charge: number;
  at: number;
}

/** A first-ever visitor's faint starting ember (a spark in the cold deep). */
export const BASE_CHARGE = 0.12;
const MIN_CHARGE = 0.05; // never quite black — a memory of the light remains
const CHARGE_STEP = 0.1; // how much one out-breath distils
const HALF_LIFE_MS = 2 * 24 * 60 * 60 * 1000; // the lamp halves every ~2 days away

const LIGHT_KEY = "lt.light";

/** The lamp's brightness on arrival: the saved charge, dimmed by the time away
 *  (exponential half-life), or the faint ember for a first visit. Pure (now is
 *  passed in) so the ebb is testable. */
export function decayCharge(saved: LightState | null, now: number): number {
  if (saved === null) return BASE_CHARGE;
  const dt = Math.max(0, now - saved.at);
  const decayed = saved.charge * Math.pow(0.5, dt / HALF_LIFE_MS);
  return clampNum(decayed, MIN_CHARGE, 1);
}

/** One out-breath's worth of distilled light, added to the steady core. */
export function addCharge(charge: number): number {
  return clampNum(charge + CHARGE_STEP, MIN_CHARGE, 1);
}

function isLight(value: unknown): value is LightState {
  if (typeof value !== "object" || value === null) return false;
  const l = value as Record<string, unknown>;
  return (
    typeof l["charge"] === "number" &&
    Number.isFinite(l["charge"]) &&
    l["charge"] >= 0 &&
    l["charge"] <= 1.5 &&
    typeof l["at"] === "number" &&
    Number.isFinite(l["at"]) &&
    l["at"] >= 0
  );
}

/** Read the remembered lamp, or null if none / unreadable. */
export function loadLight(): LightState | null {
  const raw = store().get(LIGHT_KEY);
  if (raw === null || raw.length === 0) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isLight(parsed)) return null;
    return { charge: parsed.charge, at: parsed.at };
  } catch {
    return null;
  }
}

/** Persist the lamp's brightness and the moment it was refined (local only). */
export function saveLight(charge: number, now: number): void {
  store().set(LIGHT_KEY, JSON.stringify({ v: 1, charge, at: now }));
}
