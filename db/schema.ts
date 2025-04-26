import { pgTable, serial, text, timestamp, doublePrecision } from 'drizzle-orm/pg-core';

export const sentiment = pgTable('sentiment', {
  id: serial('id').primaryKey(),
  symbol: text('symbol').notNull(),
  score: doublePrecision('score').notNull(),
  source: text('source').notNull(),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
  rawData: text('raw_data'),
  metadata: text('metadata'),
}); 