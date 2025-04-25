import { pgTable, text, serial, integer, boolean, timestamp, decimal, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table (keeping the existing user table)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Sentiment Scores table
export const sentimentScores = pgTable("sentiment_scores", {
  id: serial("id").primaryKey(),
  score: decimal("score", { precision: 5, scale: 2 }).notNull(),
  change: decimal("change", { precision: 5, scale: 2 }).notNull(),
  marketStatus: text("market_status").notNull(),
  trendDirection: text("trend_direction").notNull(),
  volatility: text("volatility").notNull(),
  confidenceLabel: text("confidence_label").notNull(),
  confidenceValue: decimal("confidence_value", { precision: 5, scale: 2 }).notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertSentimentScoreSchema = createInsertSchema(sentimentScores);
export type InsertSentimentScore = z.infer<typeof insertSentimentScoreSchema>;
export type SentimentScore = typeof sentimentScores.$inferSelect;

// Historical Sentiment Data table
export const historicalSentiment = pgTable("historical_sentiment", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").notNull(),
  score: decimal("score", { precision: 5, scale: 2 }).notNull(),
});

export const insertHistoricalSentimentSchema = createInsertSchema(historicalSentiment);
export type InsertHistoricalSentiment = z.infer<typeof insertHistoricalSentimentSchema>;
export type HistoricalSentiment = typeof historicalSentiment.$inferSelect;

// Key Events table
export const keyEvents = pgTable("key_events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  timestamp: timestamp("timestamp").notNull(),
  impact: text("impact").notNull(),
});

export const insertKeyEventSchema = createInsertSchema(keyEvents);
export type InsertKeyEvent = z.infer<typeof insertKeyEventSchema>;
export type KeyEvent = typeof keyEvents.$inferSelect;

// News Items table
export const newsItems = pgTable("news_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  source: text("source").notNull(),
  url: text("url").notNull(),
  sentimentImpact: decimal("sentiment_impact", { precision: 5, scale: 2 }).notNull(),
  timestamp: timestamp("timestamp").notNull(),
  tags: json("tags").$type<string[]>().notNull(),
});

export const insertNewsItemSchema = createInsertSchema(newsItems);
export type InsertNewsItem = z.infer<typeof insertNewsItemSchema>;
export type NewsItem = typeof newsItems.$inferSelect;

// Market Indices table
export const marketIndices = pgTable("market_indices", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  value: decimal("value", { precision: 10, scale: 2 }).notNull(),
  change: decimal("change", { precision: 5, scale: 2 }).notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertMarketIndexSchema = createInsertSchema(marketIndices);
export type InsertMarketIndex = z.infer<typeof insertMarketIndexSchema>;
export type MarketIndex = typeof marketIndices.$inferSelect;

// Sector Performance table
export const sectorPerformance = pgTable("sector_performance", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  change: decimal("change", { precision: 5, scale: 2 }).notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertSectorPerformanceSchema = createInsertSchema(sectorPerformance);
export type InsertSectorPerformance = z.infer<typeof insertSectorPerformanceSchema>;
export type SectorPerformance = typeof sectorPerformance.$inferSelect;

// Market Factors table
export const marketFactors = pgTable("market_factors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  score: decimal("score", { precision: 5, scale: 2 }).notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertMarketFactorSchema = createInsertSchema(marketFactors);
export type InsertMarketFactor = z.infer<typeof insertMarketFactorSchema>;
export type MarketFactor = typeof marketFactors.$inferSelect;

// Factor Elements table
export const factorElements = pgTable("factor_elements", {
  id: serial("id").primaryKey(),
  factorId: integer("factor_id").notNull().references(() => marketFactors.id),
  name: text("name").notNull(),
  status: text("status").notNull(),
});

export const insertFactorElementSchema = createInsertSchema(factorElements);
export type InsertFactorElement = z.infer<typeof insertFactorElementSchema>;
export type FactorElement = typeof factorElements.$inferSelect;

// Define relations
export const marketFactorsRelations = relations(marketFactors, ({ many }) => ({
  elements: many(factorElements)
}));

export const factorElementsRelations = relations(factorElements, ({ one }) => ({
  factor: one(marketFactors, { fields: [factorElements.factorId], references: [marketFactors.id] })
}));
