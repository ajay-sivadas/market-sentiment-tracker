import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import winston from 'winston';

// Create a logger instance
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ filename: 'logs/zerodha-scraper.log' })
  ]
});

interface EconomicEvent {
  date: string;
  event: string;
  importance: string;
  previous: string;
  actual: string;
  unit: string;
}

export class ZerodhaScraper {
  private readonly baseUrl = 'https://zerodha.com/markets/calendar/#';

  private isWithinNextMonth(dateStr: string): boolean {
    try {
      const eventDate = new Date(dateStr);
      const today = new Date();
      const nextMonth = new Date(today);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      
      return eventDate >= today && eventDate <= nextMonth;
    } catch (error) {
      logger.error('Error parsing date:', { dateStr, error });
      return false;
    }
  }

  async scrapeEconomicCalendar(): Promise<EconomicEvent[]> {
    try {
      const response = await fetch(this.baseUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch calendar: ${response.status} ${response.statusText}`);
      }
      
      const html = await response.text();
      const $ = cheerio.load(html);
      
      const events: EconomicEvent[] = [];
      let currentDate = '';
      
      // Find all rows in the table
      $('table tr').each((_, row) => {
        const $row = $(row);
        
        // Check if this is a date row
        if ($row.hasClass('date')) {
          const dateStr = $row.find('td.date strong').text().trim();
          // Only process if date is within next month
          if (this.isWithinNextMonth(dateStr)) {
            currentDate = dateStr;
            logger.info('Found date within next month', { date: currentDate });
          } else {
            currentDate = ''; // Reset currentDate if outside next month
          }
          return;
        }
        
        // Skip if not an entry row, no date set, or not a high-impact Indian event
        if (!$row.hasClass('entry') || !currentDate || !$row.attr('data-tag')?.includes('india|H')) {
          return;
        }
        
        // Get the event name and clean it up
        const eventName = $row.find('td.event-name').text()
          .replace(/Remind me/g, '') // Remove "Remind me" text
          .replace(/\s+/g, ' ') // Replace multiple spaces with single space
          .trim();
        
        const event: EconomicEvent = {
          date: currentDate,
          event: eventName,
          importance: 'high', // Since we're only getting high-impact events
          previous: $row.find('td.prev').text().trim(),
          actual: $row.find('td.actual').text().trim(),
          unit: $row.find('td.unit').text().trim()
        };
        
        // Only add events that have all required fields
        if (event.date && event.event) {
          logger.info('Found high-impact Indian event within next month', { event });
          events.push(event);
        }
      });
      
      logger.info('Total high-impact Indian events found within next month', { count: events.length });
      return events;
    } catch (error) {
      logger.error('Error scraping Zerodha calendar', { error });
      throw new Error('Failed to scrape economic calendar data');
    }
  }
}

export const zerodhaScraper = new ZerodhaScraper(); 