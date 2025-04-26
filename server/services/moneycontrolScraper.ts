import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { logger } from '../utils/logger';

interface MarketIndex {
  index: string;
  value: number;
  change: number;
  changePercent: number;
}

interface NewsArticle {
  title: string;
  link: string;
  category: string;
  timestamp: string;
  summary?: string;
  source: string;
}

interface MarketNews extends NewsArticle {
  type: 'update' | 'recommendation' | 'analysis' | 'commentary';
}

export class MoneyControlScraper {
  private readonly baseUrl = 'https://www.moneycontrol.com';
  private readonly userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
  private readonly requestDelay = 5000; // 5 seconds
  private lastRequestTime: number = 0;

  private async delay(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.requestDelay) {
      await new Promise(resolve => setTimeout(resolve, this.requestDelay - timeSinceLastRequest));
    }
    this.lastRequestTime = Date.now();
  }

  private async fetchWithRetry(url: string, retries = 3): Promise<string> {
    try {
      await this.delay();
      logger.info('Making request to:', { url });
      
      const response = await fetch(url, {
        headers: { 
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        redirect: 'follow',
        referrer: 'https://www.moneycontrol.com/',
        referrerPolicy: 'strict-origin-when-cross-origin'
      });

      logger.info('Response status:', { 
        status: response.status,
        statusText: response.statusText,
        finalUrl: response.url,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const html = await response.text();
      
      // Check if we got a valid HTML response
      if (!html.includes('<!DOCTYPE html') && !html.includes('<html')) {
        logger.warn('Response might not be HTML', { 
          contentType: response.headers.get('content-type'),
          first100Chars: html.substring(0, 100)
        });
        throw new Error('Invalid HTML response');
      }

      logger.info('Successfully fetched HTML', { 
        url: response.url,
        length: html.length,
        title: html.match(/<title>(.*?)<\/title>/)?.[1]
      });

      return html;
    } catch (error) {
      logger.error('Fetch error:', { 
        error,
        url,
        retriesLeft: retries
      });
      
      if (retries > 0) {
        logger.warn(`Retrying request to ${url}, attempts left: ${retries}`);
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, 3 - retries) * 1000));
        return this.fetchWithRetry(url, retries - 1);
      }
      throw error;
    }
  }

  async scrapeIndices(): Promise<{ indianIndices: MarketIndex[], globalIndices: MarketIndex[] }> {
    try {
      logger.info('Scraping indices from MoneyControl');
      const html = await this.fetchWithRetry(`${this.baseUrl}/stocksmarketsindia/`);
      const $ = cheerio.load(html);
      const indianIndices: MarketIndex[] = [];
      const globalIndices: MarketIndex[] = [];
      const seenIndices = new Set<string>();

      // Log the HTML structure for debugging
      logger.info('HTML structure:', { 
        tableCount: $('table').length,
        tableHtml: $('table').first().html(),
        allIndices: $('table tbody tr').map((_, row) => {
          const $row = $(row);
          const index = $row.find('td:nth-child(1)').text().trim();
          const value = $row.find('td:nth-child(2)').text().trim();
          const change = $row.find('td:nth-child(3)').text().trim();
          const changePercent = $row.find('td:nth-child(4)').text().trim();
          
          // Log each row's data for debugging
          logger.info('Row data:', {
            index,
            value,
            change,
            changePercent,
            rowHtml: $row.html()
          });
          
          return {
            index,
            value,
            change,
            changePercent
          };
        }).get()
      });

      $('table tbody tr').each((_, row) => {
        const $row = $(row);
        const index = $row.find('td:nth-child(1)').text().trim();
        const value = parseFloat($row.find('td:nth-child(2)').text().trim().replace(/,/g, ''));
        const change = parseFloat($row.find('td:nth-child(3)').text().trim().replace(/[+-]/g, ''));
        const changePercent = parseFloat($row.find('td:nth-child(4)').text().trim().replace('%', ''));

        if (this.validateMarketIndex({ index, value, change, changePercent })) {
          // Skip if we've already seen this index
          if (seenIndices.has(index)) {
            return;
          }
          seenIndices.add(index);

          // Check if it's a global index
          if (index.includes('GIFT NIFTY') || 
              index.includes('Dow Jones') || 
              index.includes('Nasdaq') || 
              index.includes('DAX')) {
            globalIndices.push({ index, value, change, changePercent });
          } 
          // Only include major Indian indices (NIFTY, SENSEX, BSE indices)
          else if ((index.includes('NIFTY') || 
                   index.includes('SENSEX') ||
                   index.includes('INDIA VIX')) &&
                   !index.includes('Sector') &&
                   !index.includes('Performance')) {
            indianIndices.push({ index, value, change, changePercent });
          }
        }
      });

      logger.info('Successfully scraped indices', { 
        indianCount: indianIndices.length, 
        globalCount: globalIndices.length,
        indianIndices,
        globalIndices
      });

      return { indianIndices, globalIndices };
    } catch (error) {
      logger.error('Error scraping indices', { error });
      throw error;
    }
  }

  async scrapeIndianIndices(): Promise<MarketIndex[]> {
    const { indianIndices } = await this.scrapeIndices();
    return indianIndices;
  }

  async scrapeGlobalIndices(): Promise<MarketIndex[]> {
    const { globalIndices } = await this.scrapeIndices();
    return globalIndices;
  }

  async scrapeLatestNews(): Promise<NewsArticle[]> {
    try {
      logger.info('Starting to scrape latest news from MoneyControl');
      const url = `${this.baseUrl}/news/`;
      logger.info('Target URL:', { url });
      
      const html = await this.fetchWithRetry(url);
      const $ = cheerio.load(html);
      const news: NewsArticle[] = [];

      // Log the page title to verify we're on the right page
      const pageTitle = $('title').text();
      logger.info('Page title:', { pageTitle });

      // Try to find news items
      $('a').each((_, element) => {
        const $element = $(element);
        const href = $element.attr('href');
        const text = $element.text().trim();
        
        if (href && text && href.includes('/news/') && !href.includes('#')) {
          logger.info('Found potential news link:', { 
            text,
            href,
            parentHtml: $element.parent().html()
          });
          
          news.push({
            title: text,
            link: this.buildAbsoluteUrl(href),
            category: 'News',
            timestamp: new Date().toISOString(),
            source: 'MoneyControl'
          });
        }
      });

      logger.info('Scraping completed', { 
        newsCount: news.length,
        sampleNews: news.slice(0, 2)
      });

      return news;
    } catch (error) {
      logger.error('Error in scrapeLatestNews:', { error });
      throw error;
    }
  }

  async scrapeMarketNews(): Promise<MarketNews[]> {
    try {
      logger.info('Scraping market news from MoneyControl');
      const html = await this.fetchWithRetry(`${this.baseUrl}/markets/`);
      const $ = cheerio.load(html);
      const news: MarketNews[] = [];

      // Log the full HTML structure for debugging
      logger.info('Full HTML structure:', { 
        html: html.substring(0, 1000) // Log first 1000 chars to see the structure
      });

      // Try to find market news items using various possible structures
      $('article, .article, .market-news, .market_news, .marketnews').each((_, item) => {
        const $item = $(item);
        
        // Try different possible title and link combinations
        const titleElement = $item.find('h2 a, h3 a, .title a, .headline a, .news-title a').first();
        const title = titleElement.text().trim();
        const link = titleElement.attr('href') || '';
        
        // Try different possible category elements
        const category = $item.find('.category, .cat, .news-category, .section, .tag').text().trim();
        
        // Try different possible timestamp elements
        const timestamp = $item.find('.datetime, .date, .time, .timestamp, .news-time').text().trim();
        
        const type = this.determineNewsType(category);

        if (title && link) {
          logger.info('Found market news item:', { title, link, category, timestamp });
          if (this.validateNewsArticle({ title, link, category, timestamp })) {
            news.push({
              title,
              link: this.buildAbsoluteUrl(link),
              category,
              timestamp,
              source: 'MoneyControl',
              type
            });
          }
        }
      });

      if (news.length === 0) {
        // If no news found, try alternative structure
        $('a').each((_, link) => {
          const $link = $(link);
          const href = $link.attr('href');
          if (href && href.includes('/markets/') && !href.includes('#')) {
            const title = $link.text().trim();
            if (title) {
              news.push({
                title,
                link: this.buildAbsoluteUrl(href),
                category: 'Market News',
                timestamp: new Date().toISOString(),
                source: 'MoneyControl',
                type: 'commentary'
              });
            }
          }
        });
      }

      logger.info('Successfully scraped market news', { count: news.length });
      return news;
    } catch (error) {
      logger.error('Error scraping market news', { error });
      throw error;
    }
  }

  async updateMarketMetrics(): Promise<void> {
    try {
      logger.info('Starting market metrics update process');
      
      // Get Indian indices
      logger.info('Scraping Indian indices');
      const indianIndices = await this.scrapeIndianIndices();
      logger.info('Scraped Indian indices', { count: indianIndices.length, sample: indianIndices.slice(0, 2) });
      
      // Get global indices
      logger.info('Scraping global indices');
      const globalIndices = await this.scrapeGlobalIndices();
      logger.info('Scraped global indices', { count: globalIndices.length, sample: globalIndices.slice(0, 2) });
      
      // Format data for update
      const formattedData = {
        indices: globalIndices.map(index => ({
          name: index.index,
          value: index.value,
          change: index.changePercent
        })),
        indianIndices: indianIndices.map(index => ({
          name: index.index,
          value: index.value,
          change: index.changePercent
        }))
      };
      
      logger.info('Formatted data for update', { 
        globalIndicesCount: formattedData.indices.length,
        indianIndicesCount: formattedData.indianIndices.length,
        sampleData: {
          global: formattedData.indices.slice(0, 2),
          indian: formattedData.indianIndices.slice(0, 2)
        }
      });
      
      // Update the database with new data
      logger.info('Importing updateMarketData function');
      const { updateMarketData } = await import('../storage');
      
      logger.info('Calling updateMarketData');
      await updateMarketData(formattedData);
      
      logger.info('Successfully updated market metrics', { 
        indianIndicesCount: indianIndices.length,
        globalIndicesCount: globalIndices.length
      });
    } catch (error) {
      logger.error('Error updating market metrics', { 
        error,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        errorStack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }

  private validateMarketIndex(data: MarketIndex): boolean {
    return (
      typeof data.index === 'string' && data.index.length > 0 &&
      typeof data.value === 'number' && !isNaN(data.value) &&
      typeof data.change === 'number' && !isNaN(data.change) &&
      typeof data.changePercent === 'number' && !isNaN(data.changePercent)
    );
  }

  private validateNewsArticle(data: Pick<NewsArticle, 'title' | 'link' | 'category' | 'timestamp'>): boolean {
    return (
      typeof data.title === 'string' && data.title.length > 0 &&
      typeof data.link === 'string' && data.link.length > 0 &&
      typeof data.category === 'string' && data.category.length > 0 &&
      typeof data.timestamp === 'string' && data.timestamp.length > 0
    );
  }

  private buildAbsoluteUrl(relativeUrl: string): string {
    return relativeUrl.startsWith('http') ? relativeUrl : `${this.baseUrl}${relativeUrl}`;
  }

  private determineNewsType(category: string): MarketNews['type'] {
    const lowerCategory = category.toLowerCase();
    if (lowerCategory.includes('update') || lowerCategory.includes('alert')) {
      return 'update';
    } else if (lowerCategory.includes('recommendation') || lowerCategory.includes('buy') || lowerCategory.includes('sell')) {
      return 'recommendation';
    } else if (lowerCategory.includes('analysis') || lowerCategory.includes('technical')) {
      return 'analysis';
    } else {
      return 'commentary';
    }
  }
}

export const moneyControlScraper = new MoneyControlScraper(); 