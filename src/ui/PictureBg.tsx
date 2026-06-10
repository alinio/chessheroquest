import type { CSSProperties } from "react";

/**
 * Full-bleed background image with a portrait variant for phone viewports.
 * Fixes the 16:9-source-cropped-60%-on-mobile defect (DESIGN.md assets bar):
 * portrait screens get true 9:16 art instead of a center-crop + upscale.
 */
export function PictureBg({
  landscape,
  portrait,
  className,
  style,
}: {
  landscape: string;
  portrait?: string;
  className?: string;
  style?: CSSProperties;
}) {
  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={landscape}
      alt=""
      className={className}
      style={{ width: "100%", height: "100%", objectFit: "cover", ...style }}
    />
  );
  if (!portrait) return img;
  return (
    <picture>
      <source media="(orientation: portrait)" srcSet={portrait} />
      {img}
    </picture>
  );
}
