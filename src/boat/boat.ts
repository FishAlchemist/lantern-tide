/* ════════════════════════════════════════════════════════════════
   Little paper-boat controller
   ────────────────────────────────────────────────────────────────
   Idea: after "Enter" is pressed, the front door's text dissolves into a
   little paper boat that carries the wanderer forward toward the light,
   through the tunnel, to the destination.

   Viewpoint: we're behind the boat, looking at its stern as it sails toward
   that point of light — so it's the rear-third view of a paper boat (wide near,
   narrow far), moving up and shrinking (going deeper) to read as "advancing
   toward the light".

   Three nested layers, each with one job, none interfering (all only touch
   transform / opacity, §6):
     .boat        outer: positioning + enter/exit opacity
     .boat__sail  middle: heading for the light (up + shrink = deeper)
     .boat__bob   inner: a gentle bob on the tide
   ════════════════════════════════════════════════════════════════ */

import "./boat.css";
import { forceReflow } from "../util/dom";
import { delay } from "../util/timing";
import { BOAT_SHAPE_SVG } from "./boat-shape";

// The shared boat shape wrapped in the entrance boat's own layers (see header).
const BOAT_SVG = `
<div class="boat__sail">
  <div class="boat__bob">
    ${BOAT_SHAPE_SVG}
  </div>
</div>`;

export interface Boat {
  /** Dock: the boat sails into the light, drifts onward and fades. The
   *  wanderer disembarks = arrival. */
  dock: () => Promise<void>;
}

export function launchBoat(stage: HTMLElement): Boat {
  const el = document.createElement("div");
  el.className = "boat";
  el.setAttribute("aria-hidden", "true");
  el.innerHTML = BOAT_SVG; // static string, no external input
  stage.appendChild(el);

  // Force a reflow before adding afloat, so the "form, float, head for the
  // light" transition takes effect.
  forceReflow(el);
  el.classList.add("boat--afloat");

  return {
    dock: async (): Promise<void> => {
      el.classList.add("boat--docking");
      await delay(900);
      el.remove();
    },
  };
}
