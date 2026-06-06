"use client";

import { useState } from "react";

/**
 * Share / copy a back-link to the free DNA Test — the viral flywheel (§11, §28.14).
 * Uses the native share sheet on mobile, falls back to copying the link.
 */
export function ShareButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function onShare() {
    const url =
      typeof window !== "undefined" ? `${window.location.origin}/dna` : "https://chessheroquest.com/dna";

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "ChessHeroQuest", text, url });
        return;
      } catch {
        /* user cancelled — fall through to copy */
      }
    }

    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <button
      type="button"
      onClick={onShare}
      className="rounded-chip border-gold text-gold inline-flex min-h-[44px] items-center justify-center border px-6 text-sm font-semibold"
    >
      {copied ? "Link copied!" : "Share my DNA"}
    </button>
  );
}
