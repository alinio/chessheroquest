/**
 * A small, legible coded chessboard (kickoff pass 2 §4 — coded motion, NOT AI
 * video). Renders a sparse position from an 8-rank string array. Board stays
 * clean per THE BOARD RULE (DESIGN.md): parchment/stone squares, classic glyphs,
 * a gold highlight on the "answer" square. Illustrative only — no evaluation.
 */
const GLYPH: Record<string, string> = {
  K: "♔",
  Q: "♕",
  R: "♖",
  B: "♗",
  N: "♘",
  P: "♙",
  k: "♚",
  q: "♛",
  r: "♜",
  b: "♝",
  n: "♞",
  p: "♟",
};

export interface MiniPosition {
  /** 8 strings (rank 8 → rank 1), 8 chars each: piece letters or "." */
  ranks: string[];
  /** [row, col] of the highlighted "answer" square (0,0 = a8). */
  highlight?: [number, number];
}

export function MiniBoard({
  position,
  size = 168,
}: {
  position: MiniPosition;
  size?: number;
}) {
  return (
    <div
      className="grid overflow-hidden rounded-md shadow-[0_8px_24px_-10px_rgba(0,0,0,0.7)]"
      style={{
        width: size,
        height: size,
        gridTemplateColumns: "repeat(8, 1fr)",
      }}
      aria-hidden
    >
      {position.ranks.flatMap((rank, r) =>
        rank.split("").map((ch, c) => {
          const dark = (r + c) % 2 === 1;
          const isHi =
            position.highlight?.[0] === r && position.highlight?.[1] === c;
          const white = ch !== "." && ch === ch.toUpperCase();
          return (
            <div
              key={`${r}-${c}`}
              className="flex items-center justify-center"
              style={{
                background: isHi
                  ? "var(--color-sq-hint)"
                  : dark
                    ? "var(--color-sq-dark)"
                    : "var(--color-sq-light)",
                fontSize: size / 9,
                lineHeight: 1,
                color: white ? "#fbfbf7" : "#15140f",
                textShadow: white
                  ? "0 1px 1px rgba(0,0,0,0.45)"
                  : "0 1px 0 rgba(255,255,255,0.25)",
              }}
            >
              {GLYPH[ch] ?? ""}
            </div>
          );
        }),
      )}
    </div>
  );
}
