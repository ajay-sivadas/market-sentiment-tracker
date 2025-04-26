-- Insert news items into news_items table
INSERT INTO news_items (
    title,
    summary,
    source,
    url,
    sentiment_impact,
    timestamp,
    tags
) VALUES
(
    'RBI Keeps Repo Rate Unchanged at 6.5% for Seventh Consecutive Time',
    'The Reserve Bank of India maintains status quo on key rates, citing persistent inflation concerns while maintaining growth forecast at 7% for FY25.',
    'Economic Times',
    'https://economictimes.indiatimes.com/rbi-repo-rate-decision',
    -0.3,
    '2024-04-05T11:30:00Z',
    '["rbi", "monetary policy", "interest rates", "india"]'::json
),
(
    'US Fed Signals Just One Rate Cut in 2024 Amid Sticky Inflation',
    'Federal Reserve projects only one interest rate cut this year as inflation remains above target, causing global market volatility.',
    'Bloomberg',
    'https://www.bloomberg.com/fed-rate-cut-2024',
    -1.2,
    '2024-04-10T18:45:00Z',
    '["federal reserve", "interest rates", "global markets", "inflation"]'::json
),
(
    'India''s GDP Growth Surprises at 8.4% in Q3 FY24',
    'India''s economy grows faster than expected in December quarter, boosting government''s economic management credentials.',
    'MoneyControl',
    'https://www.moneycontrol.com/india-gdp-q3-fy24',
    1.5,
    '2024-04-12T05:15:00Z',
    '["gdp", "economy", "india", "growth"]'::json
),
(
    'Nvidia Shares Surge 10% After Stellar AI Chip Demand Forecast',
    'Chipmaker Nvidia sees record revenue projections driven by AI boom, lifting global tech stocks.',
    'CNBC',
    'https://www.cnbc.com/nvidia-ai-chip-demand',
    2.0,
    '2024-04-15T20:30:00Z',
    '["nvidia", "artificial intelligence", "technology", "global markets"]'::json
),
(
    'SEBI Proposes Stricter Rules for Algorithmic Trading in India',
    'Market regulator seeks to implement new safeguards for algo trading after recent market volatility incidents.',
    'Business Standard',
    'https://www.business-standard.com/sebi-algo-trading-rules',
    -0.8,
    '2024-04-08T14:20:00Z',
    '["sebi", "algorithmic trading", "regulation", "india"]'::json
),
(
    'Oil Prices Hit 5-Month High Amid Middle East Tensions',
    'Brent crude crosses $90/barrel as geopolitical risks escalate, raising inflation concerns globally.',
    'Reuters',
    'https://www.reuters.com/oil-price-surge',
    -1.5,
    '2024-04-11T09:10:00Z',
    '["crude oil", "commodities", "inflation", "global markets"]'::json
),
(
    'Tata Motors Announces $2 Billion EV Battery Plant in Gujarat',
    'Automaker makes largest EV commitment in India to date, shares rise 5% on announcement.',
    'Livemint',
    'https://www.livemint.com/tata-motors-ev-plant',
    1.2,
    '2024-04-09T11:45:00Z',
    '["tata motors", "electric vehicles", "automobile", "india"]'::json
),
(
    'Japan''s Yen Hits 34-Year Low Against Dollar, Prompting Intervention Warnings',
    'Japanese currency continues slide despite BOJ''s rate hike, creating ripple effects in Asian markets.',
    'Financial Times',
    'https://www.ft.com/yen-34-year-low',
    -0.7,
    '2024-04-16T07:25:00Z',
    '["forex", "yen", "japan", "global markets"]'::json
),
(
    'Reliance Jio Announces 20% Hike in Tariffs Starting June',
    'India''s largest telecom operator raises prices across all plans, likely triggering industry-wide increases.',
    'ET Telecom',
    'https://telecom.economictimes.indiatimes.com/jio-tariff-hike',
    0.5,
    '2024-04-14T13:15:00Z',
    '["reliance jio", "telecom", "tariffs", "india"]'::json
),
(
    'Gold Prices Scale Record High Amid Safe-Haven Demand',
    'Global gold prices touch $2,400/oz as investors seek safety from geopolitical and inflation risks.',
    'CNBC TV18',
    'https://www.cnbctv18.com/gold-price-record-high',
    0.3,
    '2024-04-17T10:05:00Z',
    '["gold", "commodities", "safe haven", "global markets"]'::json
); 