/* ════════════════════════════════════════════════════════════════
   The lookout (§1 / §3)  ── a shop on the street; its own chunk,
   fetched only after entering (§10) ──
   ────────────────────────────────────────────────────────────────
   A stargazing terrace under the night sky: the terrace sits dead centre —
   stepped stone on high ground, an ever-burning lamp atop it, a few small
   folk standing on the deck watching the stars; a lit-window village in the
   distance, and now and then a meteor streaks past. By the fire someone
   slowly tells "the legend of the lookout" (an original myth, so public
   domain) — about this very lamp, this terrace, and the north-pointing star —
   tying back to the site's name (Lantern Tide) and the §3 loop (the tide ebbs
   and flows, but always returns).
   ════════════════════════════════════════════════════════════════ */

import "../../_shared/spaces.css"; // .space base (fixed full-screen, fade-in); robust for deep links
import "./lookout.css";
import { makeEl } from "../../../util/dom";
import { prefersReducedMotion } from "../../../state/session";
import { getMessages } from "../../../i18n/i18n";
import {
  buildBackNav,
  createSpaceRoot,
  fadeOutAndRemove,
  revealSpace,
  scatterStars,
  startParallax,
} from "../../_shared/scene";
import type { MountedSpace, SpaceContext } from "../../_shared/space-shell";

// The legend of the lookout is in the locale bundles (lookout.story): an
// original myth — the girl who lit the lamp → the first lookout → she becomes
// the north-pointing star → the tide learned from her, and always returns.

// The small folk standing on the deck (silhouettes): left%, scale, sway phase.
const FOLK: readonly { left: number; scale: number; delay: number }[] = [
  { left: 39, scale: 0.92, delay: 0 },
  { left: 46, scale: 1.04, delay: 0.7 },
  { left: 56, scale: 1, delay: 0.3 },
  { left: 62, scale: 0.86, delay: 1.1 },
];

// The scene follows the legend: each beat maps to a {lamp / north star / warmth}
// state (0–1), cross-faded smoothly by CSS (§12 reduced motion: instant swap).
// Aligned to the 12 STORY beats above: the nameless cold island → the girl
// lights a lamp, holds it higher → the terrace is built, the lamp never dies →
// the flame becomes the north star → the tide returns, ships come home by lamp
// and star → the lamp burns on for you (the whole scene warms).
const STATES: readonly { lamp: number; star: number; warm: number }[] = [
  { lamp: 0.16, star: 0, warm: 0.25 }, // 0 nameless island, cold and dark
  { lamp: 0.6, star: 0, warm: 0.3 }, // 1 the girl keeps a lamp
  { lamp: 0.5, star: 0, warm: 0.32 }, // 2 some laugh at her (lamp still small)
  { lamp: 0.85, star: 0, warm: 0.4 }, // 3 holds the lamp higher
  { lamp: 0.92, star: 0, warm: 0.46 }, // 4 villagers build the terrace
  { lamp: 1, star: 0, warm: 0.52 }, // 5 the first lookout, lamp never dies
  { lamp: 0.72, star: 1, warm: 0.56 }, // 6 the flame becomes the north star
  { lamp: 0.85, star: 1, warm: 0.62 }, // 7 ships know that star
  { lamp: 0.85, star: 0.95, warm: 0.72 }, // 8 the tide always returns
  { lamp: 0.8, star: 0.95, warm: 0.72 }, // 9 putting to sea is a voyage
  { lamp: 1, star: 1, warm: 0.86 }, // 10 by lamp and star, the tide brings you home
  { lamp: 1, star: 1, warm: 1 }, // 11 the lamp burns on for you
];

const SCENE_HTML = `
<div class="lookout__sky"></div>
<div class="lookout__horizon"></div>
<div class="lookout__moon"></div>
<div class="lookout__sea"></div>`;

// The lookout itself: three stone tiers + railing + the ever-burning lamp.
const TERRACE_HTML = `
<div class="lookout__tier lookout__tier--1"></div>
<div class="lookout__tier lookout__tier--2"></div>
<div class="lookout__tier lookout__tier--3"></div>
<div class="lookout__railing"></div>
<div class="lookout__lamp">
  <div class="lookout__lamp-pole"></div>
  <div class="lookout__lamp-light"></div>
</div>`;

function makeLayer(extra: string, depth: number): HTMLDivElement {
  const el = document.createElement("div");
  el.className = `lookout__layer ${extra}`;
  el.style.setProperty("--depth", depth.toFixed(2));
  return el;
}

// One meteor: fixed direction (matching the CSS --dx/--dy), only the start
// point, length and speed are random.
function spawnMeteor(container: HTMLElement): void {
  const m = document.createElement("div");
  m.className = "lookout__meteor";
  m.style.left = `${(Math.random() * 64).toFixed(2)}%`;
  m.style.top = `${(Math.random() * 34).toFixed(2)}%`;
  m.style.setProperty("--len", `${(110 + Math.random() * 130).toFixed(0)}px`);
  m.style.animationDuration = `${(1.3 + Math.random() * 0.6).toFixed(2)}s`;
  m.addEventListener("animationend", () => {
    m.remove();
  });
  container.appendChild(m);
}

export default function mountLookout(
  stage: HTMLElement,
  ctx: SpaceContext,
): MountedSpace {
  const reduced = prefersReducedMotion();
  const m = getMessages().lookout;
  const STORY = m.story;

  const root = createSpaceRoot("lookout", m.ariaLabel, "lookout");

  const scene = document.createElement("div");
  scene.className = "lookout__scene";
  scene.setAttribute("aria-hidden", "true");
  scene.innerHTML = SCENE_HTML; // static night scene (no external input)

  // Starfield: scatter points into the farther parallax layer (kept above the
  // terrace + village by topMax).
  const stars = makeLayer("lookout__stars", 0.4);
  scatterStars(stars, {
    count: 80,
    starClass: "lookout__star",
    topMax: 54,
    sizeRange: 1.7,
  });
  // The north-pointing star (the girl, in the legend): brighter, larger, due
  // north (top centre).
  const north = makeEl("span", "lookout__star lookout__star--north", "");
  north.style.left = "49.5%";
  north.style.top = "8%";
  stars.appendChild(north);
  scene.appendChild(stars);

  // Container the meteors fall from (spawned here, removed when the streak ends).
  const meteors = makeLayer("lookout__meteors", 0.5);
  scene.appendChild(meteors);

  // The lit-window village (midground, on the far edge of the foreground).
  const village = makeLayer("lookout__village", 0.9);
  const houseCount = 6;
  for (let i = 0; i < houseCount; i++) {
    const h = document.createElement("div");
    h.className = "lookout__house";
    h.style.setProperty("--w", `${(1.5 + Math.random() * 1).toFixed(2)}rem`);
    h.style.setProperty("--h", `${(1 + Math.random() * 0.8).toFixed(2)}rem`);
    h.style.setProperty(
      "--roof",
      `${(0.5 + Math.random() * 0.28).toFixed(2)}rem`,
    );
    // The village sits left, leaving the centre to the lookout ("the village
    // beside it").
    const left = 8 + (i * 30) / (houseCount - 1) + (Math.random() * 3 - 1.5);
    h.style.left = `${left.toFixed(2)}%`;
    h.style.setProperty("--wd", `${(2.6 + Math.random() * 2.4).toFixed(2)}s`);
    village.appendChild(h);
  }
  scene.appendChild(village);

  // Foreground: high ground, the lookout itself, the folk on the deck.
  const fg = makeLayer("lookout__foreground", 1.6);
  fg.appendChild(makeEl("div", "lookout__ground", ""));
  const terrace = makeEl("div", "lookout__terrace", "");
  terrace.innerHTML = TERRACE_HTML;
  fg.appendChild(terrace);
  for (const f of FOLK) {
    const fig = document.createElement("div");
    fig.className = "lookout__folk";
    fig.style.left = `${f.left.toFixed(2)}%`;
    fig.style.setProperty("--s", f.scale.toFixed(2));
    fig.style.animationDelay = `${f.delay.toFixed(2)}s`;
    fg.appendChild(fig);
  }
  scene.appendChild(fg);

  // Content: the legend, told slowly by the fire.
  const content = document.createElement("div");
  content.className = "lookout__content";
  const label = makeEl("p", "lookout__label", m.label);
  const title = makeEl("h2", "lookout__title", m.title);
  const story = makeEl("p", "lookout__story", STORY[0] ?? "");
  story.setAttribute("aria-live", "polite"); // announce each beat as it swaps
  // The advance affordance is a real <button>, so keyboard and screen-reader
  // users can move the legend on — not only pointer taps on the scene (§12 a11y).
  const hint = makeEl("button", "lookout__hint", m.hint);
  hint.setAttribute("type", "button");
  content.append(label, title, story, hint);

  // Navigation.
  const nav = buildBackNav(ctx, "lookout");

  // Write a beat's scene state onto the scene (CSS vars, cross-faded smoothly).
  const applyState = (i: number): void => {
    const s = STATES[i];
    if (s === undefined) return;
    scene.style.setProperty("--lamp-on", s.lamp.toFixed(2));
    scene.style.setProperty("--star-on", s.star.toFixed(2));
    scene.style.setProperty("--warm-on", s.warm.toFixed(2));
  };
  applyState(0); // beat 0's state on entry (set before mounting → no enter fade)

  root.append(scene, content, nav);
  revealSpace(stage, root);

  // ── Story progression: it tells itself slowly, and a tap jumps ahead to the
  //    next beat (§12 reduced motion: no auto-advance, instant swap) ──
  let si = 0;
  let storyOut = 0;
  let storyTimer = 0;
  const showBeat = (idx: number): void => {
    si = ((idx % STORY.length) + STORY.length) % STORY.length;
    applyState(si); // the scene changes along with this beat
    if (reduced) {
      story.textContent = STORY[si] ?? "";
      return;
    }
    story.classList.add("lookout__story--out");
    if (storyOut !== 0) clearTimeout(storyOut);
    storyOut = window.setTimeout(() => {
      story.textContent = STORY[si] ?? "";
      story.classList.remove("lookout__story--out");
    }, 480);
  };
  const resetTimer = (): void => {
    if (storyTimer !== 0) clearInterval(storyTimer);
    if (!reduced) {
      storyTimer = window.setInterval(() => {
        showBeat(si + 1);
      }, 6800);
    }
  };
  resetTimer();
  const advance = (): void => {
    showBeat(si + 1);
    resetTimer();
  };
  // Tap anywhere on the scene to move on (pointer); the hint button is the
  // keyboard-reachable equivalent — stopPropagation so a tap on it advances once.
  content.addEventListener("click", advance);
  hint.addEventListener("click", (e) => {
    e.stopPropagation();
    advance();
  });

  // ── Meteors: streak past now and then (irregular; §12 reduced motion: none) ──
  let meteorTimer = 0;
  let meteorFirst = 0;
  if (!reduced) {
    meteorFirst = window.setTimeout(() => {
      spawnMeteor(meteors);
    }, 1200);
    meteorTimer = window.setInterval(() => {
      if (Math.random() < 0.7) spawnMeteor(meteors);
    }, 3800);
  }

  // ── Parallax: stars, village and terrace drift gently with the gaze; the
  //    moon and night sky stay put ──
  const stopParallax = reduced
    ? null
    : startParallax(scene, {
        pointerX: 7,
        pointerY: 5,
        driftX: 3,
        driftY: 2,
        freqX: 0.14,
        freqY: 0.1,
        lerp: 0.05,
      });

  return {
    root,
    dispose: (): void => {
      stopParallax?.();
      if (storyTimer !== 0) clearInterval(storyTimer);
      if (storyOut !== 0) clearTimeout(storyOut);
      if (meteorTimer !== 0) clearInterval(meteorTimer);
      if (meteorFirst !== 0) clearTimeout(meteorFirst);
      fadeOutAndRemove(root);
    },
  };
}
