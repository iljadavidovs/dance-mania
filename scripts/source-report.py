import json,pathlib
rows=json.load(open('research/source/recon.json'));seed=json.load(open('research/previous-audit/route-manifest.json'))
notes={
'home':('Home / marketing','New families, adults and dancers; understand school offer','Dance photography and three service columns give concrete subject identity. Practical program/schedule/registration entry points are weak.'),
'programs':('Program catalogue','Choose a dance family','Four meaningful program families and real dance imagery. Long sections mix disciplines and eligibility needs; add search, concise facts and direct next steps.'),
'schedule':('Document links','Find class and fee documents','Five named source links. Clock background and circular buttons obscure period/audience comparison; add a clear searchable document catalogue.'),
'instructors':('People index','Identify teachers and instructors','All ten names are visible in two role groups. Portraits establish identity but there are no useful individual paths or detailed verified bios; use factual detail pages.'),
'contact-us':('Contact / inquiry','Ask about a class or visit','Verified owners, address, email and phone plus visible form. Two-column layout becomes stacked on mobile. Improve field semantics, context and safe local validation.'),
'events':('Event archive','Understand historical Toronto Grand Cup','A detailed poster carries much of the information. Its May 9–10, 2020 date needs an explicit archive label and a text alternative; no future edition confirmed.'),
'photos':('Photo collection','Explore school photography','Large documentary collection loads after scroll. Raw thumbnail targets and weak accessible names make in-site browsing difficult; use licensed illustrative collection and accessible lightbox.'),
'videos-competitions':('Historical media','Watch competition recordings','Two native 2019 recordings, with Karls and Dayana identified. Native controls work; add explicit historical context and honest rights/fallback handling.'),
'videos-shows':('Historical media','Watch show recordings','Two native show recordings from 2019. Large players dominate; retain context and deliberate user control, provide separate licensed local demonstration.'),
'dance-shoes-for-sale':('Dancewear audience index','Choose a fitting audience','Gentlemen, ladies and kids categories are distinct. Text links use legacy host while image links use current domain. Preserve all three local routes.'),
'dance-clothes-for-sale-and-rent':('Unavailable catalogue','Ask about clothing','Only coming-soon content is visible. No inventory can be inferred; provide an honest unavailable state and inquiry path.'),
'rent':('Venue inquiry','Consider a special event','Venue photographs, two videos and up-to-150-seats source claim. Contact target is malformed legacy URL. Do not certify capacity or substitute another venue.'),
'dance-mania-blog':('Editorial archive','Browse six 2020 articles','Distinct article records with dates and imagery; decorative glows compete with hierarchy. Preserve direct routes and introduce useful topic navigation.'),
'about-karls-aniscenko':('Historical biography','Read about site author','A rich biographical collage, claims and dates. Relative-time statements cannot be rolled forward; preserve this as author biography, not school About.'),
'registration-for-kids':('Registration form','Guardian route under 16','Child, mother/father contact and email/referral fields. Legacy reciprocal link creates friction. Use inclusive guardian demo fields and safe synthetic input.'),
'registration-for-adults':('Registration form','Source age 16+ route','Full name, email, phone and referral visible; 16+ is explicit. Keep age division distinct from legal adulthood and schedule ages.'),
'shoes-for-gentlemen':('Shoe categories','Explore Latin and Standard fitting','Two source categories and fitting advice. No inventory, rates or sizes are verified.'),
'shoes-for-ladies':('Shoe categories','Explore Latin and Standard fitting','Two source categories and fitting advice. No inventory, rates or sizes are verified.'),
'shoes-for-kids':('Shoe categories','Explore children’s fitting','Boys Latin, Boys Standard and one Girls Latin / Standard group. Preserve the combined girls grouping.'),
'author_dancemaniaschool_ru3lje':('Author archive','Find Karls’s six posts','Same six posts, connected to author. No canonical tag observed; preserve the biography relationship.'),
'category_for-anyone':('Category archive','Read four general-interest posts','Lesson, Walk of fame, tour and movement-film reference. No canonical observed. Preserve exact membership.'),
'category_for-dancers':('Category archive','Read three dancer-oriented posts','Walk of fame, handbook and judging essay. No canonical observed. Preserve exact membership.'),
'if-words-were-movements':('Historical article','Read movement-film reference','July 12, 2020. Raw Facebook URL visibly overflows at 390 and 320; replace it with a descriptive external action and fallback.'),
'virtual-tour-of-mania-school':('Historical article','Prepare for first visit','July 18, 2020 tour, with a YouTube reference. Embedded area is sometimes blank in fresh mobile captures; treat original availability separately from present studio condition.'),
'a-lesson-at-dance-mania-school':('Historical article','Watch Cha-Cha-Cha, Rumba and Jive','August 2, 2020. Three clips featuring Karls and Dayana; preserve the separate media destinations and date.'),
'instructions-for-dancers':('Historical handbook','Read a dancer’s preparation perspective','July 26, 2020. Body explicitly credits Dayana, while site byline is Karls. Long dense text benefits from readable summaries and historical context.'),
'how-dancing-is-evaluated-on-the-competitions':('Historical judging essay','Understand posture, rhythm, frame and partnership','July 25, 2020. Long essay with many subheadings; editorial perspective, not current official rules. Subject-specific vocabulary informs Frame & Floor.'),
' the-walk-of-fame':('Historical article','Watch WDSF red-carpet references','August 2, 2020, pointing to 2018/2019 material. Do not turn this into school awards.'),
' thank-you':('Public form result','Read response text','Direct entry renders a receipt-like statement without evidence of a submission. Local replacement must be guarded by an in-memory result.')}
notes['the-walk-of-fame']=notes.pop(' the-walk-of-fame');notes['thank-you']=notes.pop(' thank-you')
text='''# Source inventory — live recheck on 16 November 2026

Read-only recon began at robots.txt, then wp-sitemap.xml and its four child sitemaps. All 29 URLs were rendered at 1440×1000 and 390×844, plus home/programs/schedule/kids form/overflow article at 768×1024 and 320×740: **68 real captures**. Browser: Chromium 159.0.8154.6. Exact timestamps, innerWidth, final URL, title/description/canonical/headings, text, links, image loading and video sources are in [source/recon.json](source/recon.json). Captures were not resized to claim another viewport. Derived review sheets are labelled separately.

No new content route beyond the 29 source equivalents was discovered from sitemaps, header/footer, byline/category links. Legacy-domain links were recorded as targets, not followed into registration or classified as confirmed server 404s. No live form was entered or submitted. Native source video was played and paused by keyboard; no files were copied for reuse.

Evidence types: **rendered** means actual screenshot; **DOM** means inspectable metadata/text/attributes; **inference** is a design opportunity, not a tested fact. Currency is limited to what the source displayed on the observed date.

'''
for s in seed:
 group=[x for x in rows if x['url']==s['url']];d=next(x for x in group if x.get('width')==1440);m=next(x for x in group if x.get('width')==390);slug=s['slug'];family,task,note=notes[slug];
 text+=f"## {s['id']:02d}. {s['url']}\n\n- Family / audience task: {family}. {task}.\n- Final URL: {d.get('finalURL')}; {'same requested URL; no redirect observed' if d.get('finalURL')==s['url'] else 'see navigation outcome above'}.\n- DOM title: {d.get('title')}. Description: {d.get('description') or 'not present'}. Canonical: {d.get('canonical') or 'not present'}.\n- DOM headings: "+'; '.join(h['tag']+': '+h['text'] for h in d.get('headings',[])[:12])+'.\n'
 text+=f"- Rendered strengths, content/CTA and opportunity (opportunity is an inference): {note}\n- Layout, type and identity: shared charcoal/orange shell, Arial-based sans typography, centred content headings; route-specific content visible in captures below. Shell hierarchy/focus defects are audited once in visual-audit.md.\n- Responsive observation: {'horizontal overflow detected at 390 and 320 on the raw URL' if m.get('overflow') else 'no root horizontal overflow measured at 390; content reflows or stacks within the common shell'}. Shared mobile menu is available; media-provider loading is separate from local layout.\n- Interaction/accessibility: source links and form/media structures inspected without submission; route-specific improvement above. Live validation, delivery, screen-reader conformance and server success unverified.\n- Freshness: {'2020 editorial/archive material; historical context required' if family.startswith('Historical') or slug in ['events','about-karls-aniscenko','dance-mania-blog'] else 'source display checked 2026-11-16; no guarantee of operation/availability'}.\n- Evidence / confidence: rendered + DOM, high for observed content; source claims are not independently certified. [Desktop]({d['screenshot'].replace('research/','')}) / [Mobile]({m['screenshot'].replace('research/','')}).\n\n"
pathlib.Path('research/site-inventory.md').write_text(text)
pathlib.Path('research/visual-audit.md').write_text('''# Source visual audit

Actual fresh captures: research/source/screenshots, with full metadata in recon.json. Compared all 29 desktop/mobile pages through labelled overview sheets and page-family full-length review sheets. Representative additional 768/320 captures include the known long URL defect. No source screenshot was invented; the supplied November 14 audit is retained separately under previous-audit and not counted as the fresh run.

The common shell is visually consistent: charcoal background, bright orange/red separators, white Arial-based copy, large centred headings and a compact desktop header. It makes the dance subject recognizable, especially through real partner photography. Its information architecture is less helpful: Information/Gallery/Dancewear labels group many routes without making a first class, schedule and registration sequence obvious. Generous blank areas below several articles and repeated social footers lengthen mobile pages.

The six-post archive, two categories and author archive use the same rounded, glowing cards. This gives a strong visual signature but adds visual noise, especially at narrow widths. Shoe categories preserve meaningful source distinctions; the clothing page contains only a coming-soon message. Instructor grouping is clear but detail is sparse. Rental media documents the studio, but public visibility does not license its reuse.

The fresh mobile If words were movements screenshot shows a long Facebook URL forcing horizontal overflow at both 390 and 320. Other measured source roots did not overflow. Several embedded article media areas were blank in fresh mobile captures; those captures alone do not prove the provider recordings are broken. Gallery lazy-loaded images were scrolled before capture, so initial blanks were not called broken resources.

The desktop submenu keyboard check and mobile disclosure state have dedicated screenshots/DOM records in research/source. The source mobile button's accessible label is literally mobile-menu-icon. Pointer hover makes the desktop submenu visible; keyboard expansion and visual opacity are recorded separately in keyboard-menu.json. No source form was submitted or populated. Native competition video advanced under keyboard playback and paused afterward (video-check.json).

Metadata/heading findings are route-specific in site-inventory.md and recon.json. Missing descriptions/canonical tags/H1s are DOM observations, not visual guesses. Legacy text-link destinations in kids/adult and shoe navigation and malformed rental contact URLs remain target observations, not claimed verified 404/redirect outcomes.

## New document evidence

Ordinary public Google Drive browser access recovered readable pages on this run. The summer schedule is a scanned grid. The youth year schedule loaded after a bounded nine-second retry; its refreshed screenshot/text is retained. The fee document exposes a Fall–Winter 2026–2027 period, group tiers, private lesson fees and terms. The camp document describes two past August 2026 weeks. The adult document is a two-page grid. The UI summarizes the documents and preserves their exact external destinations, while requiring direct confirmation of current operation and places. A 2027 show planning note in the fee document is not promoted as a confirmed future event listing.

## Redesign implications

Give practical entry points their own navigation labels. Preserve all content routes, exact archive relationships and source dates. Provide a calm, meaningful H1 and readable paragraph measures. Replace unsafe legacy primary routes with local equivalents. Provide accessible instant disclosures, named gallery buttons, in-site focus-contained lightboxes and local-only form states. Separate documented historical media, licensed demonstration content and unknown facts. Use originals only with established rights; keep real people identifiable through names and initials rather than false portraits.

## Limits

No school staff validated the source claims. No current class operation, future event confirmation, stock, certified venue capacity, parking/access arrangements, response time or source-form delivery was verified. External recordings/captions were not comprehensively tested. No login or access request was used. Source screenshots are private local research evidence, not assets used in the redesign.
''')
