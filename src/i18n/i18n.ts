/* ════════════════════════════════════════════════════════════════
   i18n core
   ────────────────────────────────────────────────────────────────
   Locale bundles live one-per-file under ./locales and are auto-discovered
   here via import.meta.glob — to add a language, drop a new file in that
   folder (no shared file to edit). The default is zh-Hant (the site's mother
   tongue and the static index.html copy); the choice is persisted (§8 store)
   and written to <html lang>.

   Components read getMessages() at mount time; when the locale changes,
   main.ts re-mounts the active space so its content swaps language.
   ════════════════════════════════════════════════════════════════ */

import { store } from "../platform/adapter";
import type { LocaleBundle, Messages } from "./messages";

// Auto-load every locale bundle in ./locales (eager, default export only).
const loaded = import.meta.glob<LocaleBundle>("./locales/*.ts", {
  eager: true,
  import: "default",
});

const BUNDLES: Record<string, LocaleBundle> = {};
for (const bundle of Object.values(loaded)) {
  BUNDLES[bundle.code] = bundle;
}

export const DEFAULT_LOCALE = "zh-Hant";
const KEY = "lt.locale";

function firstCode(): string {
  const codes = Object.keys(BUNDLES);
  return codes[0] ?? DEFAULT_LOCALE;
}

/** Coerce an arbitrary/stored code to one we actually have. */
function normalize(code: string | null): string {
  if (code !== null && Object.prototype.hasOwnProperty.call(BUNDLES, code)) {
    return code;
  }
  return DEFAULT_LOCALE in BUNDLES ? DEFAULT_LOCALE : firstCode();
}

let current = normalize(store().get(KEY));
const listeners = new Set<(code: string) => void>();

function bundleFor(code: string): LocaleBundle | undefined {
  return BUNDLES[code] ?? BUNDLES[DEFAULT_LOCALE] ?? Object.values(BUNDLES)[0];
}

export function getLocale(): string {
  return current;
}

export function getMessages(): Messages {
  const bundle = bundleFor(current);
  if (bundle === undefined) throw new Error("No i18n locale bundles loaded");
  return bundle.messages;
}

/** All available locales, in file order — for building a language switcher. */
export function availableLocales(): readonly { code: string; name: string }[] {
  return Object.values(BUNDLES).map((b) => ({ code: b.code, name: b.name }));
}

export function localeName(code: string): string {
  return BUNDLES[code]?.name ?? code;
}

/** Set <html lang> to the current locale (call once on boot). */
export function applyInitialLang(): void {
  document.documentElement.lang = bundleFor(current)?.html ?? DEFAULT_LOCALE;
}

export function setLocale(code: string): void {
  const next = normalize(code);
  if (next === current) return;
  current = next;
  store().set(KEY, next);
  document.documentElement.lang = bundleFor(next)?.html ?? DEFAULT_LOCALE;
  for (const cb of listeners) cb(next);
}

/** The next locale in the cycle (wraps around) — for a simple toggle button. */
export function nextLocale(): string {
  const codes = Object.keys(BUNDLES);
  if (codes.length === 0) return current;
  const i = codes.indexOf(current);
  return codes[(i + 1) % codes.length] ?? current;
}

export function cycleLocale(): void {
  setLocale(nextLocale());
}

export function onLocaleChange(cb: (code: string) => void): () => void {
  listeners.add(cb);
  return (): void => {
    listeners.delete(cb);
  };
}
