CREATE TABLE "account_states" (
	"email" varchar(320) PRIMARY KEY NOT NULL,
	"token_hash" varchar(128),
	"token_expires" timestamp with time zone,
	"state" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
