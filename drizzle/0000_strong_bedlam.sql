CREATE TABLE IF NOT EXISTS "factor_elements" (
	"id" serial PRIMARY KEY NOT NULL,
	"factor_id" integer NOT NULL,
	"name" text NOT NULL,
	"status" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "historical_sentiment" (
	"id" serial PRIMARY KEY NOT NULL,
	"timestamp" timestamp NOT NULL,
	"score" numeric(5, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "indian_market_indices" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"value" numeric(10, 2) NOT NULL,
	"change" numeric(5, 2) NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "key_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"timestamp" timestamp NOT NULL,
	"impact" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "market_factors" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"score" numeric(5, 2) NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "market_indices" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"value" numeric(10, 2) NOT NULL,
	"change" numeric(5, 2) NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "news_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"summary" text NOT NULL,
	"source" text NOT NULL,
	"url" text NOT NULL,
	"sentiment_impact" numeric(5, 2) NOT NULL,
	"timestamp" timestamp NOT NULL,
	"tags" json NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nifty_pcr" (
	"id" serial PRIMARY KEY NOT NULL,
	"value" numeric(5, 2) NOT NULL,
	"change" numeric(5, 2) NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"put_volume" numeric(12, 0) NOT NULL,
	"call_volume" numeric(12, 0) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sector_performance" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"change" numeric(5, 2) NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sentiment_scores" (
	"id" serial PRIMARY KEY NOT NULL,
	"score" numeric(5, 2) NOT NULL,
	"change" numeric(5, 2) NOT NULL,
	"market_status" text NOT NULL,
	"trend_direction" text NOT NULL,
	"volatility" text NOT NULL,
	"confidence_label" text NOT NULL,
	"confidence_value" numeric(5, 2) NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "upcoming_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"event_date" timestamp NOT NULL,
	"importance" text NOT NULL,
	"type" text NOT NULL,
	"impact" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "factor_elements" ADD CONSTRAINT "factor_elements_factor_id_market_factors_id_fk" FOREIGN KEY ("factor_id") REFERENCES "public"."market_factors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
