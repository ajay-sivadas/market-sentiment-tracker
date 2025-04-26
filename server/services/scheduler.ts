import cron from 'node-cron';
import { moneyControlScraper } from './moneycontrolScraper';
import { logger } from '../utils/logger';

export class Scheduler {
  private static instance: Scheduler;
  private jobs: cron.ScheduledTask[] = [];

  private constructor() {}

  public static getInstance(): Scheduler {
    if (!Scheduler.instance) {
      Scheduler.instance = new Scheduler();
    }
    return Scheduler.instance;
  }

  public async start(): Promise<void> {
    logger.info('Starting scheduler...');

    // Run initial update immediately
    try {
      logger.info('Running initial market metrics update');
      await moneyControlScraper.updateMarketMetrics();
      logger.info('Initial market metrics update completed successfully');
    } catch (error) {
      logger.error('Error in initial market metrics update', { error });
    }

    // Schedule market metrics update every 15 minutes
    const marketMetricsJob = cron.schedule('*/15 * * * *', async () => {
      try {
        logger.info('Running scheduled market metrics update');
        await moneyControlScraper.updateMarketMetrics();
        logger.info('Scheduled market metrics update completed successfully');
      } catch (error) {
        logger.error('Error in scheduled market metrics update', { error });
      }
    });

    this.jobs.push(marketMetricsJob);
    logger.info('Scheduler started successfully');
  }

  public stop(): void {
    logger.info('Stopping scheduler...');
    this.jobs.forEach(job => job.stop());
    this.jobs = [];
    logger.info('Scheduler stopped successfully');
  }
}

export const scheduler = Scheduler.getInstance(); 