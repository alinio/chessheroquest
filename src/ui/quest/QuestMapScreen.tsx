"use client";

/**
 * Quest Map — focal redesign (global direction): the MAP is the screen. Full-bleed
 * realm illustration (light overlay), a luminous realm-accent SVG path linking 5
 * détouré round node medallions + the boss at the summit, an "you are here" marker on
 * the active node, a small dismissible coachmark (no full-screen intro), and ONE
 * bottom CTA. Rendered inside AppShell (active = Quest).
 */
import { useState, type CSSProperties } from "react";
import "@/src/ui/shell/hub.css";
import { ASSETS, getNodeArt, getOpeningArt, PLACEHOLDER, type NodeState, type RealmId } from "@/src/lib/assets";
import type { QuestMapFixture, QuestNode } from "@/src/dev/fixtures";

const STATE_MEDALLION: Record<QuestNode["state"], NodeState> = {
  conquered: "completed",
  available: "active",
  locked: "locked",
};
const REALM_ACCENT: Record<RealmId, string> = {
  "ember-marches": "#e0413b",
  "obsidian-court": "#8a7bd8",
  "aegis-bastion": "#4fb477",
  "mirage-bazaar": "#46c7d8",
};

export function QuestMapScreen({ quest }: { quest: QuestMapFixture }) {
  const [coach, setCoach] = useState(true);
  const points = [...quest.nodes.map((n) => `${n.x},${n.y}`), `${quest.bossX},${quest.bossY}`];
  const pathD = "M" + points.join(" L");
  const continueName = quest.nodes.find((n) => n.id === quest.continueId)?.name ?? "";

  return (
    <main className="map-area">
      <div className="realm-banner">
        <div>
          <h2 className="serif">{quest.realmName}</h2>
          <div className="sub">{quest.realmSub}</div>
        </div>
        <div className="qprogress"><b>{quest.conquered} / {quest.total}</b><span>conquered</span></div>
      </div>

      <div className="map" style={{ "--accent": REALM_ACCENT[quest.realm] } as CSSProperties}>
        <div className="map-bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ASSETS.backgrounds.questMap} alt="" />
        </div>

        <svg className="path" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path d={pathD} fill="none" strokeWidth="0.7" strokeDasharray="2.2 2.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" vectorEffect="non-scaling-stroke" />
        </svg>

        {quest.nodes.map((n) => (
          <div key={n.id} className={`qnode ${n.state}`} style={{ left: `${n.x}%`, top: `${n.y}%` }}>
            {n.state === "available" && <span className="here">You are here</span>}
            <div className="qmedal">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="node-art" src={getNodeArt(STATE_MEDALLION[n.state])} alt="" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="node-emblem" src={getOpeningArt(n.id)?.emblem ?? PLACEHOLDER} alt="" />
            </div>
            <span className="qname serif">{n.name}</span>
          </div>
        ))}

        {/* REALM BOSS node */}
        <div className="qnode boss" style={{ left: `${quest.bossX}%`, top: `${quest.bossY}%` }}>
          <div className="qmedal">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="node-art" src={getNodeArt("boss")} alt="" />
          </div>
          <span className="qname serif">{quest.bossName}</span>
          <span className="qmeta">Realm Boss</span>
        </div>

        {coach && (
          <div className="coachmark">
            <p>Follow the path. Conquer <b>{continueName}</b> next, then face the Realm Boss.</p>
            <button type="button" aria-label="Dismiss" onClick={() => setCoach(false)}>✕</button>
          </div>
        )}
      </div>

      <div className="questbar">
        <button className="btn-quest" type="button">⚔ Continue · {continueName}</button>
        <span className="legend">
          <span><span className="dot" style={{ background: "var(--gold-bright)" }} />conquered</span>
          <span><span className="dot" style={{ background: "var(--ember-bright)" }} />active</span>
          <span><span className="dot" style={{ background: "#3a3550" }} />locked</span>
        </span>
      </div>
    </main>
  );
}
