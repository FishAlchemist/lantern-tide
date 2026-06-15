// Minimal Node typings for vite.config.ts (the repo ships no @types/node). Vite
// evaluates the config in Node, where these built-ins really exist; this only
// describes the small slice the config touches to stamp the build info. As an
// ambient .d.ts (no imports/exports) these are module declarations, not
// augmentations — so they define the modules rather than trying to extend them.
declare module "node:child_process" {
  export function execSync(
    command: string,
    options?: { stdio?: readonly (string | number | null)[] },
  ): { toString(): string };
}

declare module "node:fs" {
  export function readFileSync(path: string, encoding: "utf8"): string;
}
