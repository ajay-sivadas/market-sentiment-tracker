import { Skeleton } from "@/components/ui/skeleton";
import { MarketMetricsData} from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MarketMetricsPanelProps {
  data?: MarketMetricsData;
  isLoading: boolean;
}

export default function MarketMetricsPanel({ data, isLoading }: MarketMetricsPanelProps) {
  if (isLoading || !data) {
    return (
      <div className="bg-card rounded-lg shadow-sm md:col-span-1" style={{height: 410}}>
        <div className="p-4 border-b ">
          <h3 className="text-lg font-medium">Market Metrics</h3>
          <Skeleton className="h-8 w-48 mt-2" />
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
      </div>
    );
  }

  const { indices, indianIndices } = data;
  
  // Helper function to get color based on percentage change
  const getChangeColor = (change: number) => {
    if (change > 0) return 'dark:text-[#00FF95] text-[#00C853]';
    if (change < 0) return 'dark:text-[#FF4F4F] text-destructive';
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
    if (change > 0) return 'dark:bg-[#00FF95] bg-[#00C853]';
    if (change < 0) return 'dark:bg-[#FF4F4F] bg-destructive';
    return 'bg-primary';
  };

  return (
    <div className="bg-card rounded-lg shadow-sm md:col-span-1" style={{height: '410px !important'}}>
      <div className="p-4 border-b border-background" >
        <h3 className="text-lg font-medium">Market Metrics</h3>
        <Tabs defaultValue="indian" className="mt-2">
          <TabsList className="grid w-48 grid-cols-2">
            <TabsTrigger value="indian">Indian</TabsTrigger>
            <TabsTrigger value="global">Global</TabsTrigger>
          </TabsList>
          
          <TabsContent value="indian" className="pt-4">
            {/* Indian Market Indices */}
            {indianIndices.map((index, i) => (
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
          </TabsContent>
          
          <TabsContent value="global" className="pt-4">
            {/* Global Market Indices */}
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
