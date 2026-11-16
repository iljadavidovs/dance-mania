import { chromium } from "playwright";
import fs from "node:fs/promises";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
await p.goto(
  "https://drive.google.com/file/d/1b1r3NL9T-ufs1IwlqEpg66Q24tSsycl1/view?usp=sharing",
);
await p.waitForTimeout(9000);
await p.screenshot({
  path: "research/source/screenshots/document-1-refreshed.jpg",
  fullPage: true,
});
await fs.writeFile(
  "research/source/document-1-refreshed.txt",
  await p.locator("body").innerText(),
);
await b.close();
