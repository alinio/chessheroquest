/**
 * /hero-select — STUB. Replaced by Module 5 (Hero Select: recommended hero free +
 * the other 3 Pro-locked). M4's result CTA routes here.
 */
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Choose your Hero — ChessHeroQuest" };

export default function HeroSelectStub() {
  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        textAlign: "center",
        padding: 24,
        background: "#08080A",
        color: "#E9E9EE",
        fontFamily: "var(--font-cinzel), serif",
      }}
    >
      <p style={{ fontSize: 12, letterSpacing: ".2em", textTransform: "uppercase", color: "#6E6E78" }}>Module 5</p>
      <h1 style={{ fontSize: 28, color: "#D9A227" }}>Hero Select — coming next</h1>
      <a href="/result" style={{ color: "#A7A7B2", fontSize: 14 }}>
        ← Back to your DNA
      </a>
    </main>
  );
}
