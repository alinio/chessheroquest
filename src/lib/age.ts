/**
 * Age band from birth year (LAW #5 — minor safety / COPPA-GDPR-K). Captured at
 * signup; drives default profile visibility + social gating. Pure.
 */
export type AgeBand = "under_13" | "age_13_15" | "age_16_17" | "adult";

export function ageBandFromBirthYear(birthYear: number, currentYear: number): AgeBand {
  const age = currentYear - birthYear;
  if (age < 13) return "under_13";
  if (age <= 15) return "age_13_15";
  if (age <= 17) return "age_16_17";
  return "adult";
}
