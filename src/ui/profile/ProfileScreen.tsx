/**
 * Profile — the hero identity hub section. Archetype portrait + level/XP, lifetime
 * stats (Opening IQ, rank, seals, streak record), strength/gap, and re-take / share
 * actions. Rendered inside AppShell (active = Profile). Data-driven.
 */
import "@/src/ui/shell/hub.css";
import { getArchetypeArt, getRankInsignia } from "@/src/lib/assets";
import type { ProfileFixture } from "@/src/dev/fixtures";

export function ProfileScreen({ profile }: { profile: ProfileFixture }) {
  const xpPct = Math.round((profile.xp / profile.xpNext) * 100);

  return (
    <main className="profile">
      <section className="pf-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="pf-portrait" src={getArchetypeArt(profile.archetype)} alt="" />
        <div className="pf-id">
          <p className="eyebrow gold">{profile.realmName}</p>
          <h1 className="serif">{profile.archetypeName}</h1>
          <p className="meta"><b>{profile.name}</b> · Level {profile.level} · joined {profile.joined}</p>
          <div className="pf-xp">
            <div className="xl"><span>Level {profile.level}</span><span>{profile.xp} / {profile.xpNext} XP</span></div>
            <div className="bar"><span style={{ width: `${xpPct}%` }} /></div>
          </div>
        </div>
      </section>

      <div className="pf-stats">
        <div className="pf-stat"><span className="n">{profile.openingIq}</span><span className="k">Opening IQ · Top {profile.topPercent}%</span></div>
        <div className="pf-stat">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={getRankInsignia(profile.rankElo)} alt="" />
          <span className="k">Rank · {profile.rankElo}</span>
        </div>
        <div className="pf-stat"><span className="n">{profile.totalSeals}/{profile.totalOpenings}</span><span className="k">Openings sealed</span></div>
        <div className="pf-stat"><span className="n">{profile.streakRecord}</span><span className="k">Best streak (days)</span></div>
      </div>

      <div className="pf-stats">
        <div className="pf-stat"><span className="n" style={{ fontSize: 18 }}>{profile.strength}</span><span className="k">Strongest opening</span></div>
        <div className="pf-stat"><span className="n" style={{ fontSize: 18, color: "#e0726b" }}>{profile.weakness}</span><span className="k">Focus — weakest</span></div>
      </div>

      <div className="pf-actions">
        <button className="btn-gold sm" type="button">Share my DNA card</button>
        <button className="btn-ghost" type="button">Re-take the DNA test</button>
      </div>
    </main>
  );
}
