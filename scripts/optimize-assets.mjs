/**
 * npm run assets:optimize
 * - Backgrounds & textures: PNG/JPG → WebP (smaller, for full-bleed surfaces).
 * - Retina masters: drop files as <name>@2x.png → auto-emit <name>.png (@1x, 50%).
 * Non-destructive (originals kept). Requires `sharp` (already a dep).
 */
import sharp from "sharp";
import { readdirSync, statSync } from "node:fs";
import { join, extname, relative, sep } from "node:path";

const ROOT = join(process.cwd(), "public", "assets");
const WEBP_DIRS = new Set(["backgrounds", "textures"]);

function listFiles(dir) {
  const out = [];
  for (const e of readdirSync(dir)) {
    if (e.startsWith(".")) continue;
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out.push(...listFiles(p));
    else out.push(p);
  }
  return out;
}

let webp = 0;
let onex = 0;
for (const p of listFiles(ROOT)) {
  const ext = extname(p).toLowerCase();
  const top = relative(ROOT, p).split(sep)[0];
  const name = p.split(sep).pop();

  if (WEBP_DIRS.has(top) && [".png", ".jpg", ".jpeg"].includes(ext)) {
    const out = p.replace(/\.(png|jpe?g)$/i, ".webp");
    await sharp(p).webp({ quality: 82 }).toFile(out);
    webp++;
    console.log("webp →", relative(process.cwd(), out));
  }

  if (/@2x\.png$/i.test(name)) {
    const out = p.replace(/@2x\.png$/i, ".png");
    const meta = await sharp(p).metadata();
    await sharp(p)
      .resize({ width: Math.max(1, Math.round((meta.width ?? 2) / 2)) })
      .png()
      .toFile(out);
    onex++;
    console.log("@1x  →", relative(process.cwd(), out));
  }
}

console.log(`\nDone — ${webp} WebP, ${onex} @1x generated.`);
console.log("Tip: name retina masters <name>@2x.png to auto-generate <name>.png (@1x).");
