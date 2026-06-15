# Versioning

How Lantern Tide is versioned, and what a version number does and does not promise.

Also available in: [Traditional Chinese](./versioning.zh-Hant.md)

## Now: ZeroVer (0.x)

While Lantern Tide is young it stays on a `0.MINOR.PATCH` line — ZeroVer, the "0ver" convention. The first tagged release is `v0.1.0`.

What this means for a reader:

- Nothing here is a stability promise. Structure, routes, content, and design tokens may change between releases without ceremony.
- This is not strict SemVer. Within 0.x the increments are loose: a minor bump marks something worth noting, a patch bump a smaller fix.
- Releases are cut by hand when something is worth marking, not on a fixed cadence.

## At 1.0.0: switch to date-based versions

When Lantern Tide reaches a state worth calling 1.0.0, it leaves the 0.x line and switches to calendar versioning. From then on a version is the date it was cut, written `vYYYYMMDD` — for example `v20260614`.

- Tags keep the `v*` shape, so publishing a Release (what the deploy workflow triggers on) keeps working unchanged across the switch.
- A date says when a build was cut, not what changed since the last one; the per-release notes still carry the "what."

## After the switch: a compatibility matrix

Once on date versions, this document will also carry a compatibility matrix — a table mapping which date-versions are compatible with which, so a reader can tell at a glance whether two dated builds line up. There is nothing to map yet; that table arrives with the first date version.

## How tags, releases, and deploys line up

- A `v*` tag is the unit of release, published as a GitHub Release. Publishing that Release triggers the gated deploy (`.github/workflows/deploy.yml`): the test gate runs on the tagged commit, and only a green commit is published.
- The GitHub Release attached to that tag carries the human-facing notes; the same text is kept under [docs/releases/](./releases/).
- Cut a release with `pnpm run release vX.Y.Z` ([scripts/release.mjs](../scripts/release.mjs)): it builds the Release from `docs/releases/vX.Y.Z.md` — the file's `# H1` becomes the title and the rest becomes the body, with sibling `./…` links absolutized — then publishes it, which kicks off the deploy. (The source `.md` keeps its H1 and relative links, which are correct for reading the file in the repo.)
- Plain pushes to `main` never deploy; they only run CI. A tag on its own doesn't deploy either — the deploy waits for the Release.
