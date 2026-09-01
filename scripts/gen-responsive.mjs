/**
 * Generate mobile-sized image variants for responsive <img srcset> / CSS swaps.
 * Visuals are unchanged — phones just download a smaller file. Sources are the
 * pristine originals in .image-originals/ (best quality), not the already-shrunk
 * public copies.
 *
 *   node scripts/gen-responsive.mjs
 */
import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const BAK = '.image-originals';
const kb = (n) => (n / 1024).toFixed(0) + ' KB';
const sizeOf = async (p) => (await stat(p)).size;

async function make(src, out, width, quality, alpha = false) {
  if (!existsSync(src)) { console.log(`  skip (no source): ${src}`); return; }
  let pipe = sharp(src).resize({ width, withoutEnlargement: true });
  pipe = alpha ? pipe.webp({ quality, alphaQuality: 92, effort: 5 }) : pipe.webp({ quality, effort: 5 });
  await pipe.toFile(out);
  console.log(`  ${path.basename(out).padEnd(28)} ${kb(await sizeOf(out)).padStart(8)}  (${width}w)`);
}

(async () => {
  // 1) Hero acceptance letter — the mobile LCP image. 640w covers a ~320px slot @2x.
  console.log('hero letter');
  await make(path.join(BAK, 'IMG_5249.jpg'), 'public/IMG_5249-640.webp', 640, 78);

  // 2) Campus backgrounds — full-bleed, heavily tinted, so quality is forgiving.
  //    820w covers a phone full-width backdrop at ~2x DPR.
  console.log('campus backgrounds (-sm)');
  const campusDir = path.join(BAK, 'images/campus');
  for (const f of await readdir(campusDir)) {
    if (!/\.(jpe?g|png)$/i.test(f)) continue;
    const name = f.replace(/\.(jpe?g|png)$/i, '');
    await make(path.join(campusDir, f), `public/images/campus/${name}-sm.webp`, 820, 62);
  }

  console.log('\nDONE');
})().catch((e) => { console.error(e); process.exit(1); });
