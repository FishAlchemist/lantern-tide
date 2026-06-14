/// <reference types="vitest/config" />
import { defineConfig } from "vitest/config";

// Automated tests: pure logic (§10 entrance gate, path routing) on jsdom.
export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.ts"],
    clearMocks: true,
  },
});
