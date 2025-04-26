import { db } from "@db";
import * as schema from "@shared/schema";

async function seed() {
  try {
    // Insert initial sentiment score
    const [sentimentScore] = await db.insert(schema.sentimentScores).values({
      score: "65.5",
      change: "2.3",
      marketStatus: "Bullish",
      trendDirection: "Upward",
      volatility: "Moderate",
      confidenceLabel: "High",
      confidenceValue: "85.0",
      timestamp: new Date()
    }).returning();

    console.log("Inserted sentiment score:", sentimentScore);

    // Insert historical sentiment data
    const historicalData = Array.from({ length: 30 }, (_, i) => ({
      timestamp: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)), // Last 30 days
      score: String(50 + Math.random() * 30) // Random score between 50 and 80
    }));

    await db.insert(schema.historicalSentiment).values(historicalData);
    console.log("Inserted historical sentiment data");

    // Insert news items
    const newsItems = [
      {
        title: "Fed Maintains Interest Rates",
        summary: "Federal Reserve keeps interest rates unchanged in latest meeting",
        source: "Financial Times",
        url: "https://ft.com/example",
        sentimentImpact: "0.8",
        timestamp: new Date(),
        tags: ["monetary policy", "federal reserve"]
      },
      {
        title: "Tech Sector Rally Continues",
        summary: "Technology stocks extend gains amid AI optimism",
        source: "Reuters",
        url: "https://reuters.com/example",
        sentimentImpact: "1.2",
        timestamp: new Date(),
        tags: ["technology", "stocks", "AI"]
      }
    ];

    await db.insert(schema.newsItems).values(newsItems);
    console.log("Inserted news items");

    // Insert market indices
    const indices = [
      {
        name: "S&P 500",
        value: "4780.25",
        change: "0.85",
        timestamp: new Date()
      },
      {
        name: "NASDAQ",
        value: "15234.75",
        change: "1.25",
        timestamp: new Date()
      }
    ];

    await db.insert(schema.marketIndices).values(indices);
    console.log("Inserted market indices");

    // Insert Indian market indices
    const indianIndices = [
      {
        name: "NIFTY 50",
        value: "21850.50",
        change: "0.95",
        timestamp: new Date()
      },
      {
        name: "SENSEX",
        value: "72450.25",
        change: "0.88",
        timestamp: new Date()
      }
    ];

    await db.insert(schema.indianMarketIndices).values(indianIndices);
    console.log("Inserted Indian market indices");

    // Insert sector performance
    const sectors = [
      {
        name: "Technology",
        change: "1.5",
        timestamp: new Date()
      },
      {
        name: "Healthcare",
        change: "-0.3",
        timestamp: new Date()
      },
      {
        name: "Finance",
        change: "0.8",
        timestamp: new Date()
      }
    ];

    await db.insert(schema.sectorPerformance).values(sectors);
    console.log("Inserted sector performance");

    // Insert market factors
    const [factor1] = await db.insert(schema.marketFactors).values({
      name: "Technical Indicators",
      score: "75.5",
      timestamp: new Date()
    }).returning();

    const [factor2] = await db.insert(schema.marketFactors).values({
      name: "Market Sentiment",
      score: "68.2",
      timestamp: new Date()
    }).returning();

    console.log("Inserted market factors");

    // Insert factor elements
    await db.insert(schema.factorElements).values([
      {
        factorId: factor1.id,
        name: "Moving Averages",
        status: "Positive"
      },
      {
        factorId: factor1.id,
        name: "RSI",
        status: "Neutral"
      },
      {
        factorId: factor2.id,
        name: "News Sentiment",
        status: "Positive"
      }
    ]);

    console.log("Inserted factor elements");

    // Insert Nifty PCR data
    await db.insert(schema.niftyPCR).values({
      value: "1.25",
      change: "0.15",
      timestamp: new Date(),
      putVolume: "1250000",
      callVolume: "1000000"
    });

    console.log("Inserted Nifty PCR data");

    // Insert upcoming events
    await db.insert(schema.upcomingEvents).values([
      {
        title: "RBI Monetary Policy Meeting",
        description: "Reserve Bank of India's bi-monthly monetary policy review",
        eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        importance: "high",
        type: "policy",
        impact: "neutral"
      },
      {
        title: "Q4 Earnings Season",
        description: "Major companies start reporting Q4 2023 earnings",
        eventDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        importance: "high",
        type: "earnings",
        impact: "positive"
      }
    ]);

    console.log("Inserted upcoming events");

    console.log("Seed completed successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed().catch(console.error); 