/**
 * Profile — the hero card (target-experience-spec §C Profile). ACQUIRED facts
 * only, never to-dos: archetype portrait, dominant earned title, Level + XP,
 * IQ + delta since arrival + sparkline, "Estimated practical rank" insignia,
 * the REAL seal row ({x} of 20), records from the database, "At the board"
 * (real synced games), the saved DNA card + re-take, Road goal + sign out.
 */
import Link from "next/link";
import "@/src/ui/shell/hub.css";
import {
  getArchetypeArt, getOpeningArt, getRankInsignia, PLACEHOLDER, type Archetype, type OpeningId,
} from "@/src/lib/assets";
import type { DnaResult } from "@/src/domain/dna/types";
import { DnaCard } from "@/src/ui/screens/DnaCard";
import { archetypeMeta } from "@/src/ui/archetype-meta";
import { ShareButton } from "@/src/ui/ShareButton";
import { RoadGoalPicker } from "@/src/ui/RoadGoalPicker";
import { SignOutButton } from "@/src/ui/SignOutButton";
import { AtTheBoardCard } from "./AtTheBoardCard";

export interface ProfileSeal {
  id: OpeningId;
  name: string;
}

export interface ProfileData {
  /** Display name (or the email's local part) — the hero's name. */
  name: string;
  email: string;
  archetype: Archetype;
  realmName: string;
  joined: string;
  /** Dominant title = the most recent earned achievement (null = none yet). */
  dominantTitle: string | null;
  level: number;
  xpInto: number;
  xpNeeded: number;
  iq: number;
  /** IQ change since the first snapshot (arrival). */
  iqDelta: number;
  /** Oldest → newest IQ snapshots (sparkline; length ≥ 2). */
  iqTrend: number[];
  /** Estimated practical rank tier (domain practicalRankElo — an estimate). */
  practicalElo: number;
  rankName: string;
  /** REAL seals (gold + Guardian defeated), in passport order. */
  seals: ProfileSeal[];
  totalOpenings: number;
  bestStreak: number;
  drillsAnswered: number;
  eloGoal: number;
  dna: DnaResult | null;
  savedUsernames?: { lichess?: string | null; chesscom?: string | null };
}

/** Same sparkline geometry as the Insights IQ trend (one visual language). */
function iqPaths(trend: number[]) {
  const W = 100, H = 32;
  const min = Math.min(...trend), max = Math.max(...trend);
  const span = max - min || 1;
  const pts = trend.map((v, i): [number, number] => [
    (i / (trend.length - 1)) * W,
    H - ((v - min) / span) * (H - 4) - 2,
  ]);
  const line = "M" + pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" L");
  return { line, area: `${line} L${W},${H} L0,${H} Z` };
}

export function ProfileScreen({ data }: { data: ProfileData }) {
  const xpPct = data.xpNeeded > 0 ? Math.round((data.xpInto / data.xpNeeded) * 100) : 0;
  const trend = data.iqTrend.length >= 2 ? data.iqTrend : [data.iq, data.iq];
  const { line, area } = iqPaths(trend);

  return (
    <main className="profile">
      {/* HERO CARD — who you've become (portrait · titles · level · IQ · rank) */}
      <section className="pf-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="pf-portrait" src={getArchetypeArt(data.archetype)} alt="" />
        <div className="pf-id">
          <p className="eyebrow gold">{data.realmName}</p>
          <h1 className="serif">{data.name}</h1>
          <p className="meta">
            {data.dominantTitle ? (
              <b className="pf-title">★ {data.dominantTitle}</b>
            ) : (
              <b className="pf-title">{archetypeMeta(data.archetype).label}</b>
            )}{" "}
            · joined {data.joined}
          </p>
          <div className="pf-xp">
            <div className="xl"><span>Level {data.level}</span><span>{data.xpInto} / {data.xpNeeded} XP</span></div>
            <div className="bar"><span style={{ width: `${xpPct}%` }} /></div>
          </div>
        </div>
        <div className="pf-iqcol">
          <p className="pf-iq-big serif">{data.iq}</p>
          <p className="pf-iq-delta">
            {data.iqDelta > 0 ? (
              <span className="up">▲ +{data.iqDelta} since you arrived</span>
            ) : data.iqDelta < 0 ? (
              <span>{data.iqDelta} since you arrived</span>
            ) : (
              <span>Opening IQ — your baseline</span>
            )}
          </p>
          <svg className="pf-spark" viewBox="0 0 100 32" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="chq-pf-iq" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="rgba(241,214,128,.3)" />
                <stop offset="1" stopColor="rgba(241,214,128,0)" />
              </linearGradient>
            </defs>
            <path d={area} fill="url(#chq-pf-iq)" />
            <path d={line} fill="none" stroke="#f1d680" strokeWidth="1.2" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="pf-rank">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={getRankInsignia(data.practicalElo)} alt="" />
            <span>
              <b>{data.rankName}</b>
              <small>Estimated practical rank · ~{data.practicalElo}</small>
            </span>
          </div>
        </div>
      </section>

      {/* SEAL ROW — the real collection, empty slots included */}
      <section className="pf-card">
        <p className="ct">
          Seals · <b>{data.seals.length} of {data.totalOpenings}</b>
        </p>
        <div className="pf-seals">
          {data.seals.map((s) => (
            <span className="pf-seal" key={s.id} title={s.name}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={getOpeningArt(s.id)?.emblem ?? PLACEHOLDER} alt={s.name} />
            </span>
          ))}
          {Array.from({ length: Math.max(0, data.totalOpenings - data.seals.length) }, (_, i) => (
            <span className="pf-seal empty" key={`empty-${i}`} aria-hidden="true" />
          ))}
        </div>
        {data.seals.length === 0 && (
          <p className="pf-board-foot">
            Twenty slots wait in your <Link href="/passport" style={{ color: "var(--gold-dim)" }}>Passport</Link> — the first seal is the hardest.
          </p>
        )}
      </section>

      {/* RECORDS — database facts only */}
      <div className="pf-stats">
        <div className="pf-stat"><span className="n">{data.bestStreak}</span><span className="k">Best streak (days)</span></div>
        <div className="pf-stat"><span className="n">{data.drillsAnswered}</span><span className="k">Positions answered</span></div>
        <div className="pf-stat"><span className="n">{data.seals.length}/{data.totalOpenings}</span><span className="k">Openings sealed</span></div>
      </div>

      {/* AT THE BOARD — real synced games (renders only once synced) */}
      <AtTheBoardCard savedUsernames={data.savedUsernames} />

      {/* DNA — the saved card + re-take */}
      {data.dna && (
        <section className="pf-dna">
          <DnaCard result={data.dna} />
          <div className="pf-actions">
            <ShareButton
              text={`My Chess DNA: ${archetypeMeta(data.dna.archetype).label} · Opening IQ ${data.dna.initialIq}. Discover yours →`}
            />
            <Link className="btn-ghost" href="/dna-test">Re-take the test</Link>
          </div>
        </section>
      )}

      <RoadGoalPicker current={data.eloGoal} />
      <div className="pf-footer">
        <SignOutButton />
      </div>
    </main>
  );
}
