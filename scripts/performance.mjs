import { chromium } from "playwright";
import fs from "node:fs/promises";
import zlib from "node:zlib";
const b = await chromium.launch();
const records = [];
const base = process.env.BASE_URL || "http://127.0.0.1:4173";
for (const variant of ["viewer", "interactive", "minimal", "vision"]) {
  const context = await b.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const p = await context.newPage();
  await p.addInitScript(() => {
    window.metrics = { lcp: 0, cls: 0 };
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) window.metrics.lcp = e.startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((list) => {
      for (const e of list.getEntries())
        if (!e.hadRecentInput) window.metrics.cls += e.value;
    }).observe({ type: "layout-shift", buffered: true });
  });
  await p.goto(base + (variant === "viewer" ? "/" : "/" + variant));
  await p.locator("h1").waitFor();
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(1000);
  const measured = await p.evaluate(() => ({
    metrics: window.metrics,
    navigation: performance
      .getEntriesByType("navigation")
      .map((n) => ({
        domContentLoaded: n.domContentLoadedEventEnd,
        load: n.loadEventEnd,
      })),
    resources: performance
      .getEntriesByType("resource")
      .map((r) => ({
        path: new URL(r.name).pathname,
        transfer: r.transferSize,
        encoded: r.encodedBodySize,
        duration: r.duration,
      })),
    userAgent: navigator.userAgent,
  }));
  records.push({
    variant,
    ...measured,
    browser: b.version(),
    at: new Date().toISOString(),
    conditions:
      "Fresh browser context; headless Chromium; local loopback production server; desktop 1440×1000; no network or CPU throttling. These are lab observations, not field metrics or Lighthouse scores.",
  });
  await context.close();
}
const bundles = [];
for (const file of (await fs.readdir("dist/assets")).filter((f) =>
  /\.(js|css)$/.test(f),
)) {
  const bytes = await fs.readFile("dist/assets/" + file);
  bundles.push({
    file,
    bytes: bytes.length,
    gzipBytes: zlib.gzipSync(bytes).length,
  });
}
const assets = [];
for (const file of await fs.readdir("public/assets")) {
  const stat = await fs.stat("public/assets/" + file);
  if (stat.isFile()) assets.push({ file, bytes: stat.size });
}
await b.close();
await fs.writeFile(
  "verification/performance.json",
  JSON.stringify({ records, bundles, assets }, null, 2),
);
console.log(
  records.map((r) => ({
    variant: r.variant,
    ...r.metrics,
    fonts: r.resources
      .filter((x) => x.path.includes("/fonts/"))
      .map((x) => x.path),
  })),
);
