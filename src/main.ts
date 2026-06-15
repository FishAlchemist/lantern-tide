/* ════════════════════════════════════════════════════════════════
   Entrance orchestration (§3 experience flow / §10 guard the entrance)
   ────────────────────────────────────────────────────────────────
   Wires the skeleton together: front door → tunnel (which is also the
   loader) → cross-fade into a space → loop.
   ════════════════════════════════════════════════════════════════ */

import "./style.css";
import { walkTunnel } from "./tunnel/tunnel";
import {
  currentRoute,
  DEFAULT_NAMESPACE,
  go,
  isExperiencePath,
  onRouteChange,
  syncFrontDoor,
  type Namespace,
} from "./router/router";
import {
  applyStoredMotion,
  decideEntrance,
  markEntered,
  prefersReducedMotion,
  setMotionPref,
} from "./state/session";
import { applyPlatformChrome } from "./platform/adapter";
import { forceReflow } from "./util/dom";
import { launchBoat } from "./boat/boat";
import {
  applyInitialLang,
  cycleLocale,
  getMessages,
  localeName,
  nextLocale,
  onLocaleChange,
} from "./i18n/i18n";
import type {
  MountedSpace,
  MountFn,
  SpaceContext,
} from "./spaces/_shared/space-shell";
import { loadSpace } from "./spaces/registry";

// Each space is its own chunk, import()-ed only after the entrance sequence is
// complete — loading is split, and a cold load stops at the front door without
// prefetching content (a perf/ritual choice). The chunks are auto-discovered by
// src/spaces/registry.ts from the folder layout; loadSpace(ns) hands back one.

function mustGet(id: string): HTMLElement {
  const node = document.getElementById(id);
  if (node === null) throw new Error(`Missing required DOM node #${id}`);
  return node;
}

const threshold = mustGet("threshold");
const stage = mustGet("stage");
const enterBtn = mustGet("enter");
const skipBtn = mustGet("skip");
const titleEl = threshold.querySelector<HTMLElement>(".threshold__title");
const taglineEl = threshold.querySelector<HTMLElement>(".threshold__tagline");
const colophonEl = threshold.querySelector<HTMLElement>(".threshold__note");
const sourceEl = threshold.querySelector<HTMLElement>(".threshold__source");

applyPlatformChrome(); // §9: only Tauri gets hardened; web stays a good citizen

let active: MountedSpace | null = null;
let activeNs: Namespace | null = null;
let busy = false;

// Closes the in-space declaration panel; assigned once the control is mounted.
let closeColophon: (() => void) | null = null;

interface EnterOptions {
  /** Skip the animation: no tunnel, no boat — land in the space directly (§12). */
  skip?: boolean;
}

/** Finish the entrance and mount a namespace's space onto the stage
 *  (the second half of the cross-fade). */
async function enterSpace(
  namespace: Namespace,
  opts: EnterOptions = {},
): Promise<void> {
  if (busy) return;
  busy = true;
  try {
    // Retract the front door: text dissolves (.threshold--leaving).
    threshold.classList.add("threshold--leaving");
    threshold.setAttribute("aria-hidden", "true");
    stage.classList.add("stage--active");
    stage.removeAttribute("aria-hidden");

    // §10 gate: only now do we fetch the target space's chunk. The namespace
    // came from the router (validated), so a loader exists; fall back to the hub.
    const loader = loadSpace(namespace) ?? loadSpace(DEFAULT_NAMESPACE);
    if (loader === undefined) return;
    const preload = loader();

    // Skip the animation (§12) → no tunnel, no boat, land directly.
    if (opts.skip === true) {
      markEntered(stampNow(), namespace);
      threshold.style.display = "none";
      const mod = await preload;
      mountInto(mod.default, namespace);
      return;
    }

    // Pressing "Enter" = an explicit opt into the full experience: remember
    // "detailed" (flags <html data-motion="full">) so the ritual (tunnel, boat)
    // and the later in-space motion play, even with the system "reduce motion"
    // on — an explicit human choice wins, and it sticks across reloads. The
    // motion toggle can change it later; "Skip" leaves the choice untouched.
    setMotionPref("full");

    // Otherwise the full ritual: a little paper boat forms at centre (the front
    // door's text dissolving into a boat), carrying the wanderer through the
    // tunnel (which is also the load), then cross-fading into the space.
    const boat = launchBoat(stage);
    const variant = decideEntrance(stampNow());

    // Don't remove the tunnel immediately when the walk ends: it returns
    // dissolve(), so the space can mount underneath the tunnel first and then
    // the tunnel dissolves to reveal it — a real cross-fade (§3).
    const dissolveTunnel = await walkTunnel(stage, { variant, preload });

    // Out of the tunnel = entrance complete. Only now may content exist (§10).
    markEntered(stampNow(), namespace);
    threshold.style.display = "none";

    // The boat sails into that brimming exit light and fades — while the tunnel
    // is still bright, so it truly "sails into the light" and vanishes; the
    // wanderer arrives, rather than overlapping the already-revealed space text.
    await boat.dock();

    const mod = await preload; // already resolved, zero wait (§6 no late fetch)
    mountInto(mod.default, namespace); // space fades in beneath the tunnel
    await dissolveTunnel(); // tunnel dissolves, revealing the space
  } catch (err) {
    // A chunk fetch or the tunnel walk failed: never strand the session with
    // busy stuck true (every later Enter/route would be silently dead). Log it,
    // and if no space mounted, restore the front door so the visitor can retry.
    console.error("Entrance failed", err);
    if (active === null) {
      stage.replaceChildren();
      stage.classList.remove("stage--active");
      stage.setAttribute("aria-hidden", "true");
      threshold.classList.remove("threshold--leaving");
      threshold.removeAttribute("aria-hidden");
      threshold.style.display = "";
    }
  } finally {
    busy = false;
  }
}

/** Switch spaces within a session (§2 spatial continuity: smooth transition,
 *  no reload, no second walk through the tunnel). `instant` swaps in place with
 *  no cross-fade — used by the motion toggle, where only the motion changes. */
function switchSpace(namespace: Namespace, instant = false): void {
  // Already inside the session → no tunnel needed, just cross-fade.
  const loader = loadSpace(namespace) ?? loadSpace(DEFAULT_NAMESPACE);
  loader?.()
    .then((mod) => {
      mountInto(mod.default, namespace, instant);
    })
    .catch((err: unknown) => {
      console.error("Space failed to load", err);
    });
}

function mountInto(
  mount: MountFn,
  namespace: Namespace,
  instant = false,
): void {
  // Instant re-mount (the motion toggle): turn the .space fade off, and drop the
  // outgoing root at once instead of waiting out its 800ms fade timer — so the
  // change reads as immediate, not a flicker or a double cross-fade.
  if (instant) stage.classList.add("stage--instant");
  active?.dispose();
  const ctx: SpaceContext = {
    goTo: (ns) => {
      go({ namespace: ns, room: null });
    },
    leave: returnToTide,
  };
  active = mount(stage, ctx);
  activeNs = namespace;
  if (instant) {
    // dispose() hid the old root (removed .space--visible); remove it now,
    // leaving just the new (visible) root, then restore fades next frame.
    stage.querySelectorAll(".space:not(.space--visible)").forEach((el) => {
      el.remove();
    });
    requestAnimationFrame(() => {
      stage.classList.remove("stage--instant");
    });
  }
}

/** §3 the loop: set out again, back into the tide. Return to the front door
 *  and wait for the next entrance. */
function returnToTide(): void {
  closeColophon?.(); // shut the declaration panel before leaving the space
  active?.dispose(); // space fades out, removed
  active = null; // ← key: clear first, so no route event recalls a space.
  activeNs = null;
  syncFrontDoor(); // reset the URL to / so a later reload shows the front door
  stage.classList.remove("stage--active");
  stage.setAttribute("aria-hidden", "true");
  // Back to the front door. enteredThisSession stays true → re-entry is light
  // (§10 return).
  threshold.style.display = "";
  forceReflow(threshold); // let display + the "dissolved" state land first
  threshold.classList.remove("threshold--leaving"); // then transition back to visible
  threshold.removeAttribute("aria-hidden");
}

/* ── Front-door copy (§7) ─────────────────────────────────────────
   The threshold is static in index.html (zh-Hant, for SEO + the default
   audience); here we re-apply it per locale. Title shows the active
   language's name, subtitle the other — a small bilingual lockup. */
function applyThresholdLocale(): void {
  const m = getMessages().threshold;
  if (titleEl) titleEl.textContent = m.title;
  if (taglineEl) taglineEl.textContent = m.tagline;
  enterBtn.textContent = m.enter;
  enterBtn.setAttribute("aria-label", m.enterAria);
  skipBtn.textContent = m.skip;
  const c = getMessages().colophon;
  if (colophonEl) colophonEl.textContent = c.note;
  if (sourceEl) sourceEl.textContent = c.source;
}

/** A small, always-present language toggle (top corner). Its label shows the
 *  language you'd switch TO; clicking cycles to the next available locale. */
function createLangToggle(): HTMLButtonElement {
  const btn = document.createElement("button");
  btn.className = "lang-toggle";
  btn.type = "button";
  const sync = (): void => {
    const name = localeName(nextLocale());
    btn.textContent = name;
    btn.setAttribute("aria-label", `Switch language to ${name}`);
  };
  sync();
  btn.addEventListener("click", () => {
    cycleLocale();
  });
  onLocaleChange(sync);
  return btn;
}

/** A small, always-present motion toggle (top corner, beside the language one).
 *  Flips the page-wide motion between detailed and simple, remembers it, and
 *  re-mounts the current space so its motion re-evaluates live. The label shows
 *  the current state; "on" (detailed) reads as a warm, filled chip. */
function createMotionToggle(): HTMLButtonElement {
  const btn = document.createElement("button");
  btn.className = "motion-toggle";
  btn.type = "button";
  const sync = (): void => {
    const detailed = !prefersReducedMotion();
    const m = getMessages().motion;
    btn.textContent = detailed ? m.detailed : m.simple;
    btn.setAttribute("aria-pressed", String(detailed));
    btn.setAttribute("aria-label", m.toggle);
  };
  sync();
  btn.addEventListener("click", () => {
    setMotionPref(prefersReducedMotion() ? "full" : "reduced");
    sync();
    // Re-mount the active space (instantly, no cross-fade) so its JS-driven
    // motion (parallax, the breath's amplitude, the embers) re-evaluates at once.
    if (active !== null && activeNs !== null) switchSpace(activeNs, true);
  });
  onLocaleChange(sync);
  return btn;
}

/** The in-space vibe-code declaration: a small button that opens a dismissible
 *  panel with the note and the source link. Shown only inside a space (CSS ties
 *  it to .stage--active); the front door shows the same note inline instead. */
function createColophonControl(): HTMLElement {
  const wrap = document.createElement("div");
  wrap.className = "colophon";

  const toggle = document.createElement("button");
  toggle.className = "colophon__toggle";
  toggle.type = "button";
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-controls", "lt-colophon-panel");

  const panel = document.createElement("div");
  panel.className = "colophon__panel";
  panel.id = "lt-colophon-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "true");

  const card = document.createElement("div");
  card.className = "colophon__card";
  const note = document.createElement("p");
  note.className = "colophon__note";
  const source = document.createElement("a");
  source.className = "colophon__source";
  source.href = "https://github.com/FishAlchemist/lantern-tide";
  source.target = "_blank";
  source.rel = "noopener noreferrer";
  const closeBtn = document.createElement("button");
  closeBtn.className = "colophon__close";
  closeBtn.type = "button";
  card.append(note, source, closeBtn);
  panel.appendChild(card);
  wrap.append(toggle, panel);

  // Move focus into the dialog on open and hand it back on close (a11y: a dialog
  // should take focus, then return it to wherever it came from).
  let lastFocus: HTMLElement | null = null;
  const setOpen = (open: boolean): void => {
    const wasOpen = wrap.classList.contains("colophon--open");
    wrap.classList.toggle("colophon--open", open);
    toggle.setAttribute("aria-expanded", String(open));
    if (open && !wasOpen) {
      lastFocus =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      closeBtn.focus();
    } else if (!open && wasOpen) {
      (lastFocus ?? toggle).focus();
      lastFocus = null;
    }
  };
  closeColophon = (): void => {
    setOpen(false);
  };

  const sync = (): void => {
    const c = getMessages().colophon;
    toggle.textContent = c.show;
    toggle.setAttribute("aria-label", c.show);
    panel.setAttribute("aria-label", c.show);
    note.textContent = c.note;
    source.textContent = c.source;
    closeBtn.textContent = c.close;
  };
  sync();
  onLocaleChange(sync);

  toggle.addEventListener("click", () => {
    setOpen(!wrap.classList.contains("colophon--open"));
  });
  closeBtn.addEventListener("click", () => {
    setOpen(false);
  });
  // Dismiss by clicking the backdrop (the panel area outside the card).
  panel.addEventListener("click", (e) => {
    if (e.target === panel) setOpen(false);
  });
  // Dismiss with Escape while open.
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && wrap.classList.contains("colophon--open")) {
      setOpen(false);
    }
  });

  return wrap;
}

/* ── Boot ─────────────────────────────────────────────────────────
   Entrance decision (on each load): the bare root / is the front door (a cold
   load stops there for the ritual). Any /street… URL — a deep link, or a reload
   while inside a shop — lands directly in that space, so a refresh keeps you
   where you were instead of bouncing back to the front door. */
function boot(): void {
  applyStoredMotion(); // re-apply a remembered detailed/simple choice before anything renders
  applyInitialLang();
  applyThresholdLocale();
  const controls = document.createElement("div");
  controls.className = "controls"; // top-right cluster of global preference toggles
  controls.append(createMotionToggle(), createLangToggle());
  document.body.appendChild(controls);
  document.body.appendChild(createColophonControl());

  // The front door's two gestures (§4: the click is the user gesture needed
  // for audio autoplay).
  enterBtn.addEventListener("click", () => {
    void enterSpace(currentRoute().namespace);
  });
  // §12: skip the animation = no tunnel, no boat, land directly.
  skipBtn.addEventListener("click", () => {
    void enterSpace(currentRoute().namespace, { skip: true });
  });

  // URL changes within a session (space switch, back/forward) → smooth swap.
  // Arriving straight at a URL (e.g. pasting /street/cafe) before entering →
  // don't land content; stay at the front door and wait for the gesture.
  onRouteChange((route) => {
    // Only respond to route switches while already inside a space (active).
    // At the front door (cold load, or just after "set out again") never land.
    if (active === null) return;
    switchSpace(route.namespace);
  });

  // Language switch: re-apply the front door, and (if inside a space) re-mount
  // it so its content swaps to the other language.
  onLocaleChange(() => {
    applyThresholdLocale();
    if (active !== null && activeNs !== null) switchSpace(activeNs);
  });

  // Reload / deep link straight into the experience (/street…) → land directly
  // in that space, no front-door ceremony.
  if (isExperiencePath()) {
    void enterSpace(currentRoute().namespace, { skip: true });
  }
}

function stampNow(): number {
  return Date.now();
}

boot();
