/* ════════════════════════════════════════════════════════════════
   The street (§1 the haven island street / a world apart)  ── the
   landing spot after arriving, and the hub of the shops ──
   ────────────────────────────────────────────────────────────────
   You come ashore through the tunnel and land on this street. The shops
   stand side by side, none above another; empty storefronts remain, to
   open as many more as you like later.
   ════════════════════════════════════════════════════════════════ */

import { mountShell, type SpaceContext } from "../_shared/space-shell";
import { getMessages } from "../../i18n/i18n";

export default function mountStreet(stage: HTMLElement, ctx: SpaceContext) {
  const m = getMessages().street;
  return mountShell(
    stage,
    { namespace: "street", label: m.label, title: m.title, note: m.note },
    ctx,
    [
      { label: m.library, to: "library" },
      { label: m.cafe, to: "cafe" },
      { label: m.lookout, to: "lookout" },
      { label: m.paperboat, to: "paperboat" },
      { label: m.empty, to: null },
      { label: m.empty, to: null },
      { label: m.empty, to: null },
    ],
  );
}
