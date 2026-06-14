/* ════════════════════════════════════════════════════════════════
   Path (history) routing
   ────────────────────────────────────────────────────────────────
   The whole experience lives under a base segment (/street), so each shop is a
   two-segment URL: /street/library, /street/cafe, /street/lookout,
   /street/paperboat; the street (the hub) is /street. The bare root / is the
   front door — and every other root path is left free for the project's own
   content later (e.g. /about, /blog), which the experience deliberately
   doesn't occupy. Uses history.pushState to switch without reloading, and the
   browser back/forward buttons work too (popstate).

   Needs a server-side SPA fallback: any unknown path returns index.html —
   Vite's dev/preview do this by default (appType: "spa"); a static deploy
   also needs a 404 → index.html rule.

   namespaces are the space folders under src/spaces/ (auto-discovered, see
   src/spaces/registry.ts); each may have rooms.
   ════════════════════════════════════════════════════════════════ */

import { SPACE_NAMESPACES } from "../spaces/registry";

// The base segment the whole experience is mounted under (root paths like
// /about stay free for the project's own content). It is "street": the hub
// renders at /street and shops at /street/<shop>, so the URL mirrors the folder
// tree (street/<shop>/) — which means BASE doubles as the default namespace.
const BASE = "street";

// ── Deploy base (Vite BASE_URL) ───────────────────────────────────────────
// "/" in dev, preview and tests; "/lantern-tide/" for the GitHub Pages build.
// Routing is written against app-absolute paths (/street/…); this prefix is
// stripped off incoming pathnames and re-added when we build a URL, so the same
// code runs at the root locally and under the project subpath on Pages.
const APP_BASE = import.meta.env.BASE_URL;
const BASE_PREFIX = APP_BASE.replace(/\/+$/, ""); // "" at root, "/lantern-tide" on Pages

/** Strip the deploy base off a real pathname → an app-absolute path ("/…"). */
function toAppPath(pathname: string): string {
  if (BASE_PREFIX === "") return pathname;
  if (pathname === BASE_PREFIX) return "/";
  if (pathname.startsWith(`${BASE_PREFIX}/`)) {
    return pathname.slice(BASE_PREFIX.length);
  }
  return pathname;
}

/** Re-add the deploy base to an app-absolute path → a real browser path. */
function toBrowserPath(appPath: string): string {
  return BASE_PREFIX === "" ? appPath : `${BASE_PREFIX}${appPath}`;
}

// After reaching the haven island you land on "the street" (the little street
// of the world apart, §1/§3); the library, café, lookout and paper-boat shop
// are all shops on it — side by side, none above another, with room to open more.
//
// A namespace is just a space's folder name. The set of spaces is auto-discovered
// from the folder layout (src/spaces/registry.ts), so adding a space is dropping
// in a folder — no edit here. That makes Namespace a runtime-validated string
// rather than a compile-time union (the same trade-off i18n makes for locale
// codes); parsePath checks it against the discovered set before trusting it.
export type Namespace = string;
export const DEFAULT_NAMESPACE: Namespace = "street";

export interface Route {
  namespace: Namespace;
  /** A room/area under the namespace, optional (§14 to be detailed). */
  room: string | null;
}

/** Is this path segment one of the auto-discovered spaces? */
function isNamespace(value: string): boolean {
  return SPACE_NAMESPACES.includes(value);
}

/** Parse location.pathname → Route. Only paths under /street are the experience;
 *  the bare root (or any other root path) falls back to the default space (the
 *  street, i.e. the front-door landing). */
export function parsePath(pathname: string): Route {
  // Like /street/cafe or /street/library/window-seat; tolerate extra slashes.
  // The deploy base (e.g. /lantern-tide on Pages) is stripped off first.
  const parts = toAppPath(pathname)
    .split("/")
    .filter((p) => p.length > 0);
  if (parts[0] !== BASE) {
    return { namespace: DEFAULT_NAMESPACE, room: null };
  }
  const ns = parts[1] ?? "";
  const roomPart = parts[2];
  return {
    namespace: isNamespace(ns) ? ns : DEFAULT_NAMESPACE,
    room: roomPart !== undefined && roomPart.length > 0 ? roomPart : null,
  };
}

export function currentRoute(): Route {
  return parsePath(location.pathname);
}

/** Route → URL path. The street (the hub) is /street; shops are /street/<shop>
 *  (optionally with a room). */
export function routeToPath(route: Route): string {
  const root = `/${BASE}`;
  // The hub (default namespace) is the base segment itself and has no rooms, so
  // it always collapses to /street — never /street/street. Shops are
  // /street/<shop>[/<room>]. (parsePath treats both /street and /street/street
  // as the hub, but only /street is ever generated here.)
  const appPath =
    route.namespace === DEFAULT_NAMESPACE
      ? root
      : route.room !== null
        ? `${root}/${route.namespace}/${route.room}`
        : `${root}/${route.namespace}`;
  return toBrowserPath(appPath);
}

let routeHandler: ((route: Route) => void) | null = null;

/** Switch the URL without reloading. Spatial continuity (§2): moving within a
 *  space is a smooth transition. pushState/replaceState don't fire an event,
 *  so notify the handler once ourselves. */
export function go(route: Route, replace = false): void {
  const path = routeToPath(route);
  if (replace) {
    history.replaceState(null, "", path);
  } else {
    history.pushState(null, "", path);
  }
  routeHandler?.(currentRoute());
}

/** Is the current URL inside the experience (/street…)? Used on cold load to
 *  land directly in that space, so a reload keeps you in the shop instead of
 *  bouncing back to the front door. The bare root / is the front door. */
export function isExperiencePath(): boolean {
  const p = toAppPath(location.pathname).replace(/\/+$/g, "");
  return p === `/${BASE}` || p.startsWith(`/${BASE}/`);
}

/** Reset the URL to the bare front door (after "set out again"), without
 *  notifying listeners — so a later reload shows the front door. */
export function syncFrontDoor(): void {
  history.replaceState(null, "", APP_BASE);
}

export function onRouteChange(handler: (route: Route) => void): () => void {
  routeHandler = handler;
  // Browser back/forward → popstate; in-app go() notifies directly (see above).
  const onPop = (): void => {
    handler(currentRoute());
  };
  window.addEventListener("popstate", onPop);
  return (): void => {
    if (routeHandler === handler) routeHandler = null;
    window.removeEventListener("popstate", onPop);
  };
}
