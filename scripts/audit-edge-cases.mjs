import { chromium } from "playwright";
import fs from "node:fs/promises";
const base = process.env.BASE_URL || "http://127.0.0.1:4180";
const b = await chromium.launch();
const rows = [];
for (const variant of ["interactive", "minimal", "vision"]) {
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  async function complete() {
    await p.locator("#demo-name").fill("Audit Dancer");
    await p.locator("#demo-email").fill("audit@example.test");
    await p.locator("#demo-phone").fill("+1 202 555 0123");
    await p.locator("#demo-interest").selectOption("Classes for myself");
    await p
      .getByRole("button", {
        name:
          variant === "interactive"
            ? "Review demo details"
            : "Complete local demo",
        exact: true,
      })
      .click();
  }
  await p.goto(`${base}/${variant}/registration-for-kids`);
  await p.locator("#demo-guardian").fill("Demo " + "X".repeat(120));
  await complete();
  const guardian = await p
    .locator("#demo-guardian")
    .evaluate((el) => ({
      length: el.value.length,
      ariaInvalid: el.getAttribute("aria-invalid"),
      describedBy: el.getAttribute("aria-describedby"),
    }));
  const text = await p.locator("main").innerText();
  const screenshot = `verification/screenshots/audit-${variant}-guardian-long.jpg`;
  await p.screenshot({ path: screenshot, fullPage: true, animations: "allow" });
  rows.push({
    variant,
    case: "Optional guardian exceeds schema max 100",
    observed: guardian,
    visibleErrorMessages: await p.locator(".field-error").allTextContents(),
    reviewVisible: await p
      .getByRole("button", { name: "Complete local demo", exact: true })
      .count(),
    success: text.includes("Demo completed locally."),
    finding:
      guardian.length > 100 && !text.includes("100 characters")
        ? "confirmed: validation prevents progress without guardian error association/message"
        : "not reproduced",
    screenshot,
    at: new Date().toISOString(),
    browser: b.version(),
  });
  await p.goto(`${base}/${variant}/contact-us`);
  await p.locator("#demo-message").fill("X".repeat(1501));
  await complete();
  const message = await p
    .locator("#demo-message")
    .evaluate((el) => ({
      ariaInvalid: el.getAttribute("aria-invalid"),
      describedBy: el.getAttribute("aria-describedby"),
    }));
  rows.push({
    variant,
    case: "Optional inquiry message exceeds 1500",
    observed: message,
    errors: await p.locator(".field-error").allTextContents(),
    finding:
      message.ariaInvalid === "true" && !message.describedBy
        ? "confirmed: visible message error lacks describedby association"
        : "not reproduced",
    at: new Date().toISOString(),
    browser: b.version(),
  });
  await p.goto(`${base}/${variant}/author/dancemaniaschool_ru3lje`);
  rows.push({
    variant,
    case: "Author archive metadata",
    title: await p.title(),
    at: new Date().toISOString(),
  });
  await p.close();
}
await b.close();
await fs.writeFile(
  "verification/edge-case-audit.json",
  JSON.stringify(rows, null, 2),
);
console.log(
  rows.map(({ variant, case: c, finding, observed, title }) => ({
    variant,
    case: c,
    finding,
    observed,
    title,
  })),
);
process.exitCode = rows.some((r) => r.finding?.startsWith("confirmed:"))
  ? 1
  : 0;
