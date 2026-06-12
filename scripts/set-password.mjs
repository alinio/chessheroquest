/**
 * Create-or-update an account with an email + password (scrypt, same format
 * as src/lib/password.ts: "saltHex:hashHex"). Run by a human, on purpose.
 *
 *   node --env-file=.env.local scripts/set-password.mjs <email> <password>
 */
import { neon } from "@neondatabase/serverless";
import { scrypt as scryptCb, randomBytes } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCb);

const [email, password] = process.argv.slice(2);
if (!email || !password) {
  console.error("Usage: node --env-file=.env.local scripts/set-password.mjs <email> <password>");
  process.exit(1);
}

const salt = randomBytes(16);
const hash = await scrypt(password, salt, 64);
const passwordHash = `${salt.toString("hex")}:${hash.toString("hex")}`;
const normalized = email.trim().toLowerCase();

const sql = neon(process.env.DATABASE_URL);
const existing = await sql`SELECT id FROM users WHERE lower(email) = ${normalized}`;

if (existing.length > 0) {
  await sql`UPDATE users SET password_hash = ${passwordHash}, updated_at = now() WHERE id = ${existing[0].id}`;
  console.log(`✓ password updated for ${normalized}`);
} else {
  const rows = await sql`INSERT INTO users (email, password_hash) VALUES (${normalized}, ${passwordHash}) RETURNING id`;
  console.log(`✓ account created for ${normalized} (${rows[0].id})`);
}
console.log("Sign in at /signin with this email + password.");
