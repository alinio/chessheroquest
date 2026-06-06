/**
 * /review — the Daily Quest: recall the positions FSRS says are due, across all
 * openings (master-vision §13.1). The core of the hidden retention loop.
 */
import { auth } from "@/src/lib/auth";
import { getDueCards } from "@/src/data/repos/cards";
import { Review } from "@/src/ui/screens/Review";

export default async function ReviewPage() {
  const session = await auth();
  const items = session?.user?.id ? await getDueCards(session.user.id, new Date(), 12) : [];

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col gap-6 px-4 py-6">
      <header className="text-center">
        <p className="font-display text-gold text-xs uppercase tracking-[0.3em]">Daily Quest</p>
        <h1 className="font-display text-text-hi text-2xl font-bold">Review due positions</h1>
      </header>
      <Review items={items} userId={session?.user?.id} />
    </main>
  );
}
