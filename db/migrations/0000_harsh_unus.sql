CREATE TYPE "public"."age_band" AS ENUM('under_13', 'age_13_15', 'age_16_17', 'adult');--> statement-breakpoint
CREATE TYPE "public"."archetype" AS ENUM('warrior', 'strategist', 'defender', 'trickster');--> statement-breakpoint
CREATE TYPE "public"."mastery_state" AS ENUM('leak', 'review', 'solid', 'gold');--> statement-breakpoint
CREATE TYPE "public"."quest_status" AS ENUM('pending', 'completed', 'expired');--> statement-breakpoint
CREATE TYPE "public"."quest_type" AS ENUM('daily_quest', 'weakness_battle', 'boss_fight');--> statement-breakpoint
CREATE TYPE "public"."training_mode" AS ENUM('learn', 'drill', 'review', 'sparring', 'dna_test');--> statement-breakpoint
CREATE TABLE "ai_explanation_cache" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cache_key" varchar(128) NOT NULL,
	"explanation" text NOT NULL,
	"model" varchar(64),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "ai_explanation_cache_cache_key_unique" UNIQUE("cache_key")
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_user_id" uuid,
	"action" varchar(64) NOT NULL,
	"target_type" varchar(64),
	"target_id" varchar(128),
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"node_id" uuid NOT NULL,
	"stability" real DEFAULT 0 NOT NULL,
	"difficulty" real DEFAULT 0 NOT NULL,
	"elapsed_days" integer DEFAULT 0 NOT NULL,
	"scheduled_days" integer DEFAULT 0 NOT NULL,
	"reps" integer DEFAULT 0 NOT NULL,
	"lapses" integer DEFAULT 0 NOT NULL,
	"state" smallint DEFAULT 0 NOT NULL,
	"due_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_review" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "dna_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"archetype" "archetype" NOT NULL,
	"initial_iq" integer NOT NULL,
	"percentile" real,
	"raw" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mastery" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"path_template_id" uuid NOT NULL,
	"state" "mastery_state" DEFAULT 'leak' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "nodes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"path_template_id" uuid,
	"parent_id" uuid,
	"fen" text NOT NULL,
	"move" varchar(12),
	"is_player_move" boolean DEFAULT true NOT NULL,
	"frequency" real,
	"eval" real,
	"eco" varchar(8)
);
--> statement-breakpoint
CREATE TABLE "opening_iq_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"value" integer NOT NULL,
	"core" real NOT NULL,
	"breadth_bonus" real DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "path_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(96) NOT NULL,
	"name" varchar(128) NOT NULL,
	"archetype" "archetype" NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "path_templates_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "quests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "quest_type" NOT NULL,
	"status" "quest_status" DEFAULT 'pending' NOT NULL,
	"xp_reward" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "training_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"node_id" uuid,
	"mode" "training_mode" NOT NULL,
	"correct" boolean,
	"latency_ms" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_repertoires" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"path_template_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(320) NOT NULL,
	"display_name" varchar(64),
	"archetype" "archetype",
	"birth_year" integer,
	"age_band" "age_band",
	"consent_marketing" boolean DEFAULT false NOT NULL,
	"profile_public" boolean DEFAULT false NOT NULL,
	"consent_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_user_id_users_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cards" ADD CONSTRAINT "cards_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cards" ADD CONSTRAINT "cards_node_id_nodes_id_fk" FOREIGN KEY ("node_id") REFERENCES "public"."nodes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dna_results" ADD CONSTRAINT "dna_results_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mastery" ADD CONSTRAINT "mastery_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mastery" ADD CONSTRAINT "mastery_path_template_id_path_templates_id_fk" FOREIGN KEY ("path_template_id") REFERENCES "public"."path_templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nodes" ADD CONSTRAINT "nodes_path_template_id_path_templates_id_fk" FOREIGN KEY ("path_template_id") REFERENCES "public"."path_templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "opening_iq_snapshots" ADD CONSTRAINT "opening_iq_snapshots_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quests" ADD CONSTRAINT "quests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "training_events" ADD CONSTRAINT "training_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "training_events" ADD CONSTRAINT "training_events_node_id_nodes_id_fk" FOREIGN KEY ("node_id") REFERENCES "public"."nodes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_repertoires" ADD CONSTRAINT "user_repertoires_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_repertoires" ADD CONSTRAINT "user_repertoires_path_template_id_path_templates_id_fk" FOREIGN KEY ("path_template_id") REFERENCES "public"."path_templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_logs_actor_idx" ON "audit_logs" USING btree ("actor_user_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "cards_user_node_uq" ON "cards" USING btree ("user_id","node_id");--> statement-breakpoint
CREATE INDEX "cards_due_idx" ON "cards" USING btree ("user_id","due_at");--> statement-breakpoint
CREATE UNIQUE INDEX "mastery_user_path_uq" ON "mastery" USING btree ("user_id","path_template_id");--> statement-breakpoint
CREATE INDEX "nodes_path_idx" ON "nodes" USING btree ("path_template_id");--> statement-breakpoint
CREATE INDEX "nodes_parent_idx" ON "nodes" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "nodes_fen_idx" ON "nodes" USING btree ("fen");--> statement-breakpoint
CREATE INDEX "iq_user_time_idx" ON "opening_iq_snapshots" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "quests_user_idx" ON "quests" USING btree ("user_id","status");--> statement-breakpoint
CREATE INDEX "training_events_user_time_idx" ON "training_events" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "user_repertoires_user_idx" ON "user_repertoires" USING btree ("user_id");