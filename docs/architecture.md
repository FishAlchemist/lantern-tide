# Architecture

How the static site is actually built. The README holds the vision and the aesthetic floor; this document holds the how, and it describes what exists today, not what might come later.

The whole thing is a pure static frontend: Vite plus vanilla TypeScript, no backend and no runtime framework. It builds to plain files and can be hosted anywhere static.

## The experience as one flow

The site is a single page that never reloads once you are inside:

1. Front door. The bare root path is a static, indexable page (the threshold): a title, a tagline, an Enter button and a Skip button.
2. Tunnel. Pressing Enter forms a little paper boat and carries it through a tunnel of warm light. The tunnel doubles as the loading screen.
3. Cross-fade. When the walk ends, the target space mounts underneath the tunnel and the tunnel dissolves to reveal it. One continuous transition, no hard page cut.
4. The street. You land on a small street, the hub; the shops open from here.
5. Loop. Leaving a shop returns you to the front door to set out again. The destination is a waypoint, not an endpoint.

Skip lands you directly in a space with no tunnel and no boat. It is also the path taken for reduced motion, and for a reload or deep link that arrives straight at a shop URL.

## Routing and namespaces

The experience uses path (history) routing. The shape is what is stable here; the individual spaces will come and go, so the concrete list belongs in the code, not in this document.

- The bare root path is the front door: static, indexable, the one URL a cold visitor or a crawler sees.
- Everything inside mounts under a single base segment. Each space is one namespace, reached as a two-segment path under that base. The base segment lives in `src/router/router.ts`; the set of namespaces is auto-discovered from the folder layout under `src/spaces/` (`src/spaces/registry.ts`), so adding a space is dropping in a `<name>/<name>.space.ts` folder, with no router or loader edit. The trade-off, the same one i18n makes for locale codes, is that a namespace is a runtime-validated string rather than a compile-time union.
- Root paths outside the base segment (for example `/about`, `/blog`) are left free for the project's own future content; the experience deliberately does not occupy them.
- `history.pushState` switches spaces without a reload; the browser back and forward buttons work through `popstate`.
- A static deploy needs an SPA fallback: any unknown path returns `index.html`. Vite dev and preview already do this; the production build also writes a `404.html` copy of the shell, which is the fallback GitHub Pages serves for unknown deep links.
- It deploys to GitHub Pages under a project subpath. The build sets Vite's base to that subpath and the router reads `import.meta.env.BASE_URL`, so the same code runs at the root locally and under the subpath in production; the base segment stays defined in `src/router/router.ts`.

## The entrance, and why it is guarded

The goal is not to lock content away. It is to keep the experience human-first: everyone arrives through the front door instead of parachuting into the middle, and a bot crawling the site finds an empty shell.

- A space's content is its own lazy chunk, imported only after the entrance completes. A cold load, or a crawler that does not run JS, stops at the front door and never fetches any shop content.
- The front door is build-time static HTML, so it stays indexable on its own.
- The entrance variant is chosen per load from whether you have visited before, how long since the last visit, and prefers-reduced-motion: a full tunnel, a warm threshold, a soft threshold, or an instant fade. A first visit is an arrival; coming back is a lighter return.
- Source of truth: `src/state/session.ts`.

## The tunnel is the loader

- One radial-gradient orb of warm light, scaled up with `transform` and brightened with `opacity`. No rings, no flash: one field of light gently filling the view. This replaced an earlier concentric-ring idea after feedback that it felt too abrupt.
- It runs while the target space's chunk loads, so stepping out of the tunnel is also load-complete; there is no late fetch at the seam.
- It animates only `transform` and `opacity`, and allocates nothing inside the requestAnimationFrame loop, so the whole walk stays on the compositor.
- Source of truth: `src/tunnel/tunnel.ts` and `src/tunnel/tunnel.css`.

## Design tokens

The aesthetic floor (quiet, warm, slow, low-contrast but clear; dark as the ground, warm light as the figure) is encoded as CSS custom properties in `src/style.css` under `:root`: color, a 4px spacing scale, motion durations and eases, a procedural SVG grain texture, and type. The one breathing lantern is the only hotspot, so everything else stays quiet enough for it to read. `style.css` is the single source of truth for the tokens; the spaces only re-weight them.

## Why vanilla TypeScript

- No framework runtime is shipped: no React over the wire, nothing to parse and hydrate on the client. The interaction budget does not need it, and the weight would work against smoothness-first.
- Animation is plain requestAnimationFrame plus CSS transforms; there is no animation library.
- Vite builds a pure static bundle. Each space is a separate chunk, loaded only after entering, so the initial load is just the front door and the entrance.

## Internationalization

- Locale bundles live one per file under `src/i18n/locales` and are auto-discovered by `import.meta.glob`; adding a language is dropping in one file.
- The default locale is `zh-Hant`, which is also the static `index.html` copy. The choice is persisted and written to `<html lang>`. A space re-mounts on a language change so its content swaps.
- All human-facing copy goes through these bundles. Only the `zh-Hant` bundle carries Chinese; the rest of the codebase stays English.

## Accessibility and motion

- prefers-reduced-motion gets an instant entrance with no movement. The one exception is the front door's slow tide swell and lantern breath: they are ambient, low-amplitude and not vection, and the tide is the site's identity, so they keep breathing (gently) even under reduced motion. Pressing Enter is an explicit choice for full motion that overrides reduced-motion for the rest of the session.
- Skip is always available, to land directly with no animation.
- A visible `:focus-visible` ring (the lantern amber, or ink on the light library page) marks every interactive control.
- The library page keeps its text selectable and copyable, like a good web citizen.

## Where to look

| Area                            | File                                                                                                                       |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Boot and entrance orchestration | `src/main.ts`                                                                                                              |
| History routing and namespaces  | `src/router/router.ts`                                                                                                     |
| Entrance state machine          | `src/state/session.ts`                                                                                                     |
| Tunnel / loader                 | `src/tunnel/`                                                                                                              |
| Spaces                          | `src/spaces/` — the street is the hub (`street/`); shops nest under it (`street/<shop>/`); shared primitives in `_shared/` |
| Space discovery / loading       | `src/spaces/registry.ts` (drop in a `<name>/<name>.space.ts` folder anywhere under spaces — auto-routed)                   |
| Locale bundles                  | `src/i18n/` (`zh-Hant` is the default)                                                                                     |
| Design tokens                   | `src/style.css`                                                                                                            |
| Front-door-only indexing        | `public/robots.txt`                                                                                                        |
| Quality gate (check + e2e)      | `.github/workflows/ci.yml` (push to main / PRs → `check` and `e2e` run as parallel jobs)                                   |
| Shared CI/deploy setup          | `.github/actions/setup/` (composite: pnpm + Node + install; each job runs `actions/checkout` first)                        |
| GitHub Pages deploy             | `.github/workflows/deploy.yml` (on-demand `v*` tag / manual; runs `check` + `e2e`, then build + deploy only if green)      |
