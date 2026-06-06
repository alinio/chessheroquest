CREATE TYPE "public"."plan" AS ENUM('free', 'pro_monthly', 'pro_annual', 'lifetime');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('none', 'active', 'past_due', 'paused', 'canceled');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "plan" "plan" DEFAULT 'free' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "subscription_status" "subscription_status" DEFAULT 'none' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "paddle_customer_id" varchar(64);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "paddle_subscription_id" varchar(64);