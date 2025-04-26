import express from 'express';
import cors from 'cors';
import { logger } from './utils/logger';
import newsRoutes from './routes/news';
import zerodhaRoutes from './routes/zerodhaScraper';
import moneyControlRoutes from './routes/moneycontrolScraper';
import { scheduler } from './services/scheduler';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Register routes
app.use('/api/news', newsRoutes);
app.use('/api/zerodha', zerodhaRoutes);
app.use('/api/moneycontrol', moneyControlRoutes);

// Start the scheduler
scheduler.start().catch(error => {
  logger.error('Failed to start scheduler', { error });
});

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received. Closing server...');
  scheduler.stop();
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received. Closing server...');
  scheduler.stop();
  process.exit(0);
});
