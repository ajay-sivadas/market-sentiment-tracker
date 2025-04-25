import { db } from "@db";
import * as schema from "@shared/schema";
import { eq, desc, lte, gte, and } from "drizzle-orm";
import { TimeFrameType, getTimeFrameDate } from "./services/marketData";

// Fetch current sentiment data
export async function getCurrentSentiment() {
  const [latestSentiment] = await db.select().from(schema.sentimentScores).orderBy(desc(schema.sentimentScores.timestamp)).limit(1);
  
  if (!latestSentiment) {
    throw new Error("No sentiment data found");
  }
  
  return {
    score: Number(latestSentiment.score),
    change: Number(latestSentiment.change),
    marketStatus: latestSentiment.marketStatus,
    trendDirection: latestSentiment.trendDirection,
    volatility: latestSentiment.volatility,
    confidence: {
      label: latestSentiment.confidenceLabel,
      value: Number(latestSentiment.confidenceValue)
    },
    lastUpdated: latestSentiment.timestamp.toISOString()
  };
}

// Get historical sentiment data based on timeframe
export async function getHistoricalSentiment(timeFrame: TimeFrameType) {
  const startDate = getTimeFrameDate(timeFrame);
  
  // Get sentiment history
  const sentimentHistory = await db.select().from(schema.historicalSentiment)
    .where(gte(schema.historicalSentiment.timestamp, startDate))
    .orderBy(schema.historicalSentiment.timestamp);
  
  // Get key events
  const keyEvents = await db.select().from(schema.keyEvents)
    .where(gte(schema.keyEvents.timestamp, startDate))
    .orderBy(schema.keyEvents.timestamp);
  
  return {
    sentimentHistory: sentimentHistory.map(item => ({
      timestamp: item.timestamp.toISOString(),
      score: Number(item.score)
    })),
    keyEvents: keyEvents.map(event => ({
      title: event.title,
      timestamp: event.timestamp.toISOString(),
      impact: event.impact,
      description: event.description
    }))
  };
}

// Get news items based on timeframe
export async function getNewsItems(timeFrame: TimeFrameType) {
  const startDate = getTimeFrameDate(timeFrame);
  
  const newsItems = await db.select().from(schema.newsItems)
    .where(gte(schema.newsItems.timestamp, startDate))
    .orderBy(desc(schema.newsItems.timestamp));
  
  return newsItems.map(item => ({
    id: item.id,
    title: item.title,
    summary: item.summary,
    timestamp: item.timestamp.toISOString(),
    source: item.source,
    url: item.url,
    sentimentImpact: Number(item.sentimentImpact),
    tags: item.tags
  }));
}

// Get market metrics (both global and Indian indices, sector performance, and Nifty PCR)
export async function getMarketMetrics() {
  // Get global market indices
  const indices = await db.select().from(schema.marketIndices)
    .orderBy(desc(schema.marketIndices.timestamp))
    .limit(10);
  
  // Get unique index names (to avoid duplicates)
  const uniqueIndices = [];
  const indexNames = new Set();
  
  for (const index of indices) {
    if (!indexNames.has(index.name)) {
      uniqueIndices.push(index);
      indexNames.add(index.name);
    }
  }
  
  // Get Indian market indices
  const indianIndices = await db.select().from(schema.indianMarketIndices)
    .orderBy(desc(schema.indianMarketIndices.timestamp))
    .limit(10);
  
  // Get unique Indian index names (to avoid duplicates)
  const uniqueIndianIndices = [];
  const indianIndexNames = new Set();
  
  for (const index of indianIndices) {
    if (!indianIndexNames.has(index.name)) {
      uniqueIndianIndices.push(index);
      indianIndexNames.add(index.name);
    }
  }
  
  // Get sector performance
  const sectors = await db.select().from(schema.sectorPerformance)
    .orderBy(desc(schema.sectorPerformance.timestamp))
    .limit(10);
  
  // Get unique sector names (to avoid duplicates)
  const uniqueSectors = [];
  const sectorNames = new Set();
  
  for (const sector of sectors) {
    if (!sectorNames.has(sector.name)) {
      uniqueSectors.push(sector);
      sectorNames.add(sector.name);
    }
  }
  
  // Get latest Nifty PCR data
  const [niftyPCRData] = await db.select().from(schema.niftyPCR)
    .orderBy(desc(schema.niftyPCR.timestamp))
    .limit(1);
  
  return {
    indices: uniqueIndices.map(index => ({
      name: index.name,
      value: Number(index.value),
      change: Number(index.change)
    })),
    indianIndices: uniqueIndianIndices.map(index => ({
      name: index.name,
      value: Number(index.value),
      change: Number(index.change)
    })),
    sectorPerformance: uniqueSectors.map(sector => ({
      name: sector.name,
      change: Number(sector.change)
    })),
    niftyPCR: niftyPCRData ? {
      value: Number(niftyPCRData.value),
      change: Number(niftyPCRData.change),
      putVolume: Number(niftyPCRData.putVolume),
      callVolume: Number(niftyPCRData.callVolume),
      lastUpdated: niftyPCRData.timestamp.toISOString()
    } : undefined
  };
}

// Get market factors and their elements
export async function getMarketFactors() {
  // Get market factors
  const factors = await db.select().from(schema.marketFactors)
    .orderBy(desc(schema.marketFactors.timestamp))
    .limit(10);
  
  // Get unique factor names (to avoid duplicates)
  const uniqueFactors = [];
  const factorNames = new Set();
  
  for (const factor of factors) {
    if (!factorNames.has(factor.name)) {
      uniqueFactors.push(factor);
      factorNames.add(factor.name);
    }
  }
  
  // Get all elements for these factors
  const factorData = [];
  
  for (const factor of uniqueFactors) {
    const elements = await db.select().from(schema.factorElements)
      .where(eq(schema.factorElements.factorId, factor.id));
    
    factorData.push({
      name: factor.name,
      score: Number(factor.score),
      elements: elements.map(element => ({
        name: element.name,
        status: element.status
      }))
    });
  }
  
  return {
    factors: factorData
  };
}

// Update market data
export async function updateMarketData(marketData: any) {
  // Update market indices
  if (marketData.indices) {
    for (const index of marketData.indices) {
      await db.insert(schema.marketIndices).values({
        name: index.name,
        value: index.value,
        change: index.change,
        timestamp: new Date()
      });
    }
  }
  
  // Update sector performance
  if (marketData.sectors) {
    for (const sector of marketData.sectors) {
      await db.insert(schema.sectorPerformance).values({
        name: sector.name,
        change: sector.change,
        timestamp: new Date()
      });
    }
  }
  
  // Update market factors
  if (marketData.factors) {
    for (const factor of marketData.factors) {
      const [insertedFactor] = await db.insert(schema.marketFactors).values({
        name: factor.name,
        score: factor.score,
        timestamp: new Date()
      }).returning();
      
      // Add factor elements
      if (factor.elements) {
        for (const element of factor.elements) {
          await db.insert(schema.factorElements).values({
            factorId: insertedFactor.id,
            name: element.name,
            status: element.status
          });
        }
      }
    }
  }
}

// Add news items
export async function addNewsItems(newsItems: any[]) {
  if (!newsItems || newsItems.length === 0) return;
  
  for (const item of newsItems) {
    await db.insert(schema.newsItems).values({
      title: item.title,
      summary: item.summary,
      source: item.source,
      url: item.url,
      sentimentImpact: item.sentimentImpact,
      timestamp: new Date(item.timestamp),
      tags: item.tags
    });
  }
}

// Update sentiment data
export async function updateSentiment(sentimentData: any) {
  // Add current sentiment
  await db.insert(schema.sentimentScores).values({
    score: sentimentData.score,
    change: sentimentData.change,
    marketStatus: sentimentData.marketStatus,
    trendDirection: sentimentData.trendDirection,
    volatility: sentimentData.volatility,
    confidenceLabel: sentimentData.confidence.label,
    confidenceValue: sentimentData.confidence.value,
    timestamp: new Date()
  });
  
  // Add historical data point
  await db.insert(schema.historicalSentiment).values({
    timestamp: new Date(),
    score: sentimentData.score
  });
  
  // Add key events if any
  if (sentimentData.keyEvents && sentimentData.keyEvents.length > 0) {
    for (const event of sentimentData.keyEvents) {
      await db.insert(schema.keyEvents).values({
        title: event.title,
        description: event.description,
        timestamp: new Date(event.timestamp),
        impact: event.impact
      });
    }
  }
}

// Get upcoming events
export async function getUpcomingEvents() {
  const now = new Date();
  
  const events = await db.select().from(schema.upcomingEvents)
    .where(gte(schema.upcomingEvents.eventDate, now))
    .orderBy(schema.upcomingEvents.eventDate)
    .limit(10);
  
  return events.map(event => ({
    id: event.id,
    title: event.title,
    description: event.description,
    eventDate: event.eventDate.toISOString(),
    importance: event.importance,
    type: event.type,
    impact: event.impact
  }));
}

export const storage = {
  getCurrentSentiment,
  getHistoricalSentiment,
  getNewsItems,
  getMarketMetrics,
  getMarketFactors,
  getUpcomingEvents,
  updateMarketData,
  addNewsItems,
  updateSentiment
};
