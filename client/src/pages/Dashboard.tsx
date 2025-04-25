import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import TimeFrameSelector from "@/components/TimeFrameSelector";
import SentimentScorePanel from "@/components/SentimentScorePanel";
import SentimentChartPanel from "@/components/SentimentChartPanel";
import NewsPanel from "@/components/NewsPanel";
import MarketMetricsPanel from "@/components/MarketMetricsPanel";
import MarketFactorsPanel from "@/components/MarketFactorsPanel";
import UpcomingEventsPanel from "@/components/UpcomingEventsPanel";
import Footer from "@/components/Footer";
import { TimeFrame } from "@/types";

export default function Dashboard() {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("1M");

  // Fetch current sentiment data
  const { data: currentSentiment, isLoading: loadingSentiment } = useQuery({
    queryKey: ["/api/sentiment/current"],
  });

  // Fetch historical sentiment data based on selected timeframe
  const { data: historicalSentiment, isLoading: loadingHistorical } = useQuery({
    queryKey: ["/api/sentiment/historical", timeFrame],
  });

  // Fetch news data
  const { data: newsData, isLoading: loadingNews } = useQuery({
    queryKey: ["/api/news", timeFrame],
  });

  // Fetch market metrics
  const { data: marketMetrics, isLoading: loadingMetrics } = useQuery({
    queryKey: ["/api/market-metrics"],
  });

  // Fetch market factors
  const { data: marketFactors, isLoading: loadingFactors } = useQuery({
    queryKey: ["/api/market-factors"],
  });

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
          />
          
          <SentimentChartPanel 
            data={historicalSentiment} 
            isLoading={loadingHistorical} 
            timeFrame={timeFrame}
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
