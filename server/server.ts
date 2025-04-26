import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import { config } from "./config";
import { Pool } from 'pg';
import { registerRoutes } from "./routes";
import cors from 'cors';
import newsRoutes from './routes/news';
import zerodhaRoutes from './routes/zerodhaScraper';
import moneyControlRoutes from './routes/moneycontrolScraper';
import { logger } from './utils/logger';
import { moneyControlScraper } from './services/moneycontrolScraper';

// Create a new pool instance with connection retry
const createPool = async (retries = 5, delay = 2000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const pool = new Pool({
        connectionString: config.databaseUrl,
        connectionTimeoutMillis: 5000,
      });
      // Test the connection
      await pool.query('SELECT 1');
      console.log('Database connection established');
      return pool;
    } catch (error) {
      if (i === retries - 1) throw error;
      console.log(`Database connection attempt ${i + 1} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Failed to establish database connection after multiple attempts');
};

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Debug middleware to log all requests
app.use((req, res, next) => {
  logger.info('Incoming request:', {
    method: req.method,
    path: req.path,
    query: req.query,
    headers: req.headers
  });
  next();
});

// Initialize server
const initServer = async () => {
  try {
    const pool = await createPool();
    
    // Register all routes first
    const server = await registerRoutes(app);
    
    // API Routes
    app.get('/api/health', async (req, res) => {
      try {
        // Test database connection
        await pool.query('SELECT 1');
        res.json({ 
          status: 'ok',
          timestamp: new Date().toISOString(),
          environment: config.nodeEnv,
          database: 'connected'
        });
      } catch (error) {
        res.status(500).json({
          status: 'error',
          error: 'Database connection failed',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Root route that lists all available endpoints
    app.get('/', (req, res) => {
      res.json({
        message: 'Welcome to MarketMood API',
        version: '1.0.0',
        endpoints: {
          news: {
            all: '/api/news',
            latest: '/api/news/latest',
            market: '/api/news/market'
          },
          market: {
            metrics: '/api/market-metrics',
            factors: '/api/market-factors'
          },
          sentiment: {
            current: '/api/sentiment/current',
            historical: '/api/sentiment/historical'
          },
          events: '/api/upcoming-events',
          health: '/api/health'
        }
      });
    });
    
    // News routes
    app.get('/api/news', async (req, res) => {
      try {
        logger.info('Fetching all news');
        const [latestNews, marketNews] = await Promise.all([
          moneyControlScraper.scrapeLatestNews(),
          moneyControlScraper.scrapeMarketNews()
        ]);

        const combinedNews = [...latestNews, ...marketNews]
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        logger.info('Successfully fetched all news', { 
          latestNewsCount: latestNews.length,
          marketNewsCount: marketNews.length,
          totalNewsCount: combinedNews.length
        });

        res.json(combinedNews);
      } catch (error) {
        logger.error('Error fetching news', { error });
        res.status(500).json({ error: 'Failed to fetch news' });
      }
    });

    app.get('/api/news/latest', async (req, res) => {
      try {
        logger.info('Fetching latest news');
        const news = await moneyControlScraper.scrapeLatestNews();
        logger.info('Successfully fetched latest news', { count: news.length });
        res.json(news);
      } catch (error) {
        logger.error('Error fetching latest news', { error });
        res.status(500).json({ error: 'Failed to fetch latest news' });
      }
    });

    app.get('/api/news/market', async (req, res) => {
      try {
        logger.info('Fetching market news');
        const news = await moneyControlScraper.scrapeMarketNews();
        logger.info('Successfully fetched market news', { count: news.length });
        res.json(news);
      } catch (error) {
        logger.error('Error fetching market news', { error });
        res.status(500).json({ error: 'Failed to fetch market news' });
      }
    });

    // 404 handler
    app.use((req, res) => {
      logger.warn('404 Not Found:', {
        method: req.method,
        path: req.path,
        query: req.query
      });
      
      res.status(404).json({
        error: 'Not Found',
        message: `The requested path ${req.path} was not found`,
        availableEndpoints: [
          '/',
          '/api/health',
          '/api/news',
          '/api/news/latest',
          '/api/news/market',
          '/api/market-metrics',
          '/api/market-factors',
          '/api/sentiment/current',
          '/api/sentiment/historical',
          '/api/upcoming-events'
        ]
      });
    });

    // Routes
    app.use('/api/news', newsRoutes);
    app.use('/api/zerodha', zerodhaRoutes);
    app.use('/api/moneycontrol', moneyControlRoutes);

    // Error handling middleware
    app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
      logger.error('Unhandled error:', err);
      res.status(500).json({ error: 'Internal server error' });
    });
    
    // Handle process signals
    const signals = ['SIGINT', 'SIGTERM', 'SIGHUP'];
    signals.forEach(signal => {
      process.on(signal, () => {
        console.log(`Received ${signal}, shutting down gracefully...`);
        server.close(() => {
          console.log('Server closed');
          pool.end(() => {
            console.log('Database pool closed');
            process.exit(0);
          });
        });
      });
    });

    const serverInstance = server.listen(config.port, () => {
      const address = serverInstance.address();
      const port = typeof address === 'object' && address ? address.port : 'unknown';
      console.log(`Server running on port ${port}`);
      console.log(`Environment: ${config.nodeEnv}`);
      
      // Log all registered routes
      const routes = app._router.stack
        .filter((r: any) => r.route)
        .map((r: any) => ({
          path: r.route.path,
          method: Object.keys(r.route.methods)[0]
        }));
      
      logger.info('Registered routes:', routes);
    });

    return server;
  } catch (error) {
    console.error('Failed to initialize server:', error);
    process.exit(1);
  }
};

// Start the server
initServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

export default app; 