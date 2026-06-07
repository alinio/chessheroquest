"use client";

/**
 * Opening / Kingdom detail (in-app-architecture §; screen-wireframe S7).
 * Banner hero + emblem crest + Boss-Fight entry (the realm's boss). Props-driven.
 */
import "@/src/ui/design-system/theme.css";
import { inter } from "@/src/ui/design-system/fonts";
import { GradientDefs } from "@/src/ui/design-system/icons";
import { Button } from "@/src/ui/design-system/Button";
import { getOpeningArt, getOpeningRealm, getRealmBoss, REALM_NAMES, PLACEHOLDER, type OpeningId } from "@/src/lib/assets";

const eyebrow = { fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase" } as const;

export function OpeningDetailScreen({ openingId, name }: { openingId: OpeningId; name?: string }) {
  const art = getOpeningArt(openingId);
  const realm = getOpeningRealm(openingId);
  const banner = art?.banner ?? PLACEHOLDER;
  const emblem = art?.emblem ?? PLACEHOLDER;
  const title = name ?? openingId;

  return (
    <div className={`chq-root ${inter.variable}`} style={{ minHeight: "100dvh" }}>
      <GradientDefs />
      <main style={{ maxWidth: 720, margin: "0 auto", paddingBottom: 56 }}>
        {/* banner hero */}
        <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 9" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={banner} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, var(--chq-obsidian))" }} />
          {/* emblem crest */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={emblem} alt="" style={{ position: "absolute", left: 20, bottom: -28, width: 72, height: 72, objectFit: "contain", filter: "drop-shadow(0 4px 8px #000)" }} />
        </div>

        <div style={{ padding: "40px 20px 0" }}>
          <p style={{ ...eyebrow, color: "var(--chq-gold-3)", fontSize: 10 }}>{realm ? REALM_NAMES[realm] : "—"}</p>
          <h1 className="chq-display chq-gold-text" style={{ fontSize: 28, fontWeight: 700, margin: "4px 0 0" }}>{title}</h1>
          <p style={{ color: "var(--chq-text-2)", fontSize: 14, lineHeight: 1.6, marginTop: 10 }}>
            Master this opening through Learn &amp; Drill, then face the realm Guardian to seal it in your Passport. {/* TODO: authored opening blurb (chess-curation-spec) */}
          </p>

          <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
            <Button variant="primary">Learn the lines →</Button>
            <Button variant="ghost">Drill</Button>
          </div>

          {/* Boss-Fight entry (realm boss) */}
          {realm && (
            <div style={{ marginTop: 24, position: "relative", overflow: "hidden", borderRadius: "var(--chq-r-card)", border: "1px solid var(--chq-gold-4)", minHeight: 160, display: "flex", alignItems: "flex-end" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={getRealmBoss(realm)} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.55 }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(8,8,10,.4), rgba(8,8,10,.88))" }} />
              <div style={{ position: "relative", padding: 18, width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                <div>
                  <p style={{ ...eyebrow, color: "var(--chq-gold-3)", fontSize: 9 }}>Boss Fight</p>
                  <p className="chq-display" style={{ color: "var(--chq-text-1)", fontSize: 18, margin: "2px 0 0" }}>Face the {REALM_NAMES[realm]} Guardian</p>
                </div>
                <Button variant="primary">Enter →</Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
