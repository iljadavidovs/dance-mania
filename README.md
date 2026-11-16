# Dance Mania — initial agent baseline for review

This is the preserved initial redesign laboratory for [Issue #1](https://github.com/iljadavidovs/dance-mania/issues/1), not an approved design or a deployed school website. The owner reports disappointing visual quality. Functional checks and route counts do not establish design quality.

Three React prototypes share source-backed school facts: `/interactive` (Rhythm Room), `/minimal` (Quiet Form, zero authored UI animation), `/vision` (Frame & Floor), with a viewer at `/`. All forms are disposable local simulations; use invented data only. No enrollment, inquiry, payment or backend exists.

## Reproduce

Use Node >=22.13; the audited environment uses Node 22.16.0 and npm 10.9.2. Dependencies resolve through package-lock.json. No global installation is required.

```sh
npm ci
PLAYWRIGHT_BROWSERS_PATH=./.browsers npx playwright install chromium webkit
npm run typecheck
npm run lint
npm run build
npm run preview -- --host 127.0.0.1 --port 4180 --strictPort
```

With preview running, in another terminal:

```sh
BASE_URL=http://127.0.0.1:4180 npm run test:e2e
BASE_URL=http://127.0.0.1:4180 npm run test:motion
BASE_URL=http://127.0.0.1:4180 npm run test:routes
BASE_URL=http://127.0.0.1:4180 npm run capture
```

Development: `npm run dev -- --host 127.0.0.1 --port 5180 --strictPort`. Ctrl+C stops either foreground server. Test commands default to port 5173 if BASE_URL is omitted. Capture writes evidence and generates viewer thumbnails; preserve the original thumbnails when reproducing the frozen baseline. Screenshot/regression generation is not design approval.

## Evidence and publication boundaries

The original local baseline is `5bad2f2369a0d32a0b238c84b68553614120e080`. It is retained locally and is deliberately not a remote ancestor: it contains excluded private context and unreviewed source-site evidence. A minimal README-only commit establishes main in the previously empty remote; all implementation is on the review branch. See [export manifest](docs/export-manifest.json) and [forensic report](docs/forensic-report.md).

`src/`, `tests/`, dependency/config files, runtime assets and original viewer thumbnails preserve the baseline. Publication additions are reports, inventory, sanitized historical evidence and fresh verification. Private source context, raw execution transcript, account metadata, reasoning, browser caches and original school screenshots/PDF captures are excluded. Original historical claims/scores are retained as claims, not adopted as this audit's conclusions. No skills are retrospectively installed to simulate historical use.

The four active photographs, silent Charleston demonstration/poster, and local fonts have source/creator/license records in [content/asset-manifest.json](content/asset-manifest.json) and [content/fonts.json](content/fonts.json). Illustrative media does not document Dance Mania. CC BY-SA adaptations retain that license; component/font notices are retained. Public school contact facts are intentional. School logo/photos/poster/recordings have no assumed reproduction grant. Historical recordings remain external links. Public visibility does not itself grant a license to project code; no new project-wide license is asserted by this publication.

Historical document labels are a November 16, 2026 snapshot, not current availability. Accessibility tests are not a WCAG certification. Headless Chromium/WebKit are not physical devices/Safari. Performance is loopback lab data, not field evidence. No merge, deployment, automatic release, issue closure or repository-visibility change is authorized by this review.
