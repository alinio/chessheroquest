/**
 * /dna — the Chess DNA Test (build order #2, the viral front door). Public, no
 * app chrome (screen S1). If the visitor is signed in, the result is persisted
 * (seeds their Opening IQ); anonymous visitors still get the full experience.
 */
import { auth } from "@/src/lib/auth";
import { DnaTest } from "@/src/ui/screens/DnaTest";

export default async function DnaPage() {
  const session = await auth();

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col px-4 py-6">
      <DnaTest userId={session?.user?.id} />
    </main>
  );
}
