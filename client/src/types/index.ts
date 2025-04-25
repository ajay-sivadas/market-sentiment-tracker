// Time frame options
export type TimeFrame = "1D" | "1W" | "1M" | "3M" | "1Y" | "All";

// Current sentiment data
export interface SentimentData {
  score: number;
  change: number;
  marketStatus: string;
  trendDirection: string;
  volatility: string;
  confidence: {
    label: string;
    value: number;
  };
  lastUpdated: string;
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
  sectorPerformance: SectorPerformance[];
}

// Factor element data
export interface FactorElement {
  name: string;
  status: string;
}

// Market factor data
export interface MarketFactor {
  name: string;
  score: number;
  elements: FactorElement[];
}

// Market factors data
export interface MarketFactorsData {
  factors: MarketFactor[];
}
