"use client";

/**
 * One-time gate for the Arrival diagnosis: first visit shows it (and marks it
 * seen), later visits go straight to the cockpit.
 */
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrivalScreen } from "@/src/ui/onboarding/ArrivalScreen";
import type { ArrivalFixture } from "@/src/dev/fixtures";

const SEEN_KEY = "chq-arrival-seen";

export function WelcomeClient({ arrival, learnUrl }: { arrival: ArrivalFixture; learnUrl: string }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(SEEN_KEY)) {
      router.replace("/train"); // already oriented — never block again
      return;
    }
    try {
      localStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* private mode — show it anyway */
    }
    const t = window.setTimeout(() => setReady(true), 0);
    return () => window.clearTimeout(t);
  }, [router]);

  if (!ready) return null;

  return (
    <ArrivalScreen
      arrival={arrival}
      onStart={() => router.push(learnUrl)}
      onSkip={() => router.push("/train")}
    />
  );
}
