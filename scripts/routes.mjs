import { chromium } from "playwright";
import fs from "node:fs/promises";
process.env.PLAYWRIGHT_BROWSERS_PATH = new URL(
  "../.browsers",
  import.meta.url,
).pathname;
const onlyArg = process.argv.find((x) => x.startsWith("--only="));
const only = onlyArg ? onlyArg.slice(7).split(",") : null;
const viewerOnly = process.argv.includes("--viewer-only");
const capture = process.argv.includes("--capture"),
  base = process.env.BASE_URL || "http://127.0.0.1:5173";
const manifest = JSON.parse(
  await fs.readFile("research/previous-audit/route-manifest.json", "utf8"),
);
const paths = manifest.map((r) =>
  new URL(r.url).pathname.replace(/^\/|\/$/g, ""),
);
const people = [
  "igor-nikon",
  "yelena-nikon",
  "dayana-nikon",
  "karls-aniscenko",
  "andrey-lobankov",
  "liana-koroleva",
  "dennis-gluskin",
  "anna-perzan",
  "ariella-shribman",
  "tamir-azbel",
];
const extra = [
  "register",
  "visit",
  ...["latin", "standard", "children", "social"].map((s) => "programs/" + s),
  ...people.map((s) => "instructors/" + s),
  "missing",
  "programs/missing",
  "instructors/missing",
];
const widths = [
  { width: 1440, height: 1000 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
  { width: 320, height: 740 },
];
await fs.mkdir("verification/screenshots", { recursive: true });
await fs.mkdir("verification/previews", { recursive: true });
const browser = await chromium.launch();
let results = [];
await Promise.all(
  ["interactive", "minimal", "vision"]
    .filter(() => !viewerOnly)
    .map(async (variant) => {
      const context = await browser.newContext({
        reducedMotion: "no-preference",
      });
      const page = await context.newPage();
      for (const path of [...paths, ...extra].filter(
        (p) => !only || only.includes(p),
      ))
        for (const viewport of widths) {
          await page.setViewportSize(viewport);
          const url = `${base}/${variant}${path ? "/" + path : ""}`;
          const errors = [];
          const onError = (e) => errors.push(e.message);
          page.on("pageerror", onError);
          let row = {
            variant,
            path,
            viewport,
            url,
            at: new Date().toISOString(),
            browser: browser.version(),
            kind: paths.includes(path) ? "source-equivalent" : "local",
            state:
              "Default route after fonts/images load; no entered form values; collapsed menu and closed modal",
          };
          try {
            await page.goto(url, { waitUntil: "domcontentloaded" });
            await page.locator("h1").waitFor();
            await page.evaluate(() => document.fonts.ready);
            await page.evaluate(async () => {
              for (let y = 0; y < document.body.scrollHeight; y += 800) {
                scrollTo(0, y);
                await new Promise((r) => setTimeout(r, 10));
              }
              scrollTo(0, 0);
              await Promise.all(
                [...document.images].map((i) => i.decode().catch(() => {})),
              );
            });
            const info = await page.evaluate(() => ({
              innerWidth,
              scrollWidth: document.documentElement.scrollWidth,
              h1: [...document.querySelectorAll("h1")].map(
                (e) => e.textContent,
              ),
              textLength:
                document.querySelector("main")?.textContent.length || 0,
              broken: [...document.images]
                .filter((i) => !i.complete || !i.naturalWidth)
                .map((i) => i.src),
              localEscapes: [...document.querySelectorAll("header a, footer a")]
                .filter((a) => a.href.includes("dancemaniaschool.com"))
                .map((a) => a.href),
              title: document.title,
              notFound: !!document.querySelector("[data-testid=not-found]"),
            }));
            row = {
              ...row,
              ...info,
              errors,
              implemented: info.h1.length === 1,
              content: info.textLength > 100,
              overflow: info.scrollWidth > viewport.width,
              passed:
                info.h1.length === 1 &&
                info.textLength > 100 &&
                !info.broken.length &&
                info.scrollWidth <= viewport.width &&
                !errors.length &&
                info.notFound === path.includes("missing"),
            };
            if (capture) {
              const name = `${variant}--${path.replaceAll("/", "_") || "home"}--${viewport.width}.jpg`;
              row.screenshot = `verification/screenshots/${name}`;
              await page.screenshot({
                path: row.screenshot,
                fullPage: true,
                type: "jpeg",
                quality: 72,
                animations: "allow",
              });
              if (path === "" && [1440, 390].includes(viewport.width))
                await page.screenshot({
                  path: `verification/previews/${variant}-${viewport.width === 1440 ? "desktop" : "mobile"}.jpg`,
                  type: "jpeg",
                  quality: 82,
                  animations: "allow",
                });
            }
            if (viewport.width === 1440) {
              await page.reload({ waitUntil: "domcontentloaded" });
              await page.locator("h1").waitFor();
              row.refresh =
                (await page.locator("h1").textContent()) === info.h1[0];
              row.passed &&= row.refresh;
            }
          } catch (e) {
            row.passed = false;
            row.error = e.message;
          }
          page.off("pageerror", onError);
          results.push(row);
          if (!row.passed)
            console.log(
              "FAIL",
              variant,
              path,
              viewport.width,
              JSON.stringify(row),
            );
          else if (viewport.width === 320)
            console.log("PASS", variant, path || "home");
        }
      await context.close();
    }),
);
for (const path of only ? [] : ["/", "/provenance", "/missing"])
  for (const viewport of widths) {
    const p = await browser.newPage({ viewport });
    let row = {
      variant: "viewer",
      state: "Viewer gallery, provenance or recovery default state",
      path,
      viewport,
      url: base + path,
      at: new Date().toISOString(),
      browser: browser.version(),
    };
    try {
      await p.goto(base + path, { waitUntil: "domcontentloaded" });
      await p.locator("h1").waitFor();
      await p.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) {
          scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 10));
        }
        await Promise.all(
          [...document.images].map((i) => i.decode().catch(() => {})),
        );
        scrollTo(0, 0);
      });
      const info = await p.evaluate(() => ({
        innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        h1: document.querySelectorAll("h1").length,
        broken: [...document.images]
          .filter((i) => !i.complete || !i.naturalWidth)
          .map((i) => i.src),
      }));
      row = {
        ...row,
        ...info,
        passed:
          info.scrollWidth <= viewport.width &&
          info.h1 === 1 &&
          !info.broken.length,
      };
      if (capture) {
        row.screenshot = `verification/screenshots/viewer--${path.slice(1) || "home"}--${viewport.width}.jpg`;
        await p.screenshot({
          path: row.screenshot,
          fullPage: true,
          type: "jpeg",
          quality: 75,
          animations: "allow",
        });
      }
    } catch (e) {
      row.passed = false;
      row.error = e.message;
    }
    results.push(row);
    await p.close();
  }
await browser.close();
if (capture && !only && !viewerOnly) {
  for (const variant of ["interactive", "minimal", "vision"])
    for (const size of ["desktop", "mobile"])
      await fs.copyFile(
        `verification/previews/${variant}-${size}.jpg`,
        `public/previews/${variant}-${size}.jpg`,
      );
}
if (capture && (only || viewerOnly)) {
  const previous = JSON.parse(
    await fs.readFile("verification/screenshot-manifest.json", "utf8"),
  );
  results = [
    ...previous.filter((r) =>
      viewerOnly
        ? r.variant !== "viewer"
        : !only.includes(r.path) || r.variant === "viewer",
    ),
    ...results,
  ];
}
await fs.writeFile(
  `verification/${capture ? "screenshot-manifest" : "route-results"}.json`,
  JSON.stringify(results, null, 2),
);
console.log(
  `${results.filter((r) => r.passed).length}/${results.length} passed. Browser ${browser.version()}`,
);
if (results.some((r) => !r.passed)) process.exitCode = 1;
