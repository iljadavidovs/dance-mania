from PIL import Image,ImageOps,ImageDraw
from pathlib import Path
import json,sys,math
kind=sys.argv[1] if len(sys.argv)>1 else 'source'
if kind=='source':
 rows=json.load(open('research/source/recon.json'));base=Path('research/source/review-sheets');items=[(x['url'].replace('https://dancemaniaschool.com/','') or 'home',x['width'],x['screenshot'])for x in rows if x.get('screenshot') and x['width'] in [1440,390]]
else:
 rows=json.load(open('verification/screenshot-manifest.json'));base=Path('verification/review-sheets');items=[(x['variant']+'/'+(x['path'] or 'home'),x['viewport']['width'],x['screenshot'])for x in rows if x.get('screenshot') and (x.get('kind')=='source-equivalent' or x.get('variant')=='viewer') and x['viewport']['width'] in [1440,390]]
base.mkdir(parents=True,exist_ok=True)
# Derived review sheets retain full image proportions plus full-resolution raw paths in manifests.
for width in [1440,390]:
 group=[x for x in items if x[1]==width]
 for batch in range(0,len(group),4):
  entries=group[batch:batch+4];panels=[]
  for title,w,file in entries:
   img=Image.open(file).convert('RGB'); targetw=430 if w==390 else 620
   targeth=round(img.height*targetw/img.width);img=img.resize((targetw,targeth))
   # Long pages in separate vertical panels so no content disappears.
   for part in range(0,targeth,1550):
    crop=img.crop((0,part,targetw,min(part+1550,targeth)));panel=Image.new('RGB',(targetw+16,crop.height+55),'#eeeeee');d=ImageDraw.Draw(panel);d.text((8,8),title[:78],fill='black');d.text((8,25),f'{w}px / part {part//1550+1} / derived',fill='black');panel.paste(crop,(8,50));panels.append(panel)
  # Columns arranged two at a time to keep image inspection legible.
  for sub in range(0,len(panels),4):
   ps=panels[sub:sub+4];cw=max(p.width for p in ps);ch=max(p.height for p in ps);sheet=Image.new('RGB',(cw*2,ch*math.ceil(len(ps)/2)),'#d5d5d5')
   for i,p in enumerate(ps):sheet.paste(p,((i%2)*cw,(i//2)*ch))
   dest=base/f'{kind}-{width}-{batch//4+1:02d}-{sub//4+1}.jpg';sheet.save(dest,quality=80)
print(base,len(list(base.glob('*.jpg'))))
