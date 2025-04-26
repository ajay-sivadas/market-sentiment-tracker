# MarketMood - Market Sentiment Analysis Platform

## Project Overview

MarketMood is a comprehensive market sentiment analysis platform that provides real-time insights into market trends, economic events, and market metrics. The platform combines data from multiple sources to give users a holistic view of market sentiment.

## Architecture

### Backend (Server)

- Built with Node.js and Express
- TypeScript for type safety
- PostgreSQL database for data storage
- RESTful API endpoints
- Winston for logging
- Cheerio for web scraping

### Frontend (Client)

- React with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Shadcn UI components
- React Query for data fetching
- Custom hooks for data management

## Data Sources

### MoneyControl Scraper

#### Market Indices

##### Indian Indices

- Source URL: `https://www.moneycontrol.com/stocksmarketsindia/`
- Target Elements:
  - Sensex
  - Nifty 50
  - Nifty Bank
  - Nifty Midcap
  - Nifty Smallcap
  - BSE Midcap
  - BSE Smallcap

##### Global Indices

- Source URL: `https://www.moneycontrol.com/global-indices/`
- Target Elements:
  - Dow Jones
  - NASDAQ
  - S&P 500
  - FTSE 100
  - DAX
  - Nikkei 225
  - Hang Seng

#### News Data

##### Latest News

- Source URL: `https://www.moneycontrol.com/news/`
- Target Elements:
  - News Title
  - News Link
  - Category
  - Timestamp
  - Summary (if available)

##### Market News

- Source URL: `https://www.moneycontrol.com/markets/`
- Target Elements:
  - Market Updates
  - Stock Recommendations
  - Technical Analysis
  - Market Commentary

### Zerodha Scraper

- Economic calendar events
- High-impact events filtering
- India-specific event focus
- Event date validation
- HTML structure logging for debugging
- Multiple selector fallbacks

## HTML Structure

### Market Indices Table

```html
<table class="indices-table">
  <tbody>
    <tr>
      <td>Index Name</td>
      <td>Current Value</td>
      <td>Change</td>
      <td>% Change</td>
    </tr>
  </tbody>
</table>
```

### News Articles

```html
<div class="newslist">
  <li>
    <h2><a href="news-link">News Title</a></h2>
    <span class="category">Category</span>
    <span class="datetime">Timestamp</span>
  </li>
</div>
```

## Key Features

### 1. Market Metrics

- Real-time display of Indian and Global market indices
- Separate tabs for Indian and Global markets
- Color-coded percentage changes (green for positive, red for negative)
- Visual progress bars for index movements
- Auto-refresh every minute
- Clean interface focusing on major indices only

### 2. Economic Calendar

- Integration with Zerodha's economic calendar
- Display of upcoming high-impact events
- Filtering for India-specific events
- Event categorization by type and impact
- Date-based event organization
- Importance and impact indicators

### 3. News Integration

- Real-time news from MoneyControl
- Sentiment analysis of news articles
- Categorization of news by type (update, recommendation, analysis, commentary)
- Source attribution
- Timestamp display
- News summary preview

### 4. Sentiment Analysis

- Current market sentiment display
- Historical sentiment trends
- Sentiment scoring based on multiple factors
- Nifty PCR (Put-Call Ratio) integration
- Visual sentiment indicators
- Trend analysis

## Data Processing

### Market Indices

1. Extract index name
2. Parse current value (remove commas, convert to number)
3. Parse change value (remove +/-, convert to number)
4. Parse percentage change (remove %, convert to number)
5. Filter out duplicate entries and company-specific indices
6. Separate Indian and Global indices

### News Articles

1. Extract title and clean text
2. Build absolute URL for links
3. Parse and standardize timestamps
4. Categorize news based on source section
5. Add sentiment analysis
6. Format for display

## Rate Limiting

- Maximum 1 request per 5 seconds per endpoint
- Implement exponential backoff for retries
- Cache responses for 5 minutes
- User-Agent rotation
- IP rotation if needed

## Error Handling

- Handle network timeouts (30 seconds)
- Handle HTML structure changes
- Handle missing or malformed data
- Log all errors with context
- Implement retry mechanism
- Fallback selectors

## Data Validation

- Validate numeric values are within expected ranges
- Ensure required fields are present
- Sanitize text content
- Verify URLs are valid
- Check for duplicate entries
- Validate date formats

## Recent Updates

### Market Metrics Panel

- Removed sector performance section for cleaner interface
- Improved index filtering to show only major indices
- Enhanced visual representation of market movements
- Separate tabs for Indian and Global markets
- Optimized data fetching with React Query
- Added loading skeletons for better UX

### Data Scraping

- Combined Indian and Global indices scraping into single method
- Improved data validation and filtering
- Enhanced error handling and logging
- Optimized scraping performance
- Added detailed HTML structure logging
- Implemented retry mechanism for failed requests

## API Endpoints

- `/api/market-metrics` - Combined market data
- `/api/upcoming-events` - Economic calendar events
- `/api/news` - Latest market news
- `/api/sentiment/current` - Current market sentiment
- `/api/sentiment/historical` - Historical sentiment data
- `/api/moneycontrol/indian-indices` - Indian market indices
- `/api/moneycontrol/global-indices` - Global market indices

## Future Enhancements

1. Add more data sources for comprehensive market coverage
2. Implement user preferences for customizing dashboard
3. Add technical analysis indicators
4. Implement market alerts and notifications
5. Add historical data visualization
6. Implement user authentication and personalized dashboards
7. Add export functionality for data
8. Implement dark/light theme toggle
9. Add mobile-responsive design improvements
10. Implement data caching for better performance

## Development Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
4. Start development servers:
   ```bash
   npm run dev
   ```

## Project Structure

```
MarketMood/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── MarketMetricsPanel.tsx
│   │   │   ├── SentimentScorePanel.tsx
│   │   │   └── EconomicCalendar.tsx
│   │   ├── pages/         # Page components
│   │   ├── types/         # TypeScript type definitions
│   │   ├── utils/         # Utility functions
│   │   └── hooks/         # Custom React hooks
│   └── public/            # Static assets
├── server/                # Backend Express application
│   ├── services/         # Business logic and scrapers
│   │   ├── moneycontrolScraper.ts
│   │   └── zerodhaScraper.ts
│   ├── routes/           # API route handlers
│   ├── storage/          # Database operations
│   └── utils/            # Utility functions
├── doc/                  # Documentation
│   └── context.md        # Project context and documentation
└── shared/               # Shared types and utilities
```

## Legal Considerations

- Respect robots.txt
- Include proper User-Agent headers
- Implement reasonable rate limiting
- Cache data to minimize requests
- Use data only for personal/non-commercial purposes
- Monitor and comply with terms of service
- Implement proper error handling for legal compliance
