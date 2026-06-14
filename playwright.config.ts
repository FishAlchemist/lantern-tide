import { defineConfig } from "@playwright/test";

// End-to-end tests: walk the entrance sequence in a real browser (§3 / §10),
// guarding interaction regressions like "setting out shouldn't recall a space".
// Uses the system-installed Chrome (channel: chrome), not a bundled build, so
// CI installs it with `playwright install chrome`. The webServer block below
// serves the production build (reusing a `pnpm preview` you already have up).
export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "**/*.spec.ts",
  timeout: 60_000, // the entrance + paper-boat voyage are deliberately slow

  reporter: [["list"]],
  use: {
    baseURL: "http://127.0.0.1:4173",
    channel: "chrome",
    headless: true,
    viewport: { width: 390, height: 844 }, // portrait, close to the phone experience
  },

  // Serve the production build for the run. reuseExistingServer keeps a preview
  // you already have up (locally); with none running — including CI — Playwright
  // starts one and tears it down. The build must exist first (pnpm build).
  webServer: {
    command: "pnpm run preview",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
