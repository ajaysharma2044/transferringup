/**
 * One-shot image optimizer (run manually, not part of the build).
 *
 *   node scripts/optimize-images.mjs
 *
 * Goal: kill the 41 MB raster payload that was tanking mobile LCP (18.2s).
 *  - Campus duotone backgrounds + review cutouts → WebP (huge wins, quality-tolerant)
 *  - Hero proof shots → WebP
 *  - Oversized logos (1.3 MB footer mark shown at 30px, 320 KB favicon) → resized in place
 *  - recent-wins / campus-band JPGs → recompressed in place
 *  - Generates the two MISSING assets that were 404-ing: /hero-campus.jpg (video
 *    poster) and /og-image.jpg (social card).
 *
 * Originals are backed up to .image-originals/ before anything destructive.
 */
import sharp from 'sharp';
import { readdir, mkdir, copyFile, rename, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const PUB = 'public';
const BAK = '.image-originals';
let saved = 0;
let after = 0;

async function backup(rel) {
  const dest = path.join(BAK, rel);
  await mkdir(path.dirname(dest), { recursive: true });
  if (!existsSync(dest)) await copyFile(path.join(PUB, rel), dest);
}
async function sizeOf(p) {
  const { stat } = await import('fs/promises');
  return (await stat(p)).size;
}
function kb(n) { return (n / 1024).toFixed(0) + ' KB'; }

/** Convert src → .webp sibling; back up + remove original. */
async function toWebp(rel, { width, quality, alpha = false }) {
  const inp = path.join(PUB, rel);
  if (!existsSync(inp)) return;
  const before = await sizeOf(inp);
  const out = inp.replace(/\.(jpe?g|png)$/i, '.webp');
  let pipe = sharp(inp).resize({ width, withoutEnlargement: true });
  pipe = pipe.webp(alpha ? { quality, alphaQuality: 92, effort: 5 } : { quality, effort: 5 });
  await pipe.toFile(out);
  await backup(rel);
  const { unlink } = await import('fs/promises');
  await unlink(inp); // remove the heavy original (ref is being repointed to .webp)
  const a = await sizeOf(out);
  saved += before - a; after += a;
  console.log(`  webp  ${rel.padEnd(48)} ${kb(before).padStart(8)} → ${kb(a).padStart(8)}`);
}

/** Recompress/resize a raster IN PLACE (keeps filename + format). */
async function inPlace(rel, { width, height, quality, format }) {
  const inp = path.join(PUB, rel);
  if (!existsSync(inp)) return;
  const before = await sizeOf(inp);
  await backup(rel);
  const tmp = inp + '.tmp';
  let pipe = sharp(path.join(BAK, rel)).resize({ width, height, fit: 'inside', withoutEnlargement: true });
  if (format === 'png') pipe = pipe.png({ compressionLevel: 9, palette: true, quality: quality || 80 });
  else pipe = pipe.jpeg({ quality: quality || 74, mozjpeg: true });
  await pipe.toFile(tmp);
  await rename(tmp, inp);
  const a = await sizeOf(inp);
  saved += before - a; after += a;
  console.log(`  place ${rel.padEnd(48)} ${kb(before).padStart(8)} → ${kb(a).padStart(8)}`);
}

(async () => {
  await mkdir(BAK, { recursive: true });

  // 1) Campus duotone backgrounds — tinted/blended, so quality is forgiving.
  console.log('campus backgrounds → webp');
  for (const f of await readdir(path.join(PUB, 'images/campus'))) {
    if (/\.(jpe?g|png)$/i.test(f)) await toWebp(`images/campus/${f}`, { width: 1500, quality: 64 });
  }

  // 2) Review cutouts — transparent PNG → webp w/ alpha.
  console.log('review cutouts → webp');
  for (const f of await readdir(path.join(PUB, 'reviews'))) {
    if (/-cutout\.png$/i.test(f)) await toWebp(`reviews/${f}`, { width: 880, quality: 80, alpha: true });
  }

  // 3) Hero proof shots → webp.
  console.log('hero proof → webp');
  await toWebp('IMG_5249.jpg', { width: 1000, quality: 78 });
  await toWebp('Screenshot_2026-03-27_at_2.34.30_AM.jpg', { width: 760, quality: 78 });

  // 4) Logos — wildly oversized for their display size. Resize in place.
  console.log('logos → resized in place');
  await inPlace('tupng.png', { height: 96, format: 'png' });                 // shown ~30px tall
  await inPlace('logotransferringup.png', { width: 256, height: 256, format: 'png' }); // favicon + schema logo
  if (existsSync(path.join(PUB, 'logo.png'))) await inPlace('logo.png', { width: 256, format: 'png' });

  // 5) recent-wins + campus-band thumbnails → recompress in place (keep names; many refs).
  console.log('recent-wins → recompress in place');
  for (const f of await readdir(path.join(PUB, 'recent-wins'))) {
    if (/\.(jpe?g)$/i.test(f)) await inPlace(`recent-wins/${f}`, { width: 1100, quality: 72 });
  }
  for (const f of ['campus-cornell.jpg', 'campus-michigan.jpg', 'campus-uva.jpg']) {
    if (existsSync(path.join(PUB, 'images', f))) await inPlace(`images/${f}`, { width: 1200, quality: 70 });
  }

  // 6) Generate the two MISSING assets that were 404-ing.
  console.log('generate missing poster + og-image');
  const NAVY = { r: 15, g: 28, b: 46 };
  // Poster: a campus frame, darkened to match the navy hero scrim (~60 KB).
  const posterSrc = path.join(BAK, 'images/campus/emory.jpg');
  if (existsSync(posterSrc)) {
    await sharp(posterSrc)
      .resize({ width: 1280, height: 720, fit: 'cover' })
      .modulate({ brightness: 0.5, saturation: 0.7 })
      .tint(NAVY)
      .jpeg({ quality: 56, mozjpeg: true })
      .toFile(path.join(PUB, 'hero-campus.jpg'));
    console.log('  made hero-campus.jpg (poster)');
  }
  // OG card: 1200×630 navy canvas with the logo centered.
  const ogLogo = await sharp(path.join(BAK, 'logotransferringup.png'))
    .resize({ width: 360, height: 360, fit: 'inside' }).png().toBuffer().catch(() => null);
  let og = sharp({ create: { width: 1200, height: 630, channels: 3, background: NAVY } });
  if (ogLogo) og = og.composite([{ input: ogLogo, gravity: 'center' }]);
  await og.jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(PUB, 'og-image.jpg'));
  console.log('  made og-image.jpg (social card)');

  console.log(`\nDONE — saved ~${(saved / 1024 / 1024).toFixed(1)} MB; new optimized payload ~${(after / 1024 / 1024).toFixed(1)} MB`);
})().catch((e) => { console.error(e); process.exit(1); });
