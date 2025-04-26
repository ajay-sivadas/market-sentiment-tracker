import { Router } from 'express';
import { zerodhaScraper } from '../services/zerodhaScraper';
import { logger } from '../utils/logger';

const router = Router();

router.get('/economic-calendar', async (req, res) => {
  try {
    const events = await zerodhaScraper.scrapeEconomicCalendar();
    res.json(events);
  } catch (error) {
    logger.error('Error fetching economic calendar:', error);
    res.status(500).json({ error: 'Failed to fetch economic calendar' });
  }
});

export default router; 