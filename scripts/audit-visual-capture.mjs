import { chromium } from "playwright";
import fs from "node:fs/promises";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
const base = process.env.BASE_URL || "http://127.0.0.1:4180";
const b = await chromium.launch();
const rows = [];
const commit = execFileSync("git", ["rev-parse", "HEAD"], {
  encoding: "utf8",
}).trim();
await fs.mkdir("verification/publication/screenshots", { recursive: true });
for (const variant of ["viewer", "interactive", "minimal", "vision"])
  for (const viewport of [
    { width: 1440, height: 1000 },
    { width: 390, height: 844 },
  ]) {
    const p = await b.newPage({ viewport, reducedMotion: "no-preference" });
    const url = base + (variant === "viewer" ? "/" : "/" + variant);
    await p.goto(url);
    await p.locator("h1").waitFor();
    await p.evaluate(() => document.fonts.ready);
    await p.evaluate(async () => {
      await Promise.all(
        [...document.images]
          .filter(
            (i) =>
              i.getBoundingClientRect().top < innerHeight &&
              i.getBoundingClientRect().bottom > 0,
          )
          .map((i) => i.decode().catch(() => {})),
      );
    });
    const file = `verification/publication/screenshots/${variant}-home-${viewport.width}.jpg`;
    await p.screenshot({
      path: file,
      type: "jpeg",
      quality: 88,
      animations: "allow",
      fullPage: false,
    });
    const observed = await p.evaluate(() => ({
      innerWidth,
      innerHeight,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    rows.push({
      variant,
      route: variant === "viewer" ? "/" : "/" + variant,
      url,
      viewport,
      observed,
      file,
      codeCommit: commit,
      originalBaselineCommit: "5bad2f2369a0d32a0b238c84b68553614120e080",
      browser: b.version(),
      at: new Date().toISOString(),
      state:
        "default homepage, viewport capture after fonts and visible images ready",
      animations: "allow",
      suppressionStylesInjected: false,
      sha256: crypto
        .createHash("sha256")
        .update(await fs.readFile(file))
        .digest("hex"),
    });
    await p.close();
  }
await b.close();
await fs.writeFile(
  "verification/publication/visual-manifest.json",
  JSON.stringify(rows, null, 2) + "\n",
);
console.log(
  "Captured 8 real viewer/prototype viewport screenshots, with exact code revision.",
);
