/** /privacy — minimal privacy policy so tester links resolve (M9c). TODO: legal review. */
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Privacy — ChessHeroQuest", robots: { index: false } };

export default function PrivacyPage() {
  return (
    <main style={{ minHeight: "100dvh", background: "#08080A", color: "#A7A7B2", maxWidth: 720, margin: "0 auto", padding: "48px 24px", fontFamily: "var(--font-inter), system-ui, sans-serif", lineHeight: 1.7 }}>
      <h1 style={{ fontFamily: "var(--font-cinzel), serif", color: "#D9A227", fontSize: 28 }}>Privacy Policy</h1>
      <p style={{ color: "#6E6E78", fontSize: 13 }}>Draft for the closed test — pending legal review.</p>
      <h2 style={{ color: "#E9E9EE", fontSize: 18, marginTop: 24 }}>What we collect</h2>
      <p>You can take the Chess DNA Test and play with no account. If you choose to save your progress, we store your email and your in-app progress (Opening IQ, archetype, hero, opening progress, spaced-repetition schedule, streak/XP, plan).</p>
      <h2 style={{ color: "#E9E9EE", fontSize: 18, marginTop: 24 }}>Payments</h2>
      <p>Subscriptions are handled by Paddle, our payment processor. We never see or store your card details.</p>
      <h2 style={{ color: "#E9E9EE", fontSize: 18, marginTop: 24 }}>What we don&apos;t do</h2>
      <p>We don&apos;t sell your data. Anonymous, non-identifying gameplay events help us improve the product.</p>
      <h2 style={{ color: "#E9E9EE", fontSize: 18, marginTop: 24 }}>Contact</h2>
      <p>Questions or deletion requests: <a href="mailto:alain@monkeoz.com" style={{ color: "#D9A227" }}>alain@monkeoz.com</a>.</p>
      <p style={{ marginTop: 32 }}><Link href="/" style={{ color: "#A7A7B2" }}>← Home</Link></p>
    </main>
  );
}
