-- Create the sentiment_scores table
CREATE TABLE IF NOT EXISTS sentiment_scores (
    id SERIAL PRIMARY KEY,
    score DECIMAL(5,2) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    source VARCHAR(50) NOT NULL,
    market VARCHAR(50) NOT NULL,
    confidence DECIMAL(5,2),
    metadata JSONB
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_sentiment_scores_timestamp ON sentiment_scores(timestamp);
CREATE INDEX IF NOT EXISTS idx_sentiment_scores_market ON sentiment_scores(market);

-- Insert some test data
INSERT INTO sentiment_scores (score, source, market, confidence, metadata) VALUES
    (75.50, 'news', 'NIFTY', 0.85, '{"articles": 5, "sentiment": "positive"}'),
    (65.30, 'social', 'NIFTY', 0.75, '{"posts": 100, "sentiment": "neutral"}'),
    (82.10, 'technical', 'NIFTY', 0.90, '{"indicators": 3, "trend": "bullish"}'),
    (45.20, 'news', 'BANKNIFTY', 0.80, '{"articles": 3, "sentiment": "negative"}'),
    (58.70, 'social', 'BANKNIFTY', 0.70, '{"posts": 50, "sentiment": "mixed"}'),
    (71.30, 'technical', 'BANKNIFTY', 0.85, '{"indicators": 4, "trend": "neutral"}'); 