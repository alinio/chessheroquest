/**
 * /drill/[slug] — SRS recall over one curated line. Records the session for the
 * signed-in user (streak + XP + FSRS cards + moat).
 */
import { notFound } from "next/navigation";
import { auth } from "@/src/lib/auth";
import { Drill } from "@/src/ui/screens/Drill";
import { STARTER_PATHS } from "@/src/domain/repertoire/starter-paths";

export default async function DrillLinePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const path = STARTER_PATHS.find((p) => p.id === slug);
  if (!path) notFound();

  const session = await auth();

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
