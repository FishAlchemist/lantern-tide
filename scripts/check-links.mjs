/* Visit every library link with a real Chrome (Playwright) to check the
   article is still live. 404/410 = a dead link to replace; 403/503 are usually
   the site blocking headless, not necessarily dead. The catalog now lives in
   the locale bundles, so read the urls from there (same urls across locales).
   Run: node scripts/check-links.mjs   (or pnpm check:links) */
import { readFileSync } from "node:fs";
import { chromium } from "@playwright/test";

const src = readFileSync(
  new URL("../src/i18n/locales/zh-Hant.ts", import.meta.url),
  "utf8",
);
const urls = [...src.matchAll(/url:\s*"([^"]+)"/g)].map((m) => m[1]);
const unique = [...new Set(urls)];
console.log(`Checking ${unique.length} links...\n`);

const browser = await chromium.launch({ channel: "chrome", headless: true });
const ctx = await browser.newContext({
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  ignoreHTTPSErrors: true,
});

const results = [];
let cursor = 0;
async function worker() {
  while (cursor < unique.length) {
    const url = unique[cursor++];
    const page = await ctx.newPage();
    let status = 0;
    let err = null;
    try {
      const resp = await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 30000,
      });
      status = resp ? resp.status() : 0;
    } catch (e) {
      err = String(e).split("\n")[0].slice(0, 80);
    }
    await page.close();
    const ok = status >= 200 && status < 400;
    results.push({ url, status, err, ok });
    console.log(
      `${ok ? "OK " : "!! "}${String(status || "ERR").padEnd(4)} ${url}${err ? "  " + err : ""}`,
    );
  }
}
await Promise.all(Array.from({ length: 6 }, () => worker()));
await browser.close();

const bad = results.filter((r) => !r.ok);
console.log(
  `\n=== ${results.length - bad.length}/${results.length} OK · ${bad.length} need a look ===`,
);
for (const b of bad) {
  console.log(
    `  ${String(b.status || "ERR").padEnd(4)} ${b.url}${b.err ? "  " + b.err : ""}`,
  );
}
