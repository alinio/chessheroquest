/**
 * /profile — the player's identity (master-vision §28.1, solo view). Shows the
 * real Opening IQ, rank, streak/level, and the saved DNA card. Sign-out here.
 */
import { redirect } from "next/navigation";
import { auth } from "@/src/lib/auth";
import { getProgress, getLatestDnaResult } from "@/src/data/repos/progress";
import { getAchievements } from "@/src/data/repos/achievements";
import { rankForIq } from "@/src/domain/iq/calibration";
import { xpProgress } from "@/src/domain/gamification/xp";
import { isStreakAlive } from "@/src/domain/gamification/streak";
import { DnaCard, ARCHETYPE_META } from "@/src/ui/screens/DnaCard";
import { ShareButton } from "@/src/ui/ShareButton";
import { SignOutButton } from "@/src/ui/SignOutButton";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface rounded-card p-3">
      <p className="font-display text-text-hi text-xl font-bold tabular-nums">{value}</p>
      <p className="text-text-low text-xs">{label}</p>
    </div>
  );
}

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");

  const [progress, dna, titles] = await Promise.all([
    getProgress(session.user.id),
    getLatestDnaResult(session.user.id),
    getAchievements(session.user.id),
  ]);

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col gap-6 px-4 py-6">
      <header className="text-center">
        <p className="font-display text-gold text-xs uppercase tracking-[0.3em]">Profile</p>
        <h1 className="text-text-hi truncate text-lg font-medium">{session.user.email}</h1>
      </header>

      {progress ? (
        <>
          <section className="text-center">
            <p
              className="font-display text-gold-bright text-6xl font-black tabular-nums"
              style={{ textShadow: "0 0 28px rgba(227,178,60,0.45)" }}
            >
              {progress.iq}
            </p>
            <p className="font-display text-gold text-sm">{rankForIq(progress.iq)}</p>
          </section>

          <section className="grid grid-cols-3 gap-3 text-center">
            <Stat
              label="Streak"
              value={`${
                isStreakAlive(
                  { count: progress.streakCount, lastActiveDay: progress.streakLastActiveDay },
                  new Date(),
                )
                  ? progress.streakCount
                  : 0
              }`}
            />
            <Stat label="Level" value={`${xpProgress(progress.xp).level}`} />
            <Stat label="Due" value={`${progress.dueCount}`} />
          </section>

          {titles.length > 0 && (
            <section className="flex flex-col gap-2">
              <p className="font-display text-text-hi text-sm uppercase tracking-[0.2em]">
                Titles
              </p>
              <div className="flex flex-wrap gap-2">
                {titles.map((t) => (
                  <span
                    key={t.key}
                    className="border-gold/50 text-gold inline-flex items-center gap-1 rounded-chip border px-3 py-1 text-xs font-semibold"
                  >
                    <span aria-hidden>★</span> {t.title}
                  </span>
                ))}
              </div>
            </section>
          )}

          {dna && (
            <>
              <DnaCard result={dna} />
              <ShareButton
                text={`My Chess DNA: ${ARCHETYPE_META[dna.archetype].label} · Opening IQ ${dna.initialIq}. Discover yours →`}
              />
            </>
          )}
        </>
      ) : (
        <p className="text-text-mid text-center text-sm">
          Take the Chess DNA Test to build your profile.
        </p>
      )}

      <SignOutButton />
    </main>
  );
}
