/**
 * Post-process generated art (assets-src/generated/*.png) into shipped WebP:
 *  - boss-*.png            → public/art/bosses/<name>.webp   (Guardian stills, 3:4)
 *  - *-bg-portrait.png     → public/assets/backgrounds/<name>.webp (9:16 variants)
 * Masters stay in assets-src/generated/ (never shipped). Idempotent.
 * Run: node assets-src/generated/process.mjs
 */
import sharp from "sharp";
import { readdirSync, statSync } from "node:fs";
import { join, basename } from "node:path";

const SRC = "assets-src/generated";
const files = readdirSync(SRC).filter((f) => f.endsWith(".png"));
let total = 0;

for (const f of files) {
  const name = basename(f, ".png");
  const out = f.startsWith("boss-")
    ? `public/art/bosses/${name}.webp`
    : `public/assets/backgrounds/${name}.webp`;
  const buf = await sharp(join(SRC, f)).webp({ quality: 82 }).toBuffer();
  await sharp(buf).toFile(out);
  const kb = Math.round(buf.length / 1024);
  total += kb;
  console.log(`${out}  ${kb}KB  (${Math.round(statSync(join(SRC, f)).size / 1024)}KB master)`);
}
console.log(`TOTAL shipped: ${Math.round(total / 102.4) / 10}MB across ${files.length} files`);
