/**
 * /train — the board surface (build order #1). Server component that selects a
 * curated path and hands it to the client LineTrainer. Mobile-first layout.
 */
import { LineTrainer } from "@/src/ui/board/LineTrainer";
import { STARTER_PATHS } from "@/src/domain/repertoire/starter-paths";

export default function TrainPage() {
  const path = STARTER_PATHS[0]!;

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col gap-6 px-4 py-6">
      <header className="text-center">
        <p className="font-display text-gold text-xs uppercase tracking-[0.3em]">
          Training
        </p>
        <h1 className="font-display text-text-hi text-2xl font-bold">Play the line</h1>
      </header>

      <LineTrainer path={path} />
    </main>
  );
}
