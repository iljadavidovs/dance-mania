import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage();
for (const v of ["interactive", "minimal", "vision"])
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: width === 1440 ? 1000 : 844 });
    await page.goto(`http://127.0.0.1:5173/${v}`);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(600);
    await page.screenshot({
      path: `verification/screenshots/initial-${v}-${width}.jpg`,
      fullPage: true,
      type: "jpeg",
      quality: 80,
      animations: "allow",
    });
    await page.screenshot({
      path: `public/previews/${v}-${width === 1440 ? "desktop" : "mobile"}.jpg`,
      type: "jpeg",
      quality: 80,
      animations: "allow",
    });
    console.log(
      v,
      width,
      await page.evaluate(() => ({
        width: innerWidth,
        overflow: document.documentElement.scrollWidth > innerWidth,
        images: [...document.images]
          .filter((i) => !i.complete || !i.naturalWidth)
          .map((i) => i.src),
      })),
    );
  }
await browser.close();
