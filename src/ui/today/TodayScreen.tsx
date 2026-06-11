/**
 * Today / Train — the daily cockpit. "Cathedral above, workbench below":
 * a thin HUD, one cinematic hero with ONE primary directive AND the day's
 * board (the first due SRS position — the board IS the button), then the
 * day's real missions (from the domain quest engine — real XP, real targets,
 * real positions) and a single coach line. Every CTA routes to a real
 * training surface; every diagram is a position the click will train.
 */
import "@/src/ui/shell/hub.css";
import Link from "next/link";
import { ASSETS } from "@/src/lib/assets";
import { PictureBg } from "@/src/ui/PictureBg";
import { MiniBoard } from "@/src/ui/board/MiniBoard";
import { generateDailyQuests, type Quest } from "@/src/domain/gamification/quests";
import { xpProgress } from "@/src/domain/gamification/xp";
import { HowItWorks } from "@/src/ui/onboarding/HowItWorks";

export interface TodayOpeningRef {
  /** STARTER_PATHS id — routes to /drill/[slug] and /train/[slug]/learn. */
  slug: string;
  name: string;
}

/** A real position to preview (server-derived from fenAfter + the SRS queue). */
export interface TodayBoardView {
  fen: string;
  orientation: "white" | "black";
  lastMove: { from: string; to: string } | null;
}

export interface TodayData {
  streakDays: number;
  /** Total XP (drives level + progress in the HUD). */
  xp: number;
  /** SRS cards due now — the Daily Quest size. */
  dueDrills: number;
  eloGoal: number;
  /** Road-to-Elo fill, 0–100 (from Opening IQ). */
  eloPct: number;
  strongest: string | null;
  /** Next line to push toward a seal (focus "boss" candidate). */
  recommended: TodayOpeningRef | null;
  /** Weakest line — the Weakness Battle target. */
  weakest: TodayOpeningRef | null;
  /**
   * The day's board (hero): the FIRST due SRS card's position, or — all
   * clear — the recommended line two moves in. Null only when neither
   * exists (never a generic decorative diagram).
   */
  dueFen: string | null;
  dueOrientation: "white" | "black";
  dueLineName: string | null;
  dueLastMove: { from: string; to: string } | null;
  /** Tabiya of the weakest line (Weakness Battle card). */
  weaknessBoard: TodayBoardView | null;
  /** Tabiya of the boss line (Boss mission card). */
  bossBoard: TodayBoardView | null;
}

const QUEST_GLYPH: Record<Quest["type"], string> = {
  daily_quest: "⚔",
  weakness_battle: "🎯",
  boss_fight: "♛",
};

function questHref(q: Quest, data: TodayData): string {
  if (q.type === "weakness_battle" && data.weakest) return `/drill/${data.weakest.slug}`;
  if (q.type === "boss_fight" && data.recommended) return `/boss/${data.recommended.slug}`;
  return "/review";
}

function questMeta(q: Quest, data: TodayData): string {
  if (q.type === "daily_quest")
    return data.dueDrills === 0
      ? "All clear — come back tomorrow"
      : `${data.dueDrills} card${data.dueDrills === 1 ? "" : "s"} · ~${Math.max(2, Math.ceil(data.dueDrills / 2))} min`;
  if (q.type === "weakness_battle") return "Patch your biggest leak";
  return "Win it → a seal in your Passport";
}

/** The REAL position each mission trains — or null (then the glyph stays). */
function questBoard(q: Quest, data: TodayData): TodayBoardView | null {
  if (q.type === "daily_quest") {
    // Same board as the hero: the first due card. All-clear → done glyph.
    return data.dueDrills > 0 && data.dueFen
      ? { fen: data.dueFen, orientation: data.dueOrientation, lastMove: data.dueLastMove }
      : null;
  }
  if (q.type === "weakness_battle") return data.weaknessBoard;
  return data.bossBoard;
}

const sideToMove = (fen: string): "White" | "Black" =>
  fen.split(" ")[1] === "b" ? "Black" : "White";

export function TodayScreen({ data }: { data: TodayData }) {
  const level = xpProgress(data.xp);
  const allClear = data.dueDrills === 0;
  const quests = generateDailyQuests({
    dueCount: data.dueDrills,
    weakestOpeningName: data.weakest?.name ?? null,
    bossOpeningName: data.recommended?.name ?? null,
  });
  const primaryHref = allClear && data.recommended
    ? `/train/${data.recommended.slug}/learn`
    : "/review";
  const heroBoard = data.dueFen !== null;

  return (
    <main className="today-v2">
      <HowItWorks />

      {/* thin HUD — streak + level only (the canonical IQ lives in the top bar) */}
      <div className="today-hud">
        <span className="h">
          Level <b>{level.level}</b> · {level.into}/{level.needed} XP
        </span>
        <span className="sep" />
        <span className="h">{allClear ? "Review clear ✓" : `${data.dueDrills} due today`}</span>
      </div>

      {/* cinematic HERO — the one thing to do now, and the board it happens on */}
      <section className="today-hero">
        <div className="bg">
          <PictureBg landscape={ASSETS.backgrounds.today} portrait={ASSETS.backgrounds.todayPortrait} />
        </div>
        <div className={heroBoard ? "hero-split" : undefined}>
          <div className="focal">
            <p className="eyebrow gold">Daily training</p>
            <h1 className="serif">
              {allClear ? "All clear, hero." : `${data.dueDrills} drills due`}
            </h1>
            <p className="sub">
              {allClear && data.recommended ? (
                <>Review done. Push <b style={{ color: "var(--gold-bright)" }}>{data.recommended.name}</b> toward its seal.</>
              ) : (
                <>Clear today&apos;s review{data.recommended ? <>, then push <b style={{ color: "var(--gold-bright)" }}>{data.recommended.name}</b></> : null}.</>
              )}
            </p>
            <Link className="btn-gold cta" href={primaryHref}>
              {allClear && data.recommended ? `Learn ${data.recommended.name} →` : "Start drills →"}
            </Link>
          </div>
          {heroBoard && data.dueFen && (
            // The day's board — the exact position the CTA trains. Board = button.
            <Link
              className="hero-board"
              href={primaryHref}
              aria-label={`${data.dueLineName ?? "Today's position"} — ${sideToMove(data.dueFen)} to move. ${allClear ? "Learn the line" : "Start drills"}.`}
            >
              <MiniBoard
                fen={data.dueFen}
                orientation={data.dueOrientation}
                lastMove={data.dueLastMove}
                size="hero"
                caption={
                  data.dueLineName ? (
                    <>
                      <b>{data.dueLineName}</b> · {sideToMove(data.dueFen)} to move
                    </>
                  ) : undefined
                }
              />
            </Link>
          )}
        </div>
        {/* Road to Elo — thin secondary sliver */}
        <div className="road">
          <div className="rl">
            <span>Road to Elo · {data.eloGoal}</span>
            {data.strongest && <span>Strongest · {data.strongest}</span>}
          </div>
          <div className="bar"><span style={{ width: `${data.eloPct}%` }} /></div>
        </div>
      </section>

      {/* the day's missions — real quest engine, real XP, real positions */}
      <section className="today-missions" aria-label="Today's missions">
        {quests.map((q) => {
          const done = q.type === "daily_quest" && allClear;
          const board = done ? null : questBoard(q, data);
          return (
            <Link
              key={q.type}
              className={`m-card${done ? " done" : ""}`}
              href={questHref(q, data)}
            >
              {board ? (
                <span className="m-board" aria-hidden="true">
                  <MiniBoard
                    fen={board.fen}
                    orientation={board.orientation}
                    lastMove={board.lastMove}
                    size="card"
                  />
                </span>
              ) : (
                <span className="m-glyph" aria-hidden="true">{done ? "✓" : QUEST_GLYPH[q.type]}</span>
              )}
              <span className="m-body">
                <span className="m-title">{q.title}</span>
                <span className="m-desc">{q.description}</span>
                <span className="m-meta">{questMeta(q, data)}</span>
              </span>
              <span className="m-xp">+{q.xpReward} XP</span>
            </Link>
          );
        })}
      </section>

      {/* coach — one discreet line */}
      <div className="today-coach">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={ASSETS.coach.mentor} alt="" />
        <p>
          {data.recommended ? (
            <>After your drills, try one new line in <b>{data.recommended.name}</b> — your fastest path up the ladder.</>
          ) : (
            <>Clear your review first — small daily reps beat long rare sessions.</>
          )}
        </p>
      </div>
    </main>
  );
}
