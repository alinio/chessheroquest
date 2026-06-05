CREATE TABLE "lichess_explorer_cache" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cache_key" varchar(128) NOT NULL,
	"fen" text NOT NULL,
	"response" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "lichess_explorer_cache_cache_key_unique" UNIQUE("cache_key")
);
