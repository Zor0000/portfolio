(() => {
  const showcase = document.querySelector('.project-showcase');
  if (!showcase) return;
  const stage = showcase.querySelector('.project-stage');
  const button = showcase.querySelector('.project-toggle');
  const canvas = showcase.querySelector('canvas');
  const context = canvas.getContext('2d');
  if (!context) return;
  const reveal = showcase.querySelector('.project-reveal');
  const isWatch = showcase.dataset.kind === 'rewatch';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const lines = showcase.querySelector('pre').textContent.split('\n');
  const columns = Math.max(...lines.map(line => line.length));
  const glyphs = [];
  lines.forEach((line, row) => [...line].forEach((char, column) => {
    if (char !== ' ') glyphs.push({char, x:(column-columns/2)*6, y:(row-lines.length/2)*12,
      drift:35+(column*17+row*13)%70, turn:(column*7+row*11)%30-15});
  }));
  let width=0, height=0, ink='', target=0, progress=0, frame=0, previous=0;
  function draw() {
    context.clearRect(0,0,width,height);
    if (!isWatch && progress===1) return;
    const scale=Math.min(width/(columns*6+24),height/(lines.length*12+25),.88);
    const eased=1-Math.pow(1-progress,3);
    context.save();
    context.translate(width/2,height/2);
    context.scale(scale,scale);
    context.font='10px monospace';
    context.fillStyle=ink;
    context.globalAlpha=isWatch ? 1 : Math.pow(1-progress,1.8);
    // The watch stays intact: a small lift and turn instead of a disclosure.
    if (isWatch && !reduced.matches) {
      context.translate(0,-9*eased);
      context.rotate(-.055*eased);
      context.scale(1+.045*eased,1+.045*eased);
    }
    for (const g of glyphs) {
      const length=Math.hypot(g.x,g.y)||1;
      const drift=isWatch ? 0 : g.drift*eased;
      context.fillText(g.char,g.x+g.x/length*drift-(isWatch ? 0 : g.turn*eased),g.y+g.y/length*drift);
    }
    context.restore();
  }
  function tick(time) {
    const delta=previous ? Math.min(time-previous,40) : 16;
    previous=time;
    const step=delta/(target ? 650 : 420);
    progress=target ? Math.min(1,progress+step) : Math.max(0,progress-step);
    draw();
    frame=progress!==target ? requestAnimationFrame(tick) : 0;
  }
  function animate() {
    if (reduced.matches || document.hidden) {
      cancelAnimationFrame(frame);frame=0;progress=target;draw();
    } else if (!frame && progress!==target) {previous=0;frame=requestAnimationFrame(tick);}
  }
  function setOpen(open) {
    target=Number(open);
    showcase.dataset.expanded=String(open);
    if (isWatch) button.setAttribute('aria-pressed',String(open));
    else {
      button.setAttribute('aria-expanded',String(open));
      button.setAttribute('aria-label',`${open ? 'Hide' : 'Show'} ${showcase.dataset.label}`);
      reveal.setAttribute('aria-hidden',String(!open));
    }
    animate();
  }
  function resize() {
    const rect=stage.getBoundingClientRect();width=rect.width;height=rect.height;
    const dpr=Math.min(devicePixelRatio||1,2);
    canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
    context.setTransform(dpr,0,0,dpr,0,0);
    ink=getComputedStyle(button).color;draw();
  }
  stage.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse') setOpen(true);});
  stage.addEventListener('pointerleave',event=>{if(event.pointerType==='mouse') setOpen(false);});
  button.addEventListener('click',event=>{if(event.pointerType!=='mouse') setOpen(!target);});
  button.addEventListener('blur',()=>setOpen(false));
  document.addEventListener('keydown',event=>{if(event.key==='Escape') setOpen(false);});
  document.addEventListener('pointerdown',event=>{if(!showcase.contains(event.target)) setOpen(false);});
  document.addEventListener('themechange',resize);
  document.addEventListener('visibilitychange',animate);
  reduced.addEventListener('change',animate);
  new ResizeObserver(resize).observe(stage);
  resize();showcase.dataset.ready='';button.disabled=false;
})();
