/* Cut a GitHub Release from its notes file and publish it — which triggers the
   gated Pages deploy (deploy.yml runs on `release: published`).

   A Release body is the notes file with two transforms (the source .md keeps
   both, since they're correct for reading the file in the repo):
     1. strip the leading "# H1" — GitHub renders the Release title on its own,
        so a body starting with the same "# title" would print it twice. The H1
        text becomes the Release --title.
     2. absolutize sibling links — GitHub does NOT rewrite relative links in a
        Release body, so "[..](./vX.zh-Hant.md)" would 404. Links to sibling
        notes ("./…") are rewritten to the blob URL on the release's own tag.

   Usage:
     node scripts/release.mjs [vX.Y.Z] [--target <sha>] [--dry-run]
       vX.Y.Z     version to cut; defaults to package.json's version.
       --target   commit to tag; defaults to HEAD.
       --dry-run  print the title, transformed body, and the gh command — no-op.
   Or: pnpm run release vX.Y.Z
*/
import { readFileSync, writeFileSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";

const REPO_URL = "https://github.com/FishAlchemist/lantern-tide";

// ── parse args ──
const argv = process.argv.slice(2);
const dryRun = argv.includes("--dry-run");
const targetAt = argv.indexOf("--target");
const positional = argv.filter(
  (a, i) => !a.startsWith("--") && i !== targetAt + 1,
);

function readPkgVersion() {
  const pkg = JSON.parse(
    readFileSync(new URL("../package.json", import.meta.url), "utf8"),
  );
  return pkg.version;
}

const raw = positional[0] ?? readPkgVersion();
const tag = raw.startsWith("v") ? raw : `v${raw}`;

// ── read + transform the notes ──
let md;
try {
  md = readFileSync(
    new URL(`../docs/releases/${tag}.md`, import.meta.url),
    "utf8",
  );
} catch {
  console.error(`No notes file: docs/releases/${tag}.md`);
  process.exit(1);
}

const lines = md.split("\n");
if (!lines[0].startsWith("# ")) {
  console.error(`docs/releases/${tag}.md must start with a "# Title" line.`);
  process.exit(1);
}
const title = lines[0].slice(2).trim();

// drop the H1, then any blank lines under it, and absolutize sibling links
const rest = lines.slice(1);
while (rest.length && rest[0].trim() === "") rest.shift();
const body = rest
  .join("\n")
  .replace(/\]\(\.\//g, `](${REPO_URL}/blob/${tag}/docs/releases/`);

// ── target commit ──
const target =
  targetAt !== -1
    ? argv[targetAt + 1]
    : execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();

// ── publish (or preview) ──
const ghArgs = ["release", "create", tag, "--target", target, "--title", title];

if (dryRun) {
  console.log(`tag:    ${tag}`);
  console.log(`title:  ${title}`);
  console.log(`target: ${target}`);
  console.log(`gh ${ghArgs.join(" ")} --notes-file <body>`);
  console.log(`\n--- body ---\n${body}`);
  process.exit(0);
}

const bodyFile = join(tmpdir(), `lt-release-${tag}.md`);
writeFileSync(bodyFile, body, "utf8");
console.log(`Publishing ${tag} — ${title} (at ${target.slice(0, 7)})…`);
try {
  execFileSync("gh", [...ghArgs, "--notes-file", bodyFile], {
    stdio: "inherit",
  });
} finally {
  rmSync(bodyFile, { force: true });
}
