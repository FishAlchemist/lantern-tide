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
