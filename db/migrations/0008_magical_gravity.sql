ALTER TABLE "account_states" ADD COLUMN "is_pro" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "account_states" ADD COLUMN "plan" varchar(16) DEFAULT 'free' NOT NULL;--> statement-breakpoint
ALTER TABLE "account_states" ADD COLUMN "paddle_customer_id" varchar(64);