/* ════════════════════════════════════════════════════════════════
   The paper-boat shop (§1 / §3)  ── a shop on the street; its own
   chunk, fetched only after entering (§10) ──
   ────────────────────────────────────────────────────────────────
   "Fold one, let it go": when you entered, the front door's text dissolved
   into a little paper boat that carried you here — this shop is that boat's
   source, closing the loop on the opening image. By the water, fold your own
   paper boat, write (or pick) something you'd set down, set it on the tide,
   and watch it drift off toward that point of light on the horizon. Once it's
   let go, you're ready to set out again (§3 loop).

   The boat reuses the shared paper boat (boat.css's .boat__paper/deck/edge/wake;
   boat.css is always loaded with the entry chunk, so we only borrow the look
   without coupling to the entry flow). All copy lives in the locale bundles.
   ════════════════════════════════════════════════════════════════ */

import "../../_shared/spaces.css"; // .space base (fade-in, centring); robust for deep links
import "./paperboat.css";
import { forceReflow, makeEl } from "../../../util/dom";
import { getMessages } from "../../../i18n/i18n";
import type { DirKey } from "../../../i18n/messages";
import { BOAT_SHAPE_SVG } from "../../../boat/boat-shape";
import {
  buildBackNav,
  createSpaceRoot,
  fadeOutAndRemove,
  revealSpace,
  scatterStars,
} from "../../_shared/scene";
import type { MountedSpace, SpaceContext } from "../../_shared/space-shell";

// Fixed direction order (the closing line is looked up by this stable key).
const DIR_ORDER: readonly DirKey[] = [
  "grief",
  "anxiety",
  "anger",
  "guilt",
  "weariness",
  "studies",
  "work",
  "relationships",
];

// The beat of fold → settle → sail → recede and vanish (timings paired with
// paperboat.css's paperboat-fold and paperboat-sail).
const FOLD_MS = 2000; // the sheet of paper folding into the boat (= paperboat-fold)
const REST_MS = 700; // the boat rests on the water before the tide takes it
const SAIL_MS = 8500; // sail-away duration (slow tidal drift); keep in sync with CSS

// The wish's explicit character limit. Shown live as a "n / 50" counter (and
// announced to screen readers) so the cap is clear while composing, not a
// silent surprise at keystroke 51.
const WISH_MAXLEN = 50;

// The boat's shape: the one shared paper boat (boat.css's .boat__* paths),
// imported as markup only so borrowing the look doesn't couple to the entrance.
const BOAT_INNER = `
<div class="paperboat__hull">
  ${BOAT_SHAPE_SVG}
</div>`;

const SCENE_HTML = `
<div class="paperboat__sky"></div>
<div class="paperboat__horizon"></div>
<div class="paperboat__moon"></div>
<div class="paperboat__beacon"></div>
<div class="paperboat__sea"></div>
<div class="paperboat__jetty">
  <div class="paperboat__papers"></div>
  <div class="paperboat__keeper"></div>
  <div class="paperboat__lantern"></div>
</div>`;

export default function mountPaperboat(
  stage: HTMLElement,
  ctx: SpaceContext,
): MountedSpace {
  const m = getMessages().paperboat;

  // The currently chosen direction key (decides the closing line; typing your
  // own resets it to null, which uses the default closing).
  let currentDir: DirKey | null = null;

  const root = createSpaceRoot("paperboat", m.ariaLabel, "paperboat");

  const scene = document.createElement("div");
  scene.className = "paperboat__scene";
  scene.setAttribute("aria-hidden", "true");
  scene.innerHTML = SCENE_HTML; // static night scene (no external input)

  // Starfield: scatter points (kept above the waterline by topMax).
  const stars = document.createElement("div");
  stars.className = "paperboat__stars";
  scatterStars(stars, {
    count: 70,
    starClass: "paperboat__star",
    topMax: 46,
    sizeRange: 1.6,
  });
  scene.appendChild(stars);

  // The stage the boat drifts on (above the sea, below the shop).
  const boatLayer = document.createElement("div");
  boatLayer.className = "paperboat__stage";
  scene.appendChild(boatLayer);

  // Content: the swappable interactive area (fold → let go → drift → fold again).
  const content = document.createElement("div");
  content.className = "paperboat__content";

  // Navigation.
  const navEl = buildBackNav(ctx, "paperboat");

  root.append(scene, content, navEl);
  revealSpace(stage, root);

  // ── Interaction state machine ───────────────────────────────────────────
  const timers: number[] = [];

  const renderCompose = (): void => {
    currentDir = null; // back to the fold page; clear the last chosen direction.

    const lore = makeEl("p", "paperboat__lore", m.lore);
    const label = makeEl("p", "paperboat__label", m.label);
    const prompt = makeEl("p", "paperboat__prompt", m.prompt);

    const input = document.createElement("input");
    input.type = "text";
    input.className = "paperboat__input";
    input.maxLength = WISH_MAXLEN;
    input.placeholder = m.inputPlaceholder;
    input.setAttribute("aria-label", m.inputAria);

    // A live "n / 50" counter so the limit is explicit while composing; linked
    // via aria-describedby so it's announced to screen readers on focus too.
    const max = String(WISH_MAXLEN);
    const count = makeEl("p", "paperboat__count", `0 / ${max}`);
    count.id = "paperboat-count";
    input.setAttribute("aria-describedby", count.id);
    const syncCount = (): void => {
      const n = input.value.length;
      count.textContent = `${String(n)} / ${max}`;
      count.classList.toggle("paperboat__count--full", n >= WISH_MAXLEN);
    };

    // Typing your own → reset direction, use the default closing.
    input.addEventListener("input", () => {
      currentDir = null;
      syncCount();
    });

    // Two-step picker: pick a direction first, then one of its lines (filled in).
    const chips = document.createElement("div");
    chips.className = "paperboat__chips";

    function fill(text: string): void {
      input.value = text;
      syncCount();
      input.focus();
    }
    function renderItems(key: DirKey): void {
      const backChip = makeEl(
        "button",
        "paperboat__chip paperboat__chip--back",
        m.changeDirection,
      );
      backChip.addEventListener("click", renderDirections);
      const items = m.directions[key].items.map((it) => {
        const chip = makeEl("button", "paperboat__chip", it);
        chip.addEventListener("click", () => {
          fill(it);
          currentDir = key; // remember the direction → matching closing.
        });
        return chip;
      });
      chips.replaceChildren(backChip, ...items);
    }
    function renderDirections(): void {
      const dirs = DIR_ORDER.map((key) => {
        const chip = makeEl(
          "button",
          "paperboat__chip paperboat__chip--dir",
          m.directions[key].dir,
        );
        chip.addEventListener("click", () => {
          renderItems(key);
        });
        return chip;
      });
      chips.replaceChildren(...dirs);
    }
    renderDirections();

    const launchBtn = makeEl("button", "paperboat__launch", m.launch);
    launchBtn.addEventListener("click", () => {
      launch(input.value.trim());
    });
    // Pressing Enter also lets it go.
    input.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Enter") launch(input.value.trim());
    });

    content.replaceChildren(
      label,
      lore,
      prompt,
      input,
      count,
      chips,
      launchBtn,
    );
  };

  const launch = (wish: string): void => {
    const text = wish.length > 0 ? wish : m.fallbackWish;
    const dir = currentDir; // the direction at the moment of letting go.
    content.replaceChildren();

    // 1) A sheet of paper with the wish written on it, which folds into the boat.
    const fold = document.createElement("div");
    fold.className = "paperboat__fold";
    fold.setAttribute("aria-hidden", "true");
    const sheet = makeEl("div", "paperboat__sheet", "");
    sheet.appendChild(makeEl("p", "paperboat__sheet-text", text));
    fold.appendChild(sheet);
    boatLayer.appendChild(fold);

    // 2) The boat, hidden at first, crossfading in as the fold completes.
    const boat = document.createElement("div");
    boat.className = "paperboat__boat";
    boat.setAttribute("aria-hidden", "true");
    boat.innerHTML = BOAT_INNER;
    // Drift a touch toward the horizon light (the beacon sits a little right);
    // each boat slightly different.
    boat.style.setProperty(
      "--drift-x",
      `${(2 + Math.random() * 12).toFixed(0)}px`,
    );
    boatLayer.appendChild(boat);

    forceReflow(fold);

    // The boat settles onto the water just before the fold finishes (crossfade).
    const tReady = window.setTimeout(() => {
      boat.classList.add("paperboat__boat--ready");
    }, FOLD_MS - 500);
    timers.push(tReady);
    // Remove the spent paper once it's folded away.
    const tClean = window.setTimeout(() => {
      fold.remove();
    }, FOLD_MS + 200);
    timers.push(tClean);
    // It rests a beat on the water, then is carried off by the tide — sailing to
    // the horizon, smaller and smaller, until it's gone.
    const t1 = window.setTimeout(() => {
      boat.classList.add("paperboat__boat--adrift");
    }, FOLD_MS + REST_MS);
    timers.push(t1);
    // Sailed away, gone → remove the boat, give a closing line.
    const t2 = window.setTimeout(
      () => {
        boat.remove();
        renderDone(dir);
      },
      FOLD_MS + REST_MS + SAIL_MS + 250,
    );
    timers.push(t2);
  };

  const renderDone = (dir: DirKey | null): void => {
    const c = dir !== null ? m.closings[dir] : m.closings.default;
    const line1 = makeEl("p", "paperboat__done", c.gone);
    const line2 = makeEl("p", "paperboat__done paperboat__done--soft", c.cheer);
    const again = makeEl("button", "paperboat__launch", m.foldAnother);
    again.addEventListener("click", () => {
      renderCompose();
    });
    content.replaceChildren(line1, line2, again);
  };

  renderCompose();

  return {
    root,
    dispose: (): void => {
      for (const timer of timers) clearTimeout(timer);
      fadeOutAndRemove(root);
    },
  };
}
