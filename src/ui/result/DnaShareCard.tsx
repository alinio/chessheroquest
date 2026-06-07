import type { CSSProperties } from "react";

/**
 * The shareable DNA Card, laid out at EXACTLY 1080×1350 (4:5) for export
 * (art-bible §3.3). Export-safe: solid colors only — no background-clip:text and
 * no url(#gradient) refs (both rasterize unreliably). Self-contained so the PNG is
 * never broken/unstyled. The crest is a coded fallback (accent disc + crown);
 * TODO: real crest art at public/art/heroes/crest-{archetype}.webp.
 */
const DISPLAY = "var(--font-cinzel), Georgia, serif";
const BODY = "var(--font-inter), system-ui, sans-serif";

export interface DnaShareCardProps {
  iq: number;
  topPercent: number;
  archetypeLabel: string;
  accent: string;
  strongestOpening: string;
  weakestOpening: string;
  tagline: string;
}

function CrownGlyph({ size = 96 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#D9A227" d="M3 17 L2.4 6 L7 11 L12 4 L17 11 L21.6 6 L21 17 Z" />
      <path fill="#D9A227" d="M2.8 17 h18.4 v2.1 a1 1 0 0 1-1 1 H3.8 a1 1 0 0 1-1-1 Z" />
      <circle cx="2.4" cy="6" r="1.5" fill="#FCEBB6" />
      <circle cx="21.6" cy="6" r="1.5" fill="#FCEBB6" />
      <circle cx="12" cy="3.7" r="1.7" fill="#FCEBB6" />
    </svg>
  );
}

function Panel({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        flex: 1,
        background: "#14141A",
        border: "1px solid #1C1C22",
        borderRadius: 18,
        padding: "28px 24px",
        textAlign: "center",
      }}
    >
      <div style={{ fontFamily: BODY, fontSize: 22, letterSpacing: "0.14em", textTransform: "uppercase", color: "#6E6E78" }}>
        {label}
      </div>
      <div style={{ fontFamily: DISPLAY, fontSize: 38, color: "#E9E9EE", marginTop: 10, lineHeight: 1.15 }}>{value}</div>
    </div>
  );
}

const caps: CSSProperties = { fontFamily: BODY, letterSpacing: "0.18em", textTransform: "uppercase" };

export function DnaShareCard({ iq, topPercent, archetypeLabel, accent, strongestOpening, weakestOpening, tagline }: DnaShareCardProps) {
  return (
    <div
      style={{
        width: 1080,
        height: 1350,
        background: "radial-gradient(900px 500px at 50% 0%, rgba(217,162,39,0.06), transparent 60%), #08080A",
        boxSizing: "border-box",
        padding: 56,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
          background: "#0D0D10",
          border: `3px solid ${accent}`,
          borderRadius: 28,
          padding: "64px 56px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ ...caps, fontSize: 26, color: "#6E6E78" }}>Your Chess DNA</div>

        {/* Crest (coded fallback) */}
        <div
          style={{
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: `radial-gradient(circle at 50% 38%, ${accent}, #0D0D10 78%)`,
            border: `2px solid ${accent}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CrownGlyph size={104} />
        </div>

        <div style={{ fontFamily: DISPLAY, fontSize: 64, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: "0.04em", textAlign: "center" }}>
          {archetypeLabel}
        </div>

        <div style={{ textAlign: "center" }}>
          <div style={{ ...caps, fontSize: 26, color: "#A7A7B2" }}>Opening IQ</div>
          <div style={{ fontFamily: DISPLAY, fontSize: 200, fontWeight: 700, color: "#F3CF77", lineHeight: 1 }}>{iq}</div>
          <div style={{ fontFamily: BODY, fontSize: 30, color: "#A7A7B2", marginTop: 8 }}>Top {topPercent}%</div>
        </div>

        <div style={{ display: "flex", gap: 24, width: "100%" }}>
          <Panel label="Best Opening" value={strongestOpening} />
          <Panel label="Biggest Weakness" value={weakestOpening} />
        </div>

        <div style={{ fontFamily: BODY, fontSize: 26, color: "#A7A7B2", textAlign: "center", fontStyle: "italic" }}>{tagline}</div>

        <div style={{ ...caps, fontSize: 24, color: "#6E6E78" }}>chessheroquest.com</div>
      </div>
    </div>
  );
}
