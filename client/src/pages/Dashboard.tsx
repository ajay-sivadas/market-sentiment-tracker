import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useWebSocket } from "@/hooks/use-websocket";
import { useMarketMetrics } from "@/hooks/useMarketMetrics";
import Header from "@/components/Header";
import TimeFrameSelector from "@/components/TimeFrameSelector";
import SentimentScorePanel from "@/components/SentimentScorePanel";
import SentimentChartPanel from "@/components/SentimentChartPanel";
import NewsPanel from "@/components/NewsPanel";
import MarketMetricsPanel from "@/components/MarketMetricsPanel";
import MarketFactorsPanel from "@/components/MarketFactorsPanel";
import UpcomingEventsPanel from "@/components/UpcomingEventsPanel";
import Footer from "@/components/Footer";
import { 
  TimeFrame, 
  SentimentData, 
  HistoricalSentimentData, 
  NewsItemData, 
  MarketFactorsData,
  IVScoreDataPoint
} from "@/types";
import { parseIVScoreCSV } from "@/utils/csvParser";
import ivScoreData from "@/data/ivscore.csv?raw";

export default function Dashboard() {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("1M");
  const [parsedIVScoreData, setParsedIVScoreData] = useState<IVScoreDataPoint[]>([]);
  
  // Setup WebSocket connection for real-time data
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const wsUrl = `${protocol}//${window.location.host}/ws`;
  const { isConnected, latestMessage, liveData } = useWebSocket(wsUrl);
  
  // Debug WebSocket connection
  useEffect(() => {
    if (isConnected) {
      console.log("WebSocket connected successfully");
    }
    if (latestMessage) {
      console.log("Latest WebSocket message:", latestMessage);
    }
    if (liveData.length > 0) {
      console.log("Live data points:", liveData.length);
    }
  }, [isConnected, latestMessage, liveData]);

  // Fetch current sentiment data
  const { data: currentSentiment, isLoading: loadingSentiment } = useQuery<SentimentData>({
    queryKey: ["/api/sentiment/current"],
  });

  // Debug sentiment data fetching
  useEffect(() => {
    console.log('Dashboard - Loading Sentiment:', loadingSentiment);
    console.log('Dashboard - Current Sentiment:', currentSentiment);
  }, [loadingSentiment, currentSentiment]);

  // Fetch historical sentiment data based on selected timeframe
  const { data: historicalSentiment, isLoading: loadingHistorical } = useQuery<HistoricalSentimentData>({
    queryKey: ["/api/sentiment/historical", timeFrame],
  });

  // Fetch news data
  const { data: newsData, isLoading: loadingNews } = useQuery<NewsItemData[]>({
    queryKey: ["/api/news", timeFrame],
  });

  // Use our custom hook for market metrics
  const { data: marketMetrics, isLoading: loadingMetrics } = useMarketMetrics();

  // Fetch market factors
  const { data: marketFactors, isLoading: loadingFactors } = useQuery<MarketFactorsData>({
    queryKey: ["/api/market-factors"],
  });

  // Parse IV score data
  useEffect(() => {
    try {
      const parsedData = parseIVScoreCSV(ivScoreData);
      setParsedIVScoreData(parsedData);
    } catch (error) {
      console.error('Error parsing IV score data:', error);
    }
  }, []);

  const handleTimeFrameChange = (newTimeFrame: TimeFrame) => {
    setTimeFrame(newTimeFrame);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header lastUpdated={currentSentiment?.lastUpdated} />
      
      <main className="container mx-auto px-4 py-6">
        <TimeFrameSelector 
          selectedTimeFrame={timeFrame} 
          onTimeFrameChange={handleTimeFrameChange}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SentimentScorePanel 
            data={currentSentiment} 
            isLoading={loadingSentiment}
            marketMetrics={marketMetrics}
            loadingMetrics={loadingMetrics}
            ivScoreData={parsedIVScoreData}
          />
          
          <SentimentChartPanel 
            data={historicalSentiment} 
            isLoading={loadingHistorical} 
            timeFrame={timeFrame}
            liveData={liveData}
            isConnected={isConnected}
            ivScoreData={parsedIVScoreData}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <NewsPanel 
              data={newsData} 
              isLoading={loadingNews} 
            />
            
            <UpcomingEventsPanel />
          </div>
          
          <MarketMetricsPanel 
            data={marketMetrics} 
            isLoading={loadingMetrics} 
          />
        </div>
        
        <MarketFactorsPanel 
          data={marketFactors} 
          isLoading={loadingFactors} 
        />
      </main>
      
      <Footer />
    </div>
  );
}
