import sys
from collections import defaultdict
p="(){}[]"
d=defaultdict(int)
y=sys.stdin.read()
q=[]
s=0
for c in y:
 if c in'"\'\\':s=1-s;continue
 if s:continue
 try:
  i=p.index(c)
  w=i&1
  d[p[i-w]]+=2*w-1
  q+=[p[i-w]]
 except:pass
while q:
 k=q.pop()
 if d[k]>=0:continue
 y+=p[p.index(k)+1]
 d[k]+=1
print(y)