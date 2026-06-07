/** Minimal Tabler-style inline SVG icons for the hub shell (currentColor, no CDN). */
import type { SVGProps } from "react";

const base = (props: SVGProps<SVGSVGElement>) => ({
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  ...props,
});

export const IconFlame = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M12 12c2 -2.96 0 -7 -1 -8c0 3.038 -1.773 4.741 -3 6c-1.226 1.26 -2 3.24 -2 5a6 6 0 1 0 12 0c0 -1.532 -1.056 -3.94 -2 -5c-1.786 3 -2.791 3 -4 2z" /></svg>
);
export const IconMap2 = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M9 4l-5 2v14l5 -2l6 2l5 -2v-14l-5 2l-6 -2" /><path d="M9 4v13" /><path d="M15 7v13" /></svg>
);
export const IconChartLine = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M4 19l0 -14" /><path d="M4 19l16 0" /><path d="M7 14l4 -4l3 3l5 -6" /></svg>
);
export const IconAward = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><circle cx="12" cy="9" r="6" /><path d="M9 14.2l-1.5 6.3l4.5 -2.7l4.5 2.7l-1.5 -6.3" /></svg>
);
export const IconShield = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M12 3l8 3v5c0 5 -3.5 8 -8 9c-4.5 -1 -8 -4 -8 -9v-5l8 -3z" /></svg>
);
export const IconMap = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M18 7l0 .01" /><path d="M18 12.5l-3 -4a3.5 3.5 0 1 1 6 0l-3 4z" /><path d="M9 6l-5 2v13l5 -2l6 2l5 -2" /><path d="M9 6v13" /><path d="M15 12v9" /></svg>
);
export const IconCreditCard = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M3 10l18 0" /><path d="M7 15l.01 0" /><path d="M11 15l2 0" /></svg>
);
export const IconSettings = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M10.3 4.3a1.9 1.9 0 0 0 3.4 0a1.9 1.9 0 0 1 2.7 2.7a1.9 1.9 0 0 0 0 3.4a1.9 1.9 0 0 1 -2.7 2.7a1.9 1.9 0 0 0 -3.4 0a1.9 1.9 0 0 1 -2.7 -2.7a1.9 1.9 0 0 0 0 -3.4a1.9 1.9 0 0 1 2.7 -2.7" transform="translate(0 1.5)" /><circle cx="12" cy="13.5" r="2.5" /></svg>
);
export const IconLogout = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M14 8v-2a2 2 0 0 0 -2 -2h-5a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h5a2 2 0 0 0 2 -2v-2" /><path d="M9 12h12l-3 -3" /><path d="M18 15l3 -3" /></svg>
);
export const IconCrown = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M12 6l3 4l4 -3l-1.5 9h-11l-1.5 -9l4 3z" /></svg>
);
export const IconLock = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11v-4a4 4 0 0 1 8 0v4" /></svg>
);
