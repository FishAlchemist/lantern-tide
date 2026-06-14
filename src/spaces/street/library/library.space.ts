/* ════════════════════════════════════════════════════════════════
   The library (§3)  ── a shop on the street; its own chunk, fetched
   only after entering (§10) ──
   ────────────────────────────────────────────────────────────────
   Temperament (the opposite of the café): cool, orderly, ink-on-paper —
   a single "lit page" floating in the dark, holding a categorised list of
   modern classics. Each entry: title · author + a one-line blurb + a link to
   a free full text. Scrollable, restrained, like really looking something up.

   A catalog index (§9 quick-find) sits alongside: a pinned side rail beside the
   page on wide screens, a collapsible "Contents" disclosure under the bar on
   phones. Each link smooth-scrolls to its shelf and the shelf you're in lights
   up (scroll-spy).

   Content (per the brief): modern pieces (20–21c speeches / essays / articles),
   tied to the site's themes (drifting, havens, facing reality, impermanence
   and stillness). The catalog lives in the locale bundles; links point to free
   sources — report dead links (pnpm check:links reads them from a locale file).
   ════════════════════════════════════════════════════════════════ */

import "../../_shared/spaces.css"; // .space base (fixed full-screen, scroll, fade-in); robust for deep links
import "./library.css";
import { makeEl } from "../../../util/dom";
import { getMessages } from "../../../i18n/i18n";
import { prefersReducedMotion } from "../../../state/session";
import {
  createSpaceRoot,
  fadeOutAndRemove,
  revealSpace,
} from "../../_shared/scene";
import type { MountedSpace, SpaceContext } from "../../_shared/space-shell";

/** An element's top within a scroll container, summed from the layout offsets
 *  (offsetTop up the offsetParent chain). This is the flow position, unaffected
 *  by sticky shifting — which is exactly why scrollIntoView / IntersectionObserver
 *  misbehave on sticky headings (they see the stuck position, not this one). */
function offsetTopWithin(el: HTMLElement, container: HTMLElement): number {
  let y = 0;
  let node: HTMLElement | null = el;
  while (node !== null && node !== container) {
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return y;
}

export default function mountLibrary(
  stage: HTMLElement,
  ctx: SpaceContext,
): MountedSpace {
  const m = getMessages().library;
  const nav = getMessages().nav;

  const root = createSpaceRoot("library", m.ariaLabel, "library");

  // Thin sticky top bar: back · title · set out — easy to leave mid-scroll.
  const bar = document.createElement("div");
  bar.className = "library__bar";
  const back = makeEl("button", "library__navlink", nav.backToStreet);
  back.addEventListener("click", () => {
    ctx.goTo("street");
  });
  const barTitle = makeEl("span", "library__bar-title", m.barTitle);
  const leave = makeEl("button", "library__navlink", m.barSetOut);
  leave.addEventListener("click", () => {
    ctx.leave();
  });
  bar.append(back, barTitle, leave);

  // The catalog index (side rail / collapsible disclosure). On phones the list
  // drops as an overlay panel toggled by this button; on wide screens CSS pins
  // it as a rail and the toggle is hidden.
  const index = document.createElement("nav");
  index.className = "library__index";
  index.setAttribute("aria-label", m.indexLabel);
  const toggle = makeEl("button", "library__index-toggle", m.indexLabel);
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-controls", "library-index-list");
  const indexList = document.createElement("ul");
  indexList.className = "library__index-list";
  indexList.id = "library-index-list";
  index.append(toggle, indexList);

  const setOpen = (open: boolean): void => {
    index.classList.toggle("library__index--open", open);
    toggle.setAttribute("aria-expanded", String(open));
  };
  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  // The lit page: the catalog.
  const page = document.createElement("div");
  page.className = "library__page";
  const lantern = makeEl("div", "library__lantern", "");
  lantern.setAttribute("aria-hidden", "true");
  const intro = makeEl("p", "library__intro", m.intro);
  page.append(lantern, intro);

  // Build shelves; each heading gets a stable, locale-independent id so the
  // index can jump to it and the scroll-spy can light it up.
  const headings: HTMLElement[] = [];
  const linkById = new Map<string, HTMLElement>();
  // Cached natural top of each shelf within the scroll container (filled by
  // measure() below). offsetTop reflects the *stuck* position once a sticky
  // heading pins, so it can't be trusted live — we snapshot it unstuck instead.
  let shelfTops: number[] = [];

  m.shelves.forEach((shelf, i) => {
    const id = `library-shelf-${String(i)}`;
    const heading = makeEl("h3", "library__heading", shelf.heading);
    heading.id = id;
    page.appendChild(heading);
    headings.push(heading);

    const list = document.createElement("div");
    list.className = "library__list";
    for (const item of shelf.entries) {
      const entry = document.createElement("a");
      entry.className = "library__entry";
      entry.href = item.url;
      entry.target = "_blank";
      entry.rel = "noopener noreferrer";
      const head = document.createElement("div");
      head.className = "library__entry-head";
      head.append(
        makeEl("span", "library__entry-title", item.title),
        makeEl("span", "library__entry-author", item.author),
      );
      entry.append(head, makeEl("p", "library__entry-blurb", item.blurb));
      list.appendChild(entry);
    }
    page.appendChild(list);

    // The matching index entry: jump to this shelf (instant under reduced
    // motion), then close the mobile panel.
    const li = document.createElement("li");
    const link = makeEl("button", "library__index-link", shelf.heading);
    link.addEventListener("click", () => {
      // Scroll the container ourselves (not heading.scrollIntoView, which won't
      // move to a sticky heading above the current view) to the shelf's cached
      // natural top, landing it just below the sticky bar/strip.
      const sticky =
        Number.parseFloat(getComputedStyle(heading).scrollMarginTop) || 0;
      const top = shelfTops[i] ?? offsetTopWithin(heading, root);
      root.scrollTo({
        top: Math.max(0, top - sticky),
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
      setOpen(false);
    });
    li.appendChild(link);
    indexList.appendChild(li);
    linkById.set(id, link);
  });

  root.append(bar, index, page);
  revealSpace(stage, root);

  // Snapshot each shelf's natural top while nothing is stuck (briefly resetting
  // scroll so sticky headings don't skew offsetTop). Mount is already at 0;
  // resize refreshes; locale changes re-mount, refreshing for free.
  const measure = (): void => {
    const prev = root.scrollTop;
    if (prev !== 0) root.scrollTop = 0; // unstick everything before measuring
    shelfTops = headings.map((heading) => offsetTopWithin(heading, root));
    if (prev !== 0) root.scrollTop = prev;
  };

  // Scroll-spy: light up the shelf whose heading has reached the reading line
  // (just under the sticky bar). Computed from the cached offsets on scroll —
  // not an IntersectionObserver, which sticky headings defeat (it never fired
  // going up). A handful of comparisons per frame; rAF keeps it off the hot
  // path (§2 smoothness).
  const setActive = (id: string): void => {
    for (const [key, link] of linkById) {
      link.classList.toggle("library__index-link--active", key === id);
    }
  };
  const readingLine = (): number => {
    const first = headings[0];
    return first
      ? Number.parseFloat(getComputedStyle(first).scrollMarginTop) || 0
      : 0;
  };
  const updateActive = (): void => {
    const line = root.scrollTop + readingLine() + 4;
    let currentId = headings[0]?.id ?? "";
    for (let i = 0; i < headings.length; i++) {
      const heading = headings[i];
      if (heading === undefined || (shelfTops[i] ?? 0) > line) break;
      currentId = heading.id;
    }
    if (currentId.length > 0) setActive(currentId);
  };

  // rAF-coalesced scroll handler; the id doubles as the "already scheduled" flag
  // and lets dispose cancel a pending frame (so it can't fire on a torn-down space).
  let rafId = 0;
  const onScroll = (): void => {
    if (rafId !== 0) return;
    rafId = requestAnimationFrame(() => {
      rafId = 0;
      updateActive();
    });
  };
  const onResize = (): void => {
    measure();
    updateActive();
  };
  measure(); // snapshot now (mount is at scrollTop 0)
  root.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);
  updateActive(); // initial highlight

  return {
    root,
    dispose: (): void => {
      root.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (rafId !== 0) cancelAnimationFrame(rafId);
      fadeOutAndRemove(root);
    },
  };
}
