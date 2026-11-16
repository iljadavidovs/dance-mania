> Historical baseline artifact. Claims and scores are reproduced for forensic review, not independently endorsed. Public export omits private context and source-site imagery; see docs/forensic-report.md.

# Local performance observations

November 16, 2026; fresh browser contexts; Chromium 159.0.8154.6; production loopback server; 1440×1000; no CPU/network throttling. Single observations, not field percentiles or Lighthouse scores. Do not rank designs by small timing differences.

| Home | LCP (ms) | CLS | Font requests (uncompressed source bytes) |
|---|---:|---:|---:|
| Viewer | 44 | 0 | 0 |
| Rhythm Room | 380 | 0.04142 | 349,592; DM Sans + Barlow Condensed |
| Quiet Form | 360 | 0 | 164,700; Manrope |
| Frame & Floor | 364 | 0.00022 | 463,756; Fraunces + Public Sans |

Main JS is 307,142 bytes / 98,359 gzip; shared form/media/domain chunk is 180,871 / 57,321 gzip. Variant JS is 12,010–15,562 raw / 3,742–4,845 gzip. Base CSS is 25,068 / 6,387 gzip; variant CSS is 13,398–19,915 raw / 2,712–3,775 gzip. The runtime/form validation/dialog stack explains the shared floor; CSS and variant modules are lazy and only active fonts are requested. This is an honest remaining optimization tradeoff rather than an artificial performance score.

Active photos: Latin 490,138 bytes; tango exhibition 157,298; waltz 32,151; jive 58,928. The silent 18-second demonstration is 711,266 bytes and its actual-frame poster 36,202 bytes. Native media uses metadata preload and explicit playback. Unused research-era image candidates remain stored but are not requested by the UI. Full font sources are local rather than custom subsets; no globally installed font tooling was needed.

`performance.json` contains resource transfer/encoded bytes, built file hashes, timestamps, user agent and complete measurements. The screenshot evidence archive is served only through deliberate evidence access and is not part of ordinary website loading.
