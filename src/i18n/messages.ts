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

/** The four beats of one breath at the stillroom, in order. Stable, locale-
 *  independent keys so the breathing guide can drive the scene regardless of
 *  the displayed language. */
export type BreathPhase = "inhale" | "hold" | "exhale" | "rest";

export interface BreathBeat {
  /** The large phase glyph shown in the breathing circle (吸 / In…). */
  word: string;
  /** The quiet cue beneath it. */
  cue: string;
}

/** Stable, locale-independent keys for the small menu of named paces — a light,
 *  quick breath through to a slow, deep one. The lead is still the default; this
 *  is just a shortcut for someone who knows the pace they want. */
export type PaceId = "gentle" | "coherent" | "calm" | "box" | "deep";

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
  /** The page-wide motion toggle (detailed ⇄ simple), a remembered choice. */
  motion: {
    /** Stable aria-label naming the control. */
    toggle: string;
    /** Visible label when detailed (full) motion is active. */
    detailed: string;
    /** Visible label when simple (calm) motion is active. */
    simple: string;
  };
  /** The corner build badge: the version, and on tap, this build's commit and a
   *  link back to its release notes. Purely informational. */
  version: {
    /** aria-label prefix for the chip (e.g. "Version" → "Version v0.3.0"). */
    label: string;
    /** Label preceding the commit SHA inside the panel. */
    commit: string;
    /** Text on the link to this version's release notes. */
    notes: string;
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
    stillroom: string;
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
  stillroom: {
    ariaLabel: string;
    label: string;
    /** A quiet line under the label: what this place is, what to do. */
    lore: string;
    /** The four breath beats, keyed so the guide stays language-agnostic. */
    phases: Record<BreathPhase, BreathBeat>;
    /** The stillroom-keeper's small companion line (a warm character touch). */
    keeper: string;
    /** A gentle comfort note (not medical advice): stop if it feels off. */
    safety: string;
    /** A standing disclaimer, kept plainly legible (not faint fine print):
     *  this is a place to ease the mind, not medical care — if unwell, judge
     *  by your own state and seek professional help. */
    notice: string;
    /** Forget the settled pace, back to being led from the start. */
    reset: string;
    /** The gentle "I'll lead you slower; stay wherever it suits you" pacing —
     *  it leads, you follow, never a test or a setup chore. */
    settle: {
      /** A one-line whisper that the fire is easing the pace and you can stay. */
      hint: string;
      /** Label on the "keep this pace" button. */
      stay: string;
    };
    /** The optional little menu of named paces, sitting quietly alongside the
     *  lead (you can also just be led and settle). */
    paces: {
      /** The quiet link that opens the menu (e.g. "換一種節奏"). */
      open: string;
      /** A short heading / the menu group's aria-label. */
      label: string;
      /** A warm name per pace — kept in the room's voice, not breathing jargon. */
      names: Record<PaceId, string>;
    };
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
