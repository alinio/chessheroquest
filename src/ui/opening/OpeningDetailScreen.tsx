/**
 * Opening detail — banner hero + détouré emblem crest + REAL mastery bar +
 * the Learn → Drill → Guardian ladder + the Opening Guardian entry. Rendered
 * inside <AppShell active="quest">. Gold accent only — the banner carries
 * identity. ONE gold button per screen: the computed next step; everything
 * else is ghost (spec §C-loop: gating Learn ✓ → Drill ✓ → Guardian).
 */
import "@/src/ui/shell/hub.css";
import Link from "next/link";
import { getOpeningArt, getOpeningRealm, getRealmBoss, REALM_NAMES, PLACEHOLDER, type OpeningId } from "@/src/lib/assets";
import { OPENING_TO_PATH } from "@/src/lib/opening-paths";
import { GUARDIANS, PATH_SIDE } from "@/src/domain/world/guardians";
import type { MasteryState } from "@/src/domain/mastery";

const pretty = (id: string) => id.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
const noThe = (s: string) => s.replace(/^The\s+/, "");

const STATE_LABEL: Record<MasteryState, string> = {
  leak: "Leak — start here",
  review: "Review — refresh the line",
  solid: "Solid — close to gold",
  gold: "Gold — conquered",
};

export interface OpeningMasteryView {
  studied: number;
  total: number;
  state: MasteryState;
}

export interface OpeningLineView {
  id: string;
  name: string;
  mastery: OpeningMasteryView | null;
  /** Half-moves in the curated line (real STARTER_PATHS length). */
  moves?: number;
  /** Honest session estimate for this line (player moves). */
  minutes?: number;
  /** True when the line has at least one SRS card due now. */
  dueToday?: boolean;
}

type Step = "learn" | "drill" | "guardian";

/**
 * Derive the ladder from the data we really have (no separate tracking yet):
 * any studied position = Learn done; full coverage = Drill done; gold =
 * the Guardian has been beaten AND the line retained.
 */
function deriveSteps(m: OpeningMasteryView | null | undefined) {
  const learn = Boolean(m && m.studied > 0);
  const drill = Boolean(m && m.total > 0 && m.studied >= m.total);
  const guardian = Boolean(m && m.state === "gold");
  const next: Step = !learn ? "learn" : !drill ? "drill" : "guardian";
  return { learn, drill, guardian, next };
}

function Stepper({ m }: { m: OpeningMasteryView | null | undefined }) {
  const s = deriveSteps(m);
  const cls = (done: boolean, isNext: boolean) =>
    `st${done ? " done" : ""}${isNext && !done ? " next" : ""}`;
  return (
    <span className="ol-step" aria-label="Line progress: Learn, Drill, Guardian">
      <span className={cls(s.learn, s.next === "learn")}>Learn{s.learn ? " ✓" : ""}</span>
      <span className="arr" aria-hidden="true">→</span>
      <span className={cls(s.drill, s.next === "drill")}>Drill{s.drill ? " ✓" : ""}</span>
      <span className="arr" aria-hidden="true">→</span>
      <span className={cls(s.guardian, s.next === "guardian")}>Guardian{s.guardian ? " ✓" : ""}</span>
    </span>
  );
}

export function OpeningDetailScreen({
  openingId,
  name,
  mastery,
  lines = [],
}: {
  openingId: OpeningId;
  name?: string;
  /** Real coverage from getOpeningMastery; absent = not started yet. */
  mastery?: OpeningMasteryView | null;
  /** Every curated line of this opening (mainline first), with real mastery. */
  lines?: OpeningLineView[];
}) {
  const art = getOpeningArt(openingId);
  const realm = getOpeningRealm(openingId);
  const realmFull = realm ? REALM_NAMES[realm] : "—";
  const realmShort = realm ? noThe(REALM_NAMES[realm]) : "—";
  const title = name ?? pretty(openingId);
  const pathId = OPENING_TO_PATH[openingId];
  const guardian = GUARDIANS[openingId];
  const pct = mastery && mastery.total > 0 ? Math.round((mastery.studied / mastery.total) * 100) : 0;
  const side = pathId ? (PATH_SIDE[pathId] ?? "white") : null;
  const { next } = deriveSteps(mastery);

  return (
    <main className="opening">
      <nav className="crumb">Quest <span>›</span> {realmShort} <span>›</span> <b>{title}</b></nav>

      {/* BANNER HERO (16:9 cover) */}
      <section className="banner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={art?.banner ?? PLACEHOLDER} alt={title} />
      </section>

      {/* détouré emblem crest overlapping the banner */}
      <div className="op-head">
        <div className="op-crest">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={art?.emblem ?? PLACEHOLDER} alt="" />
        </div>
        <div>
          <p className="eyebrow">{realmFull}</p>
          <h1 className="serif">{title}</h1>
          {side && (
            <span className="side-chip">
              <span aria-hidden="true">{side === "white" ? "♔" : "♚"}</span>
              You play {side === "white" ? "White" : "Black"}
            </span>
          )}
        </div>
      </div>

      <p className="lead">Master this opening through Learn &amp; Drill, then face its Guardian to push it toward the Passport seal.</p>

      <div className="mastery">
        <div className="bar"><span style={{ width: `${pct}%` }} /></div>
        <span className="m-label">
          {mastery
            ? `${STATE_LABEL[mastery.state]} · ${mastery.studied} / ${mastery.total} positions`
            : "Not started — learn the first line"}
        </span>
      </div>

      {/* ONE gold button — the computed next step; the rest stays ghost. */}
      <div className="actions">
        {pathId ? (
          <>
            <Link
              className={next === "learn" ? "btn-gold" : "btn-ghost"}
              href={`/train/${pathId}/learn`}
            >
              {next === "learn" ? "Learn the line →" : "Learn"}
            </Link>
            <Link
              className={next === "drill" ? "btn-gold" : "btn-ghost"}
              href={`/drill/${pathId}`}
            >
              {next === "drill" ? "Drill it from memory →" : "Drill"}
            </Link>
          </>
        ) : (
          <Link className="btn-gold" href="/train">Back to training →</Link>
        )}
      </div>

      {/* CURATED LINES — every branch, with its real Learn → Drill → Guardian ladder */}
      {lines.length > 1 && (
        <section className="op-lines">
          <p className="eyebrow gold">Lines</p>
          {lines.map((l) => {
            const sub = l.name.includes("—") ? l.name.split("—")[1]!.trim() : l.name;
            const ls = deriveSteps(l.mastery);
            return (
              <div className="op-line" key={l.id}>
                <span className="ol-wrap">
                  <span className="ol-name">
                    {sub}
                    {l.dueToday && <span className="ol-due">due today</span>}
                  </span>
                  {l.moves != null && l.minutes != null && (
                    <span className="ol-meta">{l.moves} moves · ~{l.minutes} min</span>
                  )}
                  <Stepper m={l.mastery} />
                </span>
                <span className="ol-state">
                  {l.mastery ? `${STATE_LABEL[l.mastery.state].split(" — ")[0]} · ${l.mastery.studied}/${l.mastery.total}` : "Not started"}
                </span>
                <span className="ol-actions">
                  {ls.next === "guardian" ? (
                    <>
                      <Link className="btn-ghost sm" href={`/drill/${l.id}`}>Drill</Link>
                      <Link className="btn-gold sm" href={`/boss/${l.id}`}>Guardian →</Link>
                    </>
                  ) : (
                    <>
                      <Link
                        className={ls.next === "learn" ? "btn-gold sm" : "btn-ghost sm"}
                        href={`/train/${l.id}/learn`}
                      >
                        Learn
                      </Link>
                      <Link
                        className={ls.next === "drill" ? "btn-gold sm" : "btn-ghost sm"}
                        href={`/drill/${l.id}`}
                      >
                        Drill
                      </Link>
                    </>
                  )}
                </span>
              </div>
            );
          })}
        </section>
      )}

      {/* OPENING GUARDIAN ENTRY — gold only when the duel is the next step */}
      {realm && guardian && pathId && (
        <section className="boss">
          <div className="boss-bg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={getRealmBoss(realm)} alt="" />
          </div>
          <div className="boss-inner">
            <div>
              <p className="eyebrow gold">Opening Guardian</p>
              <h3 className="serif">{guardian.name} — {guardian.title}</h3>
              <p className="muted">Play your side of the {title} from memory — win to push it toward <b style={{ color: "var(--gold-bright)" }}>gold</b>.</p>
            </div>
            <Link
              className={next === "guardian" ? "btn-gold" : "btn-ghost"}
              href={`/boss/${pathId}`}
            >
              {next === "guardian" ? "Face the Guardian →" : "Enter →"}
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
