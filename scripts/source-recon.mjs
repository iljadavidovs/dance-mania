import { chromium } from "playwright";
import fs from "node:fs/promises";
const root = "research/source";
await fs.mkdir(root + "/screenshots", { recursive: true });
const index = await fs.readFile(root + "/wp-sitemap.xml", "utf8");
let urls = [];
for (const [, url] of index.matchAll(/<loc>(.*?)<\/loc>/g)) {
  const text = await (await fetch(url)).text();
  await fs.writeFile(root + "/" + url.split("/").at(-1), text);
  urls.push(...[...text.matchAll(/<loc>(.*?)<\/loc>/g)].map((x) => x[1]));
}
await fs.writeFile(root + "/urls.json", JSON.stringify(urls, null, 2));
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const results = [];
for (const url of urls) {
  const slug =
    new URL(url).pathname.split("/").filter(Boolean).join("_") || "home";
  for (const width of [
    1440,
    390,
    ...([
      "home",
      "programs",
      "schedule",
      "registration-for-kids",
      "if-words-were-movements",
    ].includes(slug)
      ? [768, 320]
      : []),
  ]) {
    const page = await context.newPage();
    await page.setViewportSize({
      width,
      height:
        width === 1440
          ? 1000
          : width === 390
            ? 844
            : width === 768
              ? 1024
              : 740,
    });
    const failures = [];
    page.on("requestfailed", (r) =>
      failures.push({ url: r.url(), failure: r.failure()?.errorText }),
    );
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 40000 });
      await page.waitForTimeout(700);
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 700) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 80));
        }
        window.scrollTo(0, 0);
        await document.fonts.ready;
      });
      const dom = await page.evaluate(() => ({
        innerWidth,
        finalURL: location.href,
        title: document.title,
        description:
          document.querySelector("meta[name=description]")?.content || null,
        canonical: document.querySelector("link[rel=canonical]")?.href || null,
        headings: [...document.querySelectorAll("h1,h2,h3")].map((e) => ({
          tag: e.tagName,
          text: e.textContent.trim(),
        })),
        text: document.body.innerText,
        links: [...document.querySelectorAll("a")].map((a) => ({
          text: a.textContent.trim(),
          url: a.href,
        })),
        images: [...document.images].map((i) => ({
          url: i.currentSrc,
          alt: i.alt,
          loaded: i.complete && i.naturalWidth > 0,
        })),
        videos: [...document.querySelectorAll("video,iframe")].map((v) => ({
          tag: v.tagName,
          src: v.currentSrc || v.src,
          sources: [...v.querySelectorAll("source")].map((s) => s.src),
        })),
        overflow: document.documentElement.scrollWidth > innerWidth,
      }));
      const screenshot = `${root}/screenshots/${slug}-${width}.jpg`;
      await page.screenshot({
        path: screenshot,
        fullPage: true,
        type: "jpeg",
        quality: 70,
        animations: "allow",
      });
      results.push({
        url,
        width,
        at: new Date().toISOString(),
        browser: browser.version(),
        screenshot,
        ...dom,
        failures,
      });
      console.log(slug, width, dom.overflow ? "OVERFLOW" : "ok");
    } catch (e) {
      results.push({ url, width, error: e.message });
      console.log(slug, width, "FAILED", e.message.slice(0, 80));
    }
    await page.close();
    await fs.writeFile(root + "/recon.json", JSON.stringify(results, null, 2));
  }
}
await browser.close();
