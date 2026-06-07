/**
 * Grant Premium (lifetime) to an email + mint a direct magic-link sign-in URL.
 *   node --env-file=.env.local scripts/grant-premium.mjs <email>
 * Founder/tester comp utility — writes account_states (server-verified Pro).
 * No password auth exists (magic-link only); this mints a ready sign-in link.
 */
import { neon } from "@neondatabase/serverless";
import { createHash, randomBytes } from "node:crypto";

const email = (process.argv[2] ?? "alain.abulafya@gmail.com").toLowerCase();
const ORIGIN = process.env.ORIGIN ?? "https://chessheroquest.com";
const sql = neon(process.env.DATABASE_URL);

const token = randomBytes(32).toString("hex");
const tokenHash = createHash("sha256").update(token).digest("hex");
const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30-day window

await sql`
  INSERT INTO account_states (email, token_hash, token_expires, is_pro, plan, state, updated_at)
  VALUES (${email}, ${tokenHash}, ${expires}, true, 'lifetime', '{}'::jsonb, now())
  ON CONFLICT (email) DO UPDATE
  SET token_hash = ${tokenHash}, token_expires = ${expires}, is_pro = true, plan = 'lifetime', updated_at = now()
`;

const link = `${ORIGIN}/api/account/verify?email=${encodeURIComponent(email)}&token=${token}`;
console.log(`✅ ${email} → Premium (lifetime), is_pro=true`);
console.log(`🔑 One-click sign-in (single-use, valid 30 days):\n${link}`);
