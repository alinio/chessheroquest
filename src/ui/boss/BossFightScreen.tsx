"use client";

/**
 * Boss Fight — faithful reproduction of docs/mockups/mockup-boss-fight-rpg.html.
 * Immersive, NO AppShell. Full-bleed realm boss (realms/<realm>/boss.png) + soft
 * vignette/scrim, "Opening Guardian" tag, centred boss identity + difficulty pills
 * (Medium selected, Hard locked). Accent = the boss's REALM colour. Data-driven.
 */
import { useState, type CSSProperties } from "react";
import "./boss-fight.css";
import { getRealmBoss, type RealmId } from "@/src/lib/assets";
import { IconCrown, IconLock } from "@/src/ui/shell/icons";
import type { BossFixture } from "@/src/dev/fixtures";

const REALM_ACCENT: Record<RealmId, { accent: string; bright: string }> = {
  "ember-marches": { accent: "#e0413b", bright: "#ff6a52" },
  "obsidian-court": { accent: "#8a7bd8", bright: "#a99cea" },
  "aegis-bastion": { accent: "#4fb477", bright: "#6fd89a" },
  "mirage-bazaar": { accent: "#46c7d8", bright: "#6fe0ef" },
};

export function BossFightScreen({ boss }: { boss: BossFixture }) {
  const [diff, setDiff] = useState<"easy" | "medium">("medium");
  const a = REALM_ACCENT[boss.realm];

  return (
    <div className="chq-boss" style={{ "--accent": a.accent, "--accent-bright": a.bright } as CSSProperties}>
      <div className="stage">
        <div className="bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={getRealmBoss(boss.realm)} alt="" />
        </div>
        <div className="glow" />

        <div className="topleft"><IconCrown /> Opening Guardian</div>

        <div className="center">
          <p className="eyebrow">Opening Guardian</p>
          <h1 className="name serif">{boss.name}</h1>
          <p className="subtitle">{boss.subtitle}</p>
          <p className="desc">{boss.description}</p>
          <p className="taunt">&ldquo;{boss.taunt}&rdquo;</p>
          <p className="howto">Play the <b>{boss.opening}</b> against our engine — win to <b>seal</b> it in your Passport.</p>

          <div className="diff">
            <button type="button" className={`pill${diff === "easy" ? " sel" : ""}`} onClick={() => setDiff("easy")}>Easy</button>
            <button type="button" className={`pill${diff === "medium" ? " sel" : ""}`} onClick={() => setDiff("medium")}>Medium ★</button>
            <button type="button" className="pill locked" disabled>Hard <IconLock /></button>
          </div>
          <p className="helper">Medium validates &amp; seals · Hard is Pro mastery</p>

          <button type="button" className="btn-gold">Begin the duel</button>
          <button type="button" className="retreat">← Retreat</button>
        </div>
      </div>
    </div>
  );
}
