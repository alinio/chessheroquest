/**
 * Magic-link issuance — the ONE implementation of the passwordless sign-in
 * link (token mint + account_states upsert + email send). Consumed by
 * POST /api/account/request-link (player self-service) and by the admin
 * "Send magic link" action (Phase B). Never duplicate this logic.
 */
import { createHash, randomBytes } from "node:crypto";
import { db } from "@/src/data/db";
import { accountStates } from "@/db/schema";

/**
 * Mint a single-use token (15 min), persist its hash on account_states and
 * email the sign-in link. The raw token only ever lives in the link.
 */
export async function issueMagicLink(emailRaw: string, origin: string): Promise<void> {
  const email = emailRaw.toLowerCase();
  const token = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const tokenExpires = new Date(Date.now() + 15 * 60 * 1000);

  await db
    .insert(accountStates)
    .values({ email, tokenHash, tokenExpires })
    .onConflictDoUpdate({ target: accountStates.email, set: { tokenHash, tokenExpires } });

  const link = `${origin}/api/account/verify?email=${encodeURIComponent(email)}&token=${token}`;
  await sendMagicLink(email, link);
}

/**
 * Email the magic link via Resend when configured; otherwise fall back to the dev
 * console-link. To onboard real testers: set RESEND_API_KEY + RESEND_FROM (a
 * verified-domain sender). No new dependency — plain REST call.
 */
async function sendMagicLink(to: string, link: string): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log(`\n🔗 ChessHeroQuest magic link for ${to}:\n${link}\n`);
    return;
  }
  const from = process.env.RESEND_FROM ?? "ChessHeroQuest <onboarding@resend.dev>";
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({
        from,
        to,
        subject: "Your ChessHeroQuest sign-in link",
        html: `<p>Sign in to ChessHeroQuest:</p><p><a href="${link}">${link}</a></p><p>This link expires in 15 minutes. If you didn't request it, ignore this email.</p>`,
      }),
    });
    if (!res.ok) console.log(`Resend send failed (${res.status}); link for ${to}: ${link}`);
  } catch {
    console.log(`Resend send error; link for ${to}: ${link}`);
  }
}
