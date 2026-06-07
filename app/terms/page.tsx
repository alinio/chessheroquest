/** /terms — minimal terms so tester links resolve (M9c). TODO: legal review. */
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Terms — ChessHeroQuest", robots: { index: false } };

export default function TermsPage() {
  return (
    <main style={{ minHeight: "100dvh", background: "#08080A", color: "#A7A7B2", maxWidth: 720, margin: "0 auto", padding: "48px 24px", fontFamily: "var(--font-inter), system-ui, sans-serif", lineHeight: 1.7 }}>
      <h1 style={{ fontFamily: "var(--font-cinzel), serif", color: "#D9A227", fontSize: 28 }}>Terms of Service</h1>
      <p style={{ color: "#6E6E78", fontSize: 13 }}>Draft for the closed test — pending legal review.</p>
      <h2 style={{ color: "#E9E9EE", fontSize: 18, marginTop: 24 }}>The gist</h2>
      <p>ChessHeroQuest is an early-access chess-openings trainer offered as-is during this closed test. Free access includes your recommended hero and its first opening; Pro unlocks all heroes, openings, Hard mode and the full toolset.</p>
      <h2 style={{ color: "#E9E9EE", fontSize: 18, marginTop: 24 }}>Billing</h2>
      <p>Pro is billed via Paddle (monthly, yearly, or one-time lifetime). You can cancel anytime; cancellation stops future renewals.</p>
      <h2 style={{ color: "#E9E9EE", fontSize: 18, marginTop: 24 }}>Fair use</h2>
      <p>Don&apos;t abuse, resell, or attempt to break the service. We may update these terms as the product leaves closed testing.</p>
      <h2 style={{ color: "#E9E9EE", fontSize: 18, marginTop: 24 }}>Contact</h2>
      <p><a href="mailto:alain@monkeoz.com" style={{ color: "#D9A227" }}>alain@monkeoz.com</a></p>
      <p style={{ marginTop: 32 }}><Link href="/" style={{ color: "#A7A7B2" }}>← Home</Link></p>
    </main>
  );
}
