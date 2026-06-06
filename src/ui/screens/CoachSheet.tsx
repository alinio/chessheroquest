"use client";

/**
 * The mentor's counsel — a parchment-toned bottom sheet (DESIGN.md §5). Shows the
 * cached AI explanation summoned during Learn/Drill. The board stays clean; the
 * coaching lives around it.
 */
export function CoachSheet({
  open,
  loading,
  text,
  onClose,
}: {
  open: boolean;
  loading: boolean;
  text: string | null;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-xl px-3 pb-3">
      <div
        className="rounded-card border-t-2 p-5"
        style={{
          backgroundColor: "#efe6d0",
          color: "#2a2419",
          borderColor: "rgba(227,178,60,0.6)",
          boxShadow: "0 -16px 44px rgba(0,0,0,0.55)",
        }}
      >
        <div className="flex items-center justify-between">
          <p
            className="font-display text-sm uppercase tracking-[0.2em]"
            style={{ color: "#6b5a2a" }}
          >
            The Mentor&apos;s Counsel
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="min-h-[44px] px-2 text-lg"
            style={{ color: "#6b5a2a" }}
          >
            ✕
          </button>
        </div>
        <p className="mt-2 text-sm leading-relaxed" aria-live="polite">
          {loading ? "The mentor is considering…" : (text ?? "")}
        </p>
      </div>
    </div>
  );
}
