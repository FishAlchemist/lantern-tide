# Lantern Tide

> A silent observer of the shifting tides, distilling the weight of the deep into a flicker of steady light.

The name and the URL are placeholders. The only fixed anchor is the core concept below; the name is just a swappable label.

Also available in: [Traditional Chinese](./README.zh-Hant.md)

---

## This is a Vibe Code project

This repository is vibe code: a do-whatever-comes-to-mind project. It exists to let small, passing ideas come alive, not to be written perfectly.

If you are looking for a codebase with good engineering quality, please do not pick this one. The whole point of vibing on it is that the goal was never a flawless project; it was just a place to keep a fleeting little idea breathing.

That said, the intent below is the floor. Code quality is free to wander; the vision and the aesthetic are not.

## Vision and core concept (the binding floor)

The real theme is life drifting with the current. Calm is not a style, it is a result: the silent observer who, amid tides they cannot control, distills the weight of the deep into a single steady light.

The imagery system is the spine of the whole project. Every design decision hangs off this line:

| Stage                    | Image                       | Maps to                          |
| ------------------------ | --------------------------- | -------------------------------- |
| Tide / deep sea / drift  | Heavy, adrift, not chosen   | Walking the tunnel = loading     |
| Distillation / alchemy   | Refining heavy into pure    | The moment you step out          |
| A single steady flicker  | The lamp that does not move | The destination: a livable light |
| Rest, replenish, set out | Tides rise and fall         | Pause, then return to the tide   |

More about the concept:

- The name echoes the spine: the lantern, a steady unmoving glow, standing within the tide, which is ever-shifting.
- The destination is a waypoint, not an endpoint. You drift here to rest and replenish, then set out again, so the experience carries a cyclical rhythm, never "arrive and settle".
- Human-centered: this is a place built for people, not optimized for bots. The front door may be indexed; everything inside is meant to be reached by a human.
- Key insight: walking through the tunnel is a natural human threshold. A crawler will not walk through a tunnel, so the aesthetic idea and the anti-bot goal turn out to be the same thing.

## Design principles

1. Smoothness first. Jank destroys the sense of calm. Simple-and-smooth beats fancy-and-janky. The real killer is the occasional micro-stutter, not a low frame rate.
2. Human-centered, guard the entrance. Not "lock the content"; just (a) do not be a data source for bots, and (b) everyone enters through the front door, the tunnel, with no cold-dropping into the middle and breaking the flow.
3. Spatial continuity. Once you have walked through the tunnel, you never "leave" again; moving within the space is a smooth transition, not a reload.
4. Static-first, backend-decoupled. The whole site is pure frontend (HTML / CSS / JS, compiled from TS). A backend is never required; it can deploy as plain static files.

## Aesthetic floor

Intent: quiet, warm, slow, low-contrast but clear. One steady light, facing the ever-shifting deep.

The one deliberate risk, where all the boldness is spent: invert the usual warm-cream-background instinct. Make the deep the ground and the warm light the figure. The deep sea and night are the world; the library and café are warm rooms lit within that deep; and the one breathing lantern is the single memory point and hotspot of the whole site. Everything else stays quiet and restrained, like taking one accessory off before leaving the house.

- Low saturation throughout; deep as ground, warm light as the lit figure.
- Motion thesis: the world drifts slowly, the light stays still. The background may drift like something underwater; the lantern alone holds its place. Stillness within motion is that contrast.
- Type leans toward a warm old-style serif; emphasis comes from italics or color rather than bold, because heaviness fights the calm.

## How it is built

For how the static site is actually put together, including the experience flow, the routing, the guarded entrance, the tunnel that doubles as the loader, and the design tokens, see [docs/architecture.md](./docs/architecture.md).

## Repository and license

Source: https://github.com/FishAlchemist/lantern-tide

Live site (GitHub Pages): https://fishalchemist.github.io/lantern-tide/

License: MIT.
