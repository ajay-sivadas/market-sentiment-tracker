-- Create market_news table
CREATE TABLE IF NOT EXISTS market_news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    source VARCHAR(100) NOT NULL,
    url TEXT NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE NOT NULL,
    sentiment_score FLOAT NOT NULL,
    summary TEXT NOT NULL,
    entities JSONB NOT NULL,
    impact_level VARCHAR(20) NOT NULL,
    category VARCHAR(50) NOT NULL,
    market_impact_score INTEGER NOT NULL,
    affected_sectors TEXT[] NOT NULL,
    time_horizon VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_market_news_published_at ON market_news(published_at);
CREATE INDEX idx_market_news_category ON market_news(category);
CREATE INDEX idx_market_news_impact_level ON market_news(impact_level);
CREATE INDEX idx_market_news_sentiment_score ON market_news(sentiment_score); 