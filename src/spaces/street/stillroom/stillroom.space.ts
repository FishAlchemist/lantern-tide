/* ════════════════════════════════════════════════════════════════
   The stillroom (§1 / §3)  ── a shop on the street; its own chunk, fetched
   only after entering (§10) ──
   ────────────────────────────────────────────────────────────────
   The warmest room on the street (§7), and the one that makes the site's
   thesis a thing you do: "distil the weight of the deep into a flicker of
   steady light." A soft circle of warm light swells as you breathe in and
   settles as you breathe out, and the room warms with each out-breath.

   It leads, you follow — never a test. Rather than measuring you, it meets you
   at a moderate, easy-to-follow pace and eases the breath longer over the first
   minute, drawing you down toward a calm, longer-exhale rhythm; you can settle
   wherever it sits comfortably (your lungs, your call), and it remembers that,
   locally. The pace dial + its safe range live in ./breath.ts. No counts, no
   pass/fail, no setup chore: you're here to rest.

   §12: the slow scaling is the only vection risk — but the breath is this room's
   whole point and is gentle (a small, slow swell with no drift), so under reduced
   motion it still plays, just at a much smaller amplitude: an essential-but-gentle
   exception, like the front-door tide. The pace easing carries no extra motion,
   so it (and the "settle here" option) works in both modes. All copy lives in
   the locale bundles.
   ════════════════════════════════════════════════════════════════ */

import "../../_shared/spaces.css"; // .space base (fixed full-screen, fade-in); robust for deep links
import "./stillroom.css";
import { forceReflow, makeEl } from "../../../util/dom";
import { prefersReducedMotion } from "../../../state/session";
import { getMessages } from "../../../i18n/i18n";
import type { BreathPhase } from "../../../i18n/messages";
import {
  createSpaceRoot,
  fadeOutAndRemove,
  revealSpace,
  startParallax,
} from "../../_shared/scene";
import type { MountedSpace, SpaceContext } from "../../_shared/space-shell";
import {
  addCharge,
  clearRhythm,
  decayCharge,
  loadLight,
  loadRhythm,
  PACES,
  rhythmAtCalm,
  saveLight,
  saveRhythm,
  switchRestPlan,
  type Pace,
  type Rhythm,
} from "./breath";

// One beat of the running breath: how long, how far the circle scales, and how
// warm the room glows (low on the in-breath, full on the long out-breath).
interface Beat {
  key: BreathPhase;
  ms: number;
  scale: number;
  warm: number;
}

const SCALE_OPEN = 1.34; // the circle's size at the top of the breath
const GENTLE_PEAK = 1.06; // §12: a much smaller swell under reduced motion — still a breath, minimal vection
const WARM_IN = 0.34; // room warmth drawn down on the in-breath (cool deep)
const WARM_HOLD = 0.42;
const WARM_OUT = 1; // and bloomed on the out-breath (distilled to light)
const WARM_REST = 0.55;
const RAMP_STEP = 1 / 7; // each breath eases the pace one notch longer: ~7 breaths from the moderate start to the calm target
const METEOR_MS = 850; // a mote's unhurried drift from the water to the ring's edge
const METEOR_CADENCE_MS = 720; // a calm gap between motes — an unhurried trickle, not a rush
const METEOR_TAIL_MS = 250; // keep the last mote's flight clear of the in-breath's end
const RING_EDGE_FRAC = 0.4; // motes are taken in at the ring's edge, not all the way to the core

/** Turn a rhythm (seconds) into the running beat sequence. A zero hold or rest
 *  is dropped, so a quick breather doesn't get a 0-length beat flashing by. */
function buildCycle(r: Rhythm, peak: number): Beat[] {
  const beats: Beat[] = [
    { key: "inhale", ms: r.inhale * 1000, scale: peak, warm: WARM_IN },
  ];
  if (r.hold > 0) {
    beats.push({
      key: "hold",
      ms: r.hold * 1000,
      scale: peak,
      warm: WARM_HOLD,
    });
  }
  beats.push({ key: "exhale", ms: r.exhale * 1000, scale: 1, warm: WARM_OUT });
  if (r.rest > 0) {
    beats.push({ key: "rest", ms: r.rest * 1000, scale: 1, warm: WARM_REST });
  }
  return beats;
}

const SCENE_HTML = `
<div class="stillroom__warm"></div>
<div class="stillroom__layer stillroom__deep" style="--depth: 0.5"></div>
<div class="stillroom__layer stillroom__floor" style="--depth: 1.5">
  <div class="stillroom__ground"></div>
  <div class="stillroom__keeper"></div>
</div>`;

export default function mountStillroom(
  stage: HTMLElement,
  ctx: SpaceContext,
): MountedSpace {
  const reduced = prefersReducedMotion();
  // §12 exception: the breath plays in both modes, only gentler when reduced.
  const peak = reduced ? GENTLE_PEAK : SCALE_OPEN;
  const m = getMessages().stillroom;

  // The pace it leads you at. A returning visitor breathes at the pace they
  // settled on before; a fresh one is met at a moderate start and gently eased
  // slower (the ramp), free to settle wherever it sits comfortably.
  const savedRhythm = loadRhythm();
  let ramping = savedRhythm === null; // a fresh visit is led-and-slowed; a settled one isn't
  let calm = 0; // ramp progress 0..1 (only meaningful while ramping)
  let activeRhythm: Rhythm = savedRhythm ?? rhythmAtCalm(calm);

  // The refined light held in the steady core (§1): loaded at the brightness it
  // ebbed to while you were away in the tide, and topped up by each out-breath.
  let charge = decayCharge(loadLight(), Date.now());
  let lightDirty = false; // only persist (resetting the ebb clock) if you actually breathed
  const timers: number[] = [];
  let disposed = false; // guards async mote spawns scheduled before teardown

  const root = createSpaceRoot("stillroom", m.ariaLabel, "stillroom");

  const scene = document.createElement("div");
  scene.className = "stillroom__scene";
  scene.setAttribute("aria-hidden", "true");
  scene.innerHTML = SCENE_HTML; // static illustrative scene (no external input)
  const warm = scene.querySelector<HTMLElement>(".stillroom__warm");

  // Content: the breathing guide.
  const content = document.createElement("div");
  content.className = "stillroom__content";
  const label = makeEl("p", "stillroom__label", m.label);

  // The breathing circle: a scaling halo + ring around a steady core, with the
  // phase glyph held at a constant size in the middle.
  const guide = document.createElement("div");
  guide.className = "stillroom__guide";
  const breath = makeEl("div", "stillroom__breath");
  breath.setAttribute("aria-hidden", "true");
  breath.append(
    makeEl("span", "stillroom__halo"),
    makeEl("span", "stillroom__ring"),
  );
  const core = makeEl("span", "stillroom__core");
  core.setAttribute("aria-hidden", "true"); // the steady light (doesn't scale, §7)
  const word = makeEl("span", "stillroom__word");
  word.setAttribute("aria-hidden", "true"); // the cue below carries the live text for screen readers
  guide.append(breath, core, word);

  // The steady core holds the distilled light (charge 0..1): brighter and a
  // touch larger as it fills. Set before reveal so it arrives at its remembered
  // brightness as the space fades in (no jump).
  const applyCharge = (): void => {
    core.style.opacity = (0.25 + charge * 0.75).toFixed(3);
    // Grows with the gathered light — the furnace's ring widening as it fills
    // (§1): a touch more reach than the brightness so the "getting bigger" reads.
    core.style.transform = `scale(${(0.78 + charge * 0.62).toFixed(3)})`;
  };
  applyCharge();

  const cue = makeEl("p", "stillroom__cue");
  cue.setAttribute("aria-live", "polite"); // announce each beat as it swaps
  const lore = makeEl("p", "stillroom__lore", m.lore);
  const aside = makeEl("p", "stillroom__aside", m.keeper);
  const safety = makeEl("p", "stillroom__safety", m.safety);
  const notice = makeEl("p", "stillroom__notice", m.notice);
  content.append(label, guide, cue, lore, aside, safety, notice);

  // The pace controls, built here and shown below depending on where you are:
  //  · while it's still easing you slower → the "settle here" whisper + button,
  //  · once you've settled on a personal pace → the quiet reset.
  const settle = makeEl("div", "stillroom__settle");
  const settleHint = makeEl("p", "stillroom__settle-hint", m.settle.hint);
  const settleBtn = makeEl("button", "stillroom__settle-btn", m.settle.stay);
  settleBtn.setAttribute("type", "button");
  settle.append(settleHint, settleBtn);
  const reset = makeEl("button", "stillroom__reset", m.reset);
  reset.setAttribute("type", "button");

  // The optional pace menu: a quiet link beside the lead that opens a little row
  // of named paces. The lead is still the default path — this is just a shortcut
  // for someone who already knows the pace they want, so it stays collapsed and
  // out of the way (no setup gate). Works in both motion modes.
  const paces = makeEl("div", "stillroom__paces");
  const pacesToggle = makeEl("button", "stillroom__paces-toggle", m.paces.open);
  pacesToggle.setAttribute("type", "button");
  pacesToggle.setAttribute("aria-expanded", "false");
  const pacesList = makeEl("div", "stillroom__paces-list");
  pacesList.setAttribute("role", "group");
  pacesList.setAttribute("aria-label", m.paces.label);
  pacesList.hidden = true;

  // Light up whichever pace matches the one you're breathing now — but only once
  // you're on a fixed pace (while it's still easing you down, none is "the" one).
  const sameRhythm = (a: Rhythm, b: Rhythm): boolean =>
    a.inhale === b.inhale &&
    a.hold === b.hold &&
    a.exhale === b.exhale &&
    a.rest === b.rest;
  const markActivePace = (): void => {
    for (const el of pacesList.querySelectorAll<HTMLElement>(
      ".stillroom__pace",
    )) {
      const p = PACES.find((x) => x.id === el.dataset["pace"]);
      el.classList.toggle(
        "stillroom__pace--on",
        !ramping && p !== undefined && sameRhythm(p.rhythm, activeRhythm),
      );
    }
  };

  for (const p of PACES) {
    const btn = makeEl("button", "stillroom__pace", m.paces.names[p.id]);
    btn.setAttribute("type", "button");
    btn.dataset["pace"] = p.id;
    pacesList.append(btn);
  }
  paces.append(pacesToggle, pacesList);
  // (Pace buttons are wired up below, once the breath's restart is in scope.)

  // Navigation. "Set out again" carries the light you refined back into the
  // tide (§1 / §3 — the destination is a supply stop: you leave with the flicker
  // of light you distilled). Back-to-street and leaving both persist it.
  const navMsg = getMessages().nav;
  const navEl = makeEl("nav", "stillroom__nav");
  const back = makeEl("button", "stillroom__navlink", navMsg.backToStreet);
  back.addEventListener("click", () => {
    if (lightDirty) saveLight(charge, Date.now());
    ctx.goTo("street");
  });
  const leave = makeEl("button", "stillroom__navlink", navMsg.setOut);
  leave.addEventListener("click", () => {
    if (lightDirty) saveLight(charge, Date.now());
    // The refined light flares as you take it with you, then you set out.
    core.style.transition =
      "opacity 500ms var(--ease-tide), transform 500ms var(--ease-tide)";
    core.style.opacity = "1";
    core.style.transform = "scale(1.25)";
    const t = window.setTimeout(() => {
      ctx.leave();
    }, 520);
    timers.push(t);
  });
  navEl.append(back, leave);

  // An overlay above the content (below the nav) for the draw-in: motes of the
  // deep that streak up into the furnace on each in-breath, and the small ring of
  // light each one blooms as it's taken in. Kept out of the parallax layers so a
  // mote can be aimed at the core in plain viewport coordinates. The room only
  // ever fills it under full motion (§12).
  const meteors = makeEl("div", "stillroom__meteors");
  meteors.setAttribute("aria-hidden", "true");

  root.append(scene, content, meteors, navEl);
  revealSpace(stage, root);

  // ── The running breath ─────────────────────────────────────────────────────
  let phaseTimer = 0;
  let cycle = buildCycle(activeRhythm, peak);
  // The beat currently showing and when it started — so a pace switch can tell if
  // you're already paused at rest (and for how long), and cap the held "歇" so it
  // never stacks into an uncomfortable breath-hold.
  let currentBeatKey: BreathPhase | null = null;
  let beatStartedAt = 0;
  // The in-breath's pending mote spawns, kept apart so a pace switch can cancel
  // them — otherwise motes queued during the old in-breath would fly in during
  // the settle pause (on the "rest" beat, never the in-breath).
  const meteorTimers: number[] = [];
  const clearMeteorTimers = (): void => {
    for (const t of meteorTimers) clearTimeout(t);
    meteorTimers.length = 0;
  };

  const applyBeat = (b: Beat): void => {
    const ms = `${String(Math.round(b.ms))}ms`;
    breath.style.transition = ""; // fall back to the CSS transition (ease-tide)
    // !important so the slow per-beat duration survives the reduced-motion
    // blanket in style.css (which forces transition-duration to --dur-base):
    // the breath is a §12 essential-but-gentle exception, so it must stay smooth.
    breath.style.setProperty("transition-duration", ms, "important");
    breath.style.transform = `scale(${String(b.scale)})`;
    if (warm !== null) {
      warm.style.setProperty("transition-duration", ms, "important");
      warm.style.opacity = b.warm.toFixed(2);
    }
    const beat = m.phases[b.key];
    word.textContent = beat.word;
    cue.textContent = beat.cue;
    currentBeatKey = b.key;
    beatStartedAt = performance.now();
  };

  // ── The draw-in (§1 "the weight of the deep, drawn in") ─────────────────────
  // On each in-breath a few motes rise out of the water and fly into the furnace
  // — the cue's "draw the deep in", made a thing you can see — and each one
  // reaches the ring's edge and simply vanishes (no burst). They run on every
  // in-breath. Transform/opacity only (§6); spawned only in full motion, none
  // under reduced (§12).
  const spawnMeteor = (): void => {
    if (disposed) return;
    // The breathing circle's centre + a point on its edge (the ring lives in the
    // guide; measured fresh so it stays right across responsive layouts). A mote
    // is taken in when it reaches the edge facing it — it needn't reach the core.
    const g = guide.getBoundingClientRect();
    const cx = g.left + g.width / 2;
    const cy = g.top + g.height / 2;
    const radius = g.width * RING_EDGE_FRAC;
    // Start low, out of the water, across a wide band so the motes converge.
    const sx = window.innerWidth * (0.28 + Math.random() * 0.44);
    const sy = window.innerHeight * (0.82 + Math.random() * 0.12);
    let ux = sx - cx;
    let uy = sy - cy;
    const len = Math.hypot(ux, uy) || 1; // unit vector from the centre toward the mote
    ux /= len;
    uy /= len;
    const ex = cx + ux * radius; // the point on the ring's edge facing the mote
    const ey = cy + uy * radius;
    const dx = ex - sx;
    const dy = ey - sy;
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI; // orient the streak along its flight
    const meteor = makeEl("span", "stillroom__meteor");
    meteor.style.left = `${sx.toFixed(1)}px`;
    meteor.style.top = `${sy.toFixed(1)}px`;
    meteor.style.setProperty("--dx", `${dx.toFixed(1)}px`);
    meteor.style.setProperty("--dy", `${dy.toFixed(1)}px`);
    meteor.style.setProperty("--angle", `${angle.toFixed(1)}deg`);
    meteor.style.animationDuration = `${String(METEOR_MS)}ms`;
    meteor.addEventListener("animationend", () => {
      meteor.remove(); // reaches the ring's edge and simply vanishes — no burst
    });
    meteors.appendChild(meteor);
  };

  // Called at the top of every in-breath: a steady stream across the whole
  // in-breath, so the ring is fed the entire time it swells — the motes draw in
  // and the ring grows with them, rather than a single front burst. The last
  // mote is timed so its flight finishes within the in-breath (nothing lingers up
  // into the hold / out-breath). Runs every in-breath (full motion); none under
  // reduced motion (§12).
  const drawInMeteors = (inhaleMs: number): void => {
    if (reduced) return;
    const last = Math.max(0, inhaleMs - METEOR_MS - METEOR_TAIL_MS);
    for (let at = 0; at <= last; at += METEOR_CADENCE_MS) {
      meteorTimers.push(window.setTimeout(spawnMeteor, at));
    }
  };

  // One whole breath distils a little light into the core (§1). Credited only on
  // a *complete* cycle — a breath interrupted partway (leaving, switching pace)
  // leaves nothing — and written in one step, so the saved record is atomic.
  const distill = (): void => {
    charge = addCharge(charge);
    lightDirty = true;
    applyCharge();
    saveLight(charge, Date.now());
  };

  // Each completed breath, while it's still leading you down, eases the pace one
  // notch longer toward the calm target. You can settle anywhere along the way;
  // if you never do, it eases all the way to the calm target and stays there.
  const advanceRamp = (): void => {
    if (!ramping) return;
    calm = Math.min(1, calm + RAMP_STEP);
    activeRhythm = rhythmAtCalm(calm);
    if (calm >= 1) {
      ramping = false; // reached the calm target on its own — no personal pace to keep
      settle.remove();
      markActivePace(); // the lead lands on the calm pace — light it in the menu
    }
  };

  const runPhase = (i: number): void => {
    const b = cycle[i];
    if (b === undefined) return;
    applyBeat(b);
    if (b.key === "inhale") drawInMeteors(b.ms); // motes rise as you draw the deep in
    const breathComplete = i === cycle.length - 1; // the last beat closes a whole breath
    phaseTimer = window.setTimeout(() => {
      if (breathComplete) {
        distill();
        advanceRamp();
        cycle = buildCycle(activeRhythm, peak); // the next breath, at the eased pace
        runPhase(0);
      } else {
        runPhase(i + 1);
      }
    }, b.ms);
  };

  const stopBreath = (): void => {
    if (phaseTimer !== 0) {
      clearTimeout(phaseTimer);
      phaseTimer = 0;
    }
  };

  const startBreath = (): void => {
    cycle = buildCycle(activeRhythm, peak);
    forceReflow(breath); // so the first scale change actually transitions (not batched)
    runPhase(0);
  };

  // Switching pace shouldn't lurch mid-breath. Whatever size the ring is at, it
  // first contracts fluidly to its smallest (the exhaled rest), holds there on the
  // "rest" beat (歇) a moment, and only then begins the new rhythm on a fresh
  // in-breath. The held part is capped so it never becomes an uncomfortable
  // breath-hold: if you switch while already paused at rest, the time already
  // spent there counts toward the cap (and the contraction is skipped — you're
  // already small), so the total at empty stays within the cap. Used by picking a
  // pace and by the reset.
  const restartBreath = (): void => {
    stopBreath();
    clearMeteorTimers(); // no motes during the pause — they belong to the in-breath
    const restedMs =
      currentBeatKey === "rest" ? performance.now() - beatStartedAt : -1;
    const { shrinkMs, holdMs } = switchRestPlan(restedMs);
    applyBeat({ key: "rest", ms: shrinkMs, scale: 1, warm: WARM_REST });
    phaseTimer = window.setTimeout(startBreath, shrinkMs + holdMs);
  };

  // The breath runs in both modes — gently under reduced motion (§12 exception).
  startBreath();
  // Personalisation works in both modes (the pace easing carries no extra
  // motion): while it's leading you slower, offer "settle here" near the breath;
  // if you arrived with a pace you'd settled on before, offer the reset instead.
  content.insertBefore(ramping ? settle : reset, safety);
  // The optional pace menu sits at the very bottom — below the comfort note and
  // the standing disclaimer — so opening it never pushes the notice out of view
  // (the disclaimer stays put and readable; the lead stays the default path).
  content.append(paces);
  markActivePace();

  // ── The pace controls ──────────────────────────────────────────────────────
  // The pace menu opens and closes on its quiet link (collapsed by default).
  pacesToggle.addEventListener("click", () => {
    const open = pacesList.hidden;
    pacesList.hidden = !open;
    pacesToggle.setAttribute("aria-expanded", String(open));
  });

  // Jump to a chosen pace: stop being led, keep it (saved, atomic), show the
  // reset, and hand the breath over cleanly — settle back to rest, hold a beat,
  // then begin the new pace on a fresh in-breath (no mid-breath lurch).
  const pickPace = (p: Pace): void => {
    ramping = false;
    activeRhythm = p.rhythm;
    saveRhythm(activeRhythm);
    settle.remove();
    if (!content.contains(reset)) content.insertBefore(reset, safety);
    pacesList.hidden = true;
    pacesToggle.setAttribute("aria-expanded", "false");
    markActivePace();
    restartBreath();
  };
  for (const el of pacesList.querySelectorAll<HTMLElement>(
    ".stillroom__pace",
  )) {
    const p = PACES.find((x) => x.id === el.dataset["pace"]);
    if (p === undefined) continue;
    el.addEventListener("click", () => {
      pickPace(p);
    });
  }

  // "Keep this pace": stop easing and settle here, remembered. The whisper gives
  // way to the quiet reset (now there's a personal pace to forget). Saved in one
  // step — the record is atomic.
  settleBtn.addEventListener("click", () => {
    if (!ramping) return;
    ramping = false;
    saveRhythm(activeRhythm);
    settle.remove();
    if (!content.contains(reset)) content.insertBefore(reset, safety);
    markActivePace();
  });

  // "Back to the usual pace": forget the settled pace and be led from the
  // moderate start again — you can settle somewhere new, or just let it ease you
  // all the way down. Hands over the same clean way (settle to rest, a beat, then
  // the first led in-breath).
  reset.addEventListener("click", () => {
    clearRhythm();
    reset.remove();
    ramping = true;
    calm = 0;
    activeRhythm = rhythmAtCalm(calm);
    if (!content.contains(settle)) content.insertBefore(settle, safety);
    markActivePace();
    restartBreath();
  });

  // (The only motes that rise are the breath's draw-in, above — they appear on
  // the in-breath and are taken into the ring, so nothing drifts up between
  // breaths to read as a stray, un-absorbed mote.)

  // ── Parallax: the floor and the keeper drift gently with the gaze; the warm
  //    light and the breathing circle stay put (§7). §12 reduced motion: none. ──
  const stopParallax = reduced
    ? null
    : startParallax(scene, {
        pointerX: 6,
        pointerY: 4,
        driftX: 2.5,
        driftY: 1.6,
        freqX: 0.13,
        freqY: 0.1,
        lerp: 0.05,
      });

  return {
    root,
    dispose: (): void => {
      disposed = true;
      stopParallax?.();
      stopBreath();
      clearMeteorTimers();
      if (lightDirty) saveLight(charge, Date.now());
      for (const t of timers) clearTimeout(t);
      meteors.replaceChildren(); // drop any motes / rings still mid-flight
      fadeOutAndRemove(root);
    },
  };
}
