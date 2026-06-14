/* ════════════════════════════════════════════════════════════════
   Shared space primitives  ── the mount/teardown lifecycle every shop repeats ──
   ────────────────────────────────────────────────────────────────
   Each space file should hold only what makes it itself; the parts every shop
   shares live here: the <section class="space space--X"> root, fading it in and
   out, the "back to the street / set out again" nav, the scattered starfield,
   and the gentle pointer parallax. Factored out so the spaces stay consistent
   (§2 spatial continuity, one shared feel) without copy-paste drift.
   ════════════════════════════════════════════════════════════════ */

import type { Namespace } from "../../router/router";
import { forceReflow, makeEl } from "../../util/dom";
import { getMessages } from "../../i18n/i18n";
import type { SpaceContext } from "./space-shell";

/** Space fade-out duration (ms); matches --dur-slow in style.css (the `.space`
 *  opacity transition), so the node is removed exactly as the fade finishes —
 *  not 200ms early, which used to clip the leave fade into a faint pop. */
const FADE_OUT_MS = 800;

/** The standard space root: <section class="space space--<ns> [block]">. `block`
 *  is the space's own BEM block (e.g. "cafe"); omit it for the bare shell. */
export function createSpaceRoot(
  namespace: Namespace,
  ariaLabel: string,
  block?: string,
): HTMLElement {
  const root = document.createElement("section");
  root.className =
    block === undefined || block.length === 0
      ? `space space--${namespace}`
      : `space space--${namespace} ${block}`;
  root.setAttribute("aria-label", ariaLabel);
  return root;
}

/** Append a space root and play the enter fade. The forceReflow is what makes
 *  the .space--visible transition actually run — without it the append and the
 *  class-add batch into one frame and the fade is skipped (§3 cross-fade). */
export function revealSpace(stage: HTMLElement, root: HTMLElement): void {
  stage.appendChild(root);
  forceReflow(root);
  root.classList.add("space--visible");
}

/** Fade a space out and remove it once the transition ends. Callers run their
 *  own listener/timer cleanup first; this owns only the DOM teardown. A leaving
 *  space stops taking pointer events at once, so a stray click during the fade
 *  can't reach the space that's on its way out. */
export function fadeOutAndRemove(root: HTMLElement): void {
  root.style.pointerEvents = "none";
  root.setAttribute("aria-hidden", "true");
  root.classList.remove("space--visible");
  setTimeout(() => {
    root.remove();
  }, FADE_OUT_MS);
}

/** The restrained bottom nav every shop shares: "back to the street" and "set
 *  out again" (§3 loop). `block` is the shop's BEM block (e.g. "cafe"), so the
 *  buttons get that shop's own classes. Back comes first, set-out second. */
export function buildBackNav(ctx: SpaceContext, block: string): HTMLElement {
  const { nav } = getMessages();
  const navEl = document.createElement("nav");
  navEl.className = `${block}__nav`;
  const back = makeEl("button", `${block}__navlink`, nav.backToStreet);
  back.addEventListener("click", () => {
    ctx.goTo("street");
  });
  const leave = makeEl("button", `${block}__navlink`, nav.setOut);
  leave.addEventListener("click", () => {
    ctx.leave();
  });
  navEl.append(back, leave);
  return navEl;
}

export interface StarfieldOptions {
  count: number;
  /** Per-star class; CSS targets each space's stars separately. */
  starClass: string;
  /** Stars sit in the top band of the scene; this is its lower edge (%). */
  topMax: number;
  /** Largest random size addend (px) on top of the fixed 0.6 base. */
  sizeRange: number;
}

/** Scatter a twinkling starfield into a container (the far parallax layer).
 *  Positions and sizes are random; only the class and count are a contract. */
export function scatterStars(
  container: HTMLElement,
  opts: StarfieldOptions,
): void {
  for (let i = 0; i < opts.count; i++) {
    const star = document.createElement("span");
    star.className = opts.starClass;
    const size = (0.6 + Math.random() * opts.sizeRange).toFixed(2);
    star.style.left = `${(Math.random() * 100).toFixed(2)}%`;
    star.style.top = `${(Math.random() * opts.topMax).toFixed(2)}%`;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.setProperty("--tw", `${(2.4 + Math.random() * 4).toFixed(2)}s`);
    star.style.animationDelay = `${(Math.random() * 5).toFixed(2)}s`;
    container.appendChild(star);
  }
}

export interface ParallaxOptions {
  /** Pointer-pull amplitude (units the CSS multiplies by each layer's --depth). */
  pointerX: number;
  pointerY: number;
  /** Idle self-drift amplitude, so the scene breathes with no pointer (mobile). */
  driftX: number;
  driftY: number;
  /** Idle self-drift frequencies (rad/s). */
  freqX: number;
  freqY: number;
  /** Easing toward the pointer target, per frame (0..1). */
  lerp: number;
}

/** Gentle pointer parallax: writes --par-x / --par-y onto the scene each frame;
 *  layers offset by these × their --depth, while the lamp and pool stay put
 *  (§7). Allocates nothing inside the loop (§6). Returns stop(), which removes
 *  the listener and cancels the frame. The caller decides whether to start it
 *  at all (skipped under reduced motion). */
export function startParallax(
  scene: HTMLElement,
  opts: ParallaxOptions,
): () => void {
  let rafId = 0;
  let pointerX = 0;
  let pointerY = 0;
  let curX = 0;
  let curY = 0;
  let startTs = -1;
  const onPointer = (e: PointerEvent): void => {
    pointerX = (e.clientX / window.innerWidth) * 2 - 1;
    pointerY = (e.clientY / window.innerHeight) * 2 - 1;
  };
  window.addEventListener("pointermove", onPointer);

  const tick = (ts: number): void => {
    if (startTs < 0) startTs = ts;
    const t = (ts - startTs) / 1000;
    const driftX = Math.sin(t * opts.freqX) * opts.driftX;
    const driftY = Math.cos(t * opts.freqY) * opts.driftY;
    curX += (pointerX * opts.pointerX - curX) * opts.lerp;
    curY += (pointerY * opts.pointerY - curY) * opts.lerp;
    scene.style.setProperty("--par-x", String(driftX + curX));
    scene.style.setProperty("--par-y", String(driftY + curY));
    rafId = requestAnimationFrame(tick);
  };
  rafId = requestAnimationFrame(tick);

  return (): void => {
    window.removeEventListener("pointermove", onPointer);
    if (rafId !== 0) cancelAnimationFrame(rafId);
  };
}
