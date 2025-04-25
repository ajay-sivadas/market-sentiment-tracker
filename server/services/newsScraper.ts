// This service would typically use APIs like NewsAPI, AlphaVantage News, or web scraping with Cheerio
// For this implementation, we'll simulate news scraping

import { subHours } from "date-fns";

// Sample news sources
const NEWS_SOURCES = [
  "Bloomberg",
  "CNBC",
  "Financial Times",
  "Reuters",
  "Wall Street Journal",
  "MarketWatch",
  "Seeking Alpha",
  "Yahoo Finance",
  "Business Insider",
  "The Economist"
];

// Sample news headlines
const HEADLINE_TEMPLATES = [
  "{ENTITY} Reports {ADJ} Quarterly Earnings, {DIRECTION} Analyst Expectations",
  "Fed Officials Signal {ADJ} Stance on Interest Rates Amid {ECONOMIC} Concerns",
  "{SECTOR} Stocks {MOVEMENT} as {ENTITY} Announces {EVENT}",
  "Market {MOVEMENT} After {ENTITY} {EVENT}",
  "{COUNTRY} Economic Data Shows {ADJ} {ECONOMIC} Growth",
  "Investors React to {EVENT} with {MOVEMENT} in {SECTOR} Sector",
  "{ENTITY} CEO Comments on {EVENT}, Shares {MOVEMENT}",
  "Analysts {ADJ} on {SECTOR} Outlook Following {EVENT}",
  "{COUNTRY} {POLICY} Policy Shift Impacts Global Markets",
  "Breaking: {ENTITY} Announces {EVENT}, {SECTOR} Stocks {MOVEMENT}"
];

// Sample entities
const ENTITIES = [
  "Apple", "Microsoft", "Amazon", "Google", "Tesla", "JP Morgan", 
  "Goldman Sachs", "Exxon Mobil", "Pfizer", "Johnson & Johnson",
  "Federal Reserve", "European Central Bank", "Bank of England"
];

// Sample sectors
const SECTORS = [
  "Technology", "Financial", "Healthcare", "Energy", "Consumer", 
  "Industrial", "Materials", "Utilities", "Communication", "Real Estate"
];

// Sample adjectives
const ADJECTIVES = [
  "Strong", "Weak", "Surprising", "Disappointing", "Mixed",
  "Better-than-expected", "Worse-than-expected", "Steady", "Volatile", "Cautious"
];

// Sample economic terms
const ECONOMIC_TERMS = [
  "GDP", "CPI", "Inflation", "Employment", "Consumer Spending",
  "Manufacturing", "Trade Deficit", "Housing", "Retail Sales", "Supply Chain"
];

// Sample events
const EVENTS = [
  "Acquisition", "Merger", "Product Launch", "Strategic Partnership",
  "Cost-Cutting Measures", "Layoffs", "Restructuring", "Dividend Increase",
  "Share Buyback", "Expansion Plans", "Regulatory Approval", "Legal Settlement"
];

// Sample countries
const COUNTRIES = [
  "US", "China", "EU", "UK", "Japan", "Germany", "India", 
  "Brazil", "Russia", "Australia", "Canada", "South Korea"
];

// Sample movements
const MOVEMENTS = [
  "Rise", "Fall", "Surge", "Plunge", "Rally", "Retreat",
  "Climb", "Sink", "Jump", "Drop", "Rebound", "Slide"
];

// Sample directions
const DIRECTIONS = [
  "Exceeding", "Missing", "Meeting", "Surpassing", "Falling Short of"
];

// Sample policy terms
const POLICY_TERMS = [
  "Monetary", "Fiscal", "Trade", "Regulatory", "Tax", "Environmental"
];

// Sample tags
const TAG_CATEGORIES = {
  SECTORS: ["Tech", "Finance", "Healthcare", "Energy", "Retail", "Industrial"],
  MARKETS: ["Stocks", "Bonds", "Commodities", "Forex", "Crypto"],
  THEMES: ["Earnings", "Economy", "Policy", "Inflation", "Interest Rates", "Growth"],
  REGIONS: ["US", "Europe", "Asia", "Global", "Emerging Markets"]
};

// Function to generate random news
function generateRandomNews(count = 5) {
  const news = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    // Generate random timestamp within last 24 hours
    const timestamp = subHours(now, Math.floor(Math.random() * 24) + 1);
    
    // Replace template placeholders with random values
    const headlineTemplate = HEADLINE_TEMPLATES[Math.floor(Math.random() * HEADLINE_TEMPLATES.length)];
    
    let title = headlineTemplate
      .replace("{ENTITY}", ENTITIES[Math.floor(Math.random() * ENTITIES.length)])
      .replace("{ADJ}", ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)])
      .replace("{SECTOR}", SECTORS[Math.floor(Math.random() * SECTORS.length)])
      .replace("{ECONOMIC}", ECONOMIC_TERMS[Math.floor(Math.random() * ECONOMIC_TERMS.length)])
      .replace("{EVENT}", EVENTS[Math.floor(Math.random() * EVENTS.length)])
      .replace("{COUNTRY}", COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)])
      .replace("{MOVEMENT}", MOVEMENTS[Math.floor(Math.random() * MOVEMENTS.length)])
      .replace("{DIRECTION}", DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)])
      .replace("{POLICY}", POLICY_TERMS[Math.floor(Math.random() * POLICY_TERMS.length)]);
    
    // In case there are multiple of the same placeholder, replace any remaining
    if (title.includes("{")) {
      title = title
        .replace("{ENTITY}", ENTITIES[Math.floor(Math.random() * ENTITIES.length)])
        .replace("{ADJ}", ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)])
        .replace("{SECTOR}", SECTORS[Math.floor(Math.random() * SECTORS.length)])
        .replace("{ECONOMIC}", ECONOMIC_TERMS[Math.floor(Math.random() * ECONOMIC_TERMS.length)])
        .replace("{EVENT}", EVENTS[Math.floor(Math.random() * EVENTS.length)])
        .replace("{COUNTRY}", COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)])
        .replace("{MOVEMENT}", MOVEMENTS[Math.floor(Math.random() * MOVEMENTS.length)])
        .replace("{DIRECTION}", DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)])
        .replace("{POLICY}", POLICY_TERMS[Math.floor(Math.random() * POLICY_TERMS.length)]);
    }
    
    // Generate random sentiment impact (-2.0 to +2.0)
    const sentimentImpact = parseFloat((Math.random() * 4 - 2).toFixed(1));
    
    // Generate random tags (2-4 tags)
    const tags = [];
    const tagCategoryKeys = Object.keys(TAG_CATEGORIES);
    const numTags = Math.floor(Math.random() * 3) + 2; // 2-4 tags
    
    for (let j = 0; j < numTags; j++) {
      const categoryKey = tagCategoryKeys[Math.floor(Math.random() * tagCategoryKeys.length)];
      const category = TAG_CATEGORIES[categoryKey as keyof typeof TAG_CATEGORIES];
      const tag = category[Math.floor(Math.random() * category.length)];
      
      if (!tags.includes(tag)) {
        tags.push(tag);
      }
    }
    
    // Generate a summary based on the title
    const summaryParts = [
      `Investors reacted to the latest developments as ${title.toLowerCase()}.`,
      `Market analysts noted the implications for broader market sentiment.`,
      `This comes amid ongoing concerns about economic conditions and policy decisions.`,
      `Trading volume was ${Math.random() > 0.5 ? 'above' : 'below'} average following the news.`
    ];
    
    const summary = summaryParts[Math.floor(Math.random() * summaryParts.length)];
    
    // Generate URL (would be real in production)
    const source = NEWS_SOURCES[Math.floor(Math.random() * NEWS_SOURCES.length)];
    const slug = title.toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
    
    const url = `https://www.${source.toLowerCase().replace(/\s+/g, '')}.com/${slug}`;
    
    news.push({
      title,
      summary,
      source,
      url,
      sentimentImpact,
      timestamp: timestamp.toISOString(),
      tags
    });
  }
  
  return news;
}

// Function to fetch latest news
export async function fetchLatestNews(count = 5) {
  try {
    // In a production environment, this would make API calls to news data providers
    // or use a web scraping library like Cheerio to extract news from financial websites.
    // For this implementation, we'll generate simulated news data
    
    return generateRandomNews(count);
    
  } catch (error) {
    console.error("Error fetching news:", error);
    throw new Error("Failed to fetch news data");
  }
}
