import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { documents, articles } from "../src/domain/data";
import fs from "node:fs/promises";
async function ready(page: Page, url: string) {
  await page.goto(url);
  await expect(page.locator("h1")).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
}
async function fill(page: Page) {
  await page.getByLabel(/Invented.*name.*required/).fill("Demo Dancer");
  await page.getByLabel(/demo email.*required/i).fill("parent@example.test");
  await page
    .getByLabel("Demo contact phone (required)")
    .fill("+1 202 555 0123");
  await page
    .getByLabel("Interest (required)")
    .selectOption("Classes for myself");
}
async function submit(page: Page, variant: string) {
  if (variant === "interactive")
    await page.getByRole("button", { name: "Review demo details" }).click();
  await page
    .getByRole("button", { name: "Complete local demo", exact: true })
    .click();
}
for (const v of ["interactive", "minimal", "vision"]) {
  test(`${v}: program filters, unknown values, empty state and detail`, async ({
    page,
  }) => {
    await ready(page, `/${v}/programs?audience=unsupported`);
    await expect(
      page.getByText("An unsupported filter was ignored.", { exact: false }),
    ).toBeVisible();
    await page.getByLabel("Search programs").fill("Rumba");
    await expect(page.getByRole("status").first()).toContainText("1 program");
    await expect(page).toHaveURL(/q=Rumba/);
    await page.getByLabel("Search programs").fill("no-match-xyz");
    await expect(
      page.getByRole("heading", { name: "No matches this time" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Clear filters" }).click();
    await page.getByLabel("Audience", { exact: true }).selectOption("Adults");
    await page.getByLabel("Goal", { exact: true }).selectOption("Social");
    await expect(page.getByRole("status").first()).toContainText("1 program");
    await page.reload();
    await expect(page.getByLabel("Goal", { exact: true })).toHaveValue(
      "Social",
    );
    if (v === "vision")
      await page.getByRole("link", { name: "Program in detail" }).click();
    else
      await page
        .getByRole("link", {
          name: v === "interactive" ? "Explore program" : "Program details",
          exact: true,
        })
        .click();
    await expect(page.locator("h1")).toHaveText("Adult social");
    await expect(page.locator("main")).toContainText("Bachata");
    await page.goBack();
    await expect(page.getByLabel("Goal", { exact: true })).toHaveValue(
      "Social",
    );
  });
  test(`${v}: exact document links, filters, archive and access notes`, async ({
    page,
  }) => {
    await ready(page, `/${v}/schedule`);
    for (const d of documents)
      await expect(page.locator(`main a[href="${d.url}"]`)).toHaveCount(1);
    await page.getByLabel("Time context").selectOption("archive");
    await expect(page.locator("main")).toContainText("2 documents");
    await page.getByLabel("Document type").selectOption("Camp");
    await expect(page.locator("main")).toContainText("1 documents");
    await page.getByLabel("Search documents").fill("impossible");
    await expect(
      page.getByRole("heading", { name: "No matches this time" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Clear filters" }).click();
    await expect(page.locator("main")).toContainText("5 documents");
    await page.locator("main details summary").first().click();
    await expect(page.locator("main details[open]")).toBeVisible();
  });
  test(`${v}: gallery, focus containment and focus restoration`, async ({
    page,
  }) => {
    await ready(page, `/${v}/photos`);
    const trigger = page.getByRole("button", { name: /Open photo:/ }).first();
    await trigger.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: "Next photo", exact: true }).click();
    await expect(page.getByRole("dialog")).toContainText("2 / 4");
    await page
      .getByRole("button", { name: "Previous photo", exact: true })
      .click();
    for (let i = 0; i < 9; i++) {
      await page.keyboard.press("Tab");
      expect(
        await page.evaluate(
          () => !!document.activeElement?.closest("[role=dialog]"),
        ),
      ).toBe(true);
    }
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await page
      .getByRole("button", { name: "School photos", exact: true })
      .click();
    await expect(
      page.getByRole("heading", { name: "No matches this time" }),
    ).toBeVisible();
  });
  test(`${v}: native playback and keyboard pause`, async ({ page }) => {
    await ready(page, `/${v}/videos-competitions`);
    const video = page.locator("video");
    await video.scrollIntoViewIfNeeded();
    await video.focus();
    await page.keyboard.press("Space");
    await expect
      .poll(() => video.evaluate((el: HTMLVideoElement) => el.currentTime))
      .toBeGreaterThan(0.1);
    await page.keyboard.press("Space");
    await expect
      .poll(() => video.evaluate((el: HTMLVideoElement) => el.paused))
      .toBe(true);
    const before = await video.evaluate(
      (el: HTMLVideoElement) => el.currentTime,
    );
    await page.waitForTimeout(250);
    expect(await video.evaluate((el: HTMLVideoElement) => el.currentTime)).toBe(
      before,
    );
    await fs.writeFile(
      `verification/video-${v}.json`,
      JSON.stringify(
        {
          browser: page.context().browser()?.version(),
          currentTime: before,
          paused: true,
          at: new Date().toISOString(),
          method:
            "Keyboard Space on native video; time progressed, then stable after pause",
        },
        null,
        2,
      ),
    );
  });
  for (const formPath of [
    "registration-for-kids",
    "registration-for-adults",
    "contact-us",
  ])
    test(`${v}: ${formPath} validation, success, failure, reset and privacy`, async ({
      page,
    }) => {
      await ready(page, `/${v}/${formPath}`);
      const outbound: string[] = [];
      page.on("request", (r) => {
        if (
          r.postData() ||
          decodeURIComponent(r.url()).includes("Demo Dancer") ||
          r.url().includes("parent%40") ||
          r.url().includes("parent@example")
        )
          outbound.push(r.url());
      });
      await page
        .getByRole("button", {
          name:
            v === "interactive" ? "Review demo details" : "Complete local demo",
          exact: true,
        })
        .click();
      await expect(page.locator("[aria-invalid=true]").first()).toBeFocused();
      await fill(page);
      await page.getByLabel(/demo email.*required/i).fill("invalid");
      await page
        .getByRole("button", {
          name:
            v === "interactive" ? "Review demo details" : "Complete local demo",
          exact: true,
        })
        .click();
      await expect(page.locator("#email-error")).toBeVisible();
      await page
        .getByLabel(/demo email.*required/i)
        .fill("parent@example.test");
      await submit(page, v);
      await expect(page.getByRole("status")).toContainText(
        "Demo completed locally. No information was sent",
      );
      await expect(page.locator("#demo-name")).toHaveValue("");
      await page.getByRole("link", { name: "View local demo result" }).click();
      await expect(page.locator("h1")).toHaveText("Local demo result");
      await page.reload();
      await expect(page.locator("h1")).toHaveText("No local demo result");
      await ready(page, `/${v}/${formPath}`);
      await fill(page);
      await page.getByText("Laboratory test controls", { exact: true }).click();
      await page.getByLabel("Simulation outcome").selectOption("failure");
      await submit(page, v);
      await expect(page.getByRole("status")).toContainText(
        "Simulated failure. Nothing was sent.",
      );
      await page.getByRole("button", { name: "Reset form" }).click();
      await expect(page.locator("#demo-name")).toHaveValue("");
      await fill(page);
      await page
        .getByRole("navigation", { name: "Switch design direction" })
        .getByRole("link", {
          name: v === "minimal" ? "Frame & Floor" : "Quiet Form",
        })
        .click();
      await expect(page.locator("#demo-name")).toHaveValue("");
      expect(outbound).toEqual([]);
      expect(
        await page.evaluate(() => ({
          local: localStorage.length,
          session: sessionStorage.length,
          cookie: document.cookie,
        })),
      ).toEqual({ local: 0, session: 0, cookie: "" });
      expect(
        await page.evaluate(async () => await indexedDB.databases()),
      ).toEqual([]);
    });
  test(`${v}: article relationships, people, unknown records, broken media fixture`, async ({
    page,
  }) => {
    await ready(page, `/${v}/category/for-dancers`);
    for (const a of articles) {
      const links = page
        .locator("main")
        .getByRole("link", { name: a.title, exact: true });
      await expect(links).toHaveCount(
        a.categories.includes("For dancers") ? 1 : 0,
      );
    }
    await ready(page, `/${v}/author/dancemaniaschool_ru3lje`);
    for (const a of articles)
      await expect(
        page.locator("main").getByRole("link", { name: a.title, exact: true }),
      ).toHaveCount(1);
    await ready(page, `/${v}/instructors/tamir-azbel`);
    await expect(page.locator("main")).toContainText("Instructor");
    await expect(page.locator("main")).toContainText("not published");
    await ready(page, `/${v}/programs/missing`);
    await expect(page.getByTestId("not-found")).toBeVisible();
    await page.route("**/assets/latin.jpg", (r) => r.abort());
    await ready(page, `/${v}/programs/latin`);
    await expect(
      page.getByRole("img", { name: /Latin dance couple/ }),
    ).toContainText("Illustration unavailable");
  });
  test(`${v}: mobile menu, keyboard navigation, reflow and axe`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await ready(page, `/${v}`);
    await page.getByRole("button", { name: "Menu", exact: true }).click();
    await expect(
      page.getByRole("navigation", { name: "Main navigation" }),
    ).toBeVisible();
    await page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: "Schedules & fees", exact: true })
      .click();
    await expect(page.locator("h1")).toBeVisible();
    await expect(
      page.getByRole("navigation", { name: "Main navigation" }),
    ).not.toBeVisible();
    for (const path of [
      "programs",
      "schedule",
      "instructors",
      "photos",
      "instructions-for-dancers",
      "registration-for-kids",
    ]) {
      await ready(page, `/${v}/${path}`);
      if (path === "photos")
        await page
          .getByRole("button", { name: /Open photo:/ })
          .first()
          .click();
      if (path === "registration-for-kids")
        await page
          .getByRole("button", {
            name:
              v === "interactive"
                ? "Review demo details"
                : "Complete local demo",
            exact: true,
          })
          .click();
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      await fs.writeFile(
        `verification/axe-${v}-${path}.json`,
        JSON.stringify(results, null, 2),
      );
      expect(
        results.violations.map((r) => ({
          id: r.id,
          nodes: r.nodes.map((n) => n.target),
        })),
      ).toEqual([]);
    }
    await ready(page, `/${v}/instructions-for-dancers`);
    await page.evaluate(
      () => (document.documentElement.style.fontSize = "200%"),
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.setViewportSize({ width: 320, height: 740 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
}
for (const v of ["interactive", "minimal", "vision"])
  test(`${v}: logical switch/history, immersive mode, video fallback and long-input validation`, async ({
    page,
  }) => {
    await ready(page, `/${v}/the-walk-of-fame`);
    const next = v === "minimal" ? "vision" : "minimal";
    await page
      .getByRole("navigation", { name: "Switch design direction" })
      .getByRole("link", {
        name: next === "vision" ? "Frame & Floor" : "Quiet Form",
        exact: true,
      })
      .click();
    await expect(page).toHaveURL(new RegExp(`/${next}/the-walk-of-fame$`));
    await expect(page.locator("h1")).toHaveText("The walk of fame");
    await page.goBack();
    await expect(page).toHaveURL(new RegExp(`/${v}/the-walk-of-fame$`));
    await page.goForward();
    await expect(page).toHaveURL(new RegExp(`/${next}/the-walk-of-fame$`));
    await page.getByRole("button", { name: "Dismiss design switcher" }).click();
    await expect(
      page.getByRole("complementary", { name: "Design direction switcher" }),
    ).toHaveCount(0);
    await page.getByRole("link", { name: "Return to design gallery" }).click();
    await expect(page.locator("h1")).toHaveText(
      "Different waysto find the floor.",
    );
    await ready(page, `/${v}/programs?q=Rumba&style=Latin`);
    await page
      .getByRole("navigation", { name: "Switch design direction" })
      .getByRole("link", {
        name: next === "vision" ? "Frame & Floor" : "Quiet Form",
        exact: true,
      })
      .click();
    await expect(page).toHaveURL(/q=Rumba&style=Latin/);
    await expect(page.getByLabel("Search programs")).toHaveValue("Rumba");
    await ready(page, `/${v}/registration-for-adults`);
    await fill(page);
    await page.locator("#demo-name").fill("Demo " + "X".repeat(150));
    await page
      .getByRole("button", {
        name:
          v === "interactive" ? "Review demo details" : "Complete local demo",
        exact: true,
      })
      .click();
    await expect(page.locator("#name-error")).toHaveText(
      "Use 100 characters or fewer.",
    );
    await page.getByRole("button", { name: "Reset form" }).click();
    await page.route("**/assets/dance-demo.mp4", (r) => r.abort());
    await ready(page, `/${v}/videos-shows`);
    await page.locator("video").focus();
    await page.keyboard.press("Space");
    await expect(
      page.getByText("This local demonstration video could not load.", {
        exact: false,
      }),
    ).toBeVisible();
    await page.screenshot({
      path: `verification/screenshots/video-fallback-${v}.jpg`,
      fullPage: true,
      animations: "allow",
    });
  });
test("Rhythm Room comparison and quick-view drawer preserve keyboard focus", async ({
  page,
}) => {
  await ready(page, "/interactive/programs");
  await page
    .getByRole("button", { name: "Compare", exact: true })
    .first()
    .click();
  await page
    .getByRole("button", { name: "Compare", exact: true })
    .first()
    .click();
  await expect(
    page.getByRole("region", { name: "Program comparison" }),
  ).toContainText("Competitive Latin");
  await expect(
    page.getByRole("region", { name: "Program comparison" }),
  ).toContainText("Competitive Standard");
  await page.getByRole("button", { name: "Clear comparison" }).click();
  await expect(
    page.getByRole("region", { name: "Program comparison" }),
  ).toHaveCount(0);
  await ready(page, "/interactive/instructors");
  const trigger = page
    .getByRole("button", { name: "Quick view", exact: true })
    .first();
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toHaveClass(/drawer/);
  await expect(page.getByRole("dialog")).toContainText("Igor Nikon");
  await page.screenshot({
    path: "verification/screenshots/interactive-quick-view-drawer.jpg",
    animations: "allow",
  });
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});

for (const v of ["interactive", "minimal", "vision"])
  test(`${v}: resetting pending simulation invalidates its eventual result`, async ({
    page,
  }) => {
    await ready(page, `/${v}/registration-for-adults`);
    await fill(page);
    await submit(page, v);
    await expect(page.getByRole("status")).toContainText("Processing only");
    await page.getByRole("button", { name: "Reset form" }).click();
    await page.waitForTimeout(850);
    await expect(
      page.getByText("Demo completed locally.", { exact: false }),
    ).toHaveCount(0);
    await expect(page.locator("#demo-name")).toHaveValue("");
    await page.goto(`/${v}/thank-you`);
    await expect(page.locator("h1")).toHaveText("No local demo result");
  });
for (const v of ["interactive", "minimal", "vision"])
  test(`${v}: actual 200 percent text enlargement reflows at 320 CSS pixels`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 740 });
    const reports = [];
    for (const route of [
      "programs",
      "schedule",
      "instructors/ariella-shribman",
      "registration-for-kids",
      "how-dancing-is-evaluated-on-the-competitions",
    ]) {
      await ready(page, `/${v}/${route}`);
      const enlarged = await page.evaluate(() => {
        const values = [
          ...document.querySelectorAll<HTMLElement>(
            "h1,h2,h3,p,li,dt,dd,label,input,select,textarea,button,a,summary,figcaption",
          ),
        ].map((el) => ({
          el,
          size: parseFloat(getComputedStyle(el).fontSize),
        }));
        for (const { el, size } of values) el.style.fontSize = `${size * 2}px`;
        return values.length;
      });
      const state = await page.evaluate(() => ({
        width: innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        offenders: [...document.querySelectorAll("body *")]
          .filter((el) => el.getBoundingClientRect().right > innerWidth + 1)
          .map((el) => ({
            tag: el.tagName,
            class: el.className,
            text: el.textContent?.slice(0, 50),
          })),
      }));
      expect(
        state.scrollWidth,
        JSON.stringify(state.offenders),
      ).toBeLessThanOrEqual(320);
      reports.push({ route, enlarged, ...state });
      if (route === "registration-for-kids")
        await page.screenshot({
          path: `verification/screenshots/text-200-${v}-320.jpg`,
          fullPage: true,
          animations: "allow",
        });
    }
    await fs.writeFile(
      `verification/text-enlargement-${v}.json`,
      JSON.stringify(
        {
          method:
            "All relevant text elements use twice their measured computed font size, at actual 320 CSS-pixel viewport. This is a text-resize test, not a claimed physical browser zoom or device test.",
          reports,
        },
        null,
        2,
      ),
    );
  });
