"""Render an original shaded ASCII dumbbell; no image or runtime dependencies."""
import math
from pathlib import Path

W, H = 100, 36

def shape(p):
    x, y, z = p
    # Rotate the dumbbell in the image plane, then turn its end toward the viewer.
    a = -.32
    x, y = x*math.cos(a)-y*math.sin(a), x*math.sin(a)+y*math.cos(a)
    x, z = x*.94+z*.342, -x*.342+z*.94
    def cylinder(cx, half, radius):
        u, v = abs(x-cx)-half, math.hypot(y,z)-radius
        return min(max(u,v),0)+math.hypot(max(u,0),max(v,0))-.055
    return min(cylinder(0,1.75,.19), *[cylinder(side*cx,half,r) for side in [-1,1] for cx,half,r in [(1.55,.17,.86),(1.94,.18,1.04),(2.32,.13,.85),(2.55,.1,.24)]])

rows=[]
for row in range(H):
    line=''
    for col in range(W):
        x=(col-(W-1)/2)*.066
        y=((H-1)/2-row)*.132
        z=5
        hit=False
        for _ in range(80):
            d=shape((x,y,z))
            if d<.004:
                hit=True
                break
            z-=max(d,.003)
            if z < -3: break
        if not hit:
            line+=' '
            continue
        eps=.008
        n=[shape((x+eps,y,z))-shape((x-eps,y,z)),shape((x,y+eps,z))-shape((x,y-eps,z)),shape((x,y,z+eps))-shape((x,y,z-eps))]
        length=math.sqrt(sum(v*v for v in n)) or 1
        light=max(0,sum(a*b/length for a,b in zip(n,[-.45,.65,.61])))
        ramp='.,:;=+*#%@'
        line+=ramp[min(len(ramp)-1,int((.12+.87*light)*(len(ramp)-1)))]
    rows.append(line.rstrip())
Path('assets/setzo/dumbbell.txt').write_text('\n'.join(rows).rstrip('\n')+'\n')
print('\n'.join(rows))
