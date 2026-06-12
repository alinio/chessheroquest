/**
 * Tiny server-rendered SVG sparkline (no client JS). Renders nothing with
 * fewer than 2 points — no fake flat lines over missing data.
 */
export function Sparkline({
  points,
  width = 132,
  height = 28,
  label,
}: {
  points: number[];
  width?: number;
  height?: number;
  label?: string;
}) {
  if (points.length < 2) return null;

  const pad = 2;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1; // flat series → centered line
  const stepX = (width - pad * 2) / (points.length - 1);

  const coords = points
    .map((v, i) => {
      const x = pad + i * stepX;
      const y = pad + (height - pad * 2) * (1 - (v - min) / span);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg
      className="a-spark"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <polyline
        points={coords}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
