import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import * as marketDataService from "./services/marketData";
import * as newsScraperService from "./services/newsScraper";
import * as sentimentAnalyzerService from "./services/sentimentAnalyzer";
import { TimeFrameType } from "./services/marketData";

export async function registerRoutes(app: Express): Promise<Server> {
  // API prefix
  const apiPrefix = "/api";

  // Get current sentiment data
  app.get(`${apiPrefix}/sentiment/current`, async (req, res) => {
    try {
      const currentSentiment = await storage.getCurrentSentiment();
      return res.json(currentSentiment);
    } catch (error) {
      console.error("Error fetching current sentiment:", error);
      return res.status(500).json({ error: "Failed to fetch current sentiment data" });
    }
  });

  // Get historical sentiment data
  app.get(`${apiPrefix}/sentiment/historical`, async (req, res) => {
    try {
      const timeFrame = (req.query.timeFrame as TimeFrameType) || "1M";
      const historicalData = await storage.getHistoricalSentiment(timeFrame);
      return res.json(historicalData);
    } catch (error) {
      console.error("Error fetching historical sentiment:", error);
      return res.status(500).json({ error: "Failed to fetch historical sentiment data" });
    }
  });

  // Get news data
  app.get(`${apiPrefix}/news`, async (req, res) => {
    try {
      const timeFrame = (req.query.timeFrame as TimeFrameType) || "1M";
      const newsData = await storage.getNewsItems(timeFrame);
      return res.json(newsData);
    } catch (error) {
      console.error("Error fetching news:", error);
      return res.status(500).json({ error: "Failed to fetch news data" });
    }
  });

  // Get market metrics
  app.get(`${apiPrefix}/market-metrics`, async (req, res) => {
    try {
      const marketMetrics = await storage.getMarketMetrics();
      return res.json(marketMetrics);
    } catch (error) {
      console.error("Error fetching market metrics:", error);
      return res.status(500).json({ error: "Failed to fetch market metrics" });
    }
  });

  // Get market factors
  app.get(`${apiPrefix}/market-factors`, async (req, res) => {
    try {
      const marketFactors = await storage.getMarketFactors();
      return res.json(marketFactors);
    } catch (error) {
      console.error("Error fetching market factors:", error);
      return res.status(500).json({ error: "Failed to fetch market factors" });
    }
  });

  // Update market data (this would typically be called by a scheduled job)
  app.post(`${apiPrefix}/update-market-data`, async (req, res) => {
    try {
      // Get latest market data
      const marketData = await marketDataService.fetchLatestMarketData();
      
      // Get latest news
      const newsData = await newsScraperService.fetchLatestNews();
      
      // Analyze sentiment based on market data and news
      const sentimentData = await sentimentAnalyzerService.analyzeSentiment(marketData, newsData);
      
      // Store all the data
      await storage.updateMarketData(marketData);
      await storage.addNewsItems(newsData);
      await storage.updateSentiment(sentimentData);
      
      return res.status(200).json({ message: "Market data updated successfully" });
    } catch (error) {
      console.error("Error updating market data:", error);
      return res.status(500).json({ error: "Failed to update market data" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
