/**
 * Transactional email via Resend (plain REST — same pattern as the magic link,
 * no SDK dependency). Without RESEND_API_KEY the send is logged and skipped,
 * never thrown — email must not take down a request path.
 */

const BRAND_WRAP = (inner: string) => `
<div style="margin:0;padding:32px 16px;background:#0a0812;font-family:Helvetica,Arial,sans-serif;">
  <div style="max-width:520px;margin:0 auto;background:linear-gradient(180deg,#1e1730,#171120);border:1px solid rgba(205,168,69,.28);border-radius:16px;padding:32px 28px;color:#ece3cf;">
    <p style="margin:0 0 18px;font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:#cda845;">ChessHeroQuest</p>
    ${inner}
    <p style="margin:26px 0 0;font-size:11px;color:#6f6757;">You receive this because you opted in to training updates.
    Manage preferences from your profile at chessheroquest.com.</p>
  </div>
</div>`;

export interface SendEmailInput {
  to: string;
  subject: string;
  /** Inner HTML — wrapped in the branded dark/gold shell automatically. */
  html: string;
}

/** Returns true when actually sent (false = no key / provider error, logged). */
export async function sendEmail({ to, subject, html }: SendEmailInput): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log(`[email skipped — no RESEND_API_KEY] ${subject} → ${to}`);
    return false;
  }
  const from = process.env.RESEND_FROM ?? "ChessHeroQuest <onboarding@resend.dev>";
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({ from, to, subject, html: BRAND_WRAP(html) }),
    });
    if (!res.ok) console.log(`[email failed ${res.status}] ${subject} → ${to}`);
    return res.ok;
  } catch {
    console.log(`[email network error] ${subject} → ${to}`);
    return false;
  }
}
