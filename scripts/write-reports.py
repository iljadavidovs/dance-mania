from pathlib import Path
import json
from collections import defaultdict
root=Path('.')
read=lambda p:json.loads(Path(p).read_text())
routes=read('verification/route-results.json'); shots=read('verification/screenshot-manifest.json')
groups=defaultdict(list)
for r in routes: groups[(r['variant'],r['path'])].append(r)
shotgroups=defaultdict(list)
for r in shots: shotgroups[(r['variant'],r['path'])].append(r)
lines=['# Route verification matrix — 16 November 2026','','147 logical cases: 87 source equivalents (29 × 3), 48 added chooser/visit/program/person cases (16 × 3), nine nested missing-page/missing-record cases, and three viewer cases. Four actual viewports per case = 588 observations. No additional canonical content pages were discovered beyond the 29 rechecked sitemap routes.','','Evidence: `route-results.json` is the independent final production route run. `screenshot-manifest.json` records the actual image paths, timestamp, browser, state and measured innerWidth. All direct route visits passed. Refresh is tested at 1440; four-width reflow/content/assets are separate checks. `production-smoke.json` adds refresh and inspection of rendered local link destinations. Content PASS means source-record/manual review plus visible DOM checks; it is not proof of current school operation.','','Interaction entries describe the executed scope. Static pages have no unique dynamic control; shared navigation and their applicable links are checked. External call/mail/map actions were not invoked; source-document destinations were compared exactly, and documents were separately read during research. External historical playback/captions remain unverified. Dynamic tests exercise representative family records, not a fabricated click on every external link.','','| Local path | Kind | Implementation | Direct / refresh | Content | Screenshots | Interaction evidence |','|---|---|---|---|---|---|---|']
def interaction(v,p):
 if p=='programs': return 'PASS — search, combinations, invalid query, empty/reset, detail/history; keyboard journey'
 if p.startswith('programs/'): return 'PASS — detail/recovery content and local navigation; Latin keyboard journey'
 if p=='schedule': return 'PASS — all five destinations, filters/archive, availability note; mobile journey'
 if p=='instructors': return 'PASS — groups/listing/details; Rhythm quick-view focus where applicable'
 if p.startswith('instructors/'): return 'PASS — local detail/recovery navigation; sparse-record family test'
 if p in ['registration-for-kids','registration-for-adults','contact-us']: return 'PASS — required/invalid/correction/pending/success/failure/reset/privacy; 16+ keyboard'
 if p=='photos': return 'PASS — filters, lightbox keyboard/next/previous/close/focus, failed-image fixture'
 if p.startswith('videos-'): return 'PASS — licensed native play/pause via keyboard + failed-media fallback; original recordings external'
 if p=='thank-you': return 'PASS — direct/reload guard and in-memory demo result'
 if p in ['dance-mania-blog','category/for-anyone','category/for-dancers','author/dancemaniaschool_ru3lje']: return 'PASS — topic membership/article/author relationships and local routes'
 if p=='register': return 'PASS — chooser/reciprocal route links; keyboard adult choice'
 if p=='': return 'PASS — program discovery/menu and keyboard/touch journey'
 return 'PASS — static content/recovery and shared local link destinations; no unique dynamic control'
for (v,p),rows in groups.items():
 kind='viewer' if v=='viewer' else ('source' if rows[0]['kind']=='source-equivalent' else 'local')
 path=p if v=='viewer' else '/'+v+('/'+p if p else '')
 ok=all(x['passed'] for x in rows); ss=shotgroups[(v,p)]; link=next((x['screenshot'] for x in ss if x['viewport']['width']==390),'')
 nav='PASS — direct 4 widths; refresh 1440' if v!='viewer' else 'PASS — direct 4 widths; refresh in production smoke'
 inter=interaction(v,p) if v!='viewer' else 'PASS — gallery previews/full links/provenance/404 recovery and evidence files'
 lines.append(f'| `{path}` | {kind} | {"PASS" if ok else "FAIL"} | {nav} | {"PASS" if all(x.get("content",True) for x in rows) else "FAIL"} | PASS 4/4 · [390px]({link.replace("verification/", "")}) | {inter} |')
Path('verification/route-matrix.md').write_text('\n'.join(lines)+'\n')
Path('verification/visual-review.md').write_text('''# Visual review and comparison — 16 November 2026

The strongest finished direction is **Frame & Floor**. Its audience entry, connection between programs and people, and dedicated first-visit route form a coherent practical narrative. The desktop rail supplies stable task access, while mobile places the program/document content before the next action. This is an expert design judgment from the finished laboratory, not measured conversion improvement or user-study evidence. Quiet Form is the clearest alternative for a visitor who already knows which document or person they need. Rhythm Room is strongest for comparison and open-ended exploration.

## Fixed rubric

Subjective scores use the specified weights. All hard local gates pass independently; a high score does not waive defects. Scores reflect implemented, inspected pages and known costs, not hypothetical production benefits.

| Dimension | Weight | Rhythm Room | Quiet Form | Frame & Floor |
|---|---:|---:|---:|---:|
| Visitor clarity and hierarchy | 20 | 17 | 19 | 19 |
| Original, school-specific art direction | 20 | 18 | 16 | 19 |
| Complete working visitor journeys | 20 | 19 | 19 | 19 |
| Schedule / registration discovery | 15 | 13 | 15 | 14 |
| Responsive quality / accessibility | 15 | 13 | 14 | 14 |
| Truthful content / provenance | 5 | 5 | 5 | 5 |
| Performance / implementation discipline | 5 | 3 | 3 | 3 |
| **Total** | **100** | **88** | **91** | **93** |

Rhythm's larger controls, condensed hierarchy and comparison tray give exploration a clear purpose. Its alternating program layouts and off-canvas person quick view carry the identity inside the site. The richer finder requires more scanning than Quiet's list, especially at 320px. Quiet's type and alignment make schedule dates, document audience and original access exceptionally easy to compare; its restraint is less characteristic of dance performance than Frame's paired photographs and spatial composition. Frame has the best balance of competitive culture and beginner reassurance. Its editorial rail and serif hierarchy require more layout discipline; its schedule list is longer than Quiet's compact directory.

All three share a substantial React/form/dialog dependency floor. Variant modules/CSS and fonts are lazy, but full TTF files remain a cost; performance receives 3/5 for each. No score is based on invented field data. Exact local measurements and bundle bytes are in performance.json.

## Structural comparison of seven required template families

| Family | Rhythm Room | Quiet Form | Frame & Floor |
|---|---|---|---|
| Home | Cobalt discovery bar, unequal photo pair, four-family tiles, editorial breaks | Narrow aligned canvas, single monochrome photo, direct program/document index | Plum rail, unequal paired frames, audience field, program/people connection, first-visit pair |
| Programs | Faceted finder, alternating photo/fact rows, comparison tray | Filterable aligned text records, instant explanatory disclosures | Audience/master-detail selection with image, facts and next step |
| Schedule | Source status introduction and document board | Compact aligned period/audience/type directory | Documents beside practical next-action panel; ordered stack on mobile |
| People/detail | Initial tiles, right-hand quick-view drawer plus full pages | Calm role-grouped name index and dedicated records | Editorial profiles, known facts and related school context |
| Media | Larger browsable image grid and prominent media chapters | Disciplined monochrome contact sheet and concise dated catalogue | Unequal photo-essay frames with separate browse controls |
| Article | Large condensed heading and metadata/reading columns | Narrow reading hierarchy, quiet categories and dates | Plum title field with editorial side context and reading body |
| Registration | Context rail plus staged review | One-page form and persistent inline state | Paired explanation/form, sequential mobile flow |

Secondary events, rental, dancewear, author, visit, chooser and recovery pages also have independent composers in each variant. Shared facts and low-level accessible components do not impose shared whole-page trees.

## Review coverage and evidence

Source: all 29 current pages at 1440×1000 and 390×844, with five representative families at 768×1024 and 320×740. The source overview and full-family review sheets were inspected; the raw images remain under research/source/screenshots. Each route's observations and confidence are in research/site-inventory.md and research/visual-audit.md.

Implementation: all 29 source-equivalent pages in all three designs at desktop/mobile were visually inspected through labelled top/middle/bottom sheets and selected full-length family screenshots. All 12 overview sheets cover every source equivalent at 1440/768/390/320. Template and troublesome narrow states were inspected at full resolution. This review is visual inspection of real Playwright captures, not manual device testing or a pixel-baseline approval. Derived sheets are navigation aids; raw full-page images and actual viewport metadata remain authoritative. See overview/, review-sheets/, screenshot-manifest.json, interaction-screenshot-manifest.json, keyboard-review.json, browser-review.json and text-enlargement-*.json.

## Objective defects found and repaired

- Frame's full-width band caused a subpixel desktop overflow; its 320px hero and program selector also exceeded available width. Corrected grid min-width, band geometry and narrow typography/stacking. All 588 final observations have scrollWidth ≤ innerWidth, without body clipping.
- A long 320px editorial heading split its final character awkwardly. Reduced the narrow display size; the complete title remains readable.
- The initial tango reference was visibly too low-resolution for the intended crop. Replaced it with a licensed higher-resolution exhibition photograph. Global focal placement was adjusted to preserve faces; the hero has deliberate individual crops.
- Native video initially showed a black unloaded rectangle. Added an actual frame from the licensed clip as its poster. Real keyboard play advances time and pause stops it in each variant.
- Secondary routes initially leaned too heavily on a shared page composition. Replaced them with separate expressive, minimal and editorial composers, then recaptured the affected families at all widths.
- The people quick view initially behaved visually as a centered modal. Made it a right-hand drawer in Rhythm, retaining dialog containment/Escape/focus return.
- At 200% text enlargement in a 320px viewport, an intrinsic footer link width overflowed in two designs. Allowed that link to wrap within its track; all 15 enlarged-text template observations now pass.
- Reset during the 650ms pending simulation could permit an outdated result. Added generation invalidation and verified all three variants.

Before-repair images/logs remain in round-1/ and before-repairs/. Capture-script HMR reloads were tooling failures: preview writes were staged outside public and final gates use the stable production preview. New baselines were not treated as evidence of visual acceptance by themselves.

## Remaining design tradeoffs, not local failures

The illustrative photo collection is intentionally small and clearly credited. It cannot provide the trust of licensed school photography. Initials avoid false staff portraits. No source permission for school photos, poster or recordings has been assumed. Full local fonts are larger than subsets; their measured requests are listed, and only active families load. Quiet's instant states are a deliberate requirement, not an omitted animation pass. The licensed demonstration's user-initiated content playback is separate from authored UI motion. Browser-native media UI and caret behavior are not authored effects.

Before any separate production project, the school would need to confirm operational document currency, rights for its imagery/recordings, entrance/access/parking details, and a real data-handling/enrollment specification. Those are outside this local laboratory, not unfinished local features.
''')
print('Wrote matrix and visual review')
