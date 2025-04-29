import { subDays, subMonths, subYears, subHours } from "date-fns";

export type TimeFrameType = "1D" | "1W" | "1M" | "3M" | "1Y" | "All";

// Helper function to get start date based on timeframe
export function getTimeFrameDate(timeFrame: TimeFrameType): Date {
  const now = new Date();
  
  switch (timeFrame) {
    case "1D":
      return subDays(now, 1);
    case "1W":
      return subDays(now, 7);
    case "1M":
      return subMonths(now, 1);
    case "3M":
      return subMonths(now, 3);
    case "1Y":
      return subYears(now, 1);
    case "All":
      return new Date(0); // Beginning of time (Jan 1, 1970)
    default:
      return subMonths(now, 1); // Default to 1 month
  }
}

// Function to fetch latest market data from external API or generate simulated data
export async function fetchLatestMarketData() {
  try {
    // In a production environment, this would make API calls to financial data providers
    // like Alpha Vantage, IEX Cloud, or Yahoo Finance.
    // For this implementation, we'll generate simulated data

    // Generate random change based on previous value
    const generateChange = (baseValue: number, volatility = 0.05) => {
      const randomFactor = Math.random() * 2 - 1; // random between -1 and 1
      return parseFloat((randomFactor * volatility * baseValue).toFixed(2));
    };

    // Market indices data
    const indices = [
      {
        name: "S&P 500",
        value: 4325.76 + generateChange(4325.76),
        change: generateChange(1.2, 0.5)
      },
      {
        name: "NASDAQ",
        value: 13756.33 + generateChange(13756.33),
        change: generateChange(1.8, 0.6)
      },
      {
        name: "Dow Jones",
        value: 32845.13 + generateChange(32845.13),
        change: generateChange(0.9, 0.4)
      },
      {
        name: "VIX",
        value: 18.32 + generateChange(18.32, 0.1),
        change: generateChange(-5.4, 1.0)
      },
      {
        name: "10-YR Treasury",
        value: 3.45 + generateChange(3.45, 0.02),
        change: generateChange(0.0, 0.05)
      }
    ];
    
    // Indian market indices data
    const indianIndices = [
      {
        name: "NIFTY 50",
        value: 21845.50 + generateChange(21845.50),
        change: generateChange(0.9, 0.5)
      },
      {
        name: "SENSEX",
        value: 71532.25 + generateChange(71532.25),
        change: generateChange(0.8, 0.5)
      },
      {
        name: "NIFTY BANK",
        value: 46735.20 + generateChange(46735.20),
        change: generateChange(1.2, 0.6)
      },
      {
        name: "NIFTY IT",
        value: 32567.80 + generateChange(32567.80),
        change: generateChange(1.5, 0.7)
      },
      {
        name: "INDIA VIX",
        value: 14.85 + generateChange(14.85, 0.1),
        change: generateChange(-3.2, 1.0)
      }
    ];
    
    // Nifty PCR data
    const niftyPCR = {
      value: 1.25 + generateChange(1.25, 0.05),
      change: generateChange(0.15, 0.1),
      putVolume: 4528000 + Math.floor(generateChange(4528000, 0.1)),
      callVolume: 3622400 + Math.floor(generateChange(3622400, 0.1))
    };
    
    // Sector performance data
    const sectors = [
      {
        name: "Technology",
        change: generateChange(2.7, 0.3)
      },
      {
        name: "Healthcare",
        change: generateChange(1.5, 0.3)
      },
      {
        name: "Financials",
        change: generateChange(1.2, 0.3)
      },
      {
        name: "Industrials",
        change: generateChange(0.3, 0.3)
      },
      {
        name: "Energy",
        change: generateChange(-0.8, 0.4)
      },
      {
        name: "Utilities",
        change: generateChange(-1.2, 0.3)
      }
    ];
    
    // Market factors
    const economicStatus = (Math.random() > 0.7) ? "Weak" : (Math.random() > 0.3) ? "Strong" : "Moderate";
    const technicalStatus = (Math.random() > 0.7) ? "Bearish" : (Math.random() > 0.3) ? "Bullish" : "Neutral";
    const sentimentStatus = (Math.random() > 0.7) ? "Negative" : (Math.random() > 0.3) ? "Positive" : "Neutral";
    
    const factors = [
      {
        name: "Economic Indicators",
        score: parseFloat((2.1 + generateChange(2.1, 0.2)).toFixed(1)),
        elements: [
          {
            name: "Employment",
            status: (Math.random() > 0.3) ? "Strong" : "Moderate"
          },
          {
            name: "GDP Growth",
            status: (Math.random() > 0.3) ? "Positive" : "Neutral"
          },
          {
            name: "Inflation",
            status: "Moderate"
          },
          {
            name: "Consumer Confidence",
            status: economicStatus
          }
        ]
      },
      {
        name: "Technical Factors",
        score: parseFloat((1.8 + generateChange(1.8, 0.2)).toFixed(1)),
        elements: [
          {
            name: "Moving Averages",
            status: technicalStatus
          },
          {
            name: "Momentum",
            status: (Math.random() > 0.3) ? "Strong" : "Weak"
          },
          {
            name: "Volume",
            status: (Math.random() > 0.7) ? "High" : (Math.random() > 0.3) ? "Average" : "Low"
          },
          {
            name: "Breadth",
            status: (Math.random() > 0.3) ? "Positive" : "Negative"
          }
        ]
      },
      {
        name: "Market Sentiment",
        score: parseFloat((1.5 + generateChange(1.5, 0.2)).toFixed(1)),
        elements: [
          {
            name: "News Sentiment",
            status: sentimentStatus
          },
          {
            name: "Social Media",
            status: (Math.random() > 0.3) ? "Bullish" : "Bearish"
          },
          {
            name: "Analyst Ratings",
            status: (Math.random() > 0.7) ? "Bullish" : (Math.random() > 0.3) ? "Neutral" : "Bearish"
          },
          {
            name: "Options Flow",
            status: (Math.random() > 0.3) ? "Bullish" : "Bearish"
          }
        ]
      }
    ];
    
    return {
      indices,
      indianIndices,
      niftyPCR,
      sectors,
      factors
    };
    
  } catch (error) {
    console.error("Error fetching market data:", error);
    throw new Error("Failed to fetch market data");
  }
}
