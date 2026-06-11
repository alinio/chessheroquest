/**
 * /terms — Terms & Conditions (Paddle domain review: legal entity named,
 * product described, billing via Paddle as Merchant of Record, linked from
 * the site footer alongside the Refund and Privacy policies).
 */
import type { Metadata } from "next";
import { LegalPage, H2 } from "@/src/ui/legal/LegalPage";
import { LEGAL } from "@/src/lib/legal";

export const metadata: Metadata = {
  title: "Terms & Conditions — ChessHeroQuest",
  description: "Terms and Conditions for ChessHeroQuest, the chess-openings training game.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms & Conditions">
      <H2>1. Who we are</H2>
      <p>
        ChessHeroQuest (chessheroquest.com) is a chess-openings training service published and
        operated by <b style={{ color: "#E9E9EE" }}>{LEGAL.entity}</b>, {LEGAL.address} (&ldquo;we&rdquo;,
        &ldquo;us&rdquo;). Contact: <a href={`mailto:${LEGAL.contactEmail}`} style={{ color: "#D9A227" }}>{LEGAL.contactEmail}</a>.
      </p>

      <H2>2. The service</H2>
      <p>
        ChessHeroQuest helps chess players learn, drill and retain chess openings: a free Chess DNA
        Test (8 positions) that estimates your provisional Opening IQ, guided opening lines with
        move-by-move explanations, spaced-repetition drills, Guardian duels that test lines from
        memory, and progress analytics (optionally enriched with your public Lichess / Chess.com
        games). Chess evaluations come from established engines and databases — never invented.
      </p>

      <H2>3. Plans &amp; pricing</H2>
      <p>
        The Free plan includes your recommended hero and its first opening lines. The Pro plan
        (monthly, yearly, or one-time lifetime) unlocks all four heroes, all openings and lines,
        Hard mode, and the full toolset. Current prices are always displayed on our{" "}
        <a href="/pricing" style={{ color: "#D9A227" }}>pricing page</a> and at checkout before you pay.
      </p>

      <H2>4. Billing — Paddle as Merchant of Record</H2>
      <p>
        Our order process is conducted by our online reseller Paddle.com. Paddle.com is the
        Merchant of Record for all our orders. Paddle provides all customer service inquiries
        related to payments and handles returns. Your invoice and payment receipt come from Paddle.
      </p>
      <p>
        Subscriptions renew automatically at the end of each billing period. You can cancel at any
        time from your account or via the link in your Paddle receipt; cancellation stops future
        renewals and Pro access continues until the end of the paid period. The lifetime plan is a
        one-time payment with no renewal.
      </p>

      <H2>5. Refunds</H2>
      <p>
        See our <a href="/refunds" style={{ color: "#D9A227" }}>Refund Policy</a>. In short: a 14-day
        money-back guarantee on first purchases, and EU/UK consumers keep their statutory withdrawal
        rights.
      </p>

      <H2>6. Accounts &amp; eligibility</H2>
      <p>
        Sign-in is passwordless (magic link by email). You are responsible for the accuracy of the
        email address on your account. The service is designed to be age-appropriate; if you are
        under 15 (or the digital-consent age of your country), use ChessHeroQuest with the consent
        of a parent or guardian — profiles of minors are private by default.
      </p>

      <H2>7. Fair use</H2>
      <p>
        Don&apos;t abuse, resell, scrape, reverse-engineer or attempt to disrupt the service, and
        don&apos;t use automation to manipulate scores or rewards. Opening IQ is designed to reflect
        real skill; gaming it defeats the product and may lead to account suspension.
      </p>

      <H2>8. Intellectual property</H2>
      <p>
        The ChessHeroQuest name, artwork, characters (Guardians, realms), texts and software are the
        property of {LEGAL.entity} or its licensors. Chess theory itself belongs to everyone — our
        curated lines, explanations and presentation are ours. You get a personal, non-transferable
        right to use the service; nothing more is assigned.
      </p>

      <H2>9. Availability &amp; liability</H2>
      <p>
        We work to keep the service fast and available but provide it &ldquo;as is&rdquo;, without
        warranty of uninterrupted availability. To the extent permitted by law, our liability is
        limited to the amounts you paid for the service in the 12 months preceding the claim.
        Nothing in these terms limits liability that cannot be limited under applicable law,
        including French consumer law.
      </p>

      <H2>10. Changes</H2>
      <p>
        We may update these terms as the product evolves; material changes will be announced on the
        site or by email. Continued use after a change means acceptance.
      </p>

      <H2>11. Governing law</H2>
      <p>
        These terms are governed by French law. Consumers benefit from any mandatory protections of
        their country of residence. Disputes go to the competent courts of Paris, France, unless
        mandatory consumer rules designate another venue. EU consumers may also use the European
        Commission&apos;s online dispute resolution platform.
      </p>
    </LegalPage>
  );
}
