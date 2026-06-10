/**
 * npm run assets:cutout — produce TRANSPARENT-background PNGs for medallion-type
 * assets so they never render in a gray box (emblems, rank insignia, sigils, coach,
 * stamps, map nodes). Originals are backed up to assets-src/_raw/ before overwriting.
 *
 * Uses the `rembg` CLI if available (https://github.com/danielgatis/rembg):
 *     pipx install rembg   (or)   pip install "rembg[cli]"
 * If rembg is not installed, the script lists the targets and exits without changes.
 * Non-destructive: re-running skips files already cut out (those with a _raw backup).
 */
import { readdirSync, statSync, mkdirSync, copyFileSync, existsSync } from "node:fs";
import { join, relative, dirname, sep } from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = join(process.cwd(), "public", "assets");
const RAW = join(process.cwd(), "assets-src", "_raw");

const MATCH = [
  /openings[/\\][^/\\]+[/\\]emblem\.png$/,
  /badges[/\\]rank-.*\.png$/,
  /archetypes[/\\]sigil-.*\.png$/,
  /coach[/\\]mentor\.png$/,
  /passport[/\\]stamp-.*\.png$/,
  /nodes[/\\]node-.*\.png$/,
];

function listFiles(dir) {
  const out = [];
  for (const e of readdirSync(dir)) {
    if (e === "_raw" || e.startsWith(".")) continue;
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out.push(...listFiles(p));
    else out.push(p);
  }
  return out;
}

function hasRembg() {
  try { execFileSync("rembg", ["--help"], { stdio: "ignore" }); return true; }
  catch { return false; }
}

const targets = listFiles(ROOT).filter((p) => MATCH.some((re) => re.test(p)));
console.log(`Found ${targets.length} medallion-type assets to cut out.`);

if (!hasRembg()) {
  console.log("\n⚠ rembg CLI not found — no changes made. Install it, then re-run:");
  console.log("    pipx install rembg   (or)   pip install \"rembg[cli]\"\n");
  for (const p of targets) console.log("  •", relative(process.cwd(), p));
  process.exit(0);
}

let done = 0;
for (const p of targets) {
  const rel = relative(ROOT, p);
  const backup = join(RAW, rel);
  if (existsSync(backup)) continue; // already processed
  mkdirSync(dirname(backup), { recursive: true });
  copyFileSync(p, backup);
  execFileSync("rembg", ["i", backup, p]); // remove bg from the backed-up original → overwrite
  done++;
  console.log("  cut", rel);
}
console.log(`\nDone — ${done} cut out, originals in assets-src/_raw/.`);
