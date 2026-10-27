// A finite ASCII scatter, followed by the same photo reveal idea as the homepage.
(() => {
  const showcase = document.querySelector('.setzo-showcase');
  if (!showcase) return;
  const stage = showcase.querySelector('.setzo-stage');
  const button = showcase.querySelector('.setzo-toggle');
  const canvas = showcase.querySelector('canvas');
  const context = canvas.getContext('2d');
  const screens = showcase.querySelector('.setzo-screens');
  if (!context) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const glyphs = [];
  showcase.querySelector('pre').textContent.split('\n').forEach((line, row) => {
    [...line].forEach((char, column) => {
      if (char !== ' ') glyphs.push({char, x:column*6-300, y:row*12-216,
        drift:45+(column*17+row*13)%65, turn:(column*7+row*11)%30-15});
    });
  });
  let target = 0, progress = 0, frame = 0, previous = 0;
  let width = 0, height = 0, ink = '';

  function draw() {
    context.clearRect(0, 0, width, height);
    if (progress === 1) return;
    const scale = Math.min(width/660, .88);
    const eased = 1-Math.pow(1-progress,3);
    context.save();
    context.translate(width/2,height/2);
    context.scale(scale,scale);
    context.font = '10px monospace';
    context.fillStyle = ink;
    context.globalAlpha = Math.pow(1-progress,1.8);
    for (const g of glyphs) {
      const length = Math.hypot(g.x,g.y) || 1;
      context.fillText(g.char,g.x+g.x/length*g.drift*eased-g.turn*eased,g.y+g.y/length*g.drift*eased);
    }
    context.restore();
  }
  function tick(time) {
    const delta = previous ? Math.min(time-previous,40) : 16;
    previous = time;
    const step = delta/(target ? 650 : 420);
    progress = target ? Math.min(1,progress+step) : Math.max(0,progress-step);
    draw();
    frame = progress !== target ? requestAnimationFrame(tick) : 0;
  }
  function animate() {
    if (reduced.matches || document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
      progress = target;
      draw();
    } else if (!frame && progress !== target) {
      previous = 0;
      frame = requestAnimationFrame(tick);
    }
  }
  function reveal(open) {
    target = Number(open);
    showcase.dataset.expanded = String(open);
    button.setAttribute('aria-expanded',String(open));
    button.setAttribute('aria-label',open ? 'Hide Setzo app screenshots' : 'Show Setzo app screenshots');
    screens.setAttribute('aria-hidden',String(!open));
    animate();
  }
  function resize() {
    const rect = stage.getBoundingClientRect();
    width = rect.width; height = rect.height;
    const dpr = Math.min(devicePixelRatio || 1,2);
    canvas.width = Math.round(width*dpr); canvas.height = Math.round(height*dpr);
    context.setTransform(dpr,0,0,dpr,0,0);
    ink = getComputedStyle(button).color;
    draw();
  }
  stage.addEventListener('pointerenter',event => { if(event.pointerType === 'mouse') reveal(true); });
  stage.addEventListener('pointerleave',event => { if(event.pointerType === 'mouse') reveal(false); });
  button.addEventListener('click',event => {
    // Mouse reveals on entry; tap, Enter and Space toggle the same disclosure.
    if (event.pointerType !== 'mouse') reveal(!target);
  });
  button.addEventListener('blur',() => reveal(false));
  document.addEventListener('keydown',event => { if(event.key === 'Escape') reveal(false); });
  document.addEventListener('pointerdown',event => { if(!showcase.contains(event.target)) reveal(false); });
  document.addEventListener('themechange',resize);
  document.addEventListener('visibilitychange',animate);
  reduced.addEventListener('change',animate);
  new ResizeObserver(resize).observe(stage);
  resize();
  showcase.dataset.ready = '';
  button.disabled = false;
})();
