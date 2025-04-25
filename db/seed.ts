import { db } from "./index";
import * as schema from "@shared/schema";

async function seed() {
  try {
    // Seed current sentiment score
    const sentimentScores = await db.insert(schema.sentimentScores).values([
      {
        score: 67.8,
        change: 2.4,
        marketStatus: "Bullish",
        trendDirection: "Upward",
        volatility: "Medium",
        confidenceLabel: "High",
        confidenceValue: 87,
        timestamp: new Date()
      }
    ]).returning();

    console.log(`Seeded ${sentimentScores.length} sentiment scores`);

    // Seed historical sentiment data (30 days of data points)
    const baseDate = new Date();
    const historicalData = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(baseDate);
      date.setDate(date.getDate() - (29 - i));
      
      // Generate sentiment score with some randomness but trending upward
      const baseScore = 50 + (i * 0.5);
      const randomVariation = Math.random() * 10 - 5; // -5 to +5
      const score = Math.min(Math.max(baseScore + randomVariation, 30), 90);
      
      return {
        timestamp: date,
        score
      };
    });

    const insertedHistorical = await db.insert(schema.historicalSentiment).values(historicalData).returning();
    console.log(`Seeded ${insertedHistorical.length} historical sentiment data points`);

    // Seed key events
    const keyEvents = [
      {
        title: "Fed Rate Decision",
        description: "Federal Reserve leaves interest rates unchanged as expected",
        timestamp: new Date(baseDate.getTime() - (7 * 24 * 60 * 60 * 1000)), // 7 days ago
        impact: "positive"
      },
      {
        title: "Strong Tech Earnings",
        description: "Major tech companies report better than expected earnings",
        timestamp: new Date(baseDate.getTime() - (14 * 24 * 60 * 60 * 1000)), // 14 days ago
        impact: "positive"
      },
      {
        title: "Inflation Report",
        description: "CPI data shows inflation higher than expected",
        timestamp: new Date(baseDate.getTime() - (21 * 24 * 60 * 60 * 1000)), // 21 days ago
        impact: "negative"
      }
    ];

    const insertedEvents = await db.insert(schema.keyEvents).values(keyEvents).returning();
    console.log(`Seeded ${insertedEvents.length} key events`);

    // Seed news items
    const newsItems = [
      {
        title: "Fed Signals Potential Rate Cut as Inflation Eases",
        summary: "Federal Reserve officials indicated they may consider cutting interest rates later this year if inflation continues to moderate, according to meeting minutes released today.",
        source: "Financial Times",
        url: "https://www.ft.com/fed-signals-rate-cut",
        sentimentImpact: 1.2,
        timestamp: new Date(baseDate.getTime() - (6 * 60 * 60 * 1000)), // 6 hours ago
        tags: ["Fed", "Interest Rates", "Policy"]
      },
      {
        title: "Tech Giants Exceed Earnings Expectations, Boosting Market Confidence",
        summary: "Major technology companies reported quarterly earnings that surpassed analyst expectations, driven by strong cloud services growth and increased enterprise spending on AI technologies.",
        source: "Bloomberg",
        url: "https://www.bloomberg.com/tech-earnings-beat",
        sentimentImpact: 0.8,
        timestamp: new Date(baseDate.getTime() - (9 * 60 * 60 * 1000)), // 9 hours ago
        tags: ["Tech", "Earnings", "AI"]
      },
      {
        title: "Retail Sales Data Shows Unexpected Decline in Consumer Spending",
        summary: "April retail sales figures came in lower than expected, raising concerns about consumer sentiment and household spending patterns amid persistent inflation pressures.",
        source: "Reuters",
        url: "https://www.reuters.com/retail-sales-decline",
        sentimentImpact: -0.6,
        timestamp: new Date(baseDate.getTime() - (12 * 60 * 60 * 1000)), // 12 hours ago
        tags: ["Retail", "Consumer", "Economy"]
      },
      {
        title: "Manufacturing Output Surges to Highest Level in Two Years",
        summary: "Industrial production rose significantly in April, marking the strongest growth rate since 2021 and indicating robust expansion in manufacturing activity.",
        source: "CNBC",
        url: "https://www.cnbc.com/manufacturing-output-surges",
        sentimentImpact: 1.0,
        timestamp: new Date(baseDate.getTime() - (24 * 60 * 60 * 1000)), // 24 hours ago
        tags: ["Manufacturing", "Industrial", "Growth"]
      },
      {
        title: "Geopolitical Tensions Drive Oil Prices Higher",
        summary: "Crude oil futures climbed as escalating conflicts in key producing regions raised concerns about potential supply disruptions, adding to market uncertainty.",
        source: "Wall Street Journal",
        url: "https://www.wsj.com/oil-prices-tensions",
        sentimentImpact: -0.4,
        timestamp: new Date(baseDate.getTime() - (28 * 60 * 60 * 1000)), // 28 hours ago
        tags: ["Oil", "Geopolitical", "Commodities"]
      }
    ];

    const insertedNews = await db.insert(schema.newsItems).values(newsItems).returning();
    console.log(`Seeded ${insertedNews.length} news items`);

    // Seed market indices
    const indices = [
      {
        name: "S&P 500",
        value: 4325.76,
        change: 1.2,
        timestamp: new Date()
      },
      {
        name: "NASDAQ",
        value: 13756.33,
        change: 1.8,
        timestamp: new Date()
      },
      {
        name: "Dow Jones",
        value: 32845.13,
        change: 0.9,
        timestamp: new Date()
      },
      {
        name: "VIX",
        value: 18.32,
        change: -5.4,
        timestamp: new Date()
      },
      {
        name: "10-YR Treasury",
        value: 3.45,
        change: 0.0,
        timestamp: new Date()
      }
    ];

    const insertedIndices = await db.insert(schema.marketIndices).values(indices).returning();
    console.log(`Seeded ${insertedIndices.length} market indices`);

    // Seed sector performance
    const sectors = [
      {
        name: "Technology",
        change: 2.7,
        timestamp: new Date()
      },
      {
        name: "Healthcare",
        change: 1.5,
        timestamp: new Date()
      },
      {
        name: "Financials",
        change: 1.2,
        timestamp: new Date()
      },
      {
        name: "Industrials",
        change: 0.3,
        timestamp: new Date()
      },
      {
        name: "Energy",
        change: -0.8,
        timestamp: new Date()
      },
      {
        name: "Utilities",
        change: -1.2,
        timestamp: new Date()
      }
    ];

    const insertedSectors = await db.insert(schema.sectorPerformance).values(sectors).returning();
    console.log(`Seeded ${insertedSectors.length} sector performance data`);

    // Seed Indian market indices
    const indianIndices = [
      {
        name: "NIFTY 50",
        value: 21845.50,
        change: 0.9,
        timestamp: new Date()
      },
      {
        name: "SENSEX",
        value: 71532.25,
        change: 0.8,
        timestamp: new Date()
      },
      {
        name: "NIFTY BANK",
        value: 46735.20,
        change: 1.2,
        timestamp: new Date()
      },
      {
        name: "NIFTY IT",
        value: 32567.80,
        change: 1.5,
        timestamp: new Date()
      },
      {
        name: "INDIA VIX",
        value: 14.85,
        change: -3.2,
        timestamp: new Date()
      }
    ];

    const insertedIndianIndices = await db.insert(schema.indianMarketIndices).values(indianIndices).returning();
    console.log(`Seeded ${insertedIndianIndices.length} Indian market indices`);

    // Seed Nifty PCR data
    const niftyPCRData = {
      value: 1.25,
      change: 0.15,
      timestamp: new Date(),
      putVolume: 4528000,
      callVolume: 3622400
    };

    const insertedNiftyPCR = await db.insert(schema.niftyPCR).values(niftyPCRData).returning();
    console.log(`Seeded Nifty PCR data`);

    // Seed upcoming events
    const upcomingEvents = [
      {
        title: "RBI Monetary Policy Meeting",
        description: "Reserve Bank of India meeting to decide on interest rates policy",
        eventDate: new Date(baseDate.getTime() + (3 * 24 * 60 * 60 * 1000)), // 3 days from now
        importance: "high",
        type: "policy",
        impact: "neutral"
      },
      {
        title: "India GDP Data Release",
        description: "Quarterly GDP data for Indian economy",
        eventDate: new Date(baseDate.getTime() + (5 * 24 * 60 * 60 * 1000)), // 5 days from now
        importance: "high",
        type: "economic",
        impact: "positive"
      },
      {
        title: "Infosys Quarterly Results",
        description: "Q1 2023 earnings for Infosys",
        eventDate: new Date(baseDate.getTime() + (7 * 24 * 60 * 60 * 1000)), // 7 days from now
        importance: "medium",
        type: "earnings",
        impact: "positive"
      },
      {
        title: "HDFC Bank Dividend Announcement",
        description: "Expected declaration of quarterly dividend",
        eventDate: new Date(baseDate.getTime() + (10 * 24 * 60 * 60 * 1000)), // 10 days from now
        importance: "medium",
        type: "earnings",
        impact: "positive"
      }
    ];

    const insertedUpcomingEvents = await db.insert(schema.upcomingEvents).values(upcomingEvents).returning();
    console.log(`Seeded ${insertedUpcomingEvents.length} upcoming events`);

    // Seed market factors
    const factors = [
      {
        name: "Economic Indicators",
        score: 2.1,
        timestamp: new Date()
      },
      {
        name: "Technical Factors",
        score: 1.8,
        timestamp: new Date()
      },
      {
        name: "Market Sentiment",
        score: 1.5,
        timestamp: new Date()
      }
    ];

    const insertedFactors = await db.insert(schema.marketFactors).values(factors).returning();
    console.log(`Seeded ${insertedFactors.length} market factors`);

    // Seed factor elements
    const economicElements = [
      {
        factorId: insertedFactors[0].id,
        name: "Employment",
        status: "Strong"
      },
      {
        factorId: insertedFactors[0].id,
        name: "GDP Growth",
        status: "Positive"
      },
      {
        factorId: insertedFactors[0].id,
        name: "Inflation",
        status: "Moderate"
      },
      {
        factorId: insertedFactors[0].id,
        name: "Consumer Confidence",
        status: "Neutral"
      }
    ];

    const technicalElements = [
      {
        factorId: insertedFactors[1].id,
        name: "Moving Averages",
        status: "Bullish"
      },
      {
        factorId: insertedFactors[1].id,
        name: "Momentum",
        status: "Strong"
      },
      {
        factorId: insertedFactors[1].id,
        name: "Volume",
        status: "Average"
      },
      {
        factorId: insertedFactors[1].id,
        name: "Breadth",
        status: "Positive"
      }
    ];

    const sentimentElements = [
      {
        factorId: insertedFactors[2].id,
        name: "News Sentiment",
        status: "Positive"
      },
      {
        factorId: insertedFactors[2].id,
        name: "Social Media",
        status: "Bullish"
      },
      {
        factorId: insertedFactors[2].id,
        name: "Analyst Ratings",
        status: "Neutral"
      },
      {
        factorId: insertedFactors[2].id,
        name: "Options Flow",
        status: "Bullish"
      }
    ];

    const allElements = [...economicElements, ...technicalElements, ...sentimentElements];
    const insertedElements = await db.insert(schema.factorElements).values(allElements).returning();
    console.log(`Seeded ${insertedElements.length} factor elements`);

  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
