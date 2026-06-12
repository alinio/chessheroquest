/**
 * Admin display formatting — UTC everywhere (an ops tool needs one clock),
 * en-US numerals, and explicit em-dashes for absent values.
 */

export function fmtInt(n: number): string {
  return n.toLocaleString("en-US");
}

export function fmtUsd(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });
}

export function fmtPct(ratio: number): string {
  return `${(ratio * 100).toFixed(1)}%`;
}

const DATE_FMT = new Intl.DateTimeFormat("en-CA", {
  timeZone: "UTC",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const DATETIME_FMT = new Intl.DateTimeFormat("en-CA", {
  timeZone: "UTC",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export function fmtDate(d: Date | null | undefined): string {
  return d ? DATE_FMT.format(d) : "—";
}

export function fmtDateTime(d: Date | null | undefined): string {
  return d ? `${DATETIME_FMT.format(d).replace(",", "")} UTC` : "—";
}
