// One-time asset generator; requires sharp. The website has no runtime dependency.
// Run: node scripts/build-portrait.cjs
const sharp = require('sharp');
const fs = require('node:fs/promises');
const path = require('node:path');

async function main() {
  const directory = path.join(__dirname, '../assets/portraits');
  const width = 240;
  const height = 320;
  const pitch = 2.8;
  const { data, info } = await sharp(path.join(directory, 'neeraj-cutout.png'))
    .trim({ background: '#00000000', threshold: 12 })
    .resize(width - 16, height - 16, { fit: 'contain', background: '#00000000' })
    .extend({ top: 8, bottom: 8, left: 8, right: 8, background: '#00000000' })
    .ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const circles = [];
  for (let y = pitch / 2; y < height; y += pitch) {
    for (let x = pitch / 2; x < width; x += pitch) {
      const i = (Math.floor(y) * info.width + Math.floor(x)) * 4;
      const alpha = data[i + 3] / 255;
      if (alpha < 0.45) continue;
      const luminance = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
      // Light dots on charcoal: preserve shadows as open space, not a negative.
      const tone = Math.pow(Math.max(0, Math.min(1, (luminance - 14) / 190)), 0.85);
      const radius = pitch * (0.10 + 0.37 * Math.sqrt(tone)) * Math.sqrt(alpha);
      circles.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${radius.toFixed(2)}"/>`);
    }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}"><title>Neeraj Chormale, a portrait in dots</title><g fill="#d6dfce">${circles.join('')}</g></svg>\n`;
  await fs.writeFile(path.join(directory, 'neeraj-dots.svg'), svg);
  console.log(`Created portrait with ${circles.length} dots (${Math.round(svg.length / 1024)} KB).`);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
