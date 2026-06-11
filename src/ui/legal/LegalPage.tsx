import type { ReactNode } from "react";
import Link from "next/link";
import { LEGAL } from "@/src/lib/legal";

/** Shared shell for the legal pages (Terms / Refunds / Privacy) — Paddle
 *  domain review requires them clearly accessible and consistently presented. */
export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main style={{ minHeight: "100dvh", background: "#08080A", color: "#A7A7B2", fontFamily: "var(--font-manrope), system-ui, sans-serif", lineHeight: 1.7 }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 64px" }}>
        <h1 style={{ fontFamily: "var(--font-cinzel), serif", color: "#D9A227", fontSize: 30 }}>{title}</h1>
        <p style={{ color: "#6E6E78", fontSize: 13 }}>
          {LEGAL.product} is operated by {LEGAL.entity}, {LEGAL.address}. Last updated: {LEGAL.lastUpdated}.
        </p>
        {children}
        <nav style={{ marginTop: 40, display: "flex", gap: 18, flexWrap: "wrap", borderTop: "1px solid #1E1E26", paddingTop: 18, fontSize: 14 }}>
          <Link href="/" style={{ color: "#A7A7B2" }}>← Home</Link>
          <Link href="/terms" style={{ color: "#A7A7B2" }}>Terms &amp; Conditions</Link>
          <Link href="/refunds" style={{ color: "#A7A7B2" }}>Refund Policy</Link>
          <Link href="/privacy" style={{ color: "#A7A7B2" }}>Privacy Policy</Link>
          <Link href="/pricing" style={{ color: "#A7A7B2" }}>Pricing</Link>
        </nav>
      </div>
    </main>
  );
}

export const H2 = ({ children }: { children: ReactNode }) => (
  <h2 style={{ color: "#E9E9EE", fontSize: 19, marginTop: 28 }}>{children}</h2>
);
