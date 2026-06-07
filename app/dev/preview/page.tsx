"use client";

/**
 * DEV-ONLY asset preview (/dev/preview) — renders every asset in context so the
 * whole set can be eyeballed at a glance. Not in navigation; shows a notice in
 * production. Missing files fall back to the gray PLACEHOLDER.
 */
import { useState, type CSSProperties } from "react";
import "@/src/ui/design-system/theme.css";
import { inter } from "@/src/ui/design-system/fonts";
import {
  ASSETS,
  PLACEHOLDER,
  REALM_NAMES,
  getArchetypeArt,
  getArchetypeSigil,
  getNodeArt,
  getRealmBoss,
  type Archetype,
  type NodeState,
  type RankTier,
  type RealmId,
  type OpeningId,
} from "@/src/lib/assets";

function AssetImg({ src, alt, style }: { src: string; alt: string; style?: CSSProperties }) {
  const [broken, setBroken] = useState(false);
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={broken ? PLACEHOLDER : src} alt={alt} onError={() => setBroken(true)} style={style} />;
}

const card: CSSProperties = { background: "var(--chq-panel)", border: "1px solid var(--chq-line)", borderRadius: "var(--chq-r-panel)", overflow: "hidden" };
const label: CSSProperties = { fontSize: 11, color: "var(--chq-text-2)", padding: "6px 8px", textAlign: "center" };
const pretty = (id: string) => id.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: 40 }}>
      <h2 className="chq-display chq-gold-text" style={{ fontSize: 18, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", borderBottom: "1px solid var(--chq-line)", paddingBottom: 8 }}>{title}</h2>
      <div style={{ marginTop: 14 }}>{children}</div>
    </section>
  );
}

const ARCHES: Archetype[] = ["warrior", "strategist", "defender", "trickster"];
const NODE_STATES: NodeState[] = ["active", "completed", "locked", "boss"];
const RANKS: RankTier[] = [1000, 1200, 1500, 1800];
const REALMS: RealmId[] = ["ember-marches", "obsidian-court", "aegis-bastion", "mirage-bazaar"];
const grid = (min: number): CSSProperties => ({ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${min}px, 1fr))`, gap: 12 });

export default function DevPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    return <div style={{ padding: 40, fontFamily: "system-ui", color: "#aaa" }}>/dev/preview is dev-only.</div>;
  }
  const openings = Object.keys(ASSETS.openings) as OpeningId[];

  return (
    <div className={`chq-root ${inter.variable}`} style={{ minHeight: "100dvh", padding: "32px 24px 80px", maxWidth: 1200, margin: "0 auto" }}>
      <h1 className="chq-display chq-gold-text" style={{ fontSize: 26, fontWeight: 700 }}>Asset Preview — DEV</h1>
      <p style={{ color: "var(--chq-text-muted)", fontSize: 13 }}>Every asset in context. Gray = file not dropped yet (placeholder).</p>

      <Section title="Archetypes (portrait + sigil)">
        <div style={grid(160)}>
          {ARCHES.map((a) => (
            <div key={a} style={card}>
              <AssetImg src={getArchetypeArt(a)} alt={a} style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover", display: "block" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px" }}>
                <AssetImg src={getArchetypeSigil(a)} alt="" style={{ width: 28, height: 28, objectFit: "contain" }} />
                <span style={{ fontSize: 12, color: "var(--chq-text-1)", textTransform: "capitalize" }}>{a}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Backgrounds (full-bleed)">
        <div style={grid(260)}>
          {([["Today", ASSETS.backgrounds.today], ["DNA Test", ASSETS.backgrounds.dnaTest], ["Results", ASSETS.backgrounds.resultsReveal], ["Boss Arena", ASSETS.backgrounds.bossArena], ["Quest Map", ASSETS.backgrounds.questMap]] as const).map(([n, src]) => (
            <div key={n} style={card}>
              <AssetImg src={src} alt={n} style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", display: "block" }} />
              <div style={label}>{n}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Quest Map nodes (on quest-map-bg + obsidian texture)">
        <div style={{ ...card, position: "relative", padding: 28, backgroundImage: `var(--surface-texture)` }}>
          <AssetImg src={ASSETS.backgrounds.questMap} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }} />
          <div style={{ position: "relative", display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap", alignItems: "center" }}>
            {NODE_STATES.map((s) => (
              <div key={s} style={{ textAlign: "center" }}>
                <AssetImg src={getNodeArt(s)} alt={s} style={{ width: s === "boss" ? 92 : 64, height: s === "boss" ? 92 : 64, objectFit: "contain", display: "block" }} />
                <span style={{ fontSize: 11, color: "var(--chq-text-1)" }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section title="DNA Card + Weekly Report (frames + demo data)">
        <div style={grid(280)}>
          <div style={{ ...card, position: "relative" }}>
            <AssetImg src={ASSETS.dnaCard.frame} alt="DNA Card frame" style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", display: "block" }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 20 }}>
              <span style={{ ...label, fontSize: 10 }}>THE STRATEGIST</span>
              <span className="chq-display chq-gold-text" style={{ fontSize: 48, fontWeight: 700 }}>742</span>
              <span style={{ fontSize: 11, color: "var(--chq-text-2)" }}>Opening IQ · Top 12%</span>
            </div>
          </div>
          <div style={{ ...card, position: "relative" }}>
            <AssetImg src={ASSETS.dnaCard.weeklyReportFrame} alt="Weekly Report frame" style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", display: "block" }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 20 }}>
              <span style={{ ...label, fontSize: 10 }}>THIS WEEK</span>
              <span className="chq-display chq-gold-text" style={{ fontSize: 32, fontWeight: 700 }}>+38 IQ</span>
              <span style={{ fontSize: 11, color: "var(--chq-text-2)" }}>7-day streak · 4 quests · 3 openings ↑</span>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Rank insignia · Coach · Passport">
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "flex-end" }}>
          {RANKS.map((t) => (
            <div key={t} style={{ textAlign: "center" }}>
              <AssetImg src={ASSETS.badges.ranks[t]} alt={`rank ${t}`} style={{ width: 56, height: 56, objectFit: "contain", display: "block" }} />
              <span style={{ fontSize: 11, color: "var(--chq-text-2)" }}>{t}</span>
            </div>
          ))}
          <div style={{ textAlign: "center" }}>
            <AssetImg src={ASSETS.coach.mentor} alt="coach" style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", objectPosition: "center top", border: "1px solid var(--chq-gold-4)" }} />
            <span style={{ fontSize: 11, color: "var(--chq-text-2)" }}>coach</span>
          </div>
          <div style={{ ...card, width: 130 }}>
            <AssetImg src={ASSETS.passport.cover} alt="passport cover" style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover", display: "block" }} />
            <div style={label}>passport cover</div>
          </div>
          {(["stampMastered", "stampLocked"] as const).map((k) => (
            <div key={k} style={{ textAlign: "center" }}>
              <AssetImg src={ASSETS.passport[k]} alt={k} style={{ width: 56, height: 56, objectFit: "contain", display: "block" }} />
              <span style={{ fontSize: 11, color: "var(--chq-text-2)" }}>{k}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Realm bosses (4)">
        <div style={grid(200)}>
          {REALMS.map((r) => (
            <div key={r} style={card}>
              <AssetImg src={getRealmBoss(r)} alt={r} style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover", display: "block" }} />
              <div style={label}>{REALM_NAMES[r]}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="20 Openings (banner + emblem + realm)">
        <div style={grid(220)}>
          {openings.map((id) => {
            const o = ASSETS.openings[id];
            return (
              <div key={id} style={{ ...card, position: "relative" }}>
                <div style={{ position: "relative" }}>
                  <AssetImg src={o.banner} alt={id} style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", display: "block" }} />
                  <AssetImg src={o.emblem} alt="" style={{ position: "absolute", left: 8, bottom: 8, width: 36, height: 36, objectFit: "contain", filter: "drop-shadow(0 2px 4px #000)" }} />
                </div>
                <div style={{ padding: "8px 10px" }}>
                  <div style={{ fontSize: 13, color: "var(--chq-text-1)", fontWeight: 600 }}>{pretty(id)}</div>
                  <div style={{ fontSize: 10, color: "var(--chq-text-muted)", textTransform: "uppercase", letterSpacing: ".08em" }}>{REALM_NAMES[o.realm]}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  );
}
