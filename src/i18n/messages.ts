/* ════════════════════════════════════════════════════════════════
   i18n message contract
   ────────────────────────────────────────────────────────────────
   The shape every locale bundle must provide. A new language is added by
   dropping a file in ./locales/ that default-exports a LocaleBundle of this
   shape — TypeScript then checks that nothing is missing. No shared file
   needs editing (the loader auto-discovers locale files via import.meta.glob).
   ════════════════════════════════════════════════════════════════ */

/** Stable, locale-independent keys for the paper-boat directions (so a closing
 *  line can be looked up regardless of the displayed language). */
export type DirKey =
  | "grief"
  | "anxiety"
  | "anger"
  | "guilt"
  | "weariness"
  | "studies"
  | "work"
  | "relationships";

export interface Closing {
  gone: string;
  cheer: string;
}

export interface CafePrompt {
  question: string;
  quote: string;
  author: string;
}

export interface LibraryEntry {
  title: string;
  author: string;
  blurb: string;
  /** Free full-text link. The same target across locales (the encoding may
   *  differ); check-links reads the zh-Hant copy. */
  url: string;
}

export interface LibraryShelf {
  heading: string;
  entries: readonly LibraryEntry[];
}

export interface Messages {
  threshold: {
    title: string;
    tagline: string;
    enter: string;
    enterAria: string;
    skip: string;
  };
  /** The vibe-code declaration: shown inline at the front door, and behind a
   *  button on every space. Deliberately clear and direct, not just poetic. */
  colophon: {
    note: string;
    /** Label for the source-code link to the repo. */
    source: string;
    /** Button that reveals the note inside a space. */
    show: string;
    /** Dismiss label for the revealed panel. */
    close: string;
  };
  /** Shared navigation, reused by every shop. */
  nav: {
    backToStreet: string;
    setOut: string;
  };
  street: {
    label: string;
    title: string;
    note: string;
    empty: string;
    library: string;
    cafe: string;
    lookout: string;
    paperboat: string;
  };
  lookout: {
    ariaLabel: string;
    label: string;
    title: string;
    hint: string;
    story: readonly string[];
  };
  paperboat: {
    ariaLabel: string;
    label: string;
    lore: string;
    prompt: string;
    inputPlaceholder: string;
    inputAria: string;
    changeDirection: string;
    launch: string;
    foldAnother: string;
    fallbackWish: string;
    directions: Record<DirKey, { dir: string; items: readonly string[] }>;
    closings: Record<DirKey | "default", Closing>;
  };
  cafe: {
    ariaLabel: string;
    label: string;
    next: string;
    prompts: readonly CafePrompt[];
  };
  library: {
    ariaLabel: string;
    barTitle: string;
    /** Short "set out" for the thin sticky bar (kept terse on purpose). */
    barSetOut: string;
    /** Label for the shelf jump-index / catalog (e.g. "Contents"). */
    indexLabel: string;
    intro: string;
    shelves: readonly LibraryShelf[];
  };
}

export interface LocaleBundle {
  /** Locale code, e.g. "zh-Hant" or "en". Used as the stored preference. */
  code: string;
  /** Display name shown on the language toggle (its own native name). */
  name: string;
  /** Value written to <html lang>. */
  html: string;
  messages: Messages;
}
