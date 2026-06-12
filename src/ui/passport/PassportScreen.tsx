/**
 * Passport / Collection — the seal book (target-experience-spec §C Passport).
 * Cover (the seal rule in 3 steps) → "NEXT SEAL" banner (the not-yet-sealed
 * opening closest to its seal: real tabiya MiniBoard + Guardian portrait +
 * one CTA) → 4 realm sections whose headers state the Realm Guardian's status.
 * Every medallion carries one of FOUR states from REAL mastery + Guardian
 * victories: Unexplored · In training (progress ring + state chip) ·
 * Ready to seal (gold, pulsing) · Sealed (dated). No invented numbers, ever.
 */
import type { CSSProperties } from "react";
import Link from "next/link";
import "@/src/ui/shell/hub.css";
import "@/src/ui/board/board-ui.css";
import {
  ASSETS, getOpeningArt, getArchetypeSigil, PLACEHOLDER,
  type OpeningId, type RealmId, type Archetype,
} from "@/src/lib/assets";
import { MiniBoard } from "@/src/ui/board/MiniBoard";
import { BarFill } from "@/src/ui/components/BarFill";
import { StampArrival } from "./StampArrival";
import type { MedallionState } from "@/src/domain/passport";

const REALMS_ORDER: { id: RealmId; name: string; accent: string; archetype: Archetype }[] = [
  { id: "ember-marches", name: "Ember Marches", accent: "var(--ember)", archetype: "warrior" },
  { id: "obsidian-court", name: "Obsidian Court", accent: "var(--violet)", archetype: "strategist" },
  { id: "aegis-bastion", name: "Aegis Bastion", accent: "var(--emerald)", archetype: "defender" },
  { id: "mirage-bazaar", name: "Mirage Bazaar", accent: "var(--cyan)", archetype: "trickster" },
];
const OPENING_IDS = Object.keys(ASSETS.openings) as OpeningId[];

export interface PassportOpeningView {
  id: OpeningId;
  name: string;
  medallion: MedallionState;
  /** Real coverage of the line (FSRS cards / curated positions). */
  studied: number;
  total: number;
  /** In-training state chip ("Leak" | "Fading" | "Solid") — training only. */
  chip: string | null;
  /** Preformatted seal date ("May 14") — sealed only, null when unknown. */
  sealedDate: string | null;
  /** Where the medallion clicks to (learn / detail / duel), null = inert. */
  href: string | null;
}

export interface NextSealView {
  openingId: OpeningId;
  openingName: string;
  /** Gold mastery — the Guardian accepts the challenge. */
  ready: boolean;
  studied: number;
  total: number;
  guardianName: string;
  guardianArt: string;
  board: {
    fen: string;
    orientation: "white" | "black";
    lastMove: { from: string; to: string } | null;
  };
  href: string;
}

function Medallion({ o, accent }: { o: PassportOpeningView; accent: string }) {
  const emblem = getOpeningArt(o.id)?.emblem ?? PLACEHOLDER;
  const pct = o.total > 0 ? Math.round((o.studied / o.total) * 100) : 0;

  const body = (
    <>
      {o.medallion === "sealed" && (
        <span className="seal">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ASSETS.passport.stampMastered} alt="sealed" />
        </span>
      )}
      <div
        className={`op-medal${o.medallion === "training" ? " op-ring" : ""}${o.medallion === "ready" ? " op-ring op-ring--gold" : ""}`}
        style={o.medallion === "training" ? ({ "--pct": pct } as CSSProperties) : undefined}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={emblem} alt="" />
      </div>
      <span className="op-name">{o.name}</span>
      {o.medallion === "training" && (
        <span className="op-progress">
          {o.studied}/{o.total}
          {o.chip && <i className={`op-chip op-chip--${o.chip.toLowerCase()}`}>{o.chip}</i>}
        </span>
      )}
      {o.medallion === "ready" && <span className="op-cta">Challenge the Guardian</span>}
      {o.medallion === "sealed" && (
        <span className="op-progress sealed">
          {o.sealedDate ? `Sealed ${o.sealedDate}` : "Sealed"}
        </span>
      )}
    </>
  );

  const cls = `op ${o.medallion}`;
  const domId = `pp-med-${o.id}`; // StampArrival scrolls here post-seal
  return o.href ? (
    <Link id={domId} className={cls} href={o.href} style={{ "--accent": accent } as CSSProperties}>
      {body}
    </Link>
  ) : (
    <div id={domId} className={cls} style={{ "--accent": accent } as CSSProperties}>
      {body}
    </div>
  );
}

export function PassportScreen({
  openings,
  nextSeal,
}: {
  openings: PassportOpeningView[];
  nextSeal: NextSealView | null;
}) {
  const byId = new Map(openings.map((o) => [o.id, o]));
  const total = OPENING_IDS.length;
  const sealedCount = openings.filter((o) => o.medallion === "sealed").length;

  return (
    <main className="passport">
      <StampArrival />
      {/* COVER HERO — the count + the rule of the game, in 3 steps */}
      <section className="cover-hero">
        <div className="cover-img">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ASSETS.passport.cover} alt="Opening Passport" />
        </div>
        <div className="cover-meta">
          <p className="eyebrow">Opening Passport</p>
          <p className="big serif">{sealedCount} / {total} Sealed</p>
          <div className="pbar"><BarFill pct={(sealedCount / total) * 100} /></div>
          <div className="seal-rule">
            <p className="sr-title">How a seal is earned</p>
            <ol>
              <li><b>1.</b> Study the line — every position, to the end</li>
              <li><b>2.</b> Drill it to Gold — prove you remember</li>
              <li><b>3.</b> Defeat its Guardian — play it from memory, one slip forgiven</li>
            </ol>
          </div>
        </div>
      </section>

      {/* NEXT SEAL — the one opening closest to its seal (real mastery) */}
      {nextSeal && (
        <section className="next-seal" aria-label="Next seal">
          <Link className="ns-board" href={nextSeal.href} aria-hidden tabIndex={-1}>
            <MiniBoard
              fen={nextSeal.board.fen}
              orientation={nextSeal.board.orientation}
              lastMove={nextSeal.board.lastMove}
              px={148}
            />
          </Link>
          <div className="ns-body">
            <p className="eyebrow gold">{nextSeal.ready ? "Next seal" : "Next seal — closest to the seal"}</p>
            {nextSeal.ready ? (
              <>
                <h3 className="serif">The {nextSeal.openingName} is ready.</h3>
                <p className="ns-sub">
                  You hold all <b>{nextSeal.total}</b> positions at Gold.{" "}
                  <b>{nextSeal.guardianName}</b> guards the seal — defeat him to stamp it.
                </p>
                <Link className="btn-gold sm" href={nextSeal.href}>Challenge the Guardian →</Link>
              </>
            ) : (
              <>
                <h3 className="serif">{nextSeal.openingName}</h3>
                <p className="ns-sub">
                  <b>{nextSeal.studied}</b> of <b>{nextSeal.total}</b> positions hold.
                  One drill session from Gold.
                </p>
                <Link className="btn-gold sm" href={nextSeal.href}>Finish the line →</Link>
              </>
            )}
          </div>
          <span className="ns-guardian">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={nextSeal.guardianArt} alt={`${nextSeal.guardianName}, Opening Guardian`} />
          </span>
        </section>
      )}

      {/* 4 realm sections */}
      {REALMS_ORDER.map((r) => {
        const list = OPENING_IDS.filter((id) => ASSETS.openings[id].realm === r.id);
        const sealedN = list.filter((id) => byId.get(id)?.medallion === "sealed").length;
        return (
          <section className="realm-sec" key={r.id} style={{ "--accent": r.accent } as CSSProperties}>
            <div className="realm-head">
              <span className="rh-crest">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={getArchetypeSigil(r.archetype)} alt="" />
              </span>
              <h3 className="serif">{r.name}</h3>
              <span className="rh-count">
                {sealedN === list.length
                  ? `Realm Guardian awakened — conquer the ${r.name}`
                  : `${sealedN}/${list.length} sealed · Realm Guardian sleeps until ${list.length}`}
              </span>
            </div>
            <div className="op-grid">
              {list.map((id) => {
                const o = byId.get(id);
                return o ? <Medallion key={id} o={o} accent={r.accent} /> : null;
              })}
            </div>
          </section>
        );
      })}
    </main>
  );
}
