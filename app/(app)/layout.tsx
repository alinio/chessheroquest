/**
 * Authenticated app shell. Every /(app) route requires a session —
 * unauthenticated visitors are sent to /signin. The shell chrome (realm,
 * crest, avatar, streak, IQ) is the user's REAL progression; brand-new
 * players (no DNA yet) get a neutral shell with no fake numbers.
 */
import { redirect } from "next/navigation";
import { auth } from "@/src/lib/auth";
import { getProgress } from "@/src/data/repos/progress";
import { isStreakAlive } from "@/src/domain/gamification/streak";
import { AppShell } from "@/src/ui/shell/AppShell";
import { ARCHETYPE_REALM, REALM_NAMES, getArchetypeSigil, getArchetypeArt } from "@/src/lib/assets";
import "@/src/ui/animations.css";
import "@/src/ui/shell/hub.css";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");

  const progress = await getProgress(session.user.id);
  const archetype = progress?.archetype ?? null;
  const realm = archetype ? ARCHETYPE_REALM[archetype] : null;

  return (
    <AppShell
      realmName={realm ? REALM_NAMES[realm] : "ChessHeroQuest"}
      realmCrest={archetype ? getArchetypeSigil(archetype) : null}
      heroAvatar={archetype ? getArchetypeArt(archetype) : null}
      streak={
        progress
          ? isStreakAlive(
              { count: progress.streakCount, lastActiveDay: progress.streakLastActiveDay },
              new Date(),
            )
            ? progress.streakCount
            : 0
          : null
      }
      iq={progress?.iq ?? null}
    >
      {children}
    </AppShell>
  );
}
