import { test, expect } from "@playwright/test";

/* Entrance sequence + the island street, end-to-end (§3 experience flow /
   §1 the haven island street / §10 guard the entrance). Also screenshots into
   tests/e2e/__shots__ as proof of the result. */

test("enter → tunnel → street → into a shop → back → switch shop → set out to the door", async ({
  page,
}) => {
  const shot = (name: string) =>
    page.screenshot({ path: `tests/e2e/__shots__/${name}.png` });

  await page.goto("/");

  // 1) Front door visible; below it you're already "in the tide" (sea ~halfway up).
  await expect(page.locator("#threshold")).toBeVisible();
  await expect(page.locator("h1.threshold__title")).not.toBeEmpty();
  await shot("01-door");

  // 2) Click "Enter" → the tunnel appears, the boat forms and carries the
  //    wanderer toward the light.
  await page.locator("#enter").click();
  await expect(page.locator(".tunnel")).toBeVisible();
  await expect(page.locator(".boat--afloat")).toBeVisible({ timeout: 3_000 });
  await page.waitForTimeout(650);
  await shot("02-tunnel-early");
  await page.waitForTimeout(1300);
  await shot("02-tunnel-late");

  // 3) Out of the tunnel → ashore on "the street"; the tunnel dissolves, the
  //    front door retracts.
  await expect(page.locator(".space--street.space--visible")).toBeVisible({
    timeout: 12_000,
  });
  await expect(page.locator(".tunnel")).toHaveCount(0, { timeout: 5_000 });
  await expect(page.locator("#threshold")).toBeHidden();
  await shot("03-street");

  // The title stays pinned as the street sign **unmoved**; only the shop list
  // below scrolls, sinking into the tide. After scrolling, verify: the title
  // didn't move, the shop list did scroll up.
  const titleY1 =
    (await page.locator(".space--street .space__title").boundingBox())?.y ?? 0;
  const lastItem = page.locator(".space--street .space__nav-item").last();
  const itemY1 = (await lastItem.boundingBox())?.y ?? 0;
  await page.locator(".space--street .space__nav").evaluate((el) => {
    el.scrollTop = 240;
  });
  await page.waitForTimeout(200);
  const titleY2 =
    (await page.locator(".space--street .space__title").boundingBox())?.y ?? 0;
  const itemY2 = (await lastItem.boundingBox())?.y ?? 0;
  expect(Math.abs(titleY2 - titleY1)).toBeLessThan(5); // sign pinned in place
  expect(itemY2).toBeLessThan(itemY1 - 50); // shop list did scroll up
  await shot("03-street-scrolled");

  // 3b) Into the lookout, screenshot, then back to the street.
  await page.locator(".space--street .space__nav-item").nth(2).click();
  await expect(page.locator(".space--lookout.space--visible")).toBeVisible({
    timeout: 10_000,
  });
  await page.waitForTimeout(1900); // wait for the first meteor to half-streak
  await shot("03b-lookout"); // beat 1: the cold dark island, lamp dim, no north star
  // The scene follows the legend: tapping advances the story, the scene changes with it.
  const lookoutContent = page.locator(".space--lookout .lookout__content");
  for (let i = 0; i < 6; i++) {
    await lookoutContent.click();
    await page.waitForTimeout(120);
  }
  await page.waitForTimeout(1500); // wait for the scene transition to finish
  await shot("03c-lookout-star"); // beat 7: the flame becomes the north star (star lit)
  for (let i = 0; i < 5; i++) {
    await lookoutContent.click();
    await page.waitForTimeout(120);
  }
  await page.waitForTimeout(1500);
  await shot("03d-lookout-warm"); // beat 12: the lamp burns on (the whole scene warms)
  await page.locator(".space--lookout .lookout__navlink").first().click();
  await expect(page.locator(".space--street.space--visible")).toBeVisible({
    timeout: 10_000,
  });
  await page.waitForTimeout(700);

  // 3c) Into the paper-boat shop: fold one, set it on the tide, watch it drift,
  //     then back to the street.
  await page.locator(".space--street .space__nav-item").nth(3).click();
  await expect(page.locator(".space--paperboat.space--visible")).toBeVisible({
    timeout: 10_000,
  });
  await page.waitForTimeout(800);
  await shot("03e-paperboat"); // eight directions (emotions + studies/work/relationships)
  // Pick a life area (work) → expand three lines → screenshot → pick the first
  // line (nth(0) = change direction, so take nth(1)).
  await page.locator(".space--paperboat .paperboat__chip--dir").nth(6).click();
  await page.waitForTimeout(300);
  await shot("03e2-paperboat-items"); // the three lines + change direction
  await page.locator(".space--paperboat .paperboat__chip").nth(1).click();
  await page.locator(".space--paperboat .paperboat__launch").click();
  await page.waitForTimeout(900);
  await shot("03e3-paperboat-folding"); // the paper, folding into a boat
  await page.waitForTimeout(2600); // total ~3.5s → the boat, sailing away
  await shot("03f-paperboat-adrift"); // near → sailing away, shrinking
  await page.waitForTimeout(4000); // total ~7.5s → far, small
  await shot("03f2-paperboat-far"); // far, small, about to vanish
  await page.waitForTimeout(4600); // let the fold + slow voyage finish + the closing
  await shot("03g-paperboat-done"); // gone → the closing
  await page.locator(".space--paperboat .paperboat__navlink").first().click();
  await expect(page.locator(".space--street.space--visible")).toBeVisible({
    timeout: 10_000,
  });
  await page.waitForTimeout(700);

  // 4) From the street into the library; on a switch the old space fades out
  //    ~600ms, so scope clicks to the current space.
  await page.locator(".space--street .space__nav-item").nth(0).click();
  await expect(page.locator(".space--library.space--visible")).toBeVisible({
    timeout: 10_000,
  });
  await expect(page.locator(".tunnel")).toHaveCount(0); // moving within doesn't re-walk the tunnel
  await page.waitForTimeout(900); // wait for the cross-fade to finish before the shot
  await shot("04-library");

  // Scroll the long catalog; shelf headings stick under the top bar (you always
  // know which category you're in).
  await page.locator(".space--library").evaluate((el) => {
    el.scrollTop = 1100;
  });
  await page.waitForTimeout(200);
  await shot("04-library-scrolled");

  // 5) Back to the street, then into the café (shops are equals, no order).
  await page.locator(".space--library .library__navlink").first().click();
  await expect(page.locator(".space--street.space--visible")).toBeVisible({
    timeout: 10_000,
  });
  await page.locator(".space--street .space__nav-item").nth(1).click();
  await expect(page.locator(".space--cafe.space--visible")).toBeVisible({
    timeout: 10_000,
  });
  await page.waitForTimeout(900); // wait for the cross-fade before the shot
  await shot("05-cafe");

  // 6) Set out again, back into the tide → return to the front door.
  //    Key return guard: the space must be removed, not recalled by a route
  //    event to overlap the front door.
  await page.locator(".space--cafe .cafe__navlink").nth(1).click();
  await expect(page.locator("#threshold")).toBeVisible({ timeout: 10_000 });
  await page.waitForTimeout(1000); // wait for the 800ms dispose fade-out to finish
  await expect(page.locator(".space")).toHaveCount(0); // ← no overlap, not recalled
  await shot("06-back-to-door");
});

test("skip the animation: land on the street directly, no tunnel, no boat (§12)", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("#threshold")).toBeVisible();

  await page.locator("#skip").click();

  // Land directly on the street (the default landing).
  await expect(page.locator(".space--street.space--visible")).toBeVisible({
    timeout: 6_000,
  });
  // Skip = no tunnel, no boat (return guard: the skip button must really skip).
  await expect(page.locator(".tunnel")).toHaveCount(0);
  await expect(page.locator(".boat")).toHaveCount(0);
  await expect(page.locator("#threshold")).toBeHidden();
});

test("reduced motion: the paper boat still sails away and shrinks (a user-initiated core interaction, §12 exception)", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/street/paperboat");
  // A deep link / reload lands directly in the shop now (no front-door ceremony).
  await expect(page.locator(".space--paperboat.space--visible")).toBeVisible({
    timeout: 8_000,
  });

  // Fold one: pick "grief" → the first line → set it on the tide.
  await page.locator(".space--paperboat .paperboat__chip--dir").nth(0).click();
  await page.locator(".space--paperboat .paperboat__chip").nth(1).click();
  await page.locator(".space--paperboat .paperboat__launch").click();

  // The paper folds into the boat (~2s), it rests, then sails. Measure early vs
  // late in the voyage: the boat should recede (centre moves up) and shrink —
  // proving the core sail still happens even with reduced motion on.
  const boat = page.locator(".space--paperboat .paperboat__boat");
  await page.waitForTimeout(3200); // after fold + rest, just into the sail = near
  const near = await boat.boundingBox();
  await page.waitForTimeout(5000); // later in the slow voyage
  await page.screenshot({
    path: "tests/e2e/__shots__/rm-paperboat-sailing.png",
  });
  const far = await boat.boundingBox();

  expect(near).not.toBeNull();
  expect(far).not.toBeNull();
  if (near && far) {
    // Receding along the water: centre moves up (away) and clearly shrinks —
    // not an in-place fade, and not flying into the sky.
    const nearMid = near.y + near.height / 2;
    const farMid = far.y + far.height / 2;
    expect(farMid).toBeLessThan(nearMid - 20);
    expect(far.width).toBeLessThan(near.width * 0.5);
  }
});

test("reduced motion: the front-door tide still breathes by default (ambient, not vection — §12 exception)", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("#threshold")).toBeVisible();

  // We have NOT entered, so no explicit full-motion choice was made.
  await expect(page.locator("html")).not.toHaveAttribute("data-motion", "full");

  // Regression: the blanket §12 suppression used to still the ambient tide too,
  // leaving the front door a dead frame until the visitor pressed Enter and came
  // back (which leaves data-motion="full" set). The tide swell (slow vertical
  // drift) and the lantern breath are low-risk ambient motion and must keep
  // running. iteration-count "infinite" (vs the blanket rule's "1") is the
  // value-independent proof it isn't stilled.
  const tide = await page.locator("#threshold").evaluate((el) => {
    const cs = getComputedStyle(el, "::before");
    return { name: cs.animationName, iter: cs.animationIterationCount };
  });
  expect(tide.name).toBe("tide-swell");
  expect(tide.iter).toBe("infinite");

  const lantern = await page.locator("#threshold").evaluate((el) => {
    const cs = getComputedStyle(el, "::after");
    return { name: cs.animationName, iter: cs.animationIterationCount };
  });
  expect(lantern.name).toBe("threshold-glow");
  expect(lantern.iter).toBe("infinite");

  // The tunnel's forward motion is the actual vection trigger — it stays stilled
  // until "Enter". Pressing Enter (the next test) is what opts into full motion.
});

test("Enter: the front-door tide freezes in place as the door retracts (no lurch to high tide)", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("#threshold")).toBeVisible();

  // Before Enter the ambient tide is running.
  const before = await page
    .locator("#threshold")
    .evaluate((el) => getComputedStyle(el, "::before").animationPlayState);
  expect(before).toBe("running");

  // Press Enter: the door starts retracting (.threshold--leaving). The tide must
  // pause in place, not snap. Because the pre-Enter params equal the full-motion
  // base, flipping data-motion="full" swaps no parameters — pausing freezes the
  // exact current frame. (Checked while the door is still on screen, before the
  // multi-second tunnel walk hides it.)
  await page.locator("#enter").click();
  await expect(page.locator("#threshold")).toHaveClass(/threshold--leaving/);
  const tideState = await page
    .locator("#threshold")
    .evaluate((el) => getComputedStyle(el, "::before").animationPlayState);
  const lanternState = await page
    .locator("#threshold")
    .evaluate((el) => getComputedStyle(el, "::after").animationPlayState);
  expect(tideState).toBe("paused");
  expect(lanternState).toBe("paused");
});

test("reduced motion + Enter: the ritual still plays (tunnel and boat appear) — an explicit gesture overrides the system preference", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("#threshold")).toBeVisible();

  await page.locator("#enter").click();

  // Key regression: even with system "reduce motion" on, pressing "Enter" =
  // choosing full motion, so the tunnel and boat still appear (this path used
  // to be skipped entirely, leaving the user with no entrance animation).
  await expect(page.locator("html")).toHaveAttribute("data-motion", "full");
  await expect(page.locator(".tunnel")).toBeVisible();
  await expect(page.locator(".boat--afloat")).toBeVisible({ timeout: 3_000 });

  // After the tunnel it still lands on the street normally.
  await expect(page.locator(".space--street.space--visible")).toBeVisible({
    timeout: 12_000,
  });
});

test("i18n: the language toggle switches between zh/en, the space swaps language live, and it's remembered after reload", async ({
  page,
}) => {
  const visibleTitle = ".space--street.space--visible .space__title";

  await page.goto("/");
  await page.locator("#skip").click();
  await expect(page.locator(".space--street.space--visible")).toBeVisible({
    timeout: 6_000,
  });

  // Default is Traditional Chinese.
  await expect(page.locator(visibleTitle)).not.toBeEmpty();
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-Hant");

  // Click the toggle → the space re-mounts, text swaps to English, <html lang>
  // changes too.
  await page.locator(".lang-toggle").click();
  await expect(page.locator(visibleTitle)).toHaveText("A World Apart");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.screenshot({ path: "tests/e2e/__shots__/i18n-street-en.png" });

  // After reload it still remembers English (persisted), and the front door is
  // English too.
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("h1.threshold__title")).toHaveText("Lantern Tide");
  await expect(page.locator("#enter")).toHaveText("Enter");
});

test("library deep link: the catalog is a scrollable space (spaces.css loaded) and the index jumps to a shelf", async ({
  page,
}) => {
  // Deep link straight into the library — the regression guard: the shop chunk
  // must import spaces.css itself (the .space base), or a direct land has no
  // fixed, scrollable container and the long catalog can't scroll at all.
  await page.goto("/street/library");
  const space = page.locator(".space--library.space--visible");
  await expect(space).toBeVisible({ timeout: 8_000 });

  const metrics = await space.evaluate((el) => ({
    position: getComputedStyle(el).position,
    scrollable: el.scrollHeight > el.clientHeight + 100,
  }));
  expect(metrics.position).toBe("fixed");
  expect(metrics.scrollable).toBe(true);

  // The catalog index jumps to a shelf: open the disclosure, pick the third
  // shelf, and the container scrolls down to it and lights it up (scroll-spy).
  await page.locator(".library__index-toggle").click();
  await page.locator(".library__index-link").nth(2).click();
  await page.waitForTimeout(900); // smooth scroll settles
  const scrollTop = await space.evaluate((el) => el.scrollTop);
  expect(scrollTop).toBeGreaterThan(500);
  await expect(page.locator(".library__index-link").nth(2)).toHaveClass(
    /library__index-link--active/,
  );

  // Jump back UP to the first shelf. The regression: sticky headings made
  // scrollIntoView refuse to move to an earlier shelf, and the scroll-spy never
  // updated going up — both fixed by using cached natural offsets.
  await page.locator(".library__index-toggle").click();
  await page.locator(".library__index-link").nth(0).click();
  await page.waitForTimeout(900);
  const backTop = await space.evaluate((el) => el.scrollTop);
  expect(backTop).toBeLessThan(scrollTop - 2000);
  await expect(page.locator(".library__index-link").nth(0)).toHaveClass(
    /library__index-link--active/,
  );
});

test("lookout: the legend advances by keyboard, not only by pointer (§12 a11y)", async ({
  page,
}) => {
  await page.goto("/street/lookout");
  await expect(page.locator(".space--lookout.space--visible")).toBeVisible({
    timeout: 8_000,
  });

  const story = page.locator(".lookout__story");
  const firstBeat = (await story.textContent()) ?? "";

  // The advance affordance is a real <button>: a keyboard user can focus it and
  // press Enter to move the legend on (previously a click-only <div> — locked out).
  const hint = page.locator(".lookout__hint");
  await expect(hint).toHaveJSProperty("tagName", "BUTTON");
  await hint.focus();
  await page.keyboard.press("Enter");

  // The beat (and its text) changes — proving the keyboard path advances it.
  await expect(story).not.toHaveText(firstBeat, { timeout: 3_000 });
});

test("stillroom: the breathing guide cycles through its beats (deep link, full motion)", async ({
  page,
}) => {
  // Deep link straight into the stillroom. No front-door ceremony and no system
  // reduce-motion → the breath auto-cycles.
  await page.goto("/street/stillroom");
  await expect(page.locator(".space--stillroom.space--visible")).toBeVisible({
    timeout: 8_000,
  });

  // The phase glyph advances on a timer (in → hold → out → rest), which is the
  // proof the breath is running. It changes within one in-breath (~4s).
  const word = page.locator(".stillroom__word");
  const first = (await word.textContent()) ?? "";
  expect(first.length).toBeGreaterThan(0);
  await expect(word).not.toHaveText(first, { timeout: 8_000 });
  await page.waitForTimeout(700);
  await page.screenshot({ path: "tests/e2e/__shots__/07-stillroom.png" });
});

test("stillroom reduced motion: the breath still plays, gently — a small swell, no streaking motes (§12 exception)", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/street/stillroom");
  await expect(page.locator(".space--stillroom.space--visible")).toBeVisible({
    timeout: 8_000,
  });

  // §12 exception: the breath is this room's whole point and is gentle, so it
  // still runs under reduced motion — the phase glyph advances (it doesn't freeze).
  const word = page.locator(".stillroom__word");
  const first = (await word.textContent()) ?? "";
  expect(first.length).toBeGreaterThan(0);
  await expect(word).not.toHaveText(first, { timeout: 8_000 });

  // ...but the swell stays small — nowhere near the full open size (1.34). Sample
  // the circle's scale across a breath; it breathes, but only a gentle pulse.
  let maxScale = 1;
  for (let i = 0; i < 14; i++) {
    const s = await page.locator(".stillroom__breath").evaluate((el) => {
      const matrix = getComputedStyle(el).transform;
      const nums = /matrix\(([^)]+)\)/.exec(matrix);
      return nums ? parseFloat(nums[1].split(",")[0]) : 1;
    });
    maxScale = Math.max(maxScale, s);
    await page.waitForTimeout(500);
  }
  expect(maxScale).toBeGreaterThan(1.01); // it does breathe
  expect(maxScale).toBeLessThan(1.15); // but gently — far from the full 1.34 swell

  // The draw-in (streaking motes) is the vection-y motion, so under reduced
  // motion none fly (the loop above already spanned an in-breath). The gentle
  // pace-easing carries no extra motion, so it still leads you either way.
  await expect(page.locator(".stillroom__meteor")).toHaveCount(0);
});

test("stillroom: on the in-breath, motes of the deep streak up to the ring and vanish on contact (full motion)", async ({
  page,
}) => {
  await page.goto("/street/stillroom");
  await expect(page.locator(".space--stillroom.space--visible")).toBeVisible({
    timeout: 8_000,
  });

  // The cue's "draw the deep in" now has a visual: on the in-breath a stream of
  // motes rises from the water and streaks up toward the ring.
  await expect
    .poll(() => page.locator(".stillroom__meteor").count(), { timeout: 8_000 })
    .toBeGreaterThan(0);
  await page.waitForTimeout(700);
  await page.screenshot({
    path: "tests/e2e/__shots__/07b-stillroom-drawin.png",
  });

  // They reach the ring's edge and simply vanish — no little burst is left
  // behind (the absorb "flash" was removed).
  await expect(page.locator(".stillroom__flash")).toHaveCount(0);
});

test("stillroom: motes draw in on every in-breath — even with the lamp already full", async ({
  page,
}) => {
  // A full lamp must NOT stop the draw-in: the motes are the in-breath itself,
  // not a one-time fill. Regression — they used to stop once the furnace filled,
  // so the second in-breath onward had none.
  await page.addInitScript(() => {
    localStorage.setItem(
      "lt.light",
      JSON.stringify({ v: 1, charge: 1, at: Date.now() }),
    );
  });
  await page.goto("/street/stillroom");
  await expect(page.locator(".space--stillroom.space--visible")).toBeVisible({
    timeout: 8_000,
  });

  const motes = page.locator(".stillroom__meteor");
  // First in-breath: motes draw in...
  await expect.poll(() => motes.count(), { timeout: 8_000 }).toBeGreaterThan(0);
  // ...they clear as the breath moves to hold / out / rest...
  await expect.poll(() => motes.count(), { timeout: 8_000 }).toBe(0);
  // ...and the NEXT in-breath draws in again (every in-breath, not just the first).
  await expect
    .poll(() => motes.count(), { timeout: 13_000 })
    .toBeGreaterThan(0);
});

test("stillroom: the motes draw in only on the in-breath — never in the other phases", async ({
  page,
}) => {
  await page.goto("/street/stillroom");
  await expect(page.locator(".space--stillroom.space--visible")).toBeVisible({
    timeout: 8_000,
  });

  // The breath starts on the in-breath, so the first glyph is the in-breath's.
  const word = page.locator(".stillroom__word");
  const inhaleGlyph = (await word.textContent()) ?? "";
  expect(inhaleGlyph.length).toBeGreaterThan(0);

  // Sample across more than a whole cycle (in → hold → out → rest): whenever a
  // mote is in flight, the phase must be the in-breath. The stream is timed to
  // finish within it, so nothing bleeds into the other phases.
  let sawMoteOnInhale = false;
  let violations = 0;
  for (let i = 0; i < 120; i++) {
    const w = (await word.textContent()) ?? "";
    const motes = await page.locator(".stillroom__meteor").count();
    if (motes > 0) {
      if (w === inhaleGlyph) sawMoteOnInhale = true;
      else violations += 1;
    }
    await page.waitForTimeout(120);
  }
  expect(violations).toBe(0); // never drawn in outside the in-breath
  expect(sawMoteOnInhale).toBe(true); // but they do draw in on it
});

test("stillroom: it leads you slower; you can settle on a pace (no press-and-hold, no test)", async ({
  page,
}) => {
  await page.goto("/street/stillroom");
  await expect(page.locator(".space--stillroom.space--visible")).toBeVisible({
    timeout: 8_000,
  });

  // A fresh visit: it's leading you slower, so the gentle "keep this pace"
  // affordance is offered — and nothing's settled yet, so no reset. (No
  // press-and-hold target, no progress dots: you just follow.)
  const stay = page.locator(".stillroom__settle-btn");
  await expect(stay).toBeVisible();
  await expect(page.locator(".stillroom__settle-hint")).not.toBeEmpty();
  await expect(page.locator(".stillroom__press")).toHaveCount(0);
  await expect(page.locator(".stillroom__dot")).toHaveCount(0);
  await expect(page.locator(".stillroom__reset")).toHaveCount(0);

  // Tap "keep this pace" → it settles: the affordance goes away, the reset
  // (forget this pace) appears, and the pace is saved.
  await stay.click();
  await expect(page.locator(".stillroom__settle-btn")).toHaveCount(0);
  await expect(page.locator(".stillroom__reset")).toBeVisible();
});

test("stillroom: a settled pace is pre-read on load and leads at that pace (reset, not settle)", async ({
  page,
}) => {
  // No settled pace → it's leading you slower: the "keep this pace" affordance is
  // shown and there's no reset.
  await page.goto("/street/stillroom");
  await expect(page.locator(".space--stillroom.space--visible")).toBeVisible({
    timeout: 8_000,
  });
  await expect(page.locator(".stillroom__settle-btn")).toBeVisible();
  await expect(page.locator(".stillroom__reset")).toHaveCount(0);

  // Seed a settled pace; on the next load it's pre-read (loadRhythm), so it leads
  // at that pace — the reset shows and the "settle" affordance does not (the UI
  // switches on the stored pace).
  await page.addInitScript(() => {
    localStorage.setItem(
      "lt.breath",
      JSON.stringify({ v: 1, inhale: 3, hold: 0, exhale: 4.2, rest: 1 }),
    );
  });
  await page.reload();
  await expect(page.locator(".space--stillroom.space--visible")).toBeVisible({
    timeout: 8_000,
  });
  await expect(page.locator(".stillroom__reset")).toBeVisible();
  await expect(page.locator(".stillroom__settle-btn")).toHaveCount(0);

  // Pressing reset forgets the pace; it leads from the start again (reset gone,
  // the "keep this pace" affordance returns).
  await page.locator(".stillroom__reset").click();
  await expect(page.locator(".stillroom__reset")).toHaveCount(0);
  await expect(page.locator(".stillroom__settle-btn")).toBeVisible();
});

test("stillroom: an optional pace menu sits beside the lead — open it, pick one, and it's kept and lit (lead stays the default)", async ({
  page,
}) => {
  await page.goto("/street/stillroom");
  await expect(page.locator(".space--stillroom.space--visible")).toBeVisible({
    timeout: 8_000,
  });

  // The lead is still the default path: it's leading you slower (settle shown),
  // nothing settled yet (no reset). The menu is purely an optional shortcut.
  await expect(page.locator(".stillroom__settle-btn")).toBeVisible();
  await expect(page.locator(".stillroom__reset")).toHaveCount(0);

  // A quiet link offers the named paces, collapsed until opened (no setup gate):
  // the five pace buttons exist in the DOM but stay hidden.
  const toggle = page.locator(".stillroom__paces-toggle");
  await expect(toggle).toBeVisible();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator(".stillroom__pace")).toHaveCount(5);
  await expect(page.locator(".stillroom__pace").first()).toBeHidden();

  // Open it → the five paces are revealed.
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator(".stillroom__pace").first()).toBeVisible();

  // Pick the slow "deep" pace → it's kept: the menu collapses, the lead's settle
  // affordance gives way to the reset, the chosen pace is saved and lit.
  const deep = page.locator('.stillroom__pace[data-pace="deep"]');
  await deep.click();
  await expect(page.locator(".stillroom__settle-btn")).toHaveCount(0);
  await expect(page.locator(".stillroom__reset")).toBeVisible();
  await expect(deep).toHaveClass(/stillroom__pace--on/);
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  const saved = await page.evaluate(() => localStorage.getItem("lt.breath"));
  expect(saved).toContain('"exhale":8'); // the deep pace's long out-breath, persisted
});

test("stillroom: switching pace hands over cleanly — back to rest, a held pause, then the new in-breath", async ({
  page,
}) => {
  // Seed a no-rest rhythm so the breath never sits at the empty "rest" beat: the
  // pick then always lands on an active beat, giving the full contraction + hold
  // deterministically (the mid-rest, capped case is covered by the unit tests).
  await page.addInitScript(() => {
    localStorage.setItem(
      "lt.breath",
      JSON.stringify({ v: 1, inhale: 6, hold: 0, exhale: 6, rest: 0 }),
    );
  });
  await page.goto("/street/stillroom");
  await expect(page.locator(".space--stillroom.space--visible")).toBeVisible({
    timeout: 8_000,
  });

  const word = page.locator(".stillroom__word");
  const breath = page.locator(".stillroom__breath");
  const scale = () =>
    breath.evaluate((el) => {
      const m = /matrix\(([^)]+)\)/.exec(getComputedStyle(el).transform);
      return m ? parseFloat(m[1].split(",")[0]) : 1;
    });

  // Pick the slow "deep" pace.
  await page.locator(".stillroom__paces-toggle").click();
  await page.locator('.stillroom__pace[data-pace="deep"]').click();

  // Stage 1 — the ring contracts fluidly to its smallest (rest): by ~1.3s the
  // shrink has finished and it sits at rest, not lurching into the new in-breath.
  await page.waitForTimeout(1300);
  const held = (await word.textContent()) ?? "";
  expect(held.length).toBeGreaterThan(0);
  expect(await scale()).toBeLessThan(1.05); // shrunk to its smallest

  // Stage 2 — it holds there on the same (rest) beat for a few seconds: at ~3.5s
  // (within the ~3s hold) it's still the same glyph, still at rest.
  await page.waitForTimeout(2200);
  expect(await word.textContent()).toBe(held);
  expect(await scale()).toBeLessThan(1.05);

  // Stage 3 — only then does the new pace begin on a fresh in-breath: the beat
  // changes and the circle swells past rest.
  await expect(word).not.toHaveText(held, { timeout: 4_000 });
  await expect.poll(() => scale(), { timeout: 5_000 }).toBeGreaterThan(1.1);
});

test("motion toggle: flips detailed ⇄ simple live, and is remembered across reloads (§12)", async ({
  page,
}) => {
  await page.goto("/street/stillroom");
  await expect(page.locator(".space--stillroom.space--visible")).toBeVisible({
    timeout: 8_000,
  });

  // Default (no system reduce, no choice) → detailed: a warm, pressed chip, and
  // the full-motion draw-in motes stream on the in-breath.
  const toggle = page.locator(".motion-toggle");
  await expect(toggle).toBeVisible();
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await expect
    .poll(() => page.locator(".stillroom__meteor").count(), { timeout: 8_000 })
    .toBeGreaterThan(0);

  // Flip to simple → the space re-mounts at the calmer level: no streaking motes
  // any more (proof the new setting applied live to the space, not just the chip).
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await page.waitForTimeout(5_000); // span an in-breath
  await expect(page.locator(".stillroom__meteor")).toHaveCount(0);

  // The choice is remembered after a reload (deep links don't reset it).
  await page.reload();
  await expect(page.locator(".space--stillroom.space--visible")).toBeVisible({
    timeout: 8_000,
  });
  await expect(page.locator(".motion-toggle")).toHaveAttribute(
    "aria-pressed",
    "false",
  );
  await page.waitForTimeout(5_000); // span an in-breath
  await expect(page.locator(".stillroom__meteor")).toHaveCount(0);
});

test("declaration: written out on the front door, behind a button in every space (§7)", async ({
  page,
}) => {
  await page.goto("/");
  // Front door: the note is written out; the floating toggle stays hidden.
  await expect(page.locator(".threshold__note")).not.toBeEmpty();
  await expect(page.locator(".colophon__toggle")).toBeHidden();

  // Enter a space (skip straight to the street).
  await page.locator("#skip").click();
  await expect(page.locator(".space--street.space--visible")).toBeVisible({
    timeout: 6_000,
  });

  // In a space the toggle appears; the panel stays closed until pressed.
  const toggle = page.locator(".colophon__toggle");
  await expect(toggle).toBeVisible();
  await expect(page.locator(".colophon__panel")).toBeHidden();

  // Press it → the panel opens with the note and the source link to the repo.
  await toggle.click();
  await expect(page.locator(".colophon__panel")).toBeVisible();
  await expect(page.locator(".colophon__note")).not.toBeEmpty();
  await expect(page.locator(".colophon__source")).toHaveAttribute(
    "href",
    "https://github.com/FishAlchemist/lantern-tide",
  );

  // Close it again.
  await page.locator(".colophon__close").click();
  await expect(page.locator(".colophon__panel")).toBeHidden();
});

test("version badge: a corner chip shows the build version; tap it for the commit and a link to the release notes", async ({
  page,
}) => {
  await page.goto("/");

  // The chip sits in the corner from the front door on, labelled like the tag.
  const chip = page.locator(".version-badge__chip");
  await expect(chip).toBeVisible();
  await expect(chip).toHaveText(/^v\d+\.\d+\.\d+/);

  // The panel stays closed until the chip is tapped.
  const panel = page.locator(".version-badge__panel");
  await expect(panel).toBeHidden();
  await chip.click();
  await expect(panel).toBeVisible();
  await expect(chip).toHaveAttribute("aria-expanded", "true");

  // The commit SHA is shown and links out to the commit on GitHub.
  const sha = page.locator(".version-badge__sha");
  await expect(sha).not.toBeEmpty();
  await expect(sha).toHaveAttribute("href", /\/commit\/[0-9a-f]{7,40}$/);

  // The release-notes link points at this version's GitHub Release tag page.
  const notes = page.locator(".version-badge__notes");
  await expect(notes).toHaveAttribute(
    "href",
    /\/releases\/tag\/v\d+\.\d+\.\d+$/,
  );

  // Dismiss with Escape; the panel closes and the chip reads collapsed again.
  await page.keyboard.press("Escape");
  await expect(panel).toBeHidden();
  await expect(chip).toHaveAttribute("aria-expanded", "false");
});

test("performance: stepping onto the street warms the shop chunks on idle, so entering a shop doesn't pay a cold fetch", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("#skip").click(); // land straight on the street
  await expect(page.locator(".space--street.space--visible")).toBeVisible({
    timeout: 6_000,
  });

  // No shop has been visited, yet after idle a shop's chunk has already been
  // fetched — so a later tap loads from cache instead of over the cold network.
  await expect
    .poll(
      () =>
        page.evaluate(() =>
          performance
            .getEntriesByType("resource")
            .some((r) => /stillroom\.space.*\.js/.test(r.name)),
        ),
      { timeout: 8_000 },
    )
    .toBe(true);
});

test("street: tapping a shop lights it up while its room loads (a loading affordance, not a dead tap)", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("#skip").click();
  await expect(page.locator(".space--street.space--visible")).toBeVisible({
    timeout: 6_000,
  });

  // Tap the stillroom (5th storefront: library, café, lookout, paper-boat,
  // stillroom). The tapped item warms at once — the feedback that it's opening.
  const item = page.locator(".space--street .space__nav-item").nth(4);
  await item.click();
  await expect(item).toHaveClass(/space__nav-item--loading/);
  await expect(item).toHaveAttribute("aria-busy", "true");

  // And the room does open.
  await expect(page.locator(".space--stillroom.space--visible")).toBeVisible({
    timeout: 6_000,
  });
});
