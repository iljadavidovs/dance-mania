import urllib.request,json,pathlib,hashlib
repo='https://api.github.com/repos/google/fonts'
pin=json.load(urllib.request.urlopen(repo+'/commits/main'))['sha'];out=pathlib.Path('public/assets/fonts');out.mkdir(parents=True,exist_ok=True);rows=[]
for family in ['barlowcondensed','dmsans','manrope','fraunces','publicsans']:
 files=json.load(urllib.request.urlopen(repo+'/contents/ofl/'+family+'?ref='+pin))
 chosen=[f for f in files if f['name']=='OFL.txt' or (f['name'].endswith('.ttf') and 'Italic' not in f['name'] and ('[' in f['name'] or f['name']=='BarlowCondensed-SemiBold.ttf'))]
 for f in chosen:
  d=urllib.request.urlopen(f['download_url']).read();name=family+('-OFL.txt' if f['name']=='OFL.txt' else '.ttf');(out/name).write_bytes(d);rows.append(dict(family=family,source=f['download_url'],commit=pin,path='ofl/'+family+'/'+f['name'],local='/assets/fonts/'+name,license='SIL OFL 1.1',sha256=hashlib.sha256(d).hexdigest(),bytes=len(d)));print(name,len(d),flush=True)
pathlib.Path('content/fonts.json').write_text(json.dumps(rows,indent=2))
