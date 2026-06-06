/**
 * /drill — SRS recall over a curated line (build order #3). Surfaces FSRS
 * scheduling and, for the signed-in user, records the session (streak + XP + moat).
 */
import { auth } from "@/src/lib/auth";
import { Drill } from "@/src/ui/screens/Drill";
import { STARTER_PATHS } from "@/src/domain/repertoire/starter-paths";

export default async function DrillPage() {
  const session = await auth();
  const path = STARTER_PATHS[0]!;

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col gap-6 px-4 py-6">
      <header className="text-center">
        <p className="font-display text-gold text-xs uppercase tracking-[0.3em]">Drill</p>
        <h1 className="font-display text-text-hi text-2xl font-bold">Recall the line</h1>
      </header>
      <Drill path={path} userId={session?.user?.id} />
    </main>
  );
}
