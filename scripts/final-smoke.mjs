import { chromium } from "playwright";
import fs from "node:fs/promises";
process.env.PLAYWRIGHT_BROWSERS_PATH = new URL(
  "../.browsers",
  import.meta.url,
).pathname;
const base = process.env.BASE_URL || "http://127.0.0.1:4173";
const rows = JSON.parse(
  await fs.readFile("verification/route-results.json", "utf8"),
);
const cases = rows.filter((r) => r.viewport.width === 1440);
const known = new Set(cases.map((r) => new URL(r.url).pathname));
const browser = await chromium.launch();
const page = await browser.newPage();
const evidence = [];
for (const row of cases) {
  const path = new URL(row.url).pathname;
  const errors = [];
  const onError = (e) => errors.push(e.message);
  page.on("pageerror", onError);
  await page.goto(base + path);
  await page.locator("h1").waitFor();
  const h1 = await page.locator("h1").innerText();
  await page.reload();
  await page.locator("h1").waitFor();
  const links = await page
    .locator("a[href]")
    .evaluateAll((els) =>
      els.map((el) => ({
        href: el.href,
        label: el.textContent || el.getAttribute("aria-label"),
      })),
    );
  const unrecognized = links.filter((link) => {
    const u = new URL(link.href);
    return (
      u.origin === new URL(base).origin &&
      !u.pathname.startsWith("/evidence/") &&
      !known.has(u.pathname.replace(/\/$/, "") || "/")
    );
  });
  const files = [];
  for (const link of links.filter((l) =>
    new URL(l.href).pathname.startsWith("/evidence/"),
  )) {
    const response = await page.request.get(link.href);
    files.push({
      href: link.href,
      status: response.status(),
      contentType: response.headers()["content-type"],
    });
  }
  evidence.push({
    path,
    direct: true,
    refresh: h1 === (await page.locator("h1").innerText()),
    internalLinkCount: links.filter(
      (l) => new URL(l.href).origin === new URL(base).origin,
    ).length,
    unrecognized,
    files,
    errors,
    at: new Date().toISOString(),
    browser: browser.version(),
  });
  page.off("pageerror", onError);
}
await browser.close();
await fs.writeFile(
  "verification/production-smoke.json",
  JSON.stringify(evidence, null, 2),
);
const failures = evidence.filter(
  (r) =>
    !r.refresh ||
    r.unrecognized.length ||
    r.errors.length ||
    r.files.some((f) => f.status !== 200 || !/text|json/.test(f.contentType)),
);
console.log(
  `${evidence.length - failures.length}/${evidence.length} production direct/refresh/internal-route/evidence-link checks passed.`,
);
if (failures.length) {
  console.log(failures);
  process.exitCode = 1;
}
