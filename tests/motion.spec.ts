import { test, expect, type Page } from "@playwright/test";
import fs from "node:fs/promises";
async function inspect(page: Page, state: string) {
  const report = await page.evaluate(() => {
    const issues: string[] = [];
    for (const el of [
      document.documentElement,
      ...document.querySelectorAll("*"),
    ]) {
      for (const pseudo of [null, "::before", "::after"]) {
        const s = getComputedStyle(el, pseudo);
        if (
          s.animationName.split(",").some((v) => v.trim() !== "none") ||
          s.transitionDuration.split(",").some((v) => parseFloat(v) > 0) ||
          s.scrollBehavior !== "auto"
        )
          issues.push(
            `${el.tagName}.${el.className}${pseudo || ""}: ${s.animationName}/${s.transitionDuration}/${s.scrollBehavior}`,
          );
      }
    }
    return {
      issues,
      active: document.getAnimations().map((a) => a.playState),
      events: (window as unknown as { motionEvents: unknown[] }).motionEvents,
      autoplay: document.querySelectorAll(
        "video[autoplay],video[loop],svg animate,svg animateTransform",
      ).length,
      preference: matchMedia("(prefers-reduced-motion: no-preference)").matches,
    };
  });
  expect(report.issues, `${state} computed styles`).toEqual([]);
  expect(report.active).toEqual([]);
  expect(report.events).toEqual([]);
  expect(report.autoplay).toBe(0);
  expect(report.preference).toBe(true);
  return { state, ...report, at: new Date().toISOString() };
}
test("Quiet Form: cold routes, UI states, portal and prior-variant CSS have zero authored motion", async ({
  page,
}) => {
  const evidence = [];
  await page.addInitScript(() => {
    const w = window as unknown as { motionEvents: unknown[] };
    w.motionEvents = [];
    for (const name of [
      "animationstart",
      "animationiteration",
      "transitionrun",
      "transitionstart",
    ])
      document.addEventListener(
        name,
        (e) =>
          w.motionEvents.push({
            type: e.type,
            target: (e.target as HTMLElement).tagName,
          }),
        true,
      );
  });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  for (const source of ["cold", "interactive", "vision"]) {
    if (source !== "cold") {
      await page.goto(`/${source}/photos`);
      await page.locator("h1").waitFor();
      await page
        .getByRole("navigation", { name: "Switch design direction" })
        .getByRole("link", { name: "Quiet Form", exact: true })
        .click();
    } else await page.goto("/minimal/photos");
    await expect(page).toHaveURL(/\/minimal\/photos/);
    await page.locator("[data-variant=minimal] h1").waitFor();
    await page.evaluate(() => document.fonts.ready);
    evidence.push(await inspect(page, source + " photos"));
    await page
      .getByRole("button", { name: /Open photo:/ })
      .first()
      .hover();
    await page
      .getByRole("button", { name: /Open photo:/ })
      .first()
      .focus();
    evidence.push(await inspect(page, source + " hover and focus"));
    await page
      .getByRole("button", { name: /Open photo:/ })
      .first()
      .click();
    await expect(page.locator("#minimal-portal [role=dialog]")).toBeVisible();
    await page.getByRole("button", { name: "Next photo", exact: true }).click();
    evidence.push(await inspect(page, source + " portal lightbox next"));
    await page.screenshot({
      path: `verification/screenshots/motion-${source}-lightbox.jpg`,
      animations: "allow",
      type: "jpeg",
    });
    await page.keyboard.press("Escape");
    evidence.push(await inspect(page, source + " portal closed"));
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/minimal/programs");
  await page.locator("h1").waitFor();
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  evidence.push(await inspect(page, "mobile menu open"));
  await page.getByRole("button", { name: "Close menu" }).click();
  await page.getByLabel("Search programs").fill("no-match");
  evidence.push(await inspect(page, "filter empty"));
  await page.getByRole("button", { name: "Clear filters" }).click();
  await page.locator("main details summary").first().click();
  evidence.push(await inspect(page, "program row expanded"));
  await page.goto("/minimal/registration-for-kids");
  await page.locator("h1").waitFor();
  await page
    .getByRole("button", { name: "Complete local demo", exact: true })
    .click();
  evidence.push(await inspect(page, "validation"));
  await page.locator("#demo-name").fill("Demo Dancer");
  await page.locator("#demo-email").fill("parent@example.test");
  await page.locator("#demo-phone").fill("+1 202 555 0123");
  await page.locator("#demo-interest").selectOption("Classes for children");
  await page
    .getByRole("button", { name: "Complete local demo", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText("Processing only");
  evidence.push(await inspect(page, "pending"));
  await expect(page.getByRole("status")).toContainText(
    "Demo completed locally",
  );
  evidence.push(await inspect(page, "success"));
  await page.getByRole("button", { name: "Reset form" }).click();
  await page.getByText("Laboratory test controls", { exact: true }).click();
  await page.getByLabel("Simulation outcome").selectOption("failure");
  await page.locator("#demo-name").fill("Demo Dancer");
  await page.locator("#demo-email").fill("parent@example.test");
  await page.locator("#demo-phone").fill("+1 202 555 0123");
  await page.locator("#demo-interest").selectOption("Classes for children");
  await page
    .getByRole("button", { name: "Complete local demo", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText("Simulated failure");
  evidence.push(await inspect(page, "failure"));
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Schedules & fees", exact: true })
    .click();
  evidence.push(await inspect(page, "SPA route change"));
  await fs.writeFile(
    "verification/motion-results.json",
    JSON.stringify(
      {
        browser: page.context().browser()?.version(),
        suppressionStylesInjected: false,
        screenshotAnimations: "allow",
        evidence,
      },
      null,
      2,
    ),
  );
});
