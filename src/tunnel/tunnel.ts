/* ════════════════════════════════════════════════════════════════
   Tunnel controller (§5 / §3 the tunnel is the loader / §6 smoothness)
   ────────────────────────────────────────────────────────────────
   The idea (from real feedback): it's "a train coming out of a tunnel" — a
   point of warm light far off that, as you move forward, grows larger and
   brighter smoothly, brightest at the centre, fading softly outward. NO rings
   of light or dark, no sudden flash: just one field of light, gently filling
   the view.

   How: one smooth radial-gradient light orb, scaled up with transform: scale
   (compositor-handled, zero gradient banding), brightened gently with opacity.

   The tunnel doubles as the loading screen (§3); cross-fade (§3): when the
   walk ends it returns dissolve(), and the caller mounts the space underneath
   first, then dissolve()s to reveal it.
   §6: allocate nothing inside the rAF loop; only touch transform / opacity.
   ════════════════════════════════════════════════════════════════ */

import "./tunnel.css";
import type { EntranceVariant } from "../state/session";
import { forceReflow } from "../util/dom";
import { delay } from "../util/timing";

/** Tunnel dissolve duration (ms); must match tunnel.css's opacity transition. */
const FADE_MS = 500;

interface WalkOptions {
  variant: EntranceVariant;
  /** §3: assets to have ready by the time the walk ends (the target space's
   *  chunk + image decode, etc.). */
  preload?: Promise<unknown>;
}

/** Per-variant durations (ms). Deliberately long and gently changing — feedback
 *  said "the brightness changes too fast". */
const DURATION: Record<EntranceVariant, number> = {
  full: 2800, // first arrival: emerging slowly from the depths
  "threshold-warm": 1600, // return after days
  "threshold-soft": 1000, // return within hours: only the last stretch lights up
  instant: 1, // shouldn't be reached (skip / reduced go straight in via main)
};

function buildTunnel(): { root: HTMLElement; light: HTMLElement } {
  const root = document.createElement("div");
  root.className = "tunnel";
  const light = document.createElement("div");
  light.className = "tunnel__light";
  root.appendChild(light);
  return { root, light };
}

/** Run "coming out of the tunnel": the light orb scales up smoothly and
 *  brightens gently. §6: allocate nothing inside the loop. */
function runWalkAnimation(
  light: HTMLElement,
  variant: EntranceVariant,
  duration: number,
): Promise<void> {
  // "full" starts from the depths (tiny and dim); thresholds start near the
  // exit (only the last stretch plays).
  const depthStart = variant === "full" ? 0 : 0.55;

  return new Promise<void>((resolve) => {
    let startTs = -1;

    const tick = (ts: number): void => {
      if (startTs < 0) startTs = ts;
      const t = Math.min(1, (ts - startTs) / duration); // progress 0..1
      const eased = depthStart + t * (1 - depthStart); // relative position in the tunnel

      // Smooth scale-up (near-linear, slight ease, to avoid "sudden huge") +
      // gentle brighten. "Brighter toward the centre" is guaranteed by the
      // gradient itself (see css).
      const scale = 0.16 + Math.pow(eased, 1.12) * 3.4;
      const opacity = 0.42 + eased * 0.58;
      light.style.transform = `scale(${String(scale)})`;
      light.style.opacity = String(Math.min(1, opacity));

      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        resolve();
      }
    };

    requestAnimationFrame(tick);
  });
}

/** Walk through the tunnel. Resolves once the animation + preload are both
 *  ready, and returns dissolve(): only when you call dissolve() does the tunnel
 *  fade out and get removed. */
export async function walkTunnel(
  stage: HTMLElement,
  opts: WalkOptions,
): Promise<() => Promise<void>> {
  const { root, light } = buildTunnel();
  stage.appendChild(root);

  forceReflow(root);
  root.classList.add("tunnel--visible");

  const duration = DURATION[opts.variant];
  const animation =
    opts.variant === "instant"
      ? delay(duration)
      : runWalkAnimation(light, opts.variant, duration);

  // §3: out of the tunnel ≈ loading complete. Both animation and assets must
  // be satisfied.
  await Promise.all([animation, opts.preload ?? Promise.resolve()]);

  return async (): Promise<void> => {
    root.classList.remove("tunnel--visible");
    await delay(FADE_MS);
    root.remove();
  };
}
