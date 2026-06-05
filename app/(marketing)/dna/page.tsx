/**
 * /dna — the Chess DNA Test (build order #2, the viral front door).
 * Public, no app shell / nav chrome (master-vision screen S1).
 */
import { DnaTest } from "@/src/ui/screens/DnaTest";

export default function DnaPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col px-4 py-6">
      <DnaTest />
    </main>
  );
}
