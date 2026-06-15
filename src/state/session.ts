/* ════════════════════════════════════════════════════════════════
   Entrance state machine (§10 guard the entrance / human-first)
   ────────────────────────────────────────────────────────────────
   The goal (§10) isn't to lock content away. It is ① not to be a robot's
   data source, and ② that everyone arrives through the front door, not
   parachuting in midway.

   Two kinds of state:
     · persistent (adapter, §8): visited / lastVisit / lastSpace
     · in-memory for this run: enteredThisSession — true only after the
       entrance sequence is complete
   Key (§10): content for any namespace is fetched only after
   enteredThisSession is true. A cold parachute / a crawler that doesn't run
   JS → always false → the content chunk is never fetched (not visually
   hidden — it simply doesn't happen).
   ════════════════════════════════════════════════════════════════ */

import { store } from "../platform/adapter";

const KEY_VISITED = "lt.visited";
const KEY_LAST_VISIT = "lt.lastVisit";
const KEY_LAST_SPACE = "lt.lastSpace";

/** In-memory flag for this run. Deliberately not persisted — a reload / new
 *  tab resets it, forcing each session through at least one (shortened) entrance. */
let enteredThisSession = false;

export function hasEnteredThisSession(): boolean {
  return enteredThisSession;
}

/** Called when the entrance sequence completes. Before this, no content chunk
 *  should be fetched. */
export function markEntered(now: number, space?: string): void {
  enteredThisSession = true;
  const s = store();
  s.set(KEY_VISITED, "1");
  s.set(KEY_LAST_VISIT, String(now));
  if (space !== undefined) s.set(KEY_LAST_SPACE, space);
}

export function isReturningVisitor(): boolean {
  return store().get(KEY_VISITED) === "1";
}

/** How long since the last visit (ms). Used to decide the "breath" of the
 *  return entrance (§10). */
export function timeSinceLastVisit(now: number): number | null {
  const raw = store().get(KEY_LAST_VISIT);
  if (raw === null) return null;
  const last = Number(raw);
  if (!Number.isFinite(last)) return null;
  return Math.max(0, now - last);
}

export function lastSpace(): string | null {
  return store().get(KEY_LAST_SPACE);
}

/** Whether reduced motion is preferred (§12). Factored out so tests can swap it.
 *  Priority: an explicit page-wide choice wins — "full" (detailed, set by the
 *  motion toggle or by pressing "Enter") always plays; "reduced" (simple, set by
 *  the toggle) always calms. With no explicit choice, follow the OS setting. */
export function prefersReducedMotion(): boolean {
  const motion = document.documentElement.dataset["motion"];
  if (motion === "full") return false;
  if (motion === "reduced") return true;
  return matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* ── Motion preference (§12): a remembered, page-wide "detailed ⇄ simple" choice
   that overrides the OS setting. Stored locally and reflected on <html
   data-motion>, so this module and the CSS read one source of truth. Only the
   toggle and "Enter" (an explicit opt into the full experience) set it; "Skip"
   stays neutral, leaving the remembered choice (or the OS) untouched. ── */
const KEY_MOTION = "lt.motion";
export type MotionPref = "full" | "reduced";

/** The remembered motion choice, or null if none yet (→ follow the OS). */
export function loadMotionPref(): MotionPref | null {
  const v = store().get(KEY_MOTION);
  return v === "full" || v === "reduced" ? v : null;
}

/** Remember a motion choice and apply it at once (sets <html data-motion>). */
export function setMotionPref(pref: MotionPref): void {
  store().set(KEY_MOTION, pref);
  document.documentElement.dataset["motion"] = pref;
}

/** On boot: re-apply the remembered choice (if any) before anything renders. */
export function applyStoredMotion(): void {
  const pref = loadMotionPref();
  if (pref !== null) document.documentElement.dataset["motion"] = pref;
}

/* ── Entrance-variant decision (§10 shortened return entrance) ─────────────
   First time = "arrival" (full tunnel); coming back = "return" (only the last
   beat), breathing with how long you were away. */
export type EntranceVariant =
  | "full" /* first time: full tunnel (~1.2–1.5s) */
  | "threshold-soft" /* back within hours: near-instant soft fade (~0.4s) */
  | "threshold-warm" /* after days: the threshold light returns a little */
  | "instant"; /* prefers-reduced-motion: always instant fade, no movement (§12) */

const HOURS = 60 * 60 * 1000;
const DAYS = 24 * HOURS;

// Tunable feel: the time thresholds (4h / 7d) are placeholder numbers, to be
// adjusted once the rhythm of the experience is felt.
const SOFT_WITHIN = 4 * HOURS; // within hours → near-instant
const WARM_WITHIN = 7 * DAYS; // within days → the threshold light returns a bit

export function decideEntrance(now: number): EntranceVariant {
  if (prefersReducedMotion()) return "instant"; // §12 instant fade, no movement
  if (!isReturningVisitor()) return "full"; // first time → full tunnel

  const since = timeSinceLastVisit(now);
  if (since === null) return "full";
  if (since < SOFT_WITHIN) return "threshold-soft";
  if (since < WARM_WITHIN) return "threshold-warm";
  return "full"; // long absence → treat as a fresh arrival
}
