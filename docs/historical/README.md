> Historical baseline artifact. Claims and scores are reproduced for forensic review, not independently endorsed. Public export omits private context and source-site imagery; see docs/forensic-report.md.

# Dance Mania School — local redesign laboratory

Three complete, independent React prototypes and one shared viewer. Local only: no deployment, backend, analytics, real submission, payment or enrollment. Source snapshot: November 16, 2026. All local acceptance gates are recorded in [verification/acceptance.md](verification/acceptance.md).

Project: `$ORIGINAL_PROJECT`

## Open the running laboratory

Production viewer: http://127.0.0.1:4173/

- Rhythm Room: http://127.0.0.1:4173/interactive
- Quiet Form: http://127.0.0.1:4173/minimal
- Frame & Floor: http://127.0.0.1:4173/vision
- Sources and evidence: http://127.0.0.1:4173/provenance
- Screenshot browser: http://127.0.0.1:4173/evidence/index.html

Development viewer is also running at http://127.0.0.1:5173/. Use production for a stable review while evidence files are edited. Both servers bind to loopback. They run in identifiable managed terminal sessions, not detached services: development session `78877`, Vite process `15352`; production session `55633`, preview process `24103` (verified in the delivery session). Stop with Ctrl+C in the corresponding managed terminal, or `kill -TERM 15352` / `kill -TERM 24103` after checking that the PID still belongs to this project. A restarted process gets a new PID. Do not kill an unrelated process to free a port.

## Reproduce installation and run

This Mac's default Node was 22.11.0; the already installed `/usr/local/bin/node` is 22.16.0, npm 10.9.2. This project requires Node ≥22.13. No global environment was changed. In the terminal used for this project:

```sh
cd $ORIGINAL_PROJECT
export PATH=/usr/local/bin:$PATH
node --version
npm --version
npm ci
npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

Ctrl+C stops that foreground development server. For a production build and local preview, in a separate terminal:

```sh
cd $ORIGINAL_PROJECT
export PATH=/usr/local/bin:$PATH
npm run build
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

Ctrl+C stops preview. If a port is already occupied by these delivery servers, use them or choose another free loopback port and set `BASE_URL` accordingly. Production preview supplies SPA deep-link fallback; no external hosting is configured. `package-lock.json` is authoritative for exact package resolution.

## Verify

Project-local browser binaries are retained in `.browsers/`. To reproduce them if missing:

```sh
PLAYWRIGHT_BROWSERS_PATH=./.browsers npx playwright install chromium webkit
```

With preview running at 4173:

```sh
npm run typecheck
npm run lint
BASE_URL=http://127.0.0.1:4173 npm run test:routes
BASE_URL=http://127.0.0.1:4173 npm run test:e2e
BASE_URL=http://127.0.0.1:4173 npm run test:motion
BASE_URL=http://127.0.0.1:4173 npm run capture
BASE_URL=http://127.0.0.1:4173 PLAYWRIGHT_BROWSERS_PATH=./.browsers node scripts/browser-review.mjs
BASE_URL=http://127.0.0.1:4173 PLAYWRIGHT_BROWSERS_PATH=./.browsers node scripts/keyboard-review.mjs
BASE_URL=http://127.0.0.1:4173 PLAYWRIGHT_BROWSERS_PATH=./.browsers node scripts/console-audit.mjs
BASE_URL=http://127.0.0.1:4173 PLAYWRIGHT_BROWSERS_PATH=./.browsers node scripts/performance.mjs
BASE_URL=http://127.0.0.1:4173 PLAYWRIGHT_BROWSERS_PATH=./.browsers node scripts/final-smoke.mjs
```

Without `BASE_URL`, required tests/capture default to 5173. Do not rebuild or mutate public assets during a verification run. Capture stages real viewport thumbnails under verification/previews and copies them after its browser closes. Rebuild after capture to incorporate refreshed thumbnails into production. Test scripts return nonzero on a failed gate; JSON and logs retain actual outcomes. No suppression is injected during zero-motion evidence, and relevant screenshots use `animations: allow`.

## What is complete

All 29 public source routes have meaningful equivalents under each prefix: 87 source cases. Added chooser, visit, four program and ten person routes add 48 cases; nine nested missing route/record cases plus three viewer cases give 147 logical cases and 588 four-width checks. All six articles, both categories, author archive and biography remain distinct. Every design has working finder/document filters, people/details, gallery/lightbox, user-initiated licensed video, dated events, rental inquiry, dancewear categories, unavailable clothing state, registration and contact demonstrations. Program/document filters are shareable in URLs; form input is never placed there.

Rhythm uses cobalt comparison/discovery, a real program comparison tray and a person drawer. Quiet uses restrained lists and instantaneous disclosures, with zero authored motion under normal preferences. Frame uses a plum rail, paired compositions, master/detail program exploration and first-visit confidence. Whole-page composers are independent, including secondary routes. Shared typed facts, validation and small accessible primitives provide parity.

Forms say before entry: “Local demonstration. Use invented details only. Nothing is sent to Dance Mania School.” They support inline validation, static pending, simulated success/failure, reset and a guarded result page. Only component memory holds values. No real person or minor data is needed. Reset/navigation/variant change/reload discard it; browser-managed history/autofill is outside app control.

## Architecture and tools

- `src/domain/`: shared typed facts, dates, source URLs and sparse-record boundaries.
- `src/variants/`: independent shells, page families, secondary composers, scoped CSS.
- `src/shared/`: URL filters, validated simulations, media, static Button and Radix Dialog.
- `src/viewer/`: equal-entry gallery, real screenshot previews and provenance.
- `public/assets/`: licensed local photos, silent video, descriptions, fonts/notices.
- `research/`: fresh source captures, inventory, immutable Hub context and inert licensed reference copies.
- `verification/`: raw screenshots/manifests, machine results, logs, comparisons and acceptance.

Verified versions: Node 22.16.0; npm 10.9.2; React/React DOM 19.3.1; Vite 6.4.6; TypeScript 5.9.3; React Router DOM 7.18.5; Tailwind/Vite integration 4.3.5; Radix Dialog 1.3.1; Lucide React 1.73.0; React Hook Form 7.92.0; Zod 4.6.7; Playwright 1.65.1; axe Playwright 4.14.0; ESLint 9.39.5. Full direct dependency versions: [verification/package-versions.txt](verification/package-versions.txt). Vite 6 was selected for compatibility with the existing Node toolchain. Clean `npm ci` and audit completed with zero reported vulnerabilities; ESLint emits a support-window deprecation notice.

## Evidence and limitations

Start with [test results](verification/test-results.md), [route matrix](verification/route-matrix.md), [visual critique](verification/visual-review.md), [source inventory](research/site-inventory.md), [source visual audit](research/visual-audit.md), [skill decisions](research/skills.md), [design briefs](design/directions.md) and [provenance](content/provenance.md). A local Git repository contains the implementation, committed lockfile and evidence checkpoint, with no remote configured. Raw screenshots are in verification/screenshots with full metadata in screenshot-manifest.json; interaction states have a separate manifest. Derived overviews are explicitly labelled and do not replace raw captures. Actual local performance bytes/requests/LCP/CLS are in performance.json, without invented Lighthouse scores or production claims.

All 29 source pages were freshly rendered at desktop/mobile and representative pages at tablet/320px. Public Drive browser access recovered readable documents, improving on the supplied prior audit. Source information is a dated snapshot, not live operation/availability. No opening hours, access/parking assurances, stock, future events, certifications or testimonials were invented. Historical article summaries preserve dates/credits and link to originals; they are not current rules.

School imagery, poster and recordings had no established reuse grant. Licensed illustrative photos are labelled and credited; people use initials. The local Charleston clip is an unrelated CC BY 3.0 demonstration, with actual native play/pause verified. Historical school recordings remain exact external links; their availability, captions and reproduction rights were not comprehensively verified. Asset and font source pins/licenses/digests are in content/asset-manifest.json and content/fonts.json. No paid assets, copied hooks, global skills or external mutations were used. Full fonts are locally hosted rather than subset; only active families load.

Accessibility evidence includes automated axe, keyboard/focus, reflow and actual 200% text enlargement, with manual rendered inspection. It is not a WCAG certificate, physical-device test or screen-reader study. Performance is unthrottled headless loopback evidence, not field data. Real enrollment, production infrastructure and deployment are deliberately outside the authorized scope.

Frame & Floor is the finished recommendation for its coherent interest → people → documents → first-visit journey. Quiet Form is strongest for direct practical lookup; Rhythm Room is strongest for comparison/exploration. The fixed weighted comparison and rationale are in visual-review.md; no conversion benefit is asserted.
