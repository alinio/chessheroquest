"use client";

/**
 * /welcome — one-time post-payment Arrival / orientation (UX audit P0). Immersive, no
 * shell. Shown once: sets chq-arrival-seen on first view and never blocks again (a
 * second visit redirects straight to /train).
 * TODO(real-data): build ArrivalFixture from the persisted DNA result (archetype, IQ,
 * edge/gap) instead of DEMO_ARRIVAL.
 */
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrivalScreen } from "@/src/ui/onboarding/ArrivalScreen";
import { DEMO_ARRIVAL } from "@/src/dev/fixtures";

const SEEN_KEY = "chq-arrival-seen";

export default function WelcomePage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem(SEEN_KEY)) {
      router.replace("/train"); // already oriented — never block again
      return;
    }
    try { localStorage.setItem(SEEN_KEY, "1"); } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only one-time mount gate
    setReady(true);
  }, [router]);

  if (!ready) return null;

  return (
    <ArrivalScreen
      arrival={DEMO_ARRIVAL}
      onStart={() => router.push(`/train/${DEMO_ARRIVAL.strengthId}/learn`)}
      onSkip={() => router.push("/train")}
    />
  );
}
