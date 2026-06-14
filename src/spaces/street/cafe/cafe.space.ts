/* ════════════════════════════════════════════════════════════════
   The café (§3)  ── a shop on the street; its own chunk, fetched only
   after entering (§10) ──
   ────────────────────────────────────────────────────────────────
   Design direction (chosen 2+4): night-café negative space × illustrated
   scene. A late-night café interior — one small warm lamp pools light on the
   table, with plenty of empty space.

   "Sit a while, think" (§3): the pool of light holds a root question (to set
   you thinking), with a related philosophical line and its author beneath
   (someone who once sat with the same question) — the question asks, the
   quote keeps you company, rather than handing you an answer. The copy lives
   in the locale bundles; all quotes are public-domain.
   ════════════════════════════════════════════════════════════════ */

import "../../_shared/spaces.css"; // .space base (fixed full-screen, fade-in); robust for deep links
import "./cafe.css";
import { makeEl } from "../../../util/dom";
import { prefersReducedMotion } from "../../../state/session";
import { getMessages } from "../../../i18n/i18n";
import type { CafePrompt } from "../../../i18n/messages";
import {
  buildBackNav,
  createSpaceRoot,
  fadeOutAndRemove,
  revealSpace,
  startParallax,
} from "../../_shared/scene";
import type { MountedSpace, SpaceContext } from "../../_shared/space-shell";

// Static illustrative scene (the skeleton of a pure-CSS illustration). Each
// .cafe__layer carries --depth for its parallax distance.
const SCENE_HTML = `
<div class="cafe__layer cafe__window" style="--depth: 0.5">
  <div class="cafe__sea"></div>
  <div class="cafe__mullion"></div>
</div>
<div class="cafe__pool"></div>
<div class="cafe__lamp">
  <span class="cafe__lamp-cord"></span>
  <span class="cafe__lamp-shade"></span>
</div>
<div class="cafe__layer cafe__table" style="--depth: 1.1"></div>
<div class="cafe__layer cafe__cup" style="--depth: 1.6">
  <span class="cafe__steam"></span>
  <span class="cafe__steam cafe__steam--2"></span>
</div>`;

function authorLine(p: CafePrompt | undefined): string {
  return p ? `— ${p.author}` : "";
}

export default function mountCafe(
  stage: HTMLElement,
  ctx: SpaceContext,
): MountedSpace {
  const m = getMessages().cafe;
  const PROMPTS = m.prompts;

  const root = createSpaceRoot("cafe", m.ariaLabel, "cafe");

  const scene = document.createElement("div");
  scene.className = "cafe__scene";
  scene.setAttribute("aria-hidden", "true");
  scene.innerHTML = SCENE_HTML; // static illustrative scene (no external input)

  // Content: one root question in the pool of light + a companion quote (one
  // at a time, §3 sit a while, think).
  const content = document.createElement("div");
  content.className = "cafe__content";
  const label = makeEl("p", "cafe__label", m.label);

  const prompt = document.createElement("div");
  prompt.className = "cafe__prompt";
  const question = makeEl("p", "cafe__question", PROMPTS[0]?.question ?? "");
  const companion = document.createElement("div");
  companion.className = "cafe__companion";
  const quote = makeEl("blockquote", "cafe__quote", PROMPTS[0]?.quote ?? "");
  const author = makeEl("cite", "cafe__author", authorLine(PROMPTS[0]));
  companion.append(quote, author);
  prompt.append(question, companion);

  const next = makeEl("button", "cafe__next", m.next);
  content.append(label, prompt, next);

  // Navigation (restrained, at the bottom).
  const navEl = buildBackNav(ctx, "cafe");

  root.append(scene, content, navEl);
  revealSpace(stage, root);

  // Next question: cross-fade (question and quote swap together).
  let pi = 0;
  let swapTimer = 0;
  const showNext = (): void => {
    pi = (pi + 1) % PROMPTS.length;
    prompt.classList.add("cafe__prompt--out");
    swapTimer = window.setTimeout(() => {
      const p = PROMPTS[pi];
      question.textContent = p?.question ?? "";
      quote.textContent = p?.quote ?? "";
      author.textContent = authorLine(p);
      prompt.classList.remove("cafe__prompt--out");
    }, 360);
  };
  next.addEventListener("click", showNext);

  // Parallax: each layer offsets by ×--depth; the lamp and the pool of light
  // stay put (§7). §12: reduced motion → no parallax. The slow self-drift keeps
  // it breathing without a pointer (e.g. on mobile).
  const stopParallax = prefersReducedMotion()
    ? null
    : startParallax(scene, {
        pointerX: 8,
        pointerY: 6,
        driftX: 3,
        driftY: 2,
        freqX: 0.16,
        freqY: 0.12,
        lerp: 0.05,
      });

  return {
    root,
    dispose: (): void => {
      stopParallax?.();
      if (swapTimer !== 0) clearTimeout(swapTimer);
      fadeOutAndRemove(root);
    },
  };
}
