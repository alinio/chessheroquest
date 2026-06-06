/**
 * Seed the opening tree: path_templates + nodes (one node per unique position).
 * Reference data so FSRS cards can be keyed to real positions. Idempotent —
 * skips if already seeded. Run with network access to the DB:
 *
 *   node --env-file=.env.local scripts/seed-openings.mjs
 *
 * Self-contained ESM (chess.js + @neondatabase/serverless). The curated lines
 * MIRROR src/domain/repertoire/starter-paths.ts — keep them in sync.
 */
import { Chess } from "chess.js";
import { neon } from "@neondatabase/serverless";

const PATHS = [
  { slug: "italian-giuoco-pianissimo", name: "Italian Game — Giuoco Pianissimo", archetype: "strategist", eco: "C50", description: "The classical Italian.", moves: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Bc5", "c3", "Nf6", "d3", "d6"] },
  { slug: "scandinavian-mainline", name: "Scandinavian Defense — Mainline", archetype: "trickster", eco: "B01", description: "Strike at the center immediately.", moves: ["e4", "d5", "exd5", "Qxd5", "Nc3", "Qa5", "d4", "Nf6", "Nf3", "c6"] },
  { slug: "caro-kann-classical", name: "Caro-Kann Defense — Classical", archetype: "defender", eco: "B18", description: "A rock-solid reply to 1.e4.", moves: ["e4", "c6", "d4", "d5", "Nc3", "dxe4", "Nxe4", "Bf5", "Ng3", "Bg6"] },
  { slug: "evans-gambit", name: "Evans Gambit", archetype: "warrior", eco: "C51", description: "Sacrifice a pawn for a furious attack.", moves: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Bc5", "b4", "Bxb4", "c3", "Ba5"] },
];

function fenAfter(moves, ply) {
  const g = new Chess();
  for (let i = 0; i < ply; i++) g.move(moves[i]);
  return g.fen();
}

const sql = neon(process.env.DATABASE_URL);

const existing = await sql`select count(*)::int c from path_templates`;
if (existing[0].c > 0) {
  console.log(`Already seeded (${existing[0].c} path_templates) — skipping.`);
  process.exit(0);
}

const seenFen = new Set();
let nodeCount = 0;

for (const p of PATHS) {
  const inserted = await sql`
    insert into path_templates (slug, name, archetype, description)
    values (${p.slug}, ${p.name}, ${p.archetype}, ${p.description})
    returning id`;
  const pathId = inserted[0].id;

  for (let ply = 0; ply < p.moves.length; ply++) {
    const fen = fenAfter(p.moves, ply);
    if (seenFen.has(fen)) continue; // one node per unique position
    seenFen.add(fen);
    await sql`
      insert into nodes (path_template_id, fen, move, is_player_move, eco)
      values (${pathId}, ${fen}, ${p.moves[ply]}, true, ${p.eco})`;
    nodeCount += 1;
  }
}

console.log(`Seeded ${PATHS.length} path_templates and ${nodeCount} nodes.`);
