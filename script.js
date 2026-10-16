/* Small progressive enhancements. Content and links work without JavaScript. */
document.querySelectorAll("[data-year]").forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});

// Keep links to sections from the previous one-page portfolio useful.
if (document.body.classList.contains("home")) {
  const previousSections = {
    "#about": "about.html#about",
    "#work": "about.html#experience",
    "#skills": "about.html#skills",
    "#education": "about.html#education",
  };
  const openPreviousSection = () => {
    if (Object.hasOwn(previousSections, window.location.hash)) {
      window.location.replace(previousSections[window.location.hash]);
    }
  };
  openPreviousSection();
  window.addEventListener("hashchange", openPreviousSection);
}

// The illustration remains the no-JS fallback; its pixels scatter on hover.
async function initializePortrait() {
  const portrait = document.querySelector('.portrait-interaction');
  if (!portrait) return;
  const button = portrait.querySelector('.portrait-toggle');
  const fallback = portrait.querySelector('.hero-dot-portrait');
  const canvas = portrait.querySelector('canvas');
  const photos = portrait.querySelector('.portrait-photos');
  const context = canvas.getContext('2d');
  if (!context) return;

  try {
    await fallback.decode();
    const scale = 500 / 240;
    const sample = document.createElement('canvas');
    sample.width = 240;
    sample.height = 320;
    const sampleContext = sample.getContext('2d', { willReadFrequently: true });
    sampleContext.drawImage(fallback, 0, 0, 240, 320);
    const pixels = sampleContext.getImageData(0, 0, 240, 320).data;
    const particles = [];
    const pitch = 2;
    for (let y = 0; y < 320; y += pitch) {
      for (let x = 0; x < 240; x += pitch) {
        // Skip fully transparent tiles, retaining antialiased ink edges.
        let visible = false;
        for (let dy = 0; dy < pitch; dy++) {
          for (let dx = 0; dx < pitch; dx++) {
            if (pixels[((y + dy) * 240 + x + dx) * 4 + 3]) visible = true;
          }
        }
        if (!visible) continue;
        const column = x / pitch;
        const row = y / pitch;
        particles.push({
          sourceX: x, sourceY: y,
          x: (x + pitch / 2) * scale, y: (y + pitch / 2) * scale,
          distance: 90 + (17 * column + 31 * row) % 60,
          curve: (7 * column + 13 * row) % 32 - 16,
        });
      }
    }
    if (!particles.length) throw new Error('Portrait has no visible ink');

    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const origin = { x: 250, y: 320 * scale / 2 };
    const pointer = { ...origin };
    let progress = 0;
    let target = 0;
    let frame = 0;
    let previousTime = 0;
    let intersecting = true;
    let suspended = document.hidden;
    let canvasLogicalWidth = 800;
    let paddingX = 150;

    function draw() {
      context.clearRect(0, 0, canvasLogicalWidth, 320 * scale * 1.6);
      if (progress === 0) {
        context.drawImage(fallback, paddingX, 200, 500, 320 * scale);
        return;
      }
      const eased = progress * progress * (3 - 2 * progress);
      const alpha = Math.pow(1 - progress, 1.4);
      if (!alpha) return;
      const bend = Math.sin(eased * Math.PI);
      context.globalAlpha = alpha;
      const size = pitch * scale * (1 - 0.25 * eased);
      const sourceScaleX = fallback.naturalWidth / 240;
      const sourceScaleY = fallback.naturalHeight / 320;
      for (const dot of particles) {
          const dx = dot.x - origin.x;
          const dy = dot.y - origin.y;
          const length = Math.hypot(dx, dy) || 1;
          const nx = dx / length;
          const ny = dy / length;
          const curve = bend * dot.curve;
          const x = paddingX + dot.x + nx * dot.distance * eased - ny * curve;
          const y = 200 + dot.y + ny * dot.distance * eased + nx * curve;
          context.drawImage(fallback,
            dot.sourceX * sourceScaleX, dot.sourceY * sourceScaleY,
            pitch * sourceScaleX, pitch * sourceScaleY,
            x - size / 2, y - size / 2, size, size);
      }
      context.globalAlpha = 1;
    }

    function tick(time) {
      const delta = previousTime ? Math.min(time - previousTime, 40) : 16;
      previousTime = time;
      const follow = Math.min(1, delta / 100);
      origin.x += (pointer.x - origin.x) * follow;
      origin.y += (pointer.y - origin.y) * follow;
      // Reference timing: full travel in either direction is 850 ms.
      const step = delta / 850;
      progress = target > progress ? Math.min(target, progress + step) : Math.max(target, progress - step);
      draw();
      frame = progress !== target ? requestAnimationFrame(tick) : 0;
    }

    function animate() {
      if (reducedMotion.matches || suspended) {
        cancelAnimationFrame(frame);
        frame = 0;
        progress = target;
        draw();
      } else if (!frame && progress !== target) {
        previousTime = 0;
        frame = requestAnimationFrame(tick);
      }
    }

    function move(event) {
      const rect = portrait.getBoundingClientRect();
      pointer.x = Math.max(0, Math.min(500, (event.clientX - rect.left) / rect.width * 500));
      pointer.y = Math.max(0, Math.min(320 * scale, (event.clientY - rect.top) / rect.height * 320 * scale));
    }

    function reveal(expanded, event) {
      if (event) {
        move(event);
        if (progress === 0) Object.assign(origin, pointer);
      }
      target = Number(expanded);
      portrait.dataset.expanded = String(expanded);
      button.setAttribute('aria-expanded', String(expanded));
      button.setAttribute('aria-label', expanded ? 'Hide coffee photos' : 'Show coffee photos');
      photos.setAttribute('aria-hidden', String(!expanded));
      animate();
    }

    new ResizeObserver(() => {
      const rect = canvas.getBoundingClientRect();
      canvasLogicalWidth = rect.width / portrait.getBoundingClientRect().width * 500;
      paddingX = (canvasLogicalWidth - 500) / 2;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      context.setTransform(canvas.width / canvasLogicalWidth, 0, 0, canvas.height / (320 * scale * 1.6), 0, 0);
      draw();
      portrait.dataset.ready = '';
    }).observe(portrait);

    portrait.addEventListener('pointerenter', event => {
      if (event.pointerType === 'mouse') reveal(true, event);
    });
    portrait.addEventListener('pointermove', event => {
      if (event.pointerType === 'mouse') move(event);
    });
    portrait.addEventListener('pointerleave', event => {
      if (event.pointerType === 'mouse') reveal(false);
    });
    button.addEventListener('focus', () => {
      if (button.matches(':focus-visible')) reveal(true);
    });
    button.addEventListener('click', event => {
      // Mouse uses hover, while touch and assistive activation can toggle.
      if (event.pointerType !== 'mouse') reveal(!target);
    });
    portrait.addEventListener('focusout', event => {
      if (!portrait.contains(event.relatedTarget)) reveal(false);
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && target) reveal(false);
    });
    document.addEventListener('pointerdown', event => {
      if (!portrait.contains(event.target) && target) reveal(false);
    });
    reducedMotion.addEventListener('change', animate);

    function updateSuspension() {
      suspended = document.hidden || !intersecting;
      portrait.toggleAttribute('data-suspended', suspended);
      animate();
    }
    document.addEventListener('visibilitychange', updateSuspension);
    new IntersectionObserver(([entry]) => {
      intersecting = entry.isIntersecting;
      updateSuspension();
    }).observe(portrait);
    button.disabled = false;
  } catch (error) {
    // Leave the accessible illustration in place if enhancement is unavailable.
    console.warn('Static portrait retained:', error);
  }
}
initializePortrait();
