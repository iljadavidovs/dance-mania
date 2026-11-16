from pathlib import Path
import json,os,shutil,html
out=Path('public/evidence');out.mkdir(exist_ok=True)
for src in ['research/site-inventory.md','research/visual-audit.md','research/skills.md','design/directions.md','content/provenance.md','content/asset-manifest.json','verification/route-matrix.md','verification/test-results.md','verification/visual-review.md','verification/screenshot-manifest.json','verification/acceptance.md']:
 shutil.copy2(src,out/Path(src).name)
rows=json.loads(Path('verification/screenshot-manifest.json').read_text())
(out/'screenshots').mkdir(exist_ok=True)
for x in rows:
 src=Path(x['screenshot']);target=out/'screenshots'/src.name
 if target.exists():target.unlink()
 os.link(src,target)
options='<option value="">All designs</option>'+''.join(f'<option>{x}</option>'for x in ['viewer','interactive','minimal','vision'])
cards=[]
for x in sorted(rows,key=lambda r:(r['variant'],r['path'],r['viewport']['width'])):
 file=Path(x['screenshot']).name;w=x['viewport']['width'];label=html.escape(x['variant']+'/'+(x['path'] or 'home'))
 cards.append(f'<article data-v="{x["variant"]}" data-w="{w}"><h2>{label}</h2><p>{w}×{x["viewport"]["height"]} · Chromium {x["browser"]}</p><a href="screenshots/{file}" target="_blank"><img loading="lazy" src="screenshots/{file}" alt="Actual {label} full-page capture at {w}px"></a><p>{x["at"]}</p></article>')
page='''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Dance Mania — actual screenshot evidence</title><style>body{font:16px/1.5 system-ui,sans-serif;margin:0;background:#f2f2f0;color:#1a202a}header{padding:32px;max-width:1100px;margin:auto}h1{font-size:40px;line-height:1.1}a{color:#172d60}label{display:inline-block;margin:12px 24px 12px 0}select{font:inherit;padding:10px}main{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,300px),1fr));gap:24px;padding:32px}article{padding:16px;background:white;min-width:0}h2{font-size:18px;overflow-wrap:anywhere}p{font-size:13px;overflow-wrap:anywhere}img{width:100%;height:300px;object-fit:contain;object-position:top;background:#ddd}[hidden]{display:none}</style><header><a href="/provenance">Return to sources & evidence</a><h1>Actual responsive captures.</h1><p>588 full-page screenshots across 147 logical cases and four real viewport sizes. Thumbnails are contained previews of original captures; open any image for the full file. No screenshot is a fabricated mockup. Capture metadata is in <a href="screenshot-manifest.json">the manifest</a>; critique is in <a href="visual-review.md">the review</a>.</p><label>Design <select id="variant">'''+options+'''</select></label><label>Viewport <select id="width"><option value="">All widths</option><option>1440</option><option>768</option><option>390</option><option>320</option></select></label><p id="count" role="status">588 captures</p></header><main>'''+''.join(cards)+'''</main><script>const v=document.querySelector('#variant'),w=document.querySelector('#width');function filter(){let n=0;document.querySelectorAll('article').forEach(a=>{a.hidden=!!((v.value&&a.dataset.v!==v.value)||(w.value&&a.dataset.w!==w.value));if(!a.hidden)n++});document.querySelector('#count').textContent=n+' captures'}v.addEventListener('change',filter);w.addEventListener('change',filter);</script></html>'''
(out/'index.html').write_text(page)
print('Packaged 11 reports/manifests and',len(rows),'real captures with a static screenshot browser')
