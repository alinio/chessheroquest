/**
 * ChessHeroQuest — Drizzle schema (MVP-core).
 * Mirrors ARCHITECTURE.md "Data model" and master-vision.md §20.
 *
 * Two of THE LAWS are encoded at the table level, on purpose:
 *  - LAW #5 (minors): `users.birth_year` / `age_band` / consent flags — capture at
 *    signup; profiles private by default for minors. Retrofitting COPPA/GDPR-K is risky.
 *  - The data moat (§30) + ARCHITECTURE "instrument from day 1": `training_events`
 *    logs every attempt. This raw signal cannot be reconstructed retroactively.
 */
import { sql } from "drizzle-orm";
import {
  pgTable,
  pgEnum,
  uuid,
  text,
  varchar,
  integer,
  smallint,
  real,
  boolean,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
  check,
} from "drizzle-orm/pg-core";

/* ------------------------------------------------------------------ enums */

export const archetypeEnum = pgEnum("archetype", [
  "warrior",
  "strategist",
  "defender",
  "trickster",
]);

// COPPA/GDPR-K bands drive default profile visibility + social gating.
export const ageBandEnum = pgEnum("age_band", [
  "under_13",
  "age_13_15",
  "age_16_17",
  "adult",
]);

// Mastery states (master-vision §20: red/orange/green/gold) — always paired with
// an icon/shape in the UI, never color alone (DESIGN.md §9, color-blind safety).
export const masteryStateEnum = pgEnum("mastery_state", [
  "leak", // red
  "review", // orange
  "solid", // green
  "gold", // conquered (boss + retention)
]);

export const trainingModeEnum = pgEnum("training_mode", [
  "learn",
  "drill",
  "review",
  "sparring",
  "dna_test",
]);

export const questTypeEnum = pgEnum("quest_type", [
  "daily_quest",
  "weakness_battle",
  "boss_fight",
]);

export const questStatusEnum = pgEnum("quest_status", [
  "pending",
  "completed",
  "expired",
]);

// Billing (master-vision §21).
export const planEnum = pgEnum("plan", [
  "free",
  "pro_monthly",
  "pro_annual",
  "lifetime",
]);

export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "none",
  "active",
  "past_due",
  "paused",
  "canceled",
]);

export const achievementTypeEnum = pgEnum("achievement_type", [
  "opening_conquered",
  "collector",
  // A Guardian duel won on a curated path (key = `guardian:<pathId>`). The
  // Passport seal = gold mastery AND the Guardian defeated (target spec §C).
  "guardian_defeated",
]);

/* ------------------------------------------------------------------ users */

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 320 }).notNull().unique(),
    passwordHash: varchar("password_hash", { length: 255 }),
    displayName: varchar("display_name", { length: 64 }),
    archetype: archetypeEnum("archetype"), // set by the DNA Test

    // LAW #5 — minor safety. Capture at signup; do not backfill later.
    birthYear: integer("birth_year"),
    ageBand: ageBandEnum("age_band"),
    consentMarketing: boolean("consent_marketing").notNull().default(false),
    profilePublic: boolean("profile_public").notNull().default(false), // private by default
    consentAt: timestamp("consent_at", { withTimezone: true }),

    // Billing (Paddle). Plan/status mirror the verified webhook state.
    plan: planEnum("plan").notNull().default("free"),
    subscriptionStatus: subscriptionStatusEnum("subscription_status")
      .notNull()
      .default("none"),
    paddleCustomerId: varchar("paddle_customer_id", { length: 64 }),
    paddleSubscriptionId: varchar("paddle_subscription_id", { length: 64 }),

    // Engagement (daily loop). Streak day index = floor(epochMs / 86_400_000).
    xp: integer("xp").notNull().default(0),
    streakCount: integer("streak_count").notNull().default(0),
    streakLastActiveDay: integer("streak_last_active_day"),
    // Road to Elo goal (master-vision §5): 1000 | 1200 | 1500 | 1800.
    eloGoal: integer("elo_goal").notNull().default(1200),

    // Linked platforms (game sync — public usernames only, re-fetched on demand).
    lichessUsername: varchar("lichess_username", { length: 64 }),
    chesscomUsername: varchar("chesscom_username", { length: 64 }),

    // LAW #7 — back-office RBAC (Phase B). 'user' | 'admin' (CHECK below). Granting
    // 'admin' is reserved to ADMIN_EMAILS (env allowlist) admins — anti-escalation.
    role: text("role").notNull().default("user"),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [check("users_role_check", sql`${t.role} in ('user', 'admin')`)],
);

/* ----------------------------------------------- repertoires & opening tree */

// Editorial starter repertoires per archetype (the one place chess expertise is
// hand-curated — CLAUDE.md DATA SOURCES).
export const pathTemplates = pgTable("path_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 96 }).notNull().unique(),
  name: varchar("name", { length: 128 }).notNull(),
  archetype: archetypeEnum("archetype").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Which path a user adopted (their Core repertoire).
export const userRepertoires = pgTable(
  "user_repertoires",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    pathTemplateId: uuid("path_template_id")
      .notNull()
      .references(() => pathTemplates.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("user_repertoires_user_idx").on(t.userId)],
);

// The opening tree. Chess truth only (Lichess frequency + Stockfish eval + ECO).
export const nodes = pgTable(
  "nodes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    pathTemplateId: uuid("path_template_id").references(() => pathTemplates.id),
    parentId: uuid("parent_id"), // self-reference (set FK in migration to avoid cycle issues)
    fen: text("fen").notNull(),
    move: varchar("move", { length: 12 }), // SAN of the move leading here
    isPlayerMove: boolean("is_player_move").notNull().default(true),
    frequency: real("frequency"), // real line frequency (Lichess), normalized
    eval: real("eval"), // Stockfish eval (pawns), from the truth layer only
    eco: varchar("eco", { length: 8 }),
  },
  (t) => [
    index("nodes_path_idx").on(t.pathTemplateId),
    index("nodes_parent_idx").on(t.parentId),
    index("nodes_fen_idx").on(t.fen),
  ],
);

/* ------------------------------------------------------------- FSRS cards */

// Each answerable position is an SRS card. Columns mirror ts-fsrs Card state so
// FSRS can be persisted directly (the hidden retention engine — LAW #6).
export const cards = pgTable(
  "cards",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    nodeId: uuid("node_id")
      .notNull()
      .references(() => nodes.id, { onDelete: "cascade" }),
    stability: real("stability").notNull().default(0),
    difficulty: real("difficulty").notNull().default(0),
    elapsedDays: integer("elapsed_days").notNull().default(0),
    scheduledDays: integer("scheduled_days").notNull().default(0),
    reps: integer("reps").notNull().default(0),
    lapses: integer("lapses").notNull().default(0),
    state: smallint("state").notNull().default(0), // ts-fsrs State enum (0=New…)
    dueAt: timestamp("due_at", { withTimezone: true }).notNull().defaultNow(),
    lastReview: timestamp("last_review", { withTimezone: true }),
  },
  (t) => [
    uniqueIndex("cards_user_node_uq").on(t.userId, t.nodeId),
    index("cards_due_idx").on(t.userId, t.dueAt),
  ],
);

/* ----------------------------------------------------- mastery & IQ history */

export const mastery = pgTable(
  "mastery",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    pathTemplateId: uuid("path_template_id")
      .notNull()
      .references(() => pathTemplates.id),
    state: masteryStateEnum("state").notNull().default("leak"),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("mastery_user_path_uq").on(t.userId, t.pathTemplateId)],
);

// Opening IQ over time, with the Core/Breadth breakdown (LAW #1, §4.3).
export const openingIqSnapshots = pgTable(
  "opening_iq_snapshots",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    value: integer("value").notNull(), // 0–1000, = calibrate(core + breadthBonus)
    core: real("core").notNull(),
    breadthBonus: real("breadth_bonus").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("iq_user_time_idx").on(t.userId, t.createdAt)],
);

/* ------------------------------------------------------------ DNA & quests */

export const dnaResults = pgTable("dna_results", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  archetype: archetypeEnum("archetype").notNull(),
  initialIq: integer("initial_iq").notNull(),
  percentile: real("percentile"),
  raw: jsonb("raw"), // per-position answers from the 20 adaptive items
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Specialized titles earned by mastery (master-vision §28.6). One per key per user.
export const achievements = pgTable(
  "achievements",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: achievementTypeEnum("type").notNull(),
    key: varchar("key", { length: 96 }).notNull(), // e.g. the conquered opening slug
    title: varchar("title", { length: 128 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("achievements_user_key_uq").on(t.userId, t.key)],
);

// Phase-0 passwordless accounts (Module 9a) for the new module flow: email-keyed
// magic-link token + a JSON snapshot of the client stores (save/sync across
// devices). Independent of the legacy `users` table.
// TODO (M9): consolidate with Auth.js + harden (rate limit, real email provider).
export const accountStates = pgTable("account_states", {
  email: varchar("email", { length: 320 }).primaryKey(),
  tokenHash: varchar("token_hash", { length: 128 }),
  tokenExpires: timestamp("token_expires", { withTimezone: true }),
  state: jsonb("state"),
  // Server-verified Pro entitlement (M9b) — set ONLY by the verified Paddle webhook.
  isPro: boolean("is_pro").notNull().default(false),
  plan: varchar("plan", { length: 16 }).notNull().default("free"),
  paddleCustomerId: varchar("paddle_customer_id", { length: 64 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const quests = pgTable(
  "quests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: questTypeEnum("type").notNull(),
    status: questStatusEnum("status").notNull().default("pending"),
    xpReward: integer("xp_reward").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (t) => [index("quests_user_idx").on(t.userId, t.status)],
);

/* --------------------------------------------------- the moat: raw signal */

// EVERY attempt. The raw material for IQ↔Elo calibration + FSRS forgetting curves
// (§30). Cannot be reconstructed retroactively — log from the first build.
export const trainingEvents = pgTable(
  "training_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    nodeId: uuid("node_id").references(() => nodes.id, { onDelete: "set null" }),
    mode: trainingModeEnum("mode").notNull(),
    correct: boolean("correct"),
    latencyMs: integer("latency_ms"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("training_events_user_time_idx").on(t.userId, t.createdAt)],
);

/* ----------------------------------------------------- AI cache & audit log */

// Cached AI explanations (LAW #2): key = hash(fen + context). Marginal cost → ~0.
export const aiExplanationCache = pgTable("ai_explanation_cache", {
  id: uuid("id").primaryKey().defaultRandom(),
  cacheKey: varchar("cache_key", { length: 128 }).notNull().unique(),
  explanation: text("explanation").notNull(),
  model: varchar("model", { length: 64 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Cached Lichess Opening Explorer responses — keyed by hash(fen + filter).
// Positions are finite + shared → cached marginal cost → ~0; respects rate limits.
export const lichessExplorerCache = pgTable("lichess_explorer_cache", {
  id: uuid("id").primaryKey().defaultRandom(),
  cacheKey: varchar("cache_key", { length: 128 }).notNull().unique(),
  fen: text("fen").notNull(),
  response: jsonb("response").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// LAW #7: every sensitive admin action is logged. The admin is a fortress.
export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    actorUserId: uuid("actor_user_id").references(() => users.id),
    action: varchar("action", { length: 64 }).notNull(),
    targetType: varchar("target_type", { length: 64 }),
    targetId: varchar("target_id", { length: 128 }),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("audit_logs_actor_idx").on(t.actorUserId, t.createdAt)],
);
