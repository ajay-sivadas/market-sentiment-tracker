import { Router, Request, Response } from 'express';
import { moneyControlScraper } from '../services/moneycontrolScraper';
import { logger } from '../utils/logger';

const router = Router();

// Debug middleware for news routes
router.use((req, res, next) => {
  logger.info('News route accessed:', {
    method: req.method,
    path: req.path,
    query: req.query
  });
  next();
});

// Add cache control middleware
router.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Log all registered routes
const logRoutes = () => {
  const routes = router.stack
    .filter((r: any) => r.route)
    .map((r: any) => ({
      path: r.route.path,
      method: Object.keys(r.route.methods)[0]
    }));
  
  logger.info('News routes registered:', routes);
};

// Get all news (latest + market)
router.get('/', async (req: Request, res: Response) => {
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

// Get latest news only
router.get('/latest', async (req: Request, res: Response) => {
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

// Get market news only
router.get('/market', async (req: Request, res: Response) => {
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

// Log the registered routes
logRoutes();

// Export the router
export default router; 