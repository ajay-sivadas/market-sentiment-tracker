import { Router } from 'express';
import { moneyControlScraper } from '../services/moneycontrolScraper';
import { logger } from '../utils/logger';

const router = Router();

// Get Indian market indices
router.get('/indian-indices', async (req, res) => {
  try {
    const indices = await moneyControlScraper.scrapeIndianIndices();
    res.json(indices);
  } catch (error) {
    logger.error('Error fetching Indian indices', { error });
    res.status(500).json({ error: 'Failed to fetch Indian indices' });
  }
});

// Get global market indices
router.get('/global-indices', async (req, res) => {
  try {
    const indices = await moneyControlScraper.scrapeGlobalIndices();
    res.json(indices);
  } catch (error) {
    logger.error('Error fetching global indices', { error });
    res.status(500).json({ error: 'Failed to fetch global indices' });
  }
});

// Get latest news
router.get('/latest-news', async (req, res) => {
  try {
    const news = await moneyControlScraper.scrapeLatestNews();
    res.json(news);
  } catch (error) {
    logger.error('Error fetching latest news', { error });
    res.status(500).json({ error: 'Failed to fetch latest news' });
  }
});

// Get market news
router.get('/market-news', async (req, res) => {
  try {
    const news = await moneyControlScraper.scrapeMarketNews();
    res.json(news);
  } catch (error) {
    logger.error('Error fetching market news', { error });
    res.status(500).json({ error: 'Failed to fetch market news' });
  }
});

// Update market metrics
router.post('/update-metrics', async (req, res) => {
  try {
    await moneyControlScraper.updateMarketMetrics();
    res.json({ message: 'Market metrics updated successfully' });
  } catch (error) {
    logger.error('Error updating market metrics', { error });
    res.status(500).json({ error: 'Failed to update market metrics' });
  }
});

export default router; 