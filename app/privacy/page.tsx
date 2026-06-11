/**
 * /privacy — Privacy Policy (GDPR — controller is the legal entity; Paddle
 * domain review requires it clearly accessible from the site navigation).
 */
import type { Metadata } from "next";
import { LegalPage, H2 } from "@/src/ui/legal/LegalPage";
import { LEGAL } from "@/src/lib/legal";

export const metadata: Metadata = {
  title: "Privacy Policy — ChessHeroQuest",
  description: "How ChessHeroQuest collects, uses and protects your data.",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <H2>Who is responsible</H2>
      <p>
        The data controller is <b style={{ color: "#E9E9EE" }}>{LEGAL.entity}</b>, {LEGAL.address}.
        Privacy questions, access or deletion requests:{" "}
        <a href={`mailto:${LEGAL.contactEmail}`} style={{ color: "#D9A227" }}>{LEGAL.contactEmail}</a>.
      </p>

      <H2>What we collect</H2>
      <p>
        You can take the Chess DNA Test anonymously — results live in your browser only. If you
        create an account (passwordless, by email) we store: your email address, your training
        progress (Opening IQ history, archetype, opening lines studied, spaced-repetition schedule,
        streak and XP), your plan status, and — only if you choose to connect them — your{" "}
        <b style={{ color: "#E9E9EE" }}>public</b> Lichess / Chess.com usernames, used to fetch your
        public rated games for your own analytics. No passwords, no chess-platform tokens.
      </p>

      <H2>What we use it for</H2>
      <p>
        Operating the service (your progression IS the product), sending the emails you opted into
        (sign-in links always; training summaries only with your consent — one click to stop),
        improving the product through aggregated usage events, and billing.
      </p>

      <H2>Processors we rely on</H2>
      <p>
        Paddle.com (Merchant of Record — sees your payment details, we never do), Vercel (hosting),
        Neon (database), Resend (transactional email), and Sentry (error monitoring). Each receives
        only what its job requires.
      </p>

      <H2>Minors</H2>
      <p>
        ChessHeroQuest is age-appropriate by design. Profiles are private by default and we never sell or advertise on personal
        data. Players under the digital-consent age of their country should use the service with
        parental consent.
      </p>

      <H2>Cookies &amp; local storage</H2>
      <p>
        We use a session cookie for sign-in and browser local storage for your anonymous test
        progress and preferences. No third-party advertising trackers.
      </p>

      <H2>Your rights (GDPR)</H2>
      <p>
        Access, rectification, deletion, portability, restriction and objection — email us and we
        respond within 30 days. Deleting your account removes your personal data; anonymized,
        aggregated statistics may be retained. You can also complain to your supervisory authority
        (in France: the CNIL).
      </p>

      <H2>Retention</H2>
      <p>
        Account data is kept while your account is active and deleted on request. Billing records
        are kept as long as French law requires. Inactive accounts may be purged after extended
        inactivity, with notice.
      </p>
    </LegalPage>
  );
}
