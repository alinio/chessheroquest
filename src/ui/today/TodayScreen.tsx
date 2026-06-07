"use client";

/**
 * Today / Train — the daily habit loop (in-app-architecture-spec §4.2).
 * Streak header · Opening-IQ + daily goal · Due Drills · Recommended session ·
 * Road-to-Elo (with rank insignia) · coach · quick stats. Props-driven so DEV
 * routes can feed fixtures (no store/auth needed). Asset-wired (today-hero-bg).
 */
import type { ReactNode } from "react";
import "@/src/ui/design-system/theme.css";
import { inter } from "@/src/ui/design-system/fonts";
import { GradientDefs, StreakFlame, OpeningIQGauge, ProgressBar } from "@/src/ui/design-system/icons";
import { Button } from "@/src/ui/design-system/Button";
import { CoachAvatar } from "@/src/ui/coach/CoachAvatar";
import { HERO_ACCENTS } from "@/src/ui/design-system/tokens";
import { ASSETS, getRankInsignia, getArchetypeSigil, REALM_NAMES, type Archetype, type RealmId } from "@/src/lib/assets";
import type { DemoPlayer } from "@/src/dev/fixtures";

const REALM_ARCHETYPE: Record<RealmId, Archetype> = {
  "ember-marches": "warrior",
  "obsidian-court": "strategist",
  "aegis-bastion": "defender",
  "mirage-bazaar": "trickster",
};
const eyebrow = { fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase" } as const;

function Card({ children, accent }: { children: ReactNode; accent?: string }) {
  return <div style={{ background: "var(--chq-panel)", border: `1px solid ${accent ?? "var(--chq-line)"}`, borderRadius: "var(--chq-r-card)", padding: 18 }}>{children}</div>;
}

export function TodayScreen({ player, onAction }: { player: DemoPlayer; onAction?: (a: string) => void }) {
  const accent = HERO_ACCENTS[REALM_ARCHETYPE[player.realm]];
  const go = (a: string) => onAction?.(a);

  return (
    <div className={`chq-root ${inter.variable}`} style={{ minHeight: "100dvh", position: "relative" }}>
      <GradientDefs />
      {/* full-bleed Today backdrop */}
      <div aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={ASSETS.backgrounds.today} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(8,8,10,.65), rgba(8,8,10,.9))" }} />
      </div>

      <main style={{ position: "relative", zIndex: 1, maxWidth: 560, margin: "0 auto", padding: "20px 18px 56px", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* header: realm + streak */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={getArchetypeSigil(REALM_ARCHETYPE[player.realm])} alt="" style={{ width: 34, height: 34, objectFit: "contain", mixBlendMode: "screen" }} />
            <div>
              <p style={{ ...eyebrow, color: "var(--chq-text-muted)", fontSize: 9, margin: 0 }}>{REALM_NAMES[player.realm]}</p>
              <p style={{ color: "var(--chq-text-1)", fontWeight: 600, fontSize: 15, margin: 0 }}>Welcome back, {player.name}</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <StreakFlame size={26} />
            <span className="chq-display" style={{ color: "var(--chq-gold-2)", fontSize: 18, fontWeight: 700 }}>{player.streakDays}</span>
          </div>
        </div>

        {/* Opening IQ + daily goal */}
        <Card accent={accent.border}>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <OpeningIQGauge value={player.openingIq} size={96} />
            <div style={{ flex: 1 }}>
              <p style={{ ...eyebrow, color: "var(--chq-text-muted)", fontSize: 9 }}>Opening IQ · Top {player.topPercent}%</p>
              <p style={{ ...eyebrow, color: "var(--chq-text-2)", fontSize: 10, marginTop: 10 }}>Today&apos;s goal · {player.goalDone}/{player.goalTarget} XP</p>
              <div style={{ marginTop: 4 }}><ProgressBar value={player.goalDone / player.goalTarget} height={8} ariaLabel="Daily goal" /></div>
              <p style={{ color: "var(--chq-text-muted)", fontSize: 11, marginTop: 6 }}>+{player.xpToday} XP today</p>
            </div>
          </div>
        </Card>

        {/* Due Drills — primary */}
        <Card accent={accent.border}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <div>
              <p className="chq-display" style={{ color: "var(--chq-text-1)", fontSize: 18, margin: 0 }}>{player.dueDrills} drills due</p>
              <p style={{ color: "var(--chq-text-2)", fontSize: 13, marginTop: 2 }}>Keep the lines automatic — review what&apos;s due.</p>
            </div>
            <Button variant="primary" onClick={() => go("drills")}>Start →</Button>
          </div>
        </Card>

        {/* Recommended session (Road to Elo next) */}
        <Card>
          <p style={{ ...eyebrow, color: "var(--chq-gold-3)", fontSize: 9 }}>Recommended next</p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginTop: 6 }}>
            <div>
              <p style={{ color: "var(--chq-text-1)", fontWeight: 600, fontSize: 16, margin: 0 }}>{player.recommended.name}</p>
              <p style={{ color: "var(--chq-text-muted)", fontSize: 12, marginTop: 2 }}>On your Road to Elo</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Button variant="ghost" onClick={() => go("learn")}>Learn</Button>
              <Button variant="ghost" onClick={() => go("drill")}>Drill</Button>
            </div>
          </div>
        </Card>

        {/* Road to Elo bar + rank insignia */}
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={getRankInsignia(player.eloGoal)} alt="" style={{ width: 44, height: 44, objectFit: "contain" }} />
            <div style={{ flex: 1 }}>
              <p style={{ ...eyebrow, color: "var(--chq-gold-3)", fontSize: 9 }}>Road to Elo · goal {player.eloGoal}</p>
              <div style={{ marginTop: 6 }}><ProgressBar value={Math.min(1, player.openingIq / 1000)} height={8} ariaLabel="Road to Elo" /></div>
              <p style={{ color: "var(--chq-text-muted)", fontSize: 11, marginTop: 6 }}>Strongest: <b style={{ color: "var(--chq-text-2)" }}>{player.strongest}</b> · Focus: <b style={{ color: "var(--chq-text-2)" }}>{player.weakness}</b></p>
            </div>
          </div>
        </Card>

        {/* Coach */}
        <CoachAvatar size={48} message={<span>Nice 7-day streak. After your drills, try one new line in <b style={{ color: "var(--chq-text-1)" }}>{player.recommended.name}</b> — it&apos;s your fastest path up the ladder.</span>} />

        {/* quick stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {[["Cards", player.cardsReviewed], ["Accuracy", `${player.accuracy}%`], ["XP today", player.xpToday]].map(([k, v]) => (
            <div key={String(k)} style={{ background: "var(--chq-panel)", border: "1px solid var(--chq-line)", borderRadius: "var(--chq-r-panel)", padding: "12px 10px", textAlign: "center" }}>
              <div className="chq-display" style={{ color: "var(--chq-gold-2)", fontSize: 20, fontWeight: 700 }}>{v}</div>
              <div style={{ ...eyebrow, color: "var(--chq-text-muted)", fontSize: 8 }}>{k}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
