import { chromium } from "playwright";
import fs from "node:fs/promises";
process.env.PLAYWRIGHT_BROWSERS_PATH = new URL(
  "../.browsers",
  import.meta.url,
).pathname;
const base = process.env.BASE_URL || "http://127.0.0.1:5173";
const browser = await chromium.launch();
const records = [];
for (const variant of ["interactive", "minimal", "vision"]) {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  const steps = [];
  async function tabTo(locator, label) {
    for (let i = 0; i < 140; i++) {
      if (await locator.evaluate((el) => el === document.activeElement)) {
        steps.push({
          label,
          tabs: i,
          focus: await locator.evaluate((el) => ({
            tag: el.tagName,
            outline: getComputedStyle(el).outline,
          })),
        });
        return;
      }
      await page.keyboard.press("Tab");
    }
    throw new Error("Keyboard could not reach " + label);
  }
  try {
    await page.goto(`${base}/${variant}`);
    await page.locator("h1").waitFor();
    await page.keyboard.press("Tab");
    if (
      !(await page
        .getByRole("link", { name: "Skip to main content" })
        .evaluate((el) => el === document.activeElement))
    )
      throw new Error("Skip link not first");
    await page.keyboard.press("Enter");
    if (
      !(await page
        .locator("#main")
        .evaluate((el) => el === document.activeElement))
    )
      throw new Error("Skip link did not focus main");
    steps.push({ label: "First tab skip link activates and focuses main" });
    const nav = page.getByRole("navigation", { name: "Main navigation" });
    if (variant === "interactive") {
      await tabTo(
        nav.getByRole("button", { name: "Learn to dance" }),
        "Desktop disclosure",
      );
      await page.keyboard.press("Enter");
      await tabTo(
        nav.getByRole("link", { name: "Browse all programs", exact: true }),
        "Visible submenu link",
      );
    } else {
      await tabTo(
        nav.getByRole("link", {
          name: variant === "minimal" ? "Programs" : "Find your dance",
          exact: true,
        }),
        "Desktop programs navigation",
      );
    }
    await page.keyboard.press("Enter");
    await page.waitForURL(`**/${variant}/programs`);
    await tabTo(page.getByLabel("Search programs"), "Program search");
    await page.keyboard.type("Rumba");
    await page
      .getByText("Competitive Latin", { exact: true })
      .first()
      .waitFor();
    const detail = page.locator('main a[href$="/programs/latin"]').first();
    await tabTo(detail, "Latin detail link");
    await page.keyboard.press("Enter");
    await page.waitForURL(`**/${variant}/programs/latin`);
    await page.locator("h1").waitFor();
    await tabTo(
      page
        .getByRole("navigation", { name: "Explore the school" })
        .getByRole("link", { name: "Registration", exact: true }),
      "Registration footer link",
    );
    await page.keyboard.press("Enter");
    await page.waitForURL(`**/${variant}/register`);
    const adult = page
      .locator('main a[href$="/registration-for-adults"]')
      .first();
    await tabTo(adult, "16+ registration choice");
    await page.keyboard.press("Enter");
    await page.waitForURL(`**/${variant}/registration-for-adults`);
    for (const [id, value] of [
      ["name", "Keyboard Demo"],
      ["email", "keyboard@example.test"],
      ["phone", "+1 202 555 0123"],
    ]) {
      await tabTo(page.locator("#demo-" + id), "Synthetic " + id);
      await page.keyboard.type(value);
    }
    await tabTo(page.locator("#demo-interest"), "Interest native select");
    await page.keyboard.press("c");
    await page.keyboard.press("Tab");
    steps.push({
      label: "Native select keyboard value",
      value: await page.locator("#demo-interest").inputValue(),
    });
    if (variant === "interactive") {
      await tabTo(
        page.getByRole("button", { name: "Review demo details" }),
        "Review local demo",
      );
      await page.keyboard.press("Enter");
    }
    await tabTo(
      page.getByRole("button", { name: "Complete local demo", exact: true }),
      "Complete local demo",
    );
    await page.keyboard.press("Enter");
    await page
      .getByRole("status")
      .getByText("Demo completed locally.", { exact: false })
      .waitFor();
    const screenshot = `verification/screenshots/keyboard-${variant}-success.jpg`;
    await page.screenshot({
      path: screenshot,
      fullPage: true,
      animations: "allow",
    });
    records.push({
      variant,
      status: "pass",
      steps,
      screenshot,
      at: new Date().toISOString(),
      browser: browser.version(),
      method:
        "Only Tab, Enter and keyboard typing (including native select type-ahead) operate the UI after initial navigation. No click, fill, selectOption or focus calls.",
    });
  } catch (error) {
    await page.screenshot({
      path: `verification/keyboard-${variant}-failure.jpg`,
      fullPage: true,
    });
    records.push({
      variant,
      status: "fail",
      error: error.message,
      steps,
      fields: await page
        .locator("form input, form select")
        .evaluateAll((els) =>
          els.map((el) => ({ id: el.id, value: el.value })),
        ),
      text: await page.locator("main").innerText(),
    });
  }
  await page.close();
}
await browser.close();
await fs.writeFile(
  "verification/keyboard-review.json",
  JSON.stringify(records, null, 2),
);
console.log(
  records.map(({ variant, status, error }) => ({ variant, status, error })),
);
if (records.some((r) => r.status !== "pass")) process.exitCode = 1;
