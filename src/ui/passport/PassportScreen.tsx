"use client";

/**
 * Passport / Collection (in-app-architecture §4.7). Cover header + the 20-opening
 * grid where each entry shows the emblem + a mastered/locked stamp. Props-driven.
 */
import "@/src/ui/design-system/theme.css";
import { inter } from "@/src/ui/design-system/fonts";
import { GradientDefs } from "@/src/ui/design-system/icons";
import { ASSETS, getOpeningArt, PLACEHOLDER } from "@/src/lib/assets";
import type { DemoOpening } from "@/src/dev/fixtures";

const eyebrow = { fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase" } as const;

export function PassportScreen({ openings }: { openings: DemoOpening[] }) {
  const mastered = openings.filter((o) => o.mastered).length;

  return (
    <div className={`chq-root chq-parchment ${inter.variable}`} style={{ minHeight: "100dvh" }}>
      <GradientDefs />
      <main style={{ maxWidth: 760, margin: "0 auto", padding: "0 16px 56px" }}>
        {/* cover header */}
        <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 7", marginBottom: 16 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ASSETS.passport.cover} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", borderRadius: "0 0 var(--chq-r-card) var(--chq-r-card)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(8,8,10,.2), rgba(8,8,10,.85))", borderRadius: "0 0 var(--chq-r-card) var(--chq-r-card)" }} />
          <div style={{ position: "absolute", left: 20, bottom: 16 }}>
            <p style={{ ...eyebrow, color: "var(--chq-gold-3)", fontSize: 10 }}>Opening Passport</p>
            <p className="chq-display chq-gold-text" style={{ fontSize: 26, fontWeight: 700, margin: "2px 0 0" }}>{mastered} / {openings.length} sealed</p>
          </div>
        </div>

        {/* grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12 }}>
          {openings.map((o) => {
            const art = getOpeningArt(o.id);
            return (
              <div key={o.id} style={{ background: "var(--chq-panel)", border: `1px solid ${o.mastered ? "var(--chq-gold-4)" : "var(--chq-line)"}`, borderRadius: "var(--chq-r-panel)", padding: 14, textAlign: "center", position: "relative" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={art?.emblem ?? PLACEHOLDER} alt="" style={{ width: 56, height: 56, objectFit: "contain", margin: "0 auto", display: "block", opacity: o.mastered ? 1 : 0.4, filter: o.mastered ? undefined : "grayscale(1)" }} />
                {/* stamp overlay */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={o.mastered ? ASSETS.passport.stampMastered : ASSETS.passport.stampLocked} alt={o.mastered ? "mastered" : "locked"} style={{ position: "absolute", right: 8, top: 8, width: 26, height: 26, objectFit: "contain" }} />
                <p style={{ color: o.mastered ? "var(--chq-text-1)" : "var(--chq-text-muted)", fontSize: 12, marginTop: 8 }}>{o.name}</p>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
