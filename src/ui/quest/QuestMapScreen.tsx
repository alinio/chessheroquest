"use client";

/**
 * Quest Map (realm hub) — faithful reproduction of docs/mockups/mockup-hub-rpg.html
 * (<main class="map-area">). Rendered inside <AppShell active="quest">. The realm
 * illustration (quest-map-bg) stays clearly visible (light overlay — no black hole);
 * SVG path links the nodes; each node = its state medallion (node-active/completed/
 * locked.png) + the opening's détouré emblem; the REALM BOSS node crowns the map.
 * Dismissible realm intro on first visit. Data-driven.
 */
import { useState } from "react";
import "@/src/ui/shell/hub.css";
import { ASSETS, getNodeArt, getOpeningArt, PLACEHOLDER, type NodeState } from "@/src/lib/assets";
import type { QuestMapFixture, QuestNode } from "@/src/dev/fixtures";

const STATE_MEDALLION: Record<QuestNode["state"], NodeState> = {
  conquered: "completed",
  available: "active",
  locked: "locked",
};

export function QuestMapScreen({ quest }: { quest: QuestMapFixture }) {
  const [intro, setIntro] = useState(true);
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
        <div className="qprogress"><b>{quest.conquered} / {quest.total}</b><span>openings conquered</span></div>
      </div>

      <div className="map">
        <div className="map-bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ASSETS.backgrounds.questMap} alt="" />
        </div>

        <svg className="path" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path d={pathD} fill="none" stroke="#cda845" strokeWidth="0.7" strokeDasharray="2.2 2.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" vectorEffect="non-scaling-stroke" style={{ filter: "drop-shadow(0 0 4px rgba(205,168,69,.5))" }} />
        </svg>

        {quest.nodes.map((n) => (
          <div key={n.id} className={`qnode ${n.state}`} style={{ left: `${n.x}%`, top: `${n.y}%` }}>
            <div className="qmedal">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="node-art" src={getNodeArt(STATE_MEDALLION[n.state])} alt="" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="node-emblem" src={getOpeningArt(n.id)?.emblem ?? PLACEHOLDER} alt="" />
            </div>
            <span className="qname serif">{n.name}</span>
            <span className="qmeta">{n.state === "available" ? "your next quest" : n.state}</span>
          </div>
        ))}

        {/* REALM BOSS node */}
        <div className="qnode boss" style={{ left: `${quest.bossX}%`, top: `${quest.bossY}%` }}>
          <div className="qmedal">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="node-art" src={getNodeArt("boss")} alt="" />
          </div>
          <span className="qname serif">{quest.bossName}</span>
          <span className="qmeta">REALM BOSS · sealed</span>
        </div>

        {intro && (
          <div className="realm-intro">
            <p className="eyebrow gold">{quest.realmSub}</p>
            <h2 className="serif">The {quest.realmName}</h2>
            <p>Conquer each opening, then defeat the Realm Guardian to claim the realm.</p>
            <button className="btn-gold" type="button" onClick={() => setIntro(false)}>Begin →</button>
          </div>
        )}
      </div>

      <div className="questbar">
        <button className="btn-quest" type="button">⚔ Continue your quest · {continueName}</button>
        <span className="legend">
          <span><span className="dot" style={{ background: "var(--gold-bright)" }} />conquered</span>
          <span><span className="dot" style={{ background: "var(--ember-bright)" }} />available</span>
          <span><span className="dot" style={{ background: "#3a3550" }} />locked</span>
          <span><span className="dot" style={{ background: "var(--ember-deep)" }} />realm boss</span>
        </span>
      </div>
    </main>
  );
}
