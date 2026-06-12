/**
 * Realms — overview of the 4 worlds (Ember/Obsidian/Aegis/Mirage). Each card shows the
 * realm's crest + accent, progress (sealed/total), the tabiya of the FIRST unsealed
 * opening (real fenAfter — LAW #2) or the realm seal at 5/5, the Realm Boss line
 * (KINGDOM_BOSSES — authored names only), and an Enter CTA. The player's home realm
 * is ordered first and visually dominant. Rendered inside AppShell (active = Quest).
 */
import type { CSSProperties } from "react";
import Link from "next/link";
import "@/src/ui/shell/hub.css";
import { ASSETS, getArchetypeSigil } from "@/src/lib/assets";
import { MiniBoard } from "@/src/ui/board/MiniBoard";
import type { RealmEntry } from "@/src/dev/fixtures";

export function RealmsScreen({ realms }: { realms: RealmEntry[] }) {
  // The player's home realm leads — its card is the dominant one.
  const ordered = [...realms].sort((a, b) => Number(b.current) - Number(a.current));

  return (
    <main className="realms">
      <div className="ins-head">
        <p className="eyebrow gold">Realms</p>
        <h2 className="serif">Four worlds, one repertoire.</h2>
        <p className="sub">Each realm holds 5 openings. Seal them all, beat the Realm Boss, claim the realm.</p>
      </div>

      <div className="realm-grid">
        {ordered.map((r) => {
          const fullySealed = r.sealed >= r.total;
          const toGo = r.total - r.sealed;
          return (
            <section key={r.id} className={`rc${r.current ? " cur" : ""}`} style={{ "--accent": r.accent } as CSSProperties}>
              <div className="rc-top">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="rc-crest" src={getArchetypeSigil(r.archetype)} alt="" />
                <div>
                  <h3 className="serif">{r.name}</h3>
                  <div className="sub">{r.sub}</div>
                </div>
                {r.current && <span className="cur-badge">Current</span>}
              </div>

              {fullySealed ? (
                <div className="rc-next">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="rc-seal" src={ASSETS.passport.stampMastered} alt="Realm sealed" />
                  <div className="rc-next-text">
                    <div className="nl">All 5 openings sealed</div>
                    {r.bossName && <div className="bl gauntlet">The Gauntlet is open. {r.bossName} waits.</div>}
                  </div>
                </div>
              ) : r.next ? (
                <div className="rc-next">
                  <MiniBoard fen={r.next.fen} orientation={r.next.orientation} lastMove={r.next.lastMove} size="chip" />
                  <div className="rc-next-text">
                    <div className="nl">Next: {r.next.openingName}</div>
                    {r.bossName && (
                      <div className="bl">Realm Boss: {toGo} seal{toGo === 1 ? "" : "s"} to go</div>
                    )}
                  </div>
                </div>
              ) : null}

              <div className="prog">
                <div className="pl"><span><b>{r.sealed}</b> / {r.total} sealed</span><span>{Math.round((r.sealed / r.total) * 100)}%</span></div>
                <div className="rbar"><span style={{ width: `${(r.sealed / r.total) * 100}%` }} /></div>
              </div>

              <div className="rc-foot">
                <Link className="btn-ghost" href={`/quest?realm=${r.id}`} style={{ textDecoration: "none", display: "inline-block" }}>
                  {r.current ? "Continue →" : "Enter realm →"}
                </Link>
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
