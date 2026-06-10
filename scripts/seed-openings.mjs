/**
 * Seed the opening tree: path_templates + nodes (one node per unique position).
 * Reference data so FSRS cards can be keyed to real positions. INCREMENTAL +
 * idempotent — adds openings missing from the DB, never duplicates. Run with DB
 * access:
 *
 *   node --env-file=.env.local scripts/seed-openings.mjs
 *
 * Self-contained ESM. The curated lines MIRROR src/domain/repertoire/starter-paths.ts.
 */
import { Chess } from "chess.js";
import { neon } from "@neondatabase/serverless";

const PATHS = [
  { slug: "italian-giuoco-pianissimo", name: "Italian Game — Giuoco Pianissimo", archetype: "strategist", eco: "C50", description: "The classical Italian.", moves: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Bc5", "c3", "Nf6", "d3", "d6"] },
  { slug: "scandinavian-mainline", name: "Scandinavian Defense — Mainline", archetype: "trickster", eco: "B01", description: "Strike at the center immediately.", moves: ["e4", "d5", "exd5", "Qxd5", "Nc3", "Qa5", "d4", "Nf6", "Nf3", "c6"] },
  { slug: "caro-kann-classical", name: "Caro-Kann Defense — Classical", archetype: "defender", eco: "B18", description: "A rock-solid reply to 1.e4.", moves: ["e4", "c6", "d4", "d5", "Nc3", "dxe4", "Nxe4", "Bf5", "Ng3", "Bg6"] },
  { slug: "evans-gambit", name: "Evans Gambit", archetype: "warrior", eco: "C51", description: "Sacrifice a pawn for a furious attack.", moves: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Bc5", "b4", "Bxb4", "c3", "Ba5"] },
  { slug: "kings-gambit", name: "King's Gambit Accepted", archetype: "warrior", eco: "C37", description: "Offer the f-pawn for a roaring attack.", moves: ["e4", "e5", "f4", "exf4", "Nf3", "g5", "Bc4", "Bg7", "d4", "d6"] },
  { slug: "sicilian-dragon", name: "Sicilian Defense — Dragon", archetype: "warrior", eco: "B70", description: "Fianchetto the dragon bishop.", moves: ["e4", "c5", "Nf3", "d6", "d4", "cxd4", "Nxd4", "Nf6", "Nc3", "g6"] },
  { slug: "queens-gambit-declined", name: "Queen's Gambit Declined", archetype: "strategist", eco: "D35", description: "A classical, rock-solid centre.", moves: ["d4", "d5", "c4", "e6", "Nc3", "Nf6", "Bg5", "Be7", "e3", "O-O"] },
  { slug: "london-system", name: "London System", archetype: "strategist", eco: "D02", description: "A reliable setup against anything.", moves: ["d4", "d5", "Nf3", "Nf6", "Bf4", "e6", "e3", "c5", "c3", "Nc6"] },
  { slug: "slav-defense", name: "Slav Defense", archetype: "defender", eco: "D17", description: "Support the centre with c6.", moves: ["d4", "d5", "c4", "c6", "Nf3", "Nf6", "Nc3", "dxc4", "a4", "Bf5"] },
  { slug: "french-defense", name: "French Defense — Classical", archetype: "defender", eco: "C11", description: "A sturdy pawn chain.", moves: ["e4", "e6", "d4", "d5", "Nc3", "Nf6", "Bg5", "Be7", "e5", "Nfd7"] },
  { slug: "budapest-gambit", name: "Budapest Gambit", archetype: "trickster", eco: "A52", description: "A surprise gambit against 1.d4.", moves: ["d4", "Nf6", "c4", "e5", "dxe5", "Ng4", "Nf3", "Nc6", "Bf4", "Bb4"] },
  { slug: "englund-gambit", name: "Englund Gambit", archetype: "trickster", eco: "A40", description: "A cheeky 1...e5 against 1.d4.", moves: ["d4", "e5", "dxe5", "Nc6", "Nf3", "Qe7", "Nc3", "Nxe5", "Nxe5", "Qxe5"] },
  { slug: "scotch-classical", name: "Scotch Game — Classical", archetype: "warrior", eco: "C45", description: "Open the centre with an early d4.", moves: ["e4", "e5", "Nf3", "Nc6", "d4", "exd4", "Nxd4", "Bc5", "Be3", "Qf6"] },
  { slug: "smith-morra-gambit", name: "Smith-Morra Gambit — Accepted", archetype: "warrior", eco: "B21", description: "A pawn for fast, furious development.", moves: ["e4", "c5", "d4", "cxd4", "c3", "dxc3", "Nxc3", "Nc6", "Nf3", "d6"] },
  { slug: "ruy-lopez-closed", name: "Ruy Lopez — Closed", archetype: "strategist", eco: "C84", description: "The Spanish bishop pressures c6.", moves: ["e4", "e5", "Nf3", "Nc6", "Bb5", "a6", "Ba4", "Nf6", "O-O", "Be7"] },
  { slug: "nimzo-indian-rubinstein", name: "Nimzo-Indian — Rubinstein", archetype: "strategist", eco: "E40", description: "Pin the knight, fight for e4.", moves: ["d4", "Nf6", "c4", "e6", "Nc3", "Bb4", "e3", "O-O", "Bd3", "d5"] },
  { slug: "catalan-open", name: "Catalan — Mainline", archetype: "strategist", eco: "E01", description: "The g2 bishop cuts the board in half.", moves: ["d4", "Nf6", "c4", "e6", "g3", "d5", "Nf3", "Be7", "Bg2", "O-O"] },
  { slug: "english-four-knights", name: "English Opening — Four Knights", archetype: "strategist", eco: "A28", description: "Command the centre from the wing.", moves: ["c4", "e5", "Nc3", "Nf6", "Nf3", "Nc6", "g3", "d5", "cxd5", "Nxd5"] },
  { slug: "petroff-classical", name: "Petroff Defense — Classical", archetype: "defender", eco: "C42", description: "Answer every strike with its reflection.", moves: ["e4", "e5", "Nf3", "Nf6", "Nxe5", "d6", "Nf3", "Nxe4", "d4", "d5"] },
  { slug: "stafford-gambit", name: "Stafford Gambit — Mainline", archetype: "trickster", eco: "C42", description: "A knight as a gift — and a trap.", moves: ["e4", "e5", "Nf3", "Nf6", "Nxe5", "Nc6", "Nxc6", "dxc6", "d3", "Bc5"] },
  { slug: "blackmar-diemer-gambit", name: "Blackmar-Diemer Gambit — Accepted", archetype: "warrior", eco: "D00", description: "Two pawns for an open f-file on fire.", moves: ["d4", "d5", "e4", "dxe4", "Nc3", "Nf6", "f3", "exf3", "Nxf3", "g6"] },
];

function fenAfter(moves, ply) {
  const g = new Chess();
  for (let i = 0; i < ply; i++) g.move(moves[i]);
  return g.fen();
}

const sql = neon(process.env.DATABASE_URL);

const existingSlugs = new Set((await sql`select slug from path_templates`).map((r) => r.slug));
const existingFens = new Set((await sql`select fen from nodes`).map((r) => r.fen));

let addedPaths = 0;
let addedNodes = 0;

for (const p of PATHS) {
  if (existingSlugs.has(p.slug)) continue; // already seeded

  const inserted = await sql`
    insert into path_templates (slug, name, archetype, description)
    values (${p.slug}, ${p.name}, ${p.archetype}, ${p.description})
    returning id`;
  const pathId = inserted[0].id;
  addedPaths += 1;

  for (let ply = 0; ply < p.moves.length; ply++) {
    const fen = fenAfter(p.moves, ply);
    if (existingFens.has(fen)) continue; // position already owned by another line
    existingFens.add(fen);
    await sql`
      insert into nodes (path_template_id, fen, move, is_player_move, eco)
      values (${pathId}, ${fen}, ${p.moves[ply]}, true, ${p.eco})`;
    addedNodes += 1;
  }
}

console.log(`Seed: +${addedPaths} path_templates, +${addedNodes} nodes (now ${existingSlugs.size + addedPaths} openings).`);
