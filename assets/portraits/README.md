# Current light stipple portrait

Day/night themes share the same scatter renderer and coffee-photo animation.
Night mode uses `neeraj-stipple.webp` with lighten blending. Day mode uses the
user-selected transparent `neeraj-day-halftone.webp`, a 720×960 delivery copy of
the supplied `neeraj-day-halftone.png`. Its original sage and ivory colors are
preserved, with multiply blending on warm ivory. Both images decode before enabling the
interaction, and a `themechange` event redraws the canvas immediately.
The shared `theme.js` restores the saved theme before styles load on all pages;
night remains the default for new visitors.

The homepage uses `neeraj-stipple.webp`, a 720×960 crop of the selected second preview, preserved in `neeraj-stipple.png`. CSS lighten blending integrates its dark backdrop into the page. Existing 850 ms hover/exit timing is retained.

Generated using built-in imagegen from the original photograph. Prompt: Preserve the man’s likeness and expression. Head only on near-black #111513. Realistic stipple portrait designed for a dark canvas: small pale sage dots describe light on forehead, cheeks, nose and chin; black negative space forms hair, pupils and shadows. Correct positive lighting; no negative inversion. Separate round dots, no solid skin fill, lines, oval, text or watermark.

---

# Current halftone portrait

The homepage uses `neeraj-halftone.webp`, a transparent 720×960 delivery copy of `neeraj-halftone.png`, generated with built-in imagegen from the supplied halftone reference. The existing 850 ms hover and exit animation is retained. Previous assets below are kept for comparison.

## Halftone generation prompt

Create an isolated halftone head portrait matching the attached reference almost exactly, a little more detail in nose, eyes, lips. CRITICAL: all visible marks must be small separate PALE SAGE circular dots (#d6dfce). The reference's black dots become pale sage dots. The reference's offwhite background AND offwhite facial highlights become FULLY TRANSPARENT. There is NO filled-in face, NO skin surface, NO shading except the individual dots. Transparent holes between every dot. Hair made of larger closely spaced dots, brows and eyes medium dots, cheeks and nose small sparse dots. Preserve the man's exact face silhouette, hairline, features and expression in the reference. Only head, no neck. Center in portrait 3:4 format with 5% margin. This is a sparse pointillist stencil of a face for display on a dark website, NOT a photo with dots overlaid. No text.

---

# Line-art portrait and hover photos

The homepage now uses `neeraj-lineart.webp`, a transparent 720×960 delivery copy
of `neeraj-lineart.png`. The built-in image generation tool created this lightly
cartoonified line drawing directly from the user's original photograph. The
original photo, photographic cutout, and previous dot SVG are retained.

At rest, the canvas draws the illustration intact. During hover, it scatters
2×2 source-pixel tiles with their original color and transparency, using the
same 850 ms progress, curved trajectories, fading, and 25% size reduction.
The café photo timing, placement, keyboard/touch handling, and reduced-motion
support are unchanged. No SVG parsing or dot conversion is needed for this version.

## Final line-art prompt (built-in imagegen)

Use case: style-transfer. Input is the original photo and identity reference. Make a SIMPLE, lightly cartoonified yet realistic editorial LINE DRAWING of this exact man's head. Preserve recognizable real face shape, normal eye size, nose, parted lips, faint moustache, side swept short hair and expression. Draw with approximately 40-70 clean intentional medium-thick contour strokes, like an elegant hand-drawn personal avatar. Hair should have only 10-15 broad curved locks, NOT individual strands. Face should have outline, eyebrows, eyes, nose, mouth and 3-5 cheek/jaw lines. NO hatching, NO engraving, NO stippling, NO shading texture, NO photorealistic detail. Pale sage ivory (#d6dfce) strokes on a TRANSPARENT background for a dark website; all empty areas inside and outside the face transparent. No solid fills. No background, no neck, no shoulders, no clothing, no frame, no text. Full hair and chin visible, centered in 3:4 portrait with margin. Must read cleanly at 170 pixels wide. Subtle cartoon simplification only, no caricature or enlarged eyes. Use smooth bold readable ink contours, especially hair silhouette and jaw.

## Previous dot version

`neeraj-dots.svg` was the previous homepage asset: 6,411 circles sampled from the cutout,
with brightness controlling dot area. It uses the site's sage palette, has a
transparent background, scales without blur, and works without JavaScript.

The previous renderer read these SVG circles into a canvas to
reveal the four supplied café photos from `assets/photos/`. The current line-art image is
the loading/no-JavaScript fallback. The photos are orientation-corrected WebP
delivery copies; their content is unchanged.

Motion follows the inspected brianan.ca homepage: 850 ms scatter/reform, smoothstep
dot displacement, `(1 - progress)^1.4` dot fading, a 25% radius reduction, and
pointer-relative curved trajectories. Photo movement uses 850 ms with
`cubic-bezier(.16,1,.3,1)`, a 250 ms fade, and entrance delays of 0/35/70/105 ms.
Exit removes the stagger. The floating motion runs for 7/8/9/10 seconds,
alternating between `translate(-5px,-10px) rotate(-3deg)` and
`translate(6px,16px) rotate(4deg)`. Four corner slots adapt the reference's
six-image arrangement to the four supplied photos and existing portrait size.

Hover and keyboard focus reveal the photos; leaving or Escape restores the
portrait. Touch toggles on tap. Reduced motion switches states immediately;
canvas work stops at rest and floating pauses offscreen or in a hidden tab.

`neeraj-cutout.png` is the source asset, prepared from the user's supplied photo
using the built-in image generation tool. It is not downloaded by the homepage.
The original attachment was left unchanged. As with any generated extraction,
the cutout is an interpretation of the original photo rather than a pixel-exact mask.

To regenerate the SVG, install `sharp` in your development environment and run
`node scripts/build-portrait.cjs` from the project root. No build step or image
library is needed to serve the site. The script exposes grid pitch, tone mapping,
dot radius, and fill color for future adjustments.

## Cutout prompt

Use case: background-extraction. Edit the attached photo into a precise photographic cutout of ONLY this man's head: hair, face, ears and the natural chin/jaw outline. Remove all forest background, neck, clothing, shoulders and backpack. Preserve his exact identity, facial proportions, hair, eyes, nose, mouth, expression, pose and photographic textures. Do not beautify, redraw, smooth, stylize or change his face. Center the head upright in a tightly framed portrait canvas with a small transparent margin, hair fully included, ending at the chin. Actual transparent alpha background. This is a source asset to convert to mathematical halftone dots later, so keep original natural photo colors and shading. No dots yet. No text, shadows or border.
