/**
 * Style Quiz (Module 3) — domain types. Pure, framework-free.
 * 16 questions: 8 ARCHETYPE-weighted + 8 PROFILE (stored, NOT scored).
 * The quiz feeds the archetype recommendation only — it never touches Opening IQ
 * (GDD §2.2), keeping the IQ objective and the style declarative.
 */
export type Archetype = "warrior" | "strategist" | "defender" | "trickster";

export const ARCHETYPES: readonly Archetype[] = ["warrior", "strategist", "defender", "trickster"];

export interface ArchetypeOption {
  label: string;
  /** Archetype points awarded by this choice. */
  weights: Partial<Record<Archetype, number>>;
  /** Short phrase surfaced as a "reason" if it backs the recommendation. */
  reason?: string;
}

export interface ArchetypeQuestion {
  id: string;
  kind: "archetype";
  prompt: string;
  options: ArchetypeOption[];
}

export interface ProfileOption {
  label: string;
  value: string;
}

export interface ProfileQuestion {
  id: string;
  kind: "profile";
  /** Stored field key (rating, target, frequency, …). */
  field: string;
  prompt: string;
  options: ProfileOption[];
}

export type QuizQuestion = ArchetypeQuestion | ProfileQuestion;

/** Chosen option index per question id. */
export type QuizAnswers = Record<string, number>;

/** Stored profile field → chosen value. */
export type ProfileAnswers = Record<string, string>;

export interface Recommendation {
  primary: Archetype;
  /** Secondary archetype (flavor), or null if the player has no real second lean. */
  secondary: Archetype | null;
  scores: Record<Archetype, number>;
  /** 0–100, how strongly the primary dominates the style vector. */
  matchPercent: number;
  /** 2–3 data-drawn reasons for the recommendation. */
  reasons: string[];
}

export interface QuizResult extends Recommendation {
  profile: ProfileAnswers;
  completedAt?: string;
}
