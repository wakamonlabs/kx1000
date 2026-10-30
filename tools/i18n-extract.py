# 게임 파일에서 화면에 나올 수 있는 한글 문구를 뽑음. ${...} 자리는 {} 로.
import re,sys,json
src=open(sys.argv[1],encoding='utf-8').read()
src=re.sub(r'data:[a-z/+-]+;base64,[A-Za-z0-9+/=]+','DATA',src)
HG=re.compile(r'[\uac00-\ud7a3]')
out={}
def add(t,where):
  # 태그로 나눠서 텍스트 조각마다
  for piece in re.split(r'<[^<>]*>',t):
    for p in piece.split('\n'):
      p=re.sub(r'\s+',' ',p).strip()
      p=re.sub(r'&nbsp;',' ',p)
      if HG.search(p): out[p]=out.get(p,where)
def scan_js(js):
  i=0;n=len(js)
  while i<n:
    c=js[i]
    if c=='/' and i+1<n and js[i+1]=='/':
      j=js.find('\n',i);i=n if j<0 else j;continue
    if c=='/' and i+1<n and js[i+1]=='*':
      j=js.find('*/',i+2);i=n if j<0 else j+2;continue
    if c in '\'"':
      j=i+1;buf=[]
      while j<n and js[j]!=c:
        if js[j]=='\\':buf.append(js[j:j+2]);j+=2;continue
        if js[j]=='\n':break
        buf.append(js[j]);j+=1
      s=''.join(buf)
      if HG.search(s):add(s.replace('\\n','\n').replace("\\'","'").replace('\\"','"'),'js')
      i=j+1;continue
    if c=='`':
      j=i+1;buf=[]
      while j<n and js[j]!='`':
        if js[j]=='\\':buf.append(js[j:j+2]);j+=2;continue
        if js[j]=='$' and j+1<n and js[j+1]=='{':
          # 중첩된 ${ } 건너뛰되, 안의 문자열도 따로 스캔
          d=1;k=j+2
          while k<n and d>0:
            if js[k]=='{':d+=1
            elif js[k]=='}':d-=1
            elif js[k]=='`':
              # 중첩 템플릿
              m=k+1;dd=0
              while m<n and not(js[m]=='`' and dd==0):
                if js[m]=='\\':m+=2;continue
                if js[m]=='$' and m+1<n and js[m+1]=='{':dd+=1;m+=2;continue
                if js[m]=='}' and dd>0:dd-=1
                m+=1
              k=m
            elif js[k] in '\'"':
              q=js[k];m=k+1
              while m<n and js[m]!=q:
                if js[m]=='\\':m+=1
                m+=1
              k=m
            k+=1
          scan_js(js[j+2:k-1]);buf.append('{}');j=k;continue
        buf.append(js[j]);j+=1
      s=''.join(buf)
      if HG.search(s):add(s.replace('\\n','\n'),'tpl')
      i=j+1;continue
    i+=1
# 스크립트
for m in re.finditer(r'<script[^>]*>(.*?)</script>',src,re.S):scan_js(m.group(1))
# HTML 본문(스크립트·스타일 뺀)
html=re.sub(r'<script[^>]*>.*?</script>','',src,flags=re.S)
html=re.sub(r'<style[^>]*>.*?</style>','',html,flags=re.S)
html=re.sub(r'<!--.*?-->','',html,flags=re.S)
add(html,'html')
for m in re.finditer(r'(?:title|alt|aria-label|placeholder)="([^"]*)"',html):
  if HG.search(m.group(1)):out[m.group(1)]='attr'
# 그대로 두는 것: 'ko' 이름 등
keys=sorted(out)
json.dump(keys,open(sys.argv[2],'w',encoding='utf-8'),ensure_ascii=False,indent=0)
print(len(keys),sum(len(k) for k in keys))
