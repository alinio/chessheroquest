/**
 * /world — STUB. Replaced by Module 6 (World Map + Opening Node + Learn + Drill).
 * M5's hero selection routes here.
 */
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Your World — ChessHeroQuest" };

export default function WorldStub() {
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
      <p style={{ fontSize: 12, letterSpacing: ".2em", textTransform: "uppercase", color: "#6E6E78" }}>Module 6</p>
      <h1 style={{ fontSize: 28, color: "#D9A227" }}>Your World — coming next</h1>
      <a href="/hero-select" style={{ color: "#A7A7B2", fontSize: 14 }}>← Back to Hero Select</a>
    </main>
  );
}
