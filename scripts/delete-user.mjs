/**
 * Delete test accounts by email (cascade wipes all user-owned rows: cards,
 * IQ snapshots, DNA results, achievements, quests, training events, …).
 *
 *   node --env-file=.env.local scripts/delete-user.mjs email1 [email2 …]
 *
 * Run by a human, on purpose — never from app code.
 */
import { neon } from "@neondatabase/serverless";

const emails = process.argv.slice(2).map((e) => e.trim().toLowerCase()).filter(Boolean);
if (emails.length === 0) {
  console.error("Usage: node --env-file=.env.local scripts/delete-user.mjs <email> [email …]");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

for (const email of emails) {
  const rows = await sql`SELECT id, email FROM users WHERE lower(email) = ${email}`;
  if (rows.length === 0) {
    console.log(`— ${email}: no account found`);
    continue;
  }
  for (const u of rows) {
    const deleted = await sql`DELETE FROM users WHERE id = ${u.id} RETURNING email`;
    console.log(`✓ deleted ${deleted[0].email} (${u.id}) — all owned rows cascaded`);
  }
}
console.log("Done.");
