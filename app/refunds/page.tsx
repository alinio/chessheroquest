/**
 * /refunds — Refund Policy (required by Paddle domain review, linked from the
 * footer). Paddle is the Merchant of Record and processes all refunds.
 */
import type { Metadata } from "next";
import { LegalPage, H2 } from "@/src/ui/legal/LegalPage";
import { LEGAL } from "@/src/lib/legal";

export const metadata: Metadata = {
  title: "Refund Policy — ChessHeroQuest",
  description: "Refund policy for ChessHeroQuest Pro subscriptions and lifetime purchases.",
};

export default function RefundsPage() {
  return (
    <LegalPage title="Refund Policy">
      <H2>14-day money-back guarantee</H2>
      <p>
        If ChessHeroQuest Pro isn&apos;t for you, tell us within <b style={{ color: "#E9E9EE" }}>14 days
        of your first purchase</b> (monthly, yearly or lifetime) and we&apos;ll refund it in full —
        no questions asked.
      </p>

      <H2>EU &amp; UK consumers</H2>
      <p>
        Consumers in the EU/UK additionally benefit from the statutory 14-day right of withdrawal
        for digital services. By starting to use Pro features immediately you consent to the service
        beginning during the withdrawal period; this does not affect our voluntary guarantee above.
      </p>

      <H2>Renewals</H2>
      <p>
        Subscription renewals are not automatically refundable, but if a renewal charged before you
        meant to cancel, contact us within 14 days of the renewal date and we&apos;ll make it right.
        You can cancel future renewals at any time — access then runs to the end of the paid period.
      </p>

      <H2>How to request a refund</H2>
      <p>
        Payments are processed by Paddle.com, the Merchant of Record for all orders. Two equally
        valid routes:
      </p>
      <p>
        1. Email us at <a href={`mailto:${LEGAL.contactEmail}`} style={{ color: "#D9A227" }}>{LEGAL.contactEmail}</a> with
        the email used at checkout — we&apos;ll trigger the refund with Paddle.<br />
        2. Use the link in your Paddle receipt email or contact Paddle directly at{" "}
        <a href="https://paddle.net" style={{ color: "#D9A227" }} rel="noreferrer" target="_blank">paddle.net</a>.
      </p>
      <p>
        Refunds are returned to the original payment method, normally within 5–10 business days
        depending on your bank.
      </p>

      <H2>Abuse</H2>
      <p>
        We reserve the right to refuse repeated refund requests that indicate abuse of the guarantee
        (e.g. repeatedly purchasing, consuming the full content, and refunding).
      </p>
    </LegalPage>
  );
}
