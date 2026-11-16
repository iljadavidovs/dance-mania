import { chromium } from "playwright";
import fs from "node:fs/promises";
const b = await chromium.launch();
const page = await b.newPage({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "no-preference",
});
const manifest = [];
const base = process.env.BASE_URL || "http://127.0.0.1:5173";
async function go(v, path) {
  await page.goto(`${base}/${v}/${path}`);
  await page.locator("h1").waitFor();
  await page.evaluate(() => document.fonts.ready);
}
async function shot(v, state) {
  const path = `verification/screenshots/state-${v}-${state}.jpg`;
  await page.screenshot({
    path,
    fullPage: true,
    type: "jpeg",
    quality: 80,
    animations: "allow",
  });
  manifest.push({
    variant: v,
    state,
    path,
    url: page.url(),
    viewport: await page.evaluate(() => ({
      width: innerWidth,
      height: innerHeight,
    })),
    browser: b.version(),
    at: new Date().toISOString(),
    animations: "allow",
  });
}
for (const v of ["interactive", "minimal", "vision"]) {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await go(v, "programs");
  await page.getByLabel("Search programs").fill("unmatched");
  await page.getByRole("heading", { name: "No matches this time" }).waitFor();
  await shot(v, "programs-empty");
  await page.getByRole("button", { name: "Clear filters" }).click();
  if (v === "interactive") {
    await page
      .getByRole("button", { name: "Compare", exact: true })
      .first()
      .click();
    await page
      .getByRole("button", { name: "Compare", exact: true })
      .first()
      .click();
  } else if (v === "minimal")
    await page.locator("main details summary").first().click();
  else await page.getByRole("button", { name: /Competitive Standard/ }).click();
  await shot(v, "programs-selected");
  await go(v, "photos");
  await page
    .getByRole("button", { name: /Open photo:/ })
    .first()
    .click();
  await page.getByRole("dialog").waitFor();
  await shot(v, "lightbox");
  await page.keyboard.press("Escape");
  await go(v, "registration-for-kids");
  await page
    .getByRole("button", {
      name: v === "interactive" ? "Review demo details" : "Complete local demo",
      exact: true,
    })
    .click();
  await shot(v, "form-validation");
  await page.locator("#demo-name").fill("Demo Dancer");
  await page.locator("#demo-email").fill("parent@example.test");
  await page.locator("#demo-phone").fill("+1 202 555 0123");
  await page.locator("#demo-interest").selectOption("Classes for children");
  await page.getByText("Laboratory test controls", { exact: true }).click();
  await page.getByLabel("Simulation outcome").selectOption("failure");
  if (v === "interactive")
    await page.getByRole("button", { name: "Review demo details" }).click();
  await page
    .getByRole("button", { name: "Complete local demo", exact: true })
    .click();
  await shot(v, "form-pending");
  await page
    .getByRole("status")
    .getByText("Simulated failure.", { exact: false })
    .waitFor();
  await shot(v, "form-failure");
  await page.getByLabel("Simulation outcome").selectOption("success");
  await page
    .getByRole("button", { name: "Complete local demo", exact: true })
    .click();
  await page
    .getByRole("status")
    .getByText("Demo completed locally.", { exact: false })
    .waitFor();
  await shot(v, "form-success");
  await page.setViewportSize({ width: 390, height: 844 });
  await go(v, "schedule");
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await shot(v, "mobile-menu");
}
await fs.writeFile(
  "verification/interaction-screenshot-manifest.json",
  JSON.stringify(manifest, null, 2),
);
await b.close();
console.log("Captured", manifest.length, "real interaction states");
