import type { Category, Post } from "./types";

// TODO: starter content — expand/replace freely. Chess facts (moves/ECO) are
// accurate; opinions are editorial.
export const CATEGORIES: Category[] = [
  {
    slug: "openings",
    name: "Openings",
    description:
      "Opening guides, repertoires and ideas — from your first moves to complete systems.",
    accent: "#E0413B",
  },
  {
    slug: "training",
    name: "Training",
    description:
      "How to practice, remember, and actually improve — drills, habits and spaced repetition.",
    accent: "#2FB67A",
  },
  {
    slug: "strategy",
    name: "Strategy",
    description:
      "Playing styles, plans, and the ideas behind winning chess.",
    accent: "#8B6CFF",
  },
];

const AUTHOR = "The ChessHeroQuest Team";

export const POSTS: Post[] = [
  {
    slug: "what-is-your-chess-dna",
    title: "What Is Your Chess DNA? The 4 Player Archetypes Explained",
    excerpt:
      "Every chess player has a natural style. Meet the four Chess DNA archetypes — Warrior, Strategist, Defender, Trickster — and learn how to play to your strengths.",
    category: "strategy",
    tags: ["chess style", "archetypes", "improvement"],
    date: "2026-06-05",
    author: AUTHOR,
    cover: "/landing/hero-desktop-poster.png",
    featured: true,
    body: [
      {
        type: "p",
        text: "Two players can reach the same rating in completely different ways. One attacks from move one; another squeezes a tiny edge for sixty moves. That difference is your **Chess DNA** — your natural playing style — and knowing it is one of the fastest ways to start winning more games.",
      },
      {
        type: "p",
        text: "At ChessHeroQuest we group players into four archetypes. Most people are a blend, with one dominant trait. Here's how to recognise yours.",
      },
      { type: "h2", text: "⚔️ The Warrior — attack relentlessly" },
      {
        type: "p",
        text: "Warriors strike early and hunt the king. They love gambits, open lines, and sacrifices for initiative. If you reach for the King's Gambit or the Smith-Morra and feel bored in quiet positions, you're a Warrior.",
      },
      {
        type: "p",
        text: "Strength: initiative and tactics. Watch out for: overextending when the attack isn't really there.",
      },
      { type: "h2", text: "♛ The Strategist — outmaneuver, then crush" },
      {
        type: "p",
        text: "Strategists build small, durable edges and convert them in the long game. They're at home in the Ruy Lopez, the Queen's Gambit, and slow maneuvering battles where understanding beats memorisation.",
      },
      { type: "h2", text: "🛡️ The Defender — unbreakable and patient" },
      {
        type: "p",
        text: "Defenders soak up pressure, stay solid, and punish overreach. Rock-solid systems like the Caro-Kann, the London System, and the French suit them. Their games are won by the mistakes they never make.",
      },
      { type: "h2", text: "🃏 The Trickster — surprise and bewilder" },
      {
        type: "p",
        text: "Tricksters steer into sharp, offbeat lines and spring traps — the Scandinavian, the Budapest, the Stafford. They thrive on positions their opponent has never seen.",
      },
      {
        type: "callout",
        title: "Find your archetype in 2 minutes",
        text: "The free [Chess DNA Test](/dna-test) reads 20 positions plus a short style quiz to reveal your archetype, your Opening IQ, and your biggest weakness — no signup to begin.",
      },
      { type: "h2", text: "Why your archetype matters" },
      {
        type: "p",
        text: "Playing against your nature is exhausting and ineffective. A Warrior forced into dry endgames will drift; a Defender pushed into wild gambits will get mated. Once you know your DNA, you can pick openings that fit you, and train the one or two weaknesses that quietly cost you rating.",
      },
      {
        type: "p",
        text: "Next, see [the 5 best openings for beginners](/blog/best-chess-openings-for-beginners) and pick the ones that match your style.",
      },
    ],
  },
  {
    slug: "best-chess-openings-for-beginners",
    title: "The 5 Best Chess Openings for Beginners (and Why They Work)",
    excerpt:
      "You don't need to memorise 300 variations. These five sound, easy-to-learn openings teach good habits and win games — for both White and Black.",
    category: "openings",
    tags: ["openings", "beginners", "repertoire"],
    date: "2026-06-03",
    author: AUTHOR,
    cover: "/landing/kingdom-italian.png",
    featured: false,
    body: [
      {
        type: "p",
        text: "The best beginner openings share three traits: they develop pieces quickly, they fight for the centre, and they don't require memorising deep theory. Here are five that do exactly that.",
      },
      { type: "h2", text: "1. The Italian Game (White)" },
      {
        type: "p",
        text: "**1.e4 e5 2.Nf3 Nc6 3.Bc4.** A 400-year-old classic that points the bishop straight at f7 and develops naturally. It teaches the core opening principles better than almost anything else.",
      },
      { type: "h2", text: "2. The Ruy Lopez (White)" },
      {
        type: "p",
        text: "**1.e4 e5 2.Nf3 Nc6 3.Bb5.** The Spanish pressures Black's knight and builds a long-term bind. It's the choice of world champions — and a lifelong opening you'll never outgrow.",
      },
      { type: "h2", text: "3. The Caro-Kann (Black vs 1.e4)" },
      {
        type: "p",
        text: "**1.e4 c6 2.d4 d5.** Rock-solid with no structural weaknesses. The Caro-Kann gives Black an easy, reliable game and is far simpler to play than the Sicilian.",
      },
      { type: "h2", text: "4. The Queen's Gambit (White vs 1.d4)" },
      {
        type: "p",
        text: "**1.d4 d5 2.c4.** Offer a wing pawn to dominate the centre. Despite the name it's not really a gambit — Black usually can't keep the pawn — and it leads to clean, logical positions.",
      },
      { type: "h2", text: "5. The Scandinavian (Black vs 1.e4)" },
      {
        type: "p",
        text: "**1.e4 d5.** The most direct way to fight for the centre on move one. It's easy to learn, hard to surprise, and gets you a playable game with minimal theory.",
      },
      {
        type: "callout",
        title: "Pick the ones that fit you",
        text: "Aggressive players gravitate to the Italian; solid players love the Caro-Kann. Not sure which suits you? [Take the free Chess DNA Test](/dna-test) and we'll recommend your openings.",
      },
      { type: "h2", text: "How many openings do you actually need?" },
      {
        type: "p",
        text: "Two. One for White, one for Black against 1.e4, and one against 1.d4 — so really three lines, learned a few moves deep. Depth comes later. First, learn the *ideas*, not the moves, and you'll handle the surprises your opponents throw at you.",
      },
      {
        type: "p",
        text: "Once you've chosen, the hard part is remembering them under pressure — that's what [this guide on remembering your repertoire](/blog/remember-your-opening-repertoire) is for.",
      },
    ],
  },
  {
    slug: "remember-your-opening-repertoire",
    title: "How to Actually Remember Your Opening Repertoire",
    excerpt:
      "Memorising openings is easy. Recalling them in a real game is hard. Here's the spaced-repetition method that makes your repertoire stick — in 5 minutes a day.",
    category: "training",
    tags: ["training", "memory", "spaced repetition"],
    date: "2026-06-01",
    author: AUTHOR,
    cover: "/art/worlds/world-strategist-map.png",
    body: [
      {
        type: "p",
        text: "You study an opening, nod along, feel like you've got it — then a week later your opponent plays move four and your mind goes blank. The problem isn't your memory. It's *how* you're practising.",
      },
      { type: "h2", text: "Why cramming fails" },
      {
        type: "p",
        text: "Reading variations is passive. Your brain only commits something to long-term memory when it has to **retrieve** it — actively, with effort, just before you'd forget. Re-reading the same line ten times feels productive but barely moves the needle.",
      },
      { type: "h2", text: "The fix: spaced repetition" },
      {
        type: "p",
        text: "Spaced repetition shows you each position right when you're about to forget it. Get it right and the interval grows (days, then weeks); get it wrong and it comes back soon. It's the same science behind language apps — and it's brutally effective for chess openings.",
      },
      {
        type: "ol",
        items: [
          "Drill positions, not whole games — one decision at a time.",
          "Always make the move yourself before checking. Retrieval is the point.",
          "Let an algorithm schedule the reviews; don't decide what to study by feel.",
          "Keep sessions short — 5 to 10 minutes daily beats a two-hour binge.",
        ],
      },
      {
        type: "quote",
        text: "If you can recall the move under mild pressure today, you'll recall it over the board next month.",
      },
      { type: "h2", text: "Make it a daily loop" },
      {
        type: "p",
        text: "Consistency beats intensity. A short daily review — a few new positions, a few due reviews, fix one weak line — compounds faster than weekend marathons. Streaks help: missing a day is fine, missing a week resets your recall.",
      },
      {
        type: "callout",
        title: "Train openings that fit how you play",
        text: "ChessHeroQuest builds your review schedule around your weaknesses using spaced repetition (FSRS). Start with the free [Chess DNA Test](/dna-test) to get your personalised Road to Elo.",
      },
      {
        type: "p",
        text: "New to building a repertoire? Start from [the 5 best openings for beginners](/blog/best-chess-openings-for-beginners).",
      },
    ],
  },
];
