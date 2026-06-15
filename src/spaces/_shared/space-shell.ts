/* ════════════════════════════════════════════════════════════════
   Space shell (§3 / §1 the island street)  ── the mount skeleton
   shared by the street and every shop ──
   ────────────────────────────────────────────────────────────────
   After arriving on the island you land on "the street"; the street has
   shops (library, café…). Step into a shop to read it, "back to the
   street" to wander to another, "set out again" back into the tide (§3 loop).
   ════════════════════════════════════════════════════════════════ */

import "./spaces.css";
import type { Namespace } from "../../router/router";
import { makeEl } from "../../util/dom";
import { getMessages } from "../../i18n/i18n";
import { createSpaceRoot, fadeOutAndRemove, revealSpace } from "./scene";

export interface SpaceContext {
  /** Walk to another named space (the street or a shop). Smooth transition,
   *  no reload (§2 spatial continuity). */
  goTo(namespace: Namespace): void;
  /** "Set out again": back into the tide (§3 the leaving gesture of the loop). */
  leave(): void;
}

export interface NavItem {
  label: string;
  /** The named space to go to; null = placeholder (empty shop), not clickable. */
  to: Namespace | null;
}

export interface SpaceMeta {
  namespace: Namespace;
  label: string;
  title: string;
  /** A short note under the title. */
  note: string;
}

export interface MountedSpace {
  root: HTMLElement;
  dispose: () => void;
}

/** A space's default export: it mounts itself onto the stage and hands back a
 *  handle the orchestrator disposes on leave. Every `<name>/<name>.ts` exports
 *  one of these (see src/spaces/registry.ts). */
export type MountFn = (stage: HTMLElement, ctx: SpaceContext) => MountedSpace;

/** Build and fade in a space shell (street or shop). nav decides where you
 *  can walk from here. */
export function mountShell(
  stage: HTMLElement,
  meta: SpaceMeta,
  ctx: SpaceContext,
  nav: readonly NavItem[],
): MountedSpace {
  const root = createSpaceRoot(meta.namespace, meta.title);

  const ground = document.createElement("div");
  ground.className = "space__ground";

  const lantern = document.createElement("div");
  lantern.className = "lantern";
  lantern.setAttribute("aria-hidden", "true");

  const label = makeEl("p", "space__label", meta.label);
  const title = makeEl("h2", "space__title", meta.title);
  const note = makeEl("p", "space__note", meta.note);

  // Navigation: the street = a row of shops; a shop = back to the street.
  const navEl = document.createElement("nav");
  navEl.className = "space__nav";
  for (const item of nav) {
    const btn = makeEl("button", "space__nav-item", item.label);
    const target = item.to;
    if (target === null) {
      btn.setAttribute("disabled", "");
      btn.classList.add("space__nav-item--empty");
    } else {
      btn.addEventListener("click", () => {
        // Acknowledge the tap at once: the chosen shop warms while its room
        // loads. No cleanup needed — the street fades out with it once the room
        // is ready (so even a cold first entry never reads as an unresponsive tap).
        btn.classList.add("space__nav-item--loading");
        btn.setAttribute("aria-busy", "true");
        ctx.goTo(target);
      });
    }
    navEl.appendChild(btn);
  }

  // Always offer "set out again, back into the tide" (§3 loop).
  const leaveBtn = makeEl("button", "space__leave", getMessages().nav.setOut);
  leaveBtn.addEventListener("click", () => {
    ctx.leave();
  });

  root.append(ground, lantern, label, title, note, navEl, leaveBtn);

  // Second half of the cross-fade: the space fades in (§3).
  revealSpace(stage, root);

  return {
    root,
    dispose: (): void => {
      fadeOutAndRemove(root);
    },
  };
}
