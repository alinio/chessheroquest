import Link from "next/link";
import "@/src/ui/design-system/theme.css";
import { inter } from "@/src/ui/design-system/fonts";

const LINKS: [string, string][] = [
  ["/dev/screens/welcome", "★ Arrival dashboard — one-time orientation (post-payment)"],
  ["/dev/screens/today", "Today / Dashboard — daily loop"],
  ["/dev/screens/quest-map", "Quest Map — realm hub + node medallions"],
  ["/dev/screens/opening/ruy-lopez", "Opening detail — Ruy Lopez (banner + boss)"],
  ["/dev/screens/boss-fight", "Boss Fight — arena + guardian"],
  ["/dev/screens/passport", "Passport — seals (mastered/locked)"],
  ["/dev/screens/dna-results", "DNA Results (S2) — reveal + DNA card"],
];

export default function DevScreensIndex() {
  if (process.env.NODE_ENV === "production") {
    return <div style={{ padding: 40, color: "#aaa", fontFamily: "system-ui" }}>/dev/screens is dev-only.</div>;
  }
  return (
    <div className={`chq-root ${inter.variable}`} style={{ minHeight: "100dvh", padding: "40px 24px", maxWidth: 720, margin: "0 auto" }}>
      <h1 className="chq-display chq-gold-text" style={{ fontSize: 26, fontWeight: 700 }}>Dev Screens</h1>
      <p style={{ color: "var(--chq-text-muted)", fontSize: 13, marginBottom: 20 }}>Real screen components fed by demo fixtures — no auth/onboarding.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {LINKS.map(([href, label]) => (
          <Link key={href} href={href} style={{ display: "block", background: "var(--chq-panel)", border: "1px solid var(--chq-gold-4)", borderRadius: "var(--chq-r-panel)", padding: "14px 16px", color: "var(--chq-text-1)", fontSize: 15, textDecoration: "none" }}>
            {label} <span style={{ color: "var(--chq-text-muted)", fontSize: 12 }}>· {href}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
