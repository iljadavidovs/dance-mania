import { defineConfig } from "@playwright/test";
process.env.PLAYWRIGHT_BROWSERS_PATH = new URL(
  "./.browsers",
  import.meta.url,
).pathname;
const suite = process.argv.some((a) => a.includes("motion.spec"))
  ? "motion"
  : "journeys";
export default defineConfig({
  outputDir: `test-results/${suite}`,
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  timeout: 45000,
  expect: { timeout: 7000 },
  use: {
    baseURL: process.env.BASE_URL || "http://127.0.0.1:5173",
    viewport: { width: 1440, height: 1000 },
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    reducedMotion: "no-preference",
  },
  reporter: [
    ["list"],
    ["json", { outputFile: `verification/${suite}-playwright-results.json` }],
  ],
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
});
