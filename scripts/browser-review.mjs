import { chromium, webkit } from "playwright";
import fs from "node:fs/promises";
process.env.PLAYWRIGHT_BROWSERS_PATH = new URL(
  "../.browsers",
  import.meta.url,
).pathname;
const output = [];
const base = process.env.BASE_URL || "http://127.0.0.1:5173";
for (const [engine, type] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  let browser;
  try {
    browser = await type.launch();
  } catch (e) {
    output.push({ engine, error: e.message, status: "unverified" });
    continue;
  }
  for (const variant of ["interactive", "minimal", "vision"]) {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      isMobile: true,
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    try {
      await page.goto(`${base}/${variant}`);
      await page.locator("h1").waitFor();
      await page.getByRole("button", { name: "Menu", exact: true }).tap();
      await page
        .getByRole("navigation", { name: "Main navigation" })
        .getByRole("link", { name: "Schedules & fees", exact: true })
        .tap();
      await page.waitForURL(`**/${variant}/schedule`);
      await page.getByLabel("Time context").selectOption("archive");
      await page
        .locator("main")
        .getByText("Summer camp 2026", { exact: true })
        .waitFor();
      await page.goto(`${base}/${variant}/photos`);
      await page
        .getByRole("button", { name: /Open photo:/ })
        .first()
        .tap();
      await page.getByRole("dialog").waitFor();
      await page.getByRole("button", { name: "Next photo", exact: true }).tap();
      await page.getByRole("button", { name: "Close dialog" }).tap();
      await page.goto(`${base}/${variant}/registration-for-adults`);
      await page.locator("#demo-name").fill("Demo Dancer");
      await page.locator("#demo-email").fill("dancer@example.test");
      await page.locator("#demo-phone").fill("+1 202 555 0123");
      await page.locator("#demo-interest").selectOption("Classes for myself");
      if (variant === "interactive")
        await page.getByRole("button", { name: "Review demo details" }).tap();
      await page
        .getByRole("button", { name: "Complete local demo", exact: true })
        .tap();
      await page
        .getByRole("status")
        .getByText("Demo completed locally.", { exact: false })
        .waitFor();
      await page.screenshot({
        path: `verification/screenshots/${engine}-${variant}-mobile-form-success.jpg`,
        fullPage: true,
        animations: "allow",
      });
      output.push({
        engine,
        variant,
        browser: browser.version(),
        status: errors.length ? "fail" : "pass",
        errors,
        viewport: await page.evaluate(() => ({
          innerWidth,
          height: innerHeight,
          scrollWidth: document.documentElement.scrollWidth,
        })),
        at: new Date().toISOString(),
        journeys: [
          "touch-like menu",
          "schedule archive",
          "lightbox next/close",
          "synthetic form success",
        ],
      });
    } catch (e) {
      output.push({
        engine,
        variant,
        browser: browser.version(),
        status: "fail",
        error: e.message,
        errors,
      });
    }
    await context.close();
  }
  await browser.close();
}
await fs.writeFile(
  "verification/browser-review.json",
  JSON.stringify(output, null, 2),
);
console.log(output);
if (output.some((x) => x.status === "fail")) process.exitCode = 1;
