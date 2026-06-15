/* ════════════════════════════════════════════════════════════════
   Build info — which light you're holding
   ────────────────────────────────────────────────────────────────
   The version and commit are stamped in at build time by Vite's `define`
   (see vite.config.ts): __APP_VERSION__ comes from package.json, __GIT_SHA__
   from `git rev-parse HEAD`. Everything below is a pure function of those two
   strings, so the corner version badge (built in main.ts) and its tests can
   share one source of truth.
   ════════════════════════════════════════════════════════════════ */

// Stamped in by Vite at build time (declared in vite-env.d.ts). Guarded with
// typeof so a bare import outside the Vite/Vitest pipeline (no define) still
// resolves to a dev placeholder instead of throwing a ReferenceError.
const RAW_VERSION: string =
  typeof __APP_VERSION__ === "string" ? __APP_VERSION__ : "0.0.0";
const RAW_SHA: string =
  typeof __GIT_SHA__ === "string" ? __GIT_SHA__ : "unknown";

/** The repository these builds come from; the badge's links all hang off it. */
export const REPO_URL = "https://github.com/FishAlchemist/lantern-tide";

/** This build's version, e.g. "0.3.0" (no leading "v"). */
export const APP_VERSION = RAW_VERSION;

/** This build's full git commit SHA, or "unknown" when built without git. */
export const GIT_SHA = RAW_SHA;

/** The chip's label: a leading "v", matching the release tag shape (v0.3.0). */
export function versionLabel(version: string = APP_VERSION): string {
  return `v${version}`;
}

/** True when the SHA looks like a real git object id — so it's safe to link to
 *  a commit page. False for the "unknown" placeholder of a no-git build. */
export function isResolvedSha(sha: string = GIT_SHA): boolean {
  return /^[0-9a-f]{7,40}$/.test(sha);
}

/** A full 40-char SHA shortened for display; a non-resolved value (the dev
 *  placeholder) is left untouched so it still reads as itself. */
export function shortSha(sha: string = GIT_SHA, len = 7): string {
  return isResolvedSha(sha) ? sha.slice(0, len) : sha;
}

/** The GitHub Release page for a version's tag — where its release notes live. */
export function releaseUrl(version: string = APP_VERSION): string {
  return `${REPO_URL}/releases/tag/${versionLabel(version)}`;
}

/** The GitHub commit page for a SHA (only meaningful when isResolvedSha). */
export function commitUrl(sha: string = GIT_SHA): string {
  return `${REPO_URL}/commit/${sha}`;
}
