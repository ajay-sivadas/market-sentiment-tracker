// Time frame options
export type TimeFrame = "1D" | "1W" | "1M" | "3M" | "1Y" | "All";

// Current sentiment data
export interface SentimentData {
  score: number;
  change: number;
  marketStatus: string; // Now referred to as IV Score status instead of Bullish/Bearish
  trendDirection: string;
  volatility: string;
  confidence: {
    label: string;
    value: number;
  };
  lastUpdated: string;
}

// Nifty PCR data
export interface NiftyPCRData {
  value: number;
  change: number;
  putVolume: number;
  callVolume: number;
  lastUpdated: string;
}

// Upcoming event
export interface UpcomingEvent {
  id: number;
  title: string;
  description?: string;
  eventDate: string;
  importance: 'high' | 'medium' | 'low';
  type: string;
  impact: 'positive' | 'negative' | 'neutral';
}

// Indian market index
export interface IndianMarketIndex {
  name: string;
  value: number;
  change: number;
}

// Key market events
export interface KeyEvent {
  title: string;
  timestamp: string;
  impact: "positive" | "negative" | "neutral";
  description?: string;
}

// Historical sentiment data point
export interface SentimentHistoryPoint {
  timestamp: string;
  score: number;
}

// Historical sentiment data
export interface HistoricalSentimentData {
  sentimentHistory: SentimentHistoryPoint[];
  keyEvents: KeyEvent[];
}

// News item
export interface NewsItemData {
  id: number;
  title: string;
  summary: string;
  timestamp: string;
  source: string;
  url: string;
  sentimentImpact: number;
  tags: string[];
}

// Market index data
export interface MarketIndex {
  name: string;
  value: number;
  change: number;
}

// Sector performance data
export interface SectorPerformance {
  name: string;
  change: number;
}

// Market metrics data
export interface MarketMetricsData {
  indices: MarketIndex[];
  indianIndices: IndianMarketIndex[];
  sectorPerformance: SectorPerformance[];
  niftyPCR?: NiftyPCRData;
}

// IV Score data point
export interface IVScoreDataPoint {
  timestamp: string;
  averageIVScore: number;
  closePrice: number;
}
