> Historical baseline artifact. Claims and scores are reproduced for forensic review, not independently endorsed. Public export omits private context and source-site imagery; see docs/forensic-report.md.

# Executed verification — 16 November 2026

The final functional gates ran against the stable production preview at http://127.0.0.1:4173. All local required gates passed. Raw machine-readable evidence, browser versions and timestamps are retained alongside this report. Older failed iterations remain for diagnosis; the authoritative final files below identify the accepted run.

| Gate / command | Observed result | Evidence |
|---|---|---|
| `npm ci` using existing Node 22.16.0 / npm 10.9.2 | PASS; clean lockfile install, 242 packages added; audit zero vulnerabilities | npm-ci.log, npm-audit.json, package-versions.txt |
| `npm run typecheck` | PASS | typecheck.log |
| `npm run lint` | PASS | lint.log |
| `npm run build` | PASS; TypeScript + Vite production bundle | build.log |
| `BASE_URL=http://127.0.0.1:4173 npm run test:e2e` | **37/37 PASS**, no skips, retries or flaky results; 115.4s | e2e-production.log, journeys-playwright-results.json |
| `BASE_URL=http://127.0.0.1:4173 npm run test:routes` | **588/588 PASS** across 147 cases × four actual widths | routes-production.log, route-results.json |
| `BASE_URL=http://127.0.0.1:4173 npm run capture` + affected-route recapture | **588/588 PASS**, full-page images with fonts/images loaded | capture-production.log, recapture-repairs.log, screenshot-manifest.json |
| `BASE_URL=http://127.0.0.1:4173 npm run test:motion` | **1/1 PASS**, 20 inspected states, zero authored motion findings | motion-production.log, motion-results.json, motion-source-review.md |
| `BASE_URL=http://127.0.0.1:4173 PLAYWRIGHT_BROWSERS_PATH=./.browsers node scripts/browser-review.mjs` | **6/6 PASS**, Chromium 159.0.8154.6 and WebKit 27.2, each variant at 390px with touch-like input | browser-review.json |
| Same environment, `node scripts/keyboard-review.mjs` | **3/3 PASS**; skip/main, desktop menu, finder/detail, chooser and 16+ synthetic completion using keyboard only | keyboard-review.json, keyboard-review.log |
| Same environment, `node scripts/console-audit.mjs` | PASS, 42 route visits plus modal/validation; zero page errors, console warnings/errors or failed/400+ local requests | console-audit.json |
| Same environment, `node scripts/performance.mjs` | Actual unthrottled loopback lab LCP/CLS, resource requests and gzip byte counts, no invented score | performance.json |
| Same environment, `node scripts/final-smoke.mjs` | **147/147 PASS**; refresh on every logical route, zero unrecognized local routes/runtime errors, all 12 evidence destinations return 200 | production-smoke.json, production-smoke.log |
| Screenshot evidence browser | PASS at 1440/390; design + viewport filters return 48 Frame mobile captures; no overflow | evidence-browser.json |
| Asset/font digest audit | 17/17 PASS, including retained notices | asset-digest-check.json |

## Coverage and limits

The 37 tests cover program combinations/search/reset/no-match/invalid URL/history/detail; all five document destinations/filter/archive/availability disclosures; people/sparse records; gallery containment/Escape/focus return/next/previous; actual native video keyboard play/time progression/pause in every variant; controlled broken-image and video-error fixtures; article/category/author relationships; switcher route/query preservation/dismissal/history; all nine form contexts; required/invalid correction, review, pending, deterministic failure, successful simulation, reset, stale-pending reset and guarded result; no form payload in network/URL/storage; and 200% text enlargement at 320 CSS pixels on five templates per variant.

Axe ran on 18 template/modal/invalid-form states across the variants and returned no violations in those scans (`axe-*.json`). Keyboard review logs the actual 3px visible outline and traversed controls. Focus containment, return, order and native controls were exercised. Reflow was measured at 1440×1000, 768×1024, 390×844 and 320×740 with actual innerWidth; all have no page overflow, no broken local images, one H1, expected route content and no runtime exception. Enlarged-text tests double actual computed font sizes; they are not a physical-device or browser-native zoom claim. There is no WCAG certification, human usability study, physical iPhone/Safari test or screen-reader transcript. WebKit is the Playwright engine on this Mac, not claimed as Safari/iOS.

Only synthetic data was entered in local forms. Their request URLs/payloads, localStorage, sessionStorage, cookies and IndexedDB were checked; input remains in disposable component memory. Call/email/map/source form actions were not invoked. Live school forms were inspected without entry or submission. Public source documents were separately read; exact link comparison is not used as a substitute for reading them. External historical recording availability, captions and rights remain explicitly unverified. The licensed unrelated dance demonstration supplies actual local playback.

## Repairs and honest failure history

Initial test failures included ambiguous locators and concurrent test-output deletion, fixed in the test harness. A development route/capture run encountered Vite reloads when generated public thumbnails were written during testing; previews are now staged outside public, and final gates use production preview. Real layout defects (desktop/narrow Frame overflow and enlarged footer text), a stale form-result race and misleading low-resolution/black poster presentation were repaired and affected checks rerun. Secondary page composition was independently rebuilt and recaptured. Before images and logs remain; they are not counted as accepted results.

The first keyboard-only attempts used ArrowDown/Enter on macOS headless Chromium's closed native select. That sequence left its value empty; native type-ahead (`c`) selects a real option and completed all three journeys without any click/fill/selectOption/focus API. Both failed diagnostic rounds are retained. This is recorded as harness correction, not a school-site or application failure.

`npm ci` reports ESLint 9.39.5 is outside its current support window; this is a development-only compatibility choice with the existing config/toolchain, not a vulnerability finding. The project lockfile resolves exact versions. No global package, browser or agent tooling was installed or upgraded.

Final byte/timing interpretation: [performance-summary.md](performance-summary.md). Viewer LCP 44ms/CLS 0; Rhythm 380ms/0.04142; Quiet 360ms/0; Frame 364ms/0.00022 in the recorded single unthrottled loopback run. These are not production guarantees.
