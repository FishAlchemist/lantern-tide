/* ════════════════════════════════════════════════════════════════
   Platform adapter (§8 dual-target architecture)
   ────────────────────────────────────────────────────────────────
   The thin seam of "one frontend, two shipments". The rest of the frontend is
   100% standard web; every behaviour that varies by platform is tucked behind
   here.

   For now only the web fallback (browser APIs) is implemented. The Tauri branch
   is left as a clear TODO — when a desktop build is actually wanted, fill in
   invoke()/the Rust side in this one file, nowhere else.

   §8 the real boundary of portability: don't depend on Tauri without a web
   fallback.
   ════════════════════════════════════════════════════════════════ */

/** Runtime detection: are we in Tauri or a browser?
 *  §8 step 2: Tauri injects a global. The exact name depends on the current
 *  Tauri version — pin it against the docs when building the desktop app; for
 *  now use a loose check. */
export function isTauri(): boolean {
  const w = window as unknown as Record<string, unknown>;
  return "__TAURI__" in w || "__TAURI_INTERNALS__" in w;
}

export type Platform = "web" | "tauri";

export function platform(): Platform {
  return isTauri() ? "tauri" : "web";
}

/* ── Persistent store (§10) ───────────────────────────────────────
   One interface; web uses localStorage, Tauri uses local storage.
   §8 consequence: single-machine, no cross-device sync — just right for a
   quiet personal space. */
export interface Store {
  get(key: string): string | null;
  set(key: string, value: string): void;
}

const webStore: Store = {
  get(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      // Private mode / storage blocked: degrade gracefully to "always the first time".
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* ignore: failing to persist shouldn't break the entrance */
    }
  },
};

// TODO(Tauri): fill this in when shipping the desktop build.
//   const tauriStore: Store = {
//     get: (k) => invoke<string|null>("store_get", { key: k }),  // ← must become async
//     set: (k, v) => invoke("store_set", { key: k, value: v }),
//   };
// Note invoke is async, so the Store interface would need to return Promises,
// or read persistent state into memory once at startup for synchronous access
// (the latter fits the current usage better).
export function store(): Store {
  return webStore;
}

/* ── §9 de-skinning: harden only on Tauri, keep the web build a good citizen ──
   On the web, text must be selectable, copyable and right-clickable (especially
   in the library). Only apply app-like hardening when Tauri is detected. */
export function applyPlatformChrome(): void {
  if (!isTauri()) return; // web build: do nothing, be a good web citizen

  // Conditional styling applied only on Tauri.
  document.documentElement.dataset["platform"] = "tauri";
  // e.g. user-select:none, suppress the context menu, overscroll-behavior:none,
  // remove the tap highlight (prefer a [data-platform="tauri"] selector in CSS
  // rather than inline here).
}
