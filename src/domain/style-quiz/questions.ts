import type { QuizQuestion } from "./types";

/**
 * The 16 Style Quiz questions, transcribed from GDD §2.2 (drafted content).
 * Q1–8 = archetype-weighted (reason phrase per archetype-leaning option).
 * Q9–16 = profile (stored for personalization, NOT archetype-scored).
 * Non-archetype style axes from the GDD (e.g. "risk+1") are intentionally not part
 * of the archetype score; they can be revisited if a style-axis layer is added.
 * TODO: confirm quiz copy/weights (GDD) — these are drafted seed values.
 */
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    kind: "archetype",
    prompt: "When you get a chance to attack, you…",
    options: [
      { label: "Go for the kill, even if it's risky", weights: { warrior: 2 }, reason: "You go for the kill when you smell blood" },
      { label: "Build up, then strike when it's safe", weights: { strategist: 2 }, reason: "You build up before you strike" },
      { label: "Stay solid, let them overextend", weights: { defender: 2 }, reason: "You let opponents overextend" },
      { label: "Look for a shot they won't expect", weights: { trickster: 2 }, reason: "You hunt for the unexpected shot" },
    ],
  },
  {
    id: "q2",
    kind: "archetype",
    prompt: "Your ideal position is…",
    options: [
      { label: "Sharp, double-edged chaos", weights: { warrior: 2 }, reason: "You thrive in sharp, chaotic positions" },
      { label: "A small, lasting edge", weights: { strategist: 2 }, reason: "You prize a small, lasting edge" },
      { label: "A rock-solid fortress", weights: { defender: 2 }, reason: "You aim for a rock-solid fortress" },
      { label: "A weird position only you understand", weights: { trickster: 2 }, reason: "You like positions only you understand" },
    ],
  },
  {
    id: "q3",
    kind: "archetype",
    prompt: "A pawn sacrifice for initiative?",
    options: [
      { label: "Love it", weights: { warrior: 1, trickster: 1 }, reason: "You'll give a pawn for initiative" },
      { label: "Only if it's sound", weights: { strategist: 1 }, reason: "You sacrifice only when it's sound" },
      { label: "Keep my material", weights: { defender: 2 }, reason: "You hold on to your material" },
    ],
  },
  {
    id: "q4",
    kind: "archetype",
    prompt: "Against a stronger player you…",
    options: [
      { label: "Complicate with tactics", weights: { warrior: 1, trickster: 1 }, reason: "You complicate against stronger players" },
      { label: "Play solid, wait for errors", weights: { defender: 2 }, reason: "You wait patiently for errors" },
      { label: "Outplay them positionally", weights: { strategist: 2 }, reason: "You try to outplay positionally" },
    ],
  },
  {
    id: "q5",
    kind: "archetype",
    prompt: "How much opening theory will you memorize?",
    options: [
      { label: "A lot — I love prep", weights: { strategist: 2 }, reason: "You love deep opening prep" },
      { label: "Some", weights: { warrior: 1 } },
      { label: "As little as possible — give me a system", weights: { defender: 2 }, reason: "You prefer a low-theory system" },
      { label: "I'd rather learn traps", weights: { trickster: 2 }, reason: "You'd rather learn traps than theory" },
    ],
  },
  {
    id: "q6",
    kind: "archetype",
    prompt: "You win most often by…",
    options: [
      { label: "Attacking the king", weights: { warrior: 2 }, reason: "You win by attacking the king" },
      { label: "Slowly squeezing", weights: { strategist: 2 }, reason: "You win by slowly squeezing" },
      { label: "Punishing mistakes", weights: { defender: 2 }, reason: "You win by punishing mistakes" },
      { label: "Springing a trap", weights: { trickster: 2 }, reason: "You win by springing traps" },
    ],
  },
  {
    id: "q7",
    kind: "archetype",
    prompt: "Your risk appetite?",
    options: [
      { label: "I love sharp, risky lines", weights: { warrior: 1, trickster: 1 }, reason: "You embrace sharp, risky lines" },
      { label: "I prefer safe, sound positions", weights: { defender: 1, strategist: 1 }, reason: "You prefer safe, sound positions" },
    ],
  },
  {
    id: "q8",
    kind: "archetype",
    prompt: "Which openings are you drawn to?",
    options: [
      { label: "Aggressive gambits", weights: { warrior: 2 }, reason: "You're drawn to aggressive gambits" },
      { label: "Classical main lines", weights: { strategist: 2 }, reason: "You're drawn to classical main lines" },
      { label: "Solid & reliable", weights: { defender: 2 }, reason: "You're drawn to solid, reliable openings" },
      { label: "Offbeat & surprising", weights: { trickster: 2 }, reason: "You're drawn to offbeat, surprising openings" },
    ],
  },

  // ── Profile (stored, not archetype-scored) ────────────────────────────────
  {
    id: "q9",
    kind: "profile",
    field: "currentRating",
    prompt: "Your current rating?",
    options: [
      { label: "Under 800", value: "<800" },
      { label: "800–1200", value: "800-1200" },
      { label: "1200–1600", value: "1200-1600" },
      { label: "1600–2000", value: "1600-2000" },
      { label: "2000+", value: "2000+" },
      { label: "I don't know", value: "unknown" },
    ],
  },
  {
    id: "q10",
    kind: "profile",
    field: "targetRating",
    prompt: "Your target rating?",
    options: [
      { label: "Under 800", value: "<800" },
      { label: "800–1200", value: "800-1200" },
      { label: "1200–1600", value: "1200-1600" },
      { label: "1600–2000", value: "1600-2000" },
      { label: "2000+", value: "2000+" },
      { label: "I don't know", value: "unknown" },
    ],
  },
  {
    id: "q11",
    kind: "profile",
    field: "frequency",
    prompt: "How often do you play?",
    options: [
      { label: "Daily", value: "daily" },
      { label: "A few times a week", value: "weekly-few" },
      { label: "Weekly", value: "weekly" },
      { label: "Rarely", value: "rarely" },
    ],
  },
  {
    id: "q12",
    kind: "profile",
    field: "timeControl",
    prompt: "Your main time control?",
    options: [
      { label: "Bullet", value: "bullet" },
      { label: "Blitz", value: "blitz" },
      { label: "Rapid", value: "rapid" },
      { label: "Classical", value: "classical" },
    ],
  },
  {
    id: "q13",
    kind: "profile",
    field: "colorPreference",
    prompt: "You mostly play…",
    options: [
      { label: "White", value: "white" },
      { label: "Black", value: "black" },
      { label: "Both", value: "both" },
    ],
  },
  {
    id: "q14",
    kind: "profile",
    field: "goal",
    prompt: "Your main goal?",
    options: [
      { label: "Climb rating fast", value: "climb" },
      { label: "Stop losing in the opening", value: "stop-losing" },
      { label: "Have fun", value: "fun" },
      { label: "Master specific openings", value: "master" },
    ],
  },
  {
    id: "q15",
    kind: "profile",
    field: "frustration",
    prompt: "Your biggest frustration?",
    options: [
      { label: "I get crushed early", value: "crushed" },
      { label: "I don't know what to play", value: "lost" },
      { label: "I blank out of theory", value: "blank" },
      { label: "I get bored in slow games", value: "bored" },
    ],
  },
  {
    id: "q16",
    kind: "profile",
    field: "connectAccount",
    prompt: "Connect an account for deeper analysis?",
    options: [
      { label: "Lichess", value: "lichess" },
      { label: "Chess.com", value: "chesscom" },
      { label: "Not now", value: "none" },
    ],
  },
];
