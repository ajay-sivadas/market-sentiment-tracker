import { Skeleton } from "@/components/ui/skeleton";
import { MarketMetricsData, SectorPerformance } from "@/types";

interface MarketMetricsPanelProps {
  data?: MarketMetricsData;
  isLoading: boolean;
}

export default function MarketMetricsPanel({ data, isLoading }: MarketMetricsPanelProps) {
  if (isLoading || !data) {
    return (
      <div className="bg-white rounded-lg shadow-sm md:col-span-1">
        <div className="p-4 border-b border-background">
          <h3 className="text-lg font-medium">Market Metrics</h3>
        </div>
        <div className="p-4">
          {Array(5).fill(0).map((_, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-background">
          <Skeleton className="h-5 w-32 mb-3" />
          <div className="space-y-2">
            {Array(6).fill(0).map((_, index) => (
              <div key={index} className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const { indices, sectorPerformance } = data;
  
  // Helper function to get color based on percentage change
  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-[#00C853]';
    if (change < 0) return 'text-destructive';
    return 'text-muted-foreground';
  };
  
  // Helper function to get width percentage for progress bars (scaled to look better visually)
  const getBarWidth = (change: number) => {
    // Scale to make bars more visible
    const absChange = Math.abs(change);
    return Math.min(Math.max(absChange * 10, 20), 90); // Between 20% and 90%
  };
  
  // Helper function to get bar color
  const getBarColor = (change: number) => {
    if (change > 0) return 'bg-[#00C853]';
    if (change < 0) return 'bg-destructive';
    return 'bg-primary';
  };
  
  // Helper function to get dot color for sector performance
  const getSectorDotColor = (sector: SectorPerformance) => {
    if (sector.change > 0.5) return 'bg-[#00C853]';
    if (sector.change < -0.5) return 'bg-destructive';
    return 'bg-primary';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm md:col-span-1">
      <div className="p-4 border-b border-background">
        <h3 className="text-lg font-medium">Market Metrics</h3>
      </div>
      
      <div className="p-4">
        {/* Market Indices */}
        {indices.map((index, i) => (
          <div key={i} className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium">{index.name}</span>
              <div className={`flex items-center ${getChangeColor(index.change)}`}>
                <span className="font-mono">{index.value.toLocaleString()}</span>
                <span className="ml-2 text-xs">{index.change > 0 ? '+' : ''}{index.change}%</span>
              </div>
            </div>
            <div className="h-2 bg-background rounded-full">
              <div 
                className={`h-full ${getBarColor(index.change)} rounded-full`} 
                style={{ width: `${getBarWidth(index.change)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-background">
        <h4 className="text-sm font-medium mb-3">Sector Performance</h4>
        
        <div className="space-y-2">
          {sectorPerformance.map((sector, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full ${getSectorDotColor(sector)}`}></div>
                <span className="text-sm ml-2">{sector.name}</span>
              </div>
              <span className={`text-xs ${getChangeColor(sector.change)}`}>
                {sector.change > 0 ? '+' : ''}{sector.change}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
