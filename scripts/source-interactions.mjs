import { chromium } from "playwright";
import fs from "node:fs/promises";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
await p.goto("https://dancemaniaschool.com/");
await p.waitForTimeout(500);
const inventory = await p
  .locator("header button")
  .evaluateAll((es) =>
    es.map((e) => ({
      text: e.textContent,
      label: e.getAttribute("aria-label"),
      class: e.className,
    })),
  );
console.log(inventory);
await fs.writeFile(
  "research/source/menu-controls.json",
  JSON.stringify(inventory, null, 2),
);
const buttons = p.locator("header .dropdown-toggle");
if (await buttons.count()) {
  await buttons.first().focus();
  await p.keyboard.press("Enter");
  await p.screenshot({
    path: "research/source/screenshots/desktop-keyboard-menu.jpg",
  });
  await fs.writeFile(
    "research/source/keyboard-menu.json",
    JSON.stringify(
      await p
        .locator("header")
        .evaluate((el) => ({
          text: el.innerText,
          buttons: [...el.querySelectorAll("button")].map((e) => ({
            text: e.textContent,
            expanded: e.getAttribute("aria-expanded"),
          })),
          menus: [...el.querySelectorAll("ul ul")].map((e) => ({
            opacity: getComputedStyle(e).opacity,
            visibility: getComputedStyle(e).visibility,
            display: getComputedStyle(e).display,
          })),
        })),
      null,
      2,
    ),
  );
}
await buttons.first().locator("..").hover();
await p.screenshot({
  path: "research/source/screenshots/desktop-hover-menu.jpg",
});
await p.setViewportSize({ width: 390, height: 844 });
await p.reload();
console.log(
  await p
    .locator("button")
    .evaluateAll((es) =>
      es.map((e) => ({
        text: e.textContent,
        label: e.getAttribute("aria-label"),
        class: e.className,
      })),
    ),
);
const m = p.locator(".responsive-menu-icon");
if (await m.count()) {
  await m.click();
  await p.screenshot({
    path: "research/source/screenshots/mobile-menu-open.jpg",
  });
}
await p.goto("https://dancemaniaschool.com/videos-competitions/");
const video = p.locator("video").first();
await video.scrollIntoViewIfNeeded();
await video.focus();
await p.keyboard.press("Space");
await p.waitForTimeout(700);
const playing = await video.evaluate((v) => ({
  time: v.currentTime,
  paused: v.paused,
  error: v.error?.message,
}));
await p.keyboard.press("Space");
const paused = await video.evaluate((v) => ({
  time: v.currentTime,
  paused: v.paused,
}));
await fs.writeFile(
  "research/source/video-check.json",
  JSON.stringify(
    { playing, paused, at: new Date().toISOString(), browser: b.version() },
    null,
    2,
  ),
);
await b.close();
