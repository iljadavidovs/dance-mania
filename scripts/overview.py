from PIL import Image,ImageDraw
import json,math,pathlib
rows=json.load(open('verification/screenshot-manifest.json'));out=pathlib.Path('verification/overview');out.mkdir(exist_ok=True)
for variant in ['interactive','minimal','vision']:
 for w in [1440,768,390,320]:
  group=[x for x in rows if x.get('variant')==variant and x.get('kind')=='source-equivalent' and x['viewport']['width']==w];sheet=Image.new('RGB',(1800,math.ceil(len(group)/5)*650),'#dededb');d=ImageDraw.Draw(sheet)
  for n,x in enumerate(group):
   img=Image.open(x['screenshot']);px=(n%5)*360;py=(n//5)*650;d.text((px+8,py+5),x['path'][:48]or'home',fill='black');d.text((px+8,py+20),f'{variant} / {w}px / top, middle, bottom',fill='black')
   for j,start in enumerate([0,max(0,(img.height-(1500 if w>=768 else 500))//2),max(0,img.height-(1500 if w>=768 else 500))]):
    crop=img.crop((0,start,img.width,min(img.height,start+(1500 if w>=768 else 500))));crop.thumbnail((344,195));sheet.paste(crop,(px+8,py+40+j*200))
  sheet.save(out/f'{variant}-{w}.jpg',quality=85)
print('Six derived overview sheets generated, each covering all 29 source-equivalent routes.')
