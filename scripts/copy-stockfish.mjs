/**
 * Copies the single-threaded Stockfish WASM build into public/ so it can be
 * loaded as a Web Worker from /stockfish/. Run via the `postinstall` hook so it
 * works locally and on Vercel (install → copy → build). The 7 MB .wasm is NOT
 * committed; it is reproduced from node_modules on every install.
 *
 * Engine: stockfish-18-lite-single (single-threaded → no SharedArrayBuffer, so
 * no COOP/COEP headers required). Stockfish is GPLv3 — comply when distributing.
 */
import { mkdirSync, copyFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = join(root, "node_modules", "stockfish", "bin");
const outDir = join(root, "public", "stockfish");
const files = ["stockfish-18-lite-single.js", "stockfish-18-lite-single.wasm"];

if (!existsSync(join(srcDir, files[0]))) {
  console.warn("[copy-stockfish] stockfish package not found in node_modules; skipping.");
  process.exit(0);
}

mkdirSync(outDir, { recursive: true });
for (const f of files) {
  copyFileSync(join(srcDir, f), join(outDir, f));
}
console.log(`[copy-stockfish] copied ${files.length} file(s) → public/stockfish/`);
