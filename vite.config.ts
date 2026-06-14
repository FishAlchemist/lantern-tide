import { defineConfig, type Plugin } from "vite";

// After the build, also write the entry HTML as 404.html. GitHub Pages has no
// built-in SPA fallback, so it serves 404.html for unknown deep links; making
// it a copy of index.html boots the app, and the router reads the path and
// lands in the right space (history routing keeps working under the subpath).
function githubPagesSpaFallback(): Plugin {
  return {
    name: "gh-pages-spa-fallback",
    apply: "build",
    enforce: "post", // run after Vite has emitted index.html into the bundle
    generateBundle(_options, bundle) {
      const index = bundle["index.html"];
      if (index && index.type === "asset") {
        this.emitFile({
          type: "asset",
          fileName: "404.html",
          source: index.source,
        });
      }
    },
  };
}

// Pure static output (§4). Kept deliberately minimal — asset processing and an
// AVIF/WebP image pipeline (§6) can grow out of here later.
export default defineConfig(({ mode }) => ({
  // GitHub Pages project site serves under /<repo>/. `vite build --mode pages`
  // sets that base; dev, preview and the local build stay at root, so the e2e
  // suite and `pnpm preview` are unaffected.
  base: mode === "pages" ? "/lantern-tide/" : "/",
  plugins: [githubPagesSpaFallback()],
  server: {
    host: true,
    // When cloudflared / any reverse proxy connects, the Host header is the
    // tunnel domain. Allowed during the demo; not needed for a real deploy.
    allowedHosts: true,
  },
  preview: {
    host: true,
    allowedHosts: true,
    // Disable caching during the demo so every refresh gets the latest build
    // (avoids phones caching an old version).
    headers: { "Cache-Control": "no-store" },
  },
  build: {
    // Each namespace's content is its own chunk, fetched after entering.
    // The default code-splitting achieves this (dynamic import → auto chunk).
    target: "es2022",
  },
}));
