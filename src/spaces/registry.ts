/* ════════════════════════════════════════════════════════════════
   Space registry  ── auto-discovery, so adding a space is dropping in a folder ──
   ────────────────────────────────────────────────────────────────
   The wiring that used to be hand-maintained in two places (the router's
   namespace list and main.ts's loader map) is derived here from the folder
   layout, mirroring how i18n auto-discovers its locale bundles.

   Convention: a space is a folder (anywhere under src/spaces/) holding a
   <name>.space.ts entry that default-exports its mount function; <name> is the
   namespace. The folder layout mirrors the world (and the URL): the street is
   the hub, the shops sit under it (street/cafe/cafe.space.ts → /street/cafe).
   The .space.ts marker is the whole trick: the glob matches only it, so any
   other .ts in a space folder is just a helper — free to sit beside the entry,
   and bundled into that space's own chunk — while tests, _shared and this
   registry are never mistaken for spaces. Drop in a new <name>/<name>.space.ts
   and it is routable and loadable with no edits here.

   Loaders are lazy (import.meta.glob without `eager`), so each space stays its
   own chunk, fetched only when entered (§10) — the same code-splitting the hand
   -written dynamic imports gave us.
   ════════════════════════════════════════════════════════════════ */

import type { MountFn } from "./_shared/space-shell";

interface SpaceModule {
  default: MountFn;
}

// Keying on the .space.ts marker, the glob matches ONLY entries — at any depth,
// so shops nested under street/ count. Everything else (helpers, the co-located
// test, _shared, this registry) is ignored, which matters for the BUILD too:
// import.meta.glob emits a chunk per matched file, so a broader pattern would
// ship a dead chunk for each non-space .ts (and drag Vitest into dist).
const modules = import.meta.glob<SpaceModule>("./**/*.space.ts");

// namespace (the entry filename without its .space.ts marker) → its lazy loader.
const loaders = new Map<string, () => Promise<SpaceModule>>();
for (const [path, loader] of Object.entries(modules)) {
  const namespace = path
    .split("/")
    .at(-1)
    ?.replace(/\.space\.ts$/, "");
  if (namespace === undefined || namespace.length === 0) continue;
  loaders.set(namespace, loader);
}

/** Every discovered space namespace (folder name), in stable alphabetical order. */
export const SPACE_NAMESPACES: readonly string[] = [...loaders.keys()].sort();

/** The lazy chunk loader for a namespace, or undefined if no such space exists. */
export function loadSpace(
  namespace: string,
): (() => Promise<SpaceModule>) | undefined {
  return loaders.get(namespace);
}
