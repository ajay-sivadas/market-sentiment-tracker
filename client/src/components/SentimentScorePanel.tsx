import { ArrowUp, ArrowDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { SentimentData } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SentimentScorePanelProps {
  data?: SentimentData;
  isLoading: boolean;
  marketMetrics?: any; // Will include Nifty PCR and other market metrics
  loadingMetrics?: boolean;
}

export default function SentimentScorePanel({ data, isLoading, marketMetrics, loadingMetrics }: SentimentScorePanelProps) {
  if (isLoading || !data) {
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

  const { score, change, marketStatus, trendDirection, volatility, confidence } = data;
  const isPositive = change > 0;
  const scorePercentage = score;
  
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

  return (
    <div className="bg-card rounded-lg shadow-sm p-6 md:col-span-1">
      <h3 className="text-lg font-medium mb-4">Current Sentiment</h3>
      
      {/* Sentiment Score */}
      <div className="sentiment-score mb-6 flex flex-col items-center">
        <span className="text-4xl font-mono font-bold text-primary">{score.toFixed(1)}</span>
        <div className="flex items-center mt-2">
          {isPositive ? (
            <ArrowUp className="h-5 w-5 dark:text-[#00FF95] text-[#00C853]" />
          ) : (
            <ArrowDown className="h-5 w-5 dark:text-[#FF4F4F] text-destructive" />
          )}
          <span className={`ml-1 font-mono ${isPositive ? 'dark:text-[#00FF95] text-[#00C853]' : 'dark:text-[#FF4F4F] text-destructive'}`}>
            {isPositive ? '+' : ''}{change.toFixed(1)}
          </span>
          <span className="ml-1 text-sm text-muted-foreground">today</span>
        </div>
      </div>
      
      {/* Sentiment Gauge */}
      <div className="mb-6">
        <div className="relative h-4 bg-background rounded-full overflow-hidden mb-2">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-destructive via-yellow-400 to-[#00C853] dark:from-[#FF4F4F] dark:via-[#FFD600] dark:to-[#00FF95]" 
            style={{ width: `${scorePercentage}%` }}
          ></div>
          <div 
            className="absolute top-0 left-0 h-full w-px bg-foreground" 
            style={{ left: `${scorePercentage}%` }}
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
          <span className={`font-medium px-2 py-1 rounded ${getStatusBgColor(marketStatus)} ${getStatusColor(marketStatus)} text-sm`}>
            {marketStatus}
          </span>
        </div>
        <div className="flex justify-between items-center pb-2 border-b border-background">
          <span className="text-sm">Trend Direction</span>
          <span className={`font-medium ${getStatusColor(trendDirection)}`}>
            {trendDirection}
          </span>
        </div>
        <div className="flex justify-between items-center pb-2 border-b border-background">
          <span className="text-sm">Volatility</span>
          <span className="font-medium">{volatility}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm">Confidence</span>
          <span className="font-medium">{confidence.label} ({confidence.value}%)</span>
        </div>
      </div>
      
      {/* Market Indicators Tabs */}
      {marketMetrics && (
        <div className="mt-6 pt-4 border-t border-background">
          <h4 className="text-sm font-medium mb-3">Market Indicators</h4>
          <Tabs defaultValue="nifty-pcr" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-3">
              <TabsTrigger value="nifty-pcr">Nifty PCR</TabsTrigger>
              <TabsTrigger value="india-vix">India VIX</TabsTrigger>
            </TabsList>
            
            <TabsContent value="nifty-pcr" className="space-y-2">
              {marketMetrics.niftyPCR && (
                <>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Put-Call Ratio</span>
                    <div className={`flex items-center ${getChangeColor(marketMetrics.niftyPCR.change)}`}>
                      <span className="font-mono font-medium">{marketMetrics.niftyPCR.value.toFixed(2)}</span>
                      <span className="ml-2 text-xs">
                        {marketMetrics.niftyPCR.change > 0 ? '+' : ''}{marketMetrics.niftyPCR.change}
                      </span>
                    </div>
                  </div>
                  
                  {/* Removed explanatory text as requested */}
                  
                  <div className="flex justify-between text-xs mt-3">
                    <div>
                      <span className="block text-muted-foreground">Puts Volume</span>
                      <span className="font-mono">{marketMetrics.niftyPCR.putVolume.toLocaleString()}</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-muted-foreground">Calls Volume</span>
                      <span className="font-mono">{marketMetrics.niftyPCR.callVolume.toLocaleString()}</span>
                    </div>
                  </div>
                </>
              )}
            </TabsContent>
            
            <TabsContent value="india-vix" className="space-y-3">
              {marketMetrics.indianIndices && (
                <>
                  {marketMetrics.indianIndices.map((index: any) => {
                    if (index.name.toLowerCase().includes('vix')) {
                      return (
                        <div key={index.name} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">{index.name}</span>
                            <div className={`flex items-center ${getChangeColor(index.change)}`}>
                              <span className="font-mono">{index.value.toLocaleString()}</span>
                              <span className="ml-2 text-xs">{index.change > 0 ? '+' : ''}{index.change}%</span>
                            </div>
                          </div>
                          
                          {/* Removed explanatory text as requested */}
                        </div>
                      );
                    }
                    return null;
                  })}
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
