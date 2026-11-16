import { chromium } from "playwright";
import fs from "node:fs/promises";
const b = await chromium.launch();
const out = [];
for (const variant of ["interactive", "minimal", "vision"]) {
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  const messages = [],
    failed = [],
    responses = [];
  p.on("console", (m) => {
    if (["error", "warning"].includes(m.type()))
      messages.push({ type: m.type(), text: m.text() });
  });
  p.on("pageerror", (e) =>
    messages.push({ type: "pageerror", text: e.message }),
  );
  p.on("requestfailed", (r) =>
    failed.push({ url: r.url(), error: r.failure()?.errorText }),
  );
  p.on("response", (r) => {
    if (r.status() >= 400) responses.push({ url: r.url(), status: r.status() });
  });
  for (const path of [
    "",
    "programs",
    "schedule",
    "instructors",
    "visit",
    "events",
    "rent",
    "dance-shoes-for-sale",
    "shoes-for-kids",
    "about-karls-aniscenko",
    "photos",
    "videos-shows",
    "instructions-for-dancers",
    "registration-for-kids",
  ]) {
    await p.goto(`http://127.0.0.1:4173/${variant}${path ? "/" + path : ""}`);
    await p.locator("h1").waitFor();
    if (path === "photos") {
      await p
        .getByRole("button", { name: /Open photo:/ })
        .first()
        .click();
      await p.getByRole("dialog").waitFor();
      await p.keyboard.press("Escape");
    }
    if (path === "registration-for-kids") {
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
  }
  out.push({
    variant,
    browser: b.version(),
    messages,
    failed,
    responses,
    at: new Date().toISOString(),
  });
  await p.close();
}
await b.close();
await fs.writeFile(
  "verification/console-audit.json",
  JSON.stringify(out, null, 2),
);
console.log(out);
if (out.some((x) => x.messages.length || x.failed.length || x.responses.length))
  process.exitCode = 1;
