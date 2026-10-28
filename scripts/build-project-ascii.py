"""Rebuild the portfolio's text illustrations; no third-party dependencies."""
from pathlib import Path
import math
import html
import re

ROOT = Path(__file__).resolve().parents[1]
W, H = 112, 34

def inside(x, y, points):
    hit = False
    j = len(points) - 1
    for i, (xi, yi) in enumerate(points):
        xj, yj = points[j]
        if (yi > y) != (yj > y) and x < (xj-xi)*(y-yi)/(yj-yi)+xi:
            hit = not hit
        j = i
    return hit

def segment(x, y, a, b):
    dx, dy = b[0]-a[0], b[1]-a[1]
    t = max(0, min(1, ((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy)))
    return math.hypot(x-a[0]-t*dx, y-a[1]-t*dy)

def book(x, y):
    left=[(13,18),(33,14),(56,24),(56,53),(33,43),(13,47)]
    right=[(56,24),(79,14),(99,18),(99,47),(79,43),(56,53)]
    if inside(x,y,[(10,21),(32,17),(56,27),(80,17),(102,21),(102,51),(80,48),(56,58),(32,48),(10,52)]):
        value=.45
    else: value=0
    if inside(x,y,left):
        value=.88-(x-13)/85
        for off in [8,13,18,23]:
            if segment(x,y,(19,18+off),(33,16+off)) < .48 or segment(x,y,(33,16+off),(50,23+off)) < .48: value=.12
    if inside(x,y,right):
        value=.5+(x-56)/100
        for off in [8,13,18,23]:
            if segment(x,y,(62,23+off),(79,16+off)) < .48 or segment(x,y,(79,16+off),(93,18+off)) < .48: value=.12
    if segment(x,y,(56,25),(56,55))<.8: value=.2
    return value

def rack(x,y):
    value=0
    if inside(x,y,[(36,10),(64,5),(81,14),(52,20)]): value=.9
    if inside(x,y,[(64,5),(81,14),(81,56),(64,64)]): value=.3
    if inside(x,y,[(36,10),(64,15),(64,64),(36,58)]):
        value=.7
        yy=y-(x-36)*.19
        for top in [15,24,33,42,51]:
            if top<yy<top+6 and 39<x<61:
                value=.17
                if 41<x<53 and int(x)%3==0: value=.5
                if math.hypot(x-58,yy-top-3)<1.1: value=1
    return value

def ticket(x,y):
    a=math.radians(-10)
    dx,dy=x-56,y-35
    xx=dx*math.cos(a)+dy*math.sin(a)
    yy=-dx*math.sin(a)+dy*math.cos(a)
    if abs(xx)>44 or abs(yy)>19: return 0
    if math.hypot(abs(xx)-44,yy)<5: return 0
    if abs(xx)>42 or abs(yy)>17: return .85
    if 21<xx<23 and int(yy+20)%6<3: return 0
    if xx>26:
        if -12<yy<12 and int(xx)%4 in [0,1]: return .9
        return .12
    # Sun above an uninterrupted horizon.
    if abs(yy-5)<.9 and -34<xx<13: return .95
    if yy<4 and abs(math.hypot(xx+10,yy-4)-10)<1.2: return .9
    for angle in [0,math.pi/4,math.pi/2,3*math.pi/4,math.pi]:
        aa=(-10+14*math.cos(angle),4-14*math.sin(angle))
        bb=(-10+17*math.cos(angle),4-17*math.sin(angle))
        if segment(xx,yy,aa,bb)<.7: return .7
    if 10<yy<12 and -29<xx<8: return .5
    return .12

def watch(x,y):
    a=math.radians(26)
    dx,dy=x-56,y-34
    xx=dx*math.cos(a)+dy*math.sin(a)
    yy=-dx*math.sin(a)+dy*math.cos(a)
    val=0
    if abs(xx)<10 and abs(yy)<31:
        val=.32 if abs(xx)<8 else .7
        if int(yy+32)%6<1.5: val=.8
    r=math.hypot(xx,yy/0.88)
    if r<20: val=.38
    if r<18.5: val=.95
    if r<16: val=.12
    if 19<xx<23 and abs(yy)<2.5: val=.8
    if 13.5<r<15:
        angle=math.atan2(yy/0.88,xx)
        if abs(math.sin(angle*6))<.23: val=1
    if r<13.5:
        if segment(xx,yy,(0,0),(-7,-5))<.65 or segment(xx,yy,(0,0),(7,-9))<.55: val=1
        if segment(xx,yy,(-3,-1),(10,4))<.3: val=.6
        if math.hypot(xx,yy)<1.4: val=1
    return val

def graph(x,y):
    nodes=[(21,19,6),(52,33,8),(86,14,6),(90,52,6),(26,54,5)]
    edges=[(0,1),(1,2),(1,4),(2,3)]
    val=0
    for a,b in edges:
        if segment(x,y,nodes[a][:2],nodes[b][:2])<.45: val=.6
    for nx,ny,r in nodes:
        d=math.hypot(x-nx,y-ny)
        if d<r+1:
            val=.95 if d>r-1 else .16
    return val

ramp=' .,:;=+*#%@'
for name,fn in [('skillonomy',book),('cooling',rack),('campushorizon',ticket),('rewatch',watch),('gymbuddy',graph)]:
    lines=[]
    for row in range(H):
        line=''
        for col in range(W):
            v=fn(col+.5,row*2+1)
            line+=ramp[round(max(0,min(1,v))*(len(ramp)-1))]
        lines.append(line.rstrip())
    art='\n'.join(lines).strip('\n')
    (ROOT/'assets/showcases'/f'{name}.txt').write_text(art+'\n')
    page=ROOT/'projects'/f'{name}.html'
    source=page.read_text()
    if 'class="project-ascii"' in source:
        source=re.sub(r'(<pre class="project-ascii" aria-hidden="true">)[\s\S]*?(</pre>)',lambda m:m[1]+html.escape(art)+m[2],source)
        page.write_text(source)
