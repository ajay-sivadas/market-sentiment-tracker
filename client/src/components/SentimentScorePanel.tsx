import { ArrowUp, ArrowDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { SentimentData, IVScoreDataPoint } from "@/types";
import { useEffect } from "react";

interface SentimentScorePanelProps {
  data?: SentimentData;
  isLoading: boolean;
  marketMetrics?: any;
  loadingMetrics?: boolean;
  ivScoreData?: IVScoreDataPoint[];
}

export default function SentimentScorePanel({ 
  data, 
  isLoading, 
  marketMetrics, 
  loadingMetrics,
  ivScoreData 
}: SentimentScorePanelProps) {
  // Calculate sentiment score based on IV scores
  const calculateSentimentScore = () => {
    if (!ivScoreData || ivScoreData.length === 0) {
      return 50; // Default neutral score
    }

    const lastMinuteScore = ivScoreData[ivScoreData.length - 1].averageIVScore;
    const scoresLessThanLastMinute = ivScoreData.filter(
      point => point.averageIVScore < lastMinuteScore
    ).length;
    
    const totalScores = ivScoreData.length;
    const score = (scoresLessThanLastMinute / totalScores) * 100;
    
    return score;
  };

  const sentimentScore = calculateSentimentScore();
  const isPositive = sentimentScore > 50;
  const change = sentimentScore - 50; // Change from neutral (50)
  const currentIVScore = ivScoreData?.[ivScoreData.length - 1]?.averageIVScore || 0;

  if (isLoading) {
    return (
      <div className="bg-card rounded-lg shadow-sm p-6 md:col-span-1">
        <h3 className="text-lg font-medium mb-4">Current Sentiment</h3>
        <div className="sentiment-score mb-6 flex flex-col items-center">
          <Skeleton className="h-10 w-24 mb-2" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="mb-6">
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="space-y-4">
          {Array(4).fill(0).map((_, index) => (
            <div key={index} className="flex justify-between items-center pb-2 border-b border-background">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default values for missing data
  const defaultData = {
    marketStatus: 'Neutral',
    trendDirection: 'Neutral',
    volatility: 'Medium',
    confidence: {
      label: 'Medium',
      value: 50
    }
  };

  const displayData = data || defaultData;

  // Helper function to get color based on percentage change
  const getChangeColor = (change: number) => {
    if (change > 0) return 'dark:text-[#00FF95] text-[#00C853]';
    if (change < 0) return 'dark:text-[#FF4F4F] text-destructive';
    return 'text-muted-foreground';
  };
  
  // Determine status colors
  const getStatusColor = (status: string) => {
    if (status.toLowerCase().includes('bull') || status.toLowerCase() === 'upward') return 'text-[#00C853]';
    if (status.toLowerCase().includes('bear') || status.toLowerCase() === 'downward') return 'text-destructive';
    return '';
  };
  
  // Determine status background colors
  const getStatusBgColor = (status: string) => {
    if (status.toLowerCase().includes('bull')) return 'bg-[#00C853] bg-opacity-10';
    if (status.toLowerCase().includes('bear')) return 'bg-destructive bg-opacity-10';
    return 'bg-primary bg-opacity-10';
  };

  // Add dummy market metrics if none provided
  const dummyMarketMetrics = {
    niftyPCR: {
      value: 1.25,
      change: 0.15,
      putVolume: 1250000,
      callVolume: 1000000,
      lastUpdated: new Date().toISOString()
    },
    indianIndices: [
      {
        name: "India VIX",
        value: 15.75,
        change: -1.25
      }
    ]
  };

  // Ensure marketMetrics is properly initialized
  const displayMarketMetrics = marketMetrics || dummyMarketMetrics;

  // Ensure all required properties exist
  const niftyPCR = displayMarketMetrics.niftyPCR || dummyMarketMetrics.niftyPCR;
  const indianIndices = displayMarketMetrics.indianIndices || dummyMarketMetrics.indianIndices;

  return (
    <div className="bg-card rounded-lg shadow-sm p-6 md:col-span-1">
      <h3 className="text-lg font-medium mb-4">Current Sentiment</h3>
      
      {/* Current IV Score */}
      <div className="mb-6 flex flex-col items-center bg-muted/50 p-4 rounded-lg">
        <span className="text-sm text-muted-foreground mb-1">Current IV Score</span>
        <span className="text-3xl font-mono font-bold text-primary">{currentIVScore.toFixed(4)}</span>
      </div>
      
      {/* Sentiment Score */}
      <div className="sentiment-score mb-6 flex flex-col items-center">
        <span className="text-sm text-muted-foreground mb-1">Sentiment Score</span>
        <span className="text-4xl font-mono font-bold text-primary">{sentimentScore.toFixed(1)}</span>
        <div className="flex items-center mt-2">
          {isPositive ? (
            <ArrowUp className="h-5 w-5 dark:text-[#00FF95] text-[#00C853]" />
          ) : (
            <ArrowDown className="h-5 w-5 dark:text-[#FF4F4F] text-destructive" />
          )}
          <span className={`ml-1 font-mono ${getChangeColor(change)}`}>
            {isPositive ? '+' : ''}{change.toFixed(1)}
          </span>
          <span className="ml-1 text-sm text-muted-foreground">from neutral</span>
        </div>
      </div>
      
      {/* Sentiment Gauge */}
      <div className="mb-6">
        <div className="relative h-4 bg-background rounded-full overflow-hidden mb-2">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-destructive via-yellow-400 to-[#00C853] dark:from-[#FF4F4F] dark:via-[#FFD600] dark:to-[#00FF95]" 
            style={{ width: `${sentimentScore}%` }}
          ></div>
          <div 
            className="absolute top-0 left-0 h-full w-px bg-foreground" 
            style={{ left: `${sentimentScore}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Low IV</span>
          <span>Neutral</span>
          <span>High IV</span>
        </div>
      </div>
      
      {/* Market Status */}
      <div className="space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-background">
          <span className="text-sm">IV Score</span>
          <span className={`font-medium px-2 py-1 rounded ${getStatusBgColor(displayData.marketStatus)} ${getStatusColor(displayData.marketStatus)} text-sm`}>
            {displayData.marketStatus}
          </span>
        </div>
        <div className="flex justify-between items-center pb-2 border-b border-background">
          <span className="text-sm">Trend Direction</span>
          <span className={`font-medium ${getStatusColor(displayData.trendDirection)}`}>
            {displayData.trendDirection}
          </span>
        </div>
        <div className="flex justify-between items-center pb-2 border-b border-background">
          <span className="text-sm">Volatility</span>
          <span className="font-medium">{displayData.volatility}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm">Confidence</span>
          <span className="font-medium">{displayData.confidence.label} ({displayData.confidence.value}%)</span>
        </div>
      </div>
      
      {/* Market Indicators */}
      <div className="mt-6 pt-4 border-t border-background">
        <h4 className="text-sm font-medium mb-3">Market Indicators</h4>
        
        {/* Nifty PCR Section */}
        <div className="mb-6">
          <h5 className="text-sm font-medium mb-2">Nifty PCR</h5>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm">Put-Call Ratio</span>
            <div className={`flex items-center ${getChangeColor(niftyPCR.change)}`}>
              <span className="font-mono font-medium">{niftyPCR.value.toFixed(2)}</span>
              <span className="ml-2 text-xs">
                {niftyPCR.change > 0 ? '+' : ''}{niftyPCR.change}
              </span>
            </div>
          </div>
          
          <div className="flex justify-between text-xs mt-4">
            <div>
              <span className="block text-muted-foreground">Puts Volume</span>
              <span className="font-mono">{niftyPCR.putVolume.toLocaleString()}</span>
            </div>
            <div className="text-right">
              <span className="block text-muted-foreground">Calls Volume</span>
              <span className="font-mono">{niftyPCR.callVolume.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* India VIX Section */}
        <div>
          <h5 className="text-sm font-medium mb-2">India VIX</h5>
          {indianIndices.map((index: any) => {
            if (index.name.toLowerCase().includes('vix')) {
              return (
                <div key={index.name} className="space-y-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">{index.name}</span>
                    <div className={`flex items-center ${getChangeColor(index.change)}`}>
                      <span className="font-mono">{index.value.toLocaleString()}</span>
                      <span className="ml-2 text-xs">{index.change > 0 ? '+' : ''}{index.change}%</span>
                    </div>
                  </div>
                  
                  {/* Bar visualization for VIX - general range indicator */}
                  <div className="h-3 bg-muted rounded-full overflow-hidden mb-2">
                    <div 
                      className={`h-full ${index.value > 20 ? 'bg-destructive/70' : index.value < 15 ? 'bg-primary/70' : 'bg-amber-500/70'}`}
                      style={{ width: `${Math.min(Math.max(index.value * 2.5, 10), 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Lower Volatility</span>
                    <span>Higher Volatility</span>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
}