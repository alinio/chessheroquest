"use client";

/**
 * Quest Map — the MAP is the screen; the chess enters through the NODE DOSSIER
 * (spec §C-hub): a panel anchored right on desktop / under the map on mobile,
 * open by default on the active node. It shows the line's REAL tabiya
 * (fenAfter over the curated mainline), lines-at-gold, and ONE named CTA per
 * state. Full-bleed realm illustration, luminous realm-accent path, détouré
 * node medallions + the boss at the summit. Rendered inside AppShell.
 */
import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import "@/src/ui/shell/hub.css";
import { ASSETS, getNodeArt, getOpeningArt, PLACEHOLDER, type NodeState, type RealmId } from "@/src/lib/assets";
import { PictureBg } from "@/src/ui/PictureBg";
import { MiniBoard } from "@/src/ui/board/MiniBoard";
import { learnHref } from "@/src/lib/opening-paths";
import { Nudge, nudgeSeen } from "@/src/ui/onboarding/Nudge";
import type { QuestMapFixture, QuestNode } from "@/src/dev/fixtures";

const STATE_MEDALLION: Record<QuestNode["state"], NodeState> = {
  conquered: "completed",
  available: "active",
  locked: "locked",
};
/** State glyph inside the name plate — color is never the only signal. */
const STATE_GLYPH: Record<QuestNode["state"], string> = {
  conquered: "✓",
  available: "⚔",
  locked: "🔒",
};
const STATE_LABEL: Record<QuestNode["state"], string> = {
  conquered: "Conquered",
  available: "Available now",
  locked: "Locked — seal the path to reach it",
};
/** Realm-specific 21:9 map art (Higgsfield drop 06-12) — one world per realm. */
const REALM_MAP: Record<RealmId, string> = {
  "ember-marches": "/art/maps/map-ember-marches.webp",
  "obsidian-court": "/art/maps/map-obsidian-court.webp",
  "aegis-bastion": "/art/maps/map-aegis-bastion.webp",
  "mirage-bazaar": "/art/maps/map-mirage-bazaar.webp",
};

const REALM_ACCENT: Record<RealmId, string> = {
  "ember-marches": "#e0413b",
  "obsidian-court": "#8a7bd8",
  "aegis-bastion": "#4fb477",
  "mirage-bazaar": "#46c7d8",
};

/** The node dossier — the chess behind the medallion, one named CTA per state. */
function NodeDossier({
  node,
  prevName,
  onClose,
}: {
  node: QuestNode;
  /** The node guarding this one (locked copy names the real obstacle). */
  prevName: string | null;
  onClose: () => void;
}) {
  const locked = node.state === "locked";
  const linesDone = node.linesDone ?? 0;
  const linesTotal = node.linesTotal ?? 0;
  const minutes = Math.max(2, (linesTotal - linesDone) * 2);

  return (
    <aside className={`dossier${locked ? " locked" : ""}`} aria-label={`${node.name} — dossier`}>
      <button type="button" className="d-close" aria-label="Close dossier" onClick={onClose}>✕</button>
      {node.tabiyaFen && (
        <span className="d-board">
          <MiniBoard
            fen={node.tabiyaFen}
            orientation={node.side ?? "white"}
            lastMove={node.lastMove ?? null}
            px={140}
          />
        </span>
      )}
      <h3 className="serif d-name">{node.name}</h3>
      {linesTotal > 0 && (
        <p className="d-meta">
          {linesDone}/{linesTotal} line{linesTotal === 1 ? "" : "s"} · ~{minutes} min
        </p>
      )}
      {node.state === "available" && (
        <Link className="btn-gold d-cta" href={learnHref(node.id) ?? "/review"}>
          ⚔ Learn the {node.name} →
        </Link>
      )}
      {node.state === "conquered" && node.conqueredAt && (
        <p className="d-meta">Conquered {node.conqueredAt}</p>
      )}
      {node.state === "conquered" &&
        (node.pathId ? (
          <Link className="btn-ghost d-cta" href={`/drill/${node.pathId}`}>
            Sealed — Drill it again →
          </Link>
        ) : (
          <p className="d-lock">Sealed.</p>
        ))}
      {locked && (
        <p className="d-lock">
          Locked. Conquer the {prevName ?? "previous opening"} to open this road.
        </p>
      )}
    </aside>
  );
}

export function QuestMapScreen({ quest }: { quest: QuestMapFixture }) {
  // The dossier opens on the ACTIVE node by default — the map greets you with
  // the position you're about to train, not a tooltip.
  const [openId, setOpenId] = useState<QuestNode["id"] | null>(quest.continueId);

  // First arrival on the Quest map → the realm nudge (spec §B5: one nudge max;
  // it yields to the higher-priority IQ nudge until that one is dismissed).
  const [realmNudge, setRealmNudge] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => {
      if (!nudgeSeen("realm") && nudgeSeen("iq")) setRealmNudge(true);
    }, 600);
    return () => window.clearTimeout(t);
  }, []);
  const points = [...quest.nodes.map((n) => `${n.x},${n.y}`), `${quest.bossX},${quest.bossY}`];
  const pathD = "M" + points.join(" L");
  const continueName = quest.nodes.find((n) => n.id === quest.continueId)?.name ?? "";
  const openIdx = quest.nodes.findIndex((n) => n.id === openId);
  const openNode = openIdx >= 0 ? quest.nodes[openIdx] : undefined;

  return (
    <main className="map-area">
      <div className="realm-banner">
        <div>
          <h2 className="serif">{quest.realmName}</h2>
          <div className="sub">{quest.realmSub}</div>
        </div>
        <span className="chq-nudge-anchor">
          <div className="qprogress"><b>{quest.conquered} / {quest.total}</b><span>conquered</span></div>
          {realmNudge && (
            <Nudge
              concept="realm"
              text={`${quest.total} openings guard this realm. Conquer them node by node — seal all ${quest.total} and the Realm Boss appears.`}
              onDismiss={() => setRealmNudge(false)}
            />
          )}
        </span>
      </div>

      <div className="map-wrap" style={{ "--accent": REALM_ACCENT[quest.realm] } as CSSProperties}>
        <div className="map">
          <div className="map-bg">
            <PictureBg landscape={REALM_MAP[quest.realm] ?? ASSETS.backgrounds.questMap} portrait={ASSETS.backgrounds.questMapPortrait} />
          </div>

          <svg className="path" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path d={pathD} fill="none" strokeWidth="0.7" strokeDasharray="2.2 2.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" vectorEffect="non-scaling-stroke" />
          </svg>

          {quest.nodes.map((n) => (
            <button
              key={n.id}
              type="button"
              className={`qnode ${n.state}${openId === n.id ? " open" : ""}`}
              style={{ left: `${n.x}%`, top: `${n.y}%` }}
              title={STATE_LABEL[n.state]}
              onClick={() => setOpenId(n.id)}
            >
              {n.state === "available" && <span className="here">You are here</span>}
              <span className="qmedal">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="node-art" src={getNodeArt(STATE_MEDALLION[n.state])} alt="" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="node-emblem" src={getOpeningArt(n.id)?.emblem ?? PLACEHOLDER} alt="" />
              </span>
              <span className="qname serif">
                <span className="qstate" aria-hidden="true">{STATE_GLYPH[n.state]}</span>
                {n.name}
                <span className="sr-only"> — {STATE_LABEL[n.state]}</span>
              </span>
            </button>
          ))}

          {/* REALM BOSS node — the Gauntlet opens at 5/5 */}
          {quest.conquered >= quest.total ? (
            <Link
              className="qnode boss"
              href={`/boss/realm/${quest.realm}`}
              style={{ left: `${quest.bossX}%`, top: `${quest.bossY}%` }}
            >
              <div className="qmedal">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="node-art" src={getNodeArt("boss")} alt="" />
              </div>
              <span className="qname serif">{quest.bossName}</span>
              <span className="qmeta">The Gauntlet is open — claim the realm →</span>
            </Link>
          ) : (
            <div className="qnode boss" style={{ left: `${quest.bossX}%`, top: `${quest.bossY}%` }}>
              <div className="qmedal">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="node-art" src={getNodeArt("boss")} alt="" />
              </div>
              <span className="qname serif">{quest.bossName}</span>
              <span className="qmeta">Kingdom Boss — seal all {quest.total} to face him</span>
            </div>
          )}
        </div>

        {openNode && (
          <NodeDossier
            node={openNode}
            prevName={openIdx > 0 ? (quest.nodes[openIdx - 1]?.name ?? null) : null}
            onClose={() => setOpenId(null)}
          />
        )}
      </div>

      <div className="questbar">
        <Link className="btn-quest" href={learnHref(quest.continueId) ?? "/review"}>
          ⚔ Continue · {continueName}
        </Link>
        <span className="legend">
          <span><span className="dot" style={{ background: "var(--gold-bright)" }} />conquered</span>
          <span><span className="dot" style={{ background: "var(--ember-bright)" }} />active</span>
          <span><span className="dot" style={{ background: "#3a3550" }} />locked</span>
        </span>
      </div>
    </main>
  );
}
