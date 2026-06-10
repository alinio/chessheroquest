/**
 * /train/[slug]/learn — the curated line board trainer (moved from /train/[slug],
 * which now shows the Opening detail). The coach panel is on-demand (cached AI, LAW #2).
 * TODO(immersion): Learn/Drill still inherit the (app) AppShell — extract to a
 * shell-less sub-group for true full-screen immersion.
 */
import { notFound } from "next/navigation";
import { LineTrainer } from "@/src/ui/board/LineTrainer";
import { STARTER_PATHS } from "@/src/domain/repertoire/starter-paths";

export default async function TrainLineLearnPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const path = STARTER_PATHS.find((p) => p.id === slug);
  if (!path) notFound();

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col gap-6 px-4 py-6">
      <header className="text-center">
        <p className="font-display text-gold text-xs uppercase tracking-[0.3em]">Learn</p>
        <h1 className="font-display text-text-hi text-2xl font-bold">Play the line</h1>
      </header>
      <LineTrainer path={path} />
    </main>
  );
}
