import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import * as marketDataService from "./services/marketData";
import * as newsScraperService from "./services/newsScraper";
import * as sentimentAnalyzerService from "./services/sentimentAnalyzer";
import { TimeFrameType } from "./services/marketData";
import { log } from "./vite";

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
  
  // Get upcoming events
  app.get(`${apiPrefix}/upcoming-events`, async (req, res) => {
    try {
      const upcomingEvents = await storage.getUpcomingEvents();
      return res.json(upcomingEvents);
    } catch (error) {
      console.error("Error fetching upcoming events:", error);
      return res.status(500).json({ error: "Failed to fetch upcoming events" });
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
  
  // Initialize WebSocket server on a distinct path to avoid conflicts with Vite's HMR
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Handle WebSocket connections
  wss.on('connection', (ws) => {
    log('WebSocket client connected', 'ws-server');
    
    // Send current data to client
    const sendInitialData = async () => {
      try {
        // Get the latest sentiment data
        const currentSentiment = await storage.getCurrentSentiment();
        
        // Send initial data to client
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({
            type: 'sentiment',
            data: currentSentiment
          }));
        }
      } catch (error) {
        console.error('Error sending initial WebSocket data:', error);
      }
    };
    
    // Send initial data when client connects
    sendInitialData();
    
    // Set up interval to send real-time market updates
    const intervalId = setInterval(async () => {
      if (ws.readyState === WebSocket.OPEN) {
        try {
          // Generate real-time market data for Nifty50
          const niftyValue = 22000 + (Math.random() - 0.5) * 200; // Random value around 22000
          
          // Generate a sentiment score update with slight variations
          const currentSentiment = await storage.getCurrentSentiment();
          const sentimentUpdate = {
            ...currentSentiment,
            score: currentSentiment.score + (Math.random() - 0.5) * 2, // Small random variation
            lastUpdated: new Date().toISOString()
          };
          
          // Send the combined real-time data
          ws.send(JSON.stringify({
            type: 'live-update',
            data: {
              timestamp: new Date().toISOString(),
              niftyValue,
              score: sentimentUpdate.score
            }
          }));
        } catch (error) {
          console.error('Error sending WebSocket update:', error);
        }
      }
    }, 3000); // Send updates every 3 seconds
    
    // Handle client disconnection
    ws.on('close', () => {
      log('WebSocket client disconnected', 'ws-server');
      clearInterval(intervalId);
    });
    
    // Handle client messages
    ws.on('message', (message) => {
      try {
        const parsedMessage = JSON.parse(message.toString());
        log(`Received message from client: ${JSON.stringify(parsedMessage)}`, 'ws-server');
        
        // Handle different message types from client
        if (parsedMessage.type === 'subscribe') {
          // Client subscribing to a specific data stream
          log(`Client subscribed to: ${parsedMessage.channel}`, 'ws-server');
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    });
  });

  return httpServer;
}
