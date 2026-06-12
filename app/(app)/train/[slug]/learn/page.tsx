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

  // No banner header — the LineTrainer's compact HUD is the whole chrome;
  // the screen's width goes to the board + explorer panel.
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col gap-4 px-4 py-6 lg:px-8">
      <h1 className="sr-only">{`Learn — ${path.name}`}</h1>
      <LineTrainer path={path} />
    </main>
  );
}
