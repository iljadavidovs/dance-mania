import { chromium } from "playwright";
import fs from "node:fs/promises";
const entries = JSON.parse(
  await fs.readFile("research/source/documents.json", "utf8"),
);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const out = [];
for (const [i, d] of entries.entries()) {
  try {
    await page.goto(d.url, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(1500);
    await page.screenshot({
      path: `research/source/screenshots/document-${i}.jpg`,
      fullPage: true,
    });
    out.push({
      url: d.url,
      final: page.url(),
      text: await page.locator("body").innerText(),
      screenshot: `research/source/screenshots/document-${i}.jpg`,
      at: new Date().toISOString(),
    });
  } catch (e) {
    out.push({ url: d.url, error: e.message });
  }
}
await fs.writeFile(
  "research/source/document-browser.json",
  JSON.stringify(out, null, 2),
);
await browser.close();
