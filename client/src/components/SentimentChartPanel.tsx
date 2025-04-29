import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { Image, FileText, Download, BarChart2, TrendingUp, Wifi, WifiOff } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { HistoricalSentimentData, TimeFrame, KeyEvent, SentimentHistoryPoint, IVScoreDataPoint } from "@/types";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Legend,
  ComposedChart,
  Bar,
  ReferenceDot
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useWebSocket } from "@/hooks/use-websocket";
import { Slider } from "@/components/ui/slider";

interface SentimentChartPanelProps {
  data?: HistoricalSentimentData;
  isLoading: boolean;
  timeFrame: TimeFrame;
  liveData?: any[];
  isConnected?: boolean;
  ivScoreData?: IVScoreDataPoint[];
}

// Type for combined sentiment and IV score data points
interface CombinedDataPoint {
  timestamp: string;
  score: number;
  closePrice: number;
}

export default function SentimentChartPanel({ 
  data, 
  isLoading,
  timeFrame,
  liveData: externalLiveData,
  isConnected: wsConnected,
  ivScoreData
}: SentimentChartPanelProps) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [localLiveData, setLocalLiveData] = useState<CombinedDataPoint[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [showIVScore, setShowIVScore] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'historical' | 'live'>('historical');
  const [visibleRange, setVisibleRange] = useState<[number, number]>([0, 1]);
  const [displayedData, setDisplayedData] = useState<CombinedDataPoint[]>([]);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [maxRange, setMaxRange] = useState<number>(1);
  const [currentPosition, setCurrentPosition] = useState<number>(0);
  
  // Use the connection status from props or default to false
  const isConnected = wsConnected ?? false;

  // Update the data combination logic
  const combinedHistoricalData = ivScoreData?.map(point => {
    const score = typeof point.averageIVScore === 'number' ? point.averageIVScore * 100 : 0;
    return {
      timestamp: point.timestamp,
      score,
      closePrice: point.closePrice
    };
  }) || [];

  // Calculate maximum allowed range for 5 days
  useEffect(() => {
    if (!combinedHistoricalData || combinedHistoricalData.length === 0) return;
    
    // Group data by days
    const groupedByDay = combinedHistoricalData.reduce((acc, point) => {
      const date = new Date(point.timestamp).toDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(point);
      return acc;
    }, {} as Record<string, CombinedDataPoint[]>);
    
    const days = Object.keys(groupedByDay);
    const totalDays = days.length;
    
    // Calculate maximum range (5 days / total days)
    const newMaxRange = Math.min(5 / totalDays, 1);
    setMaxRange(newMaxRange);
  }, [combinedHistoricalData]);

  // Process data from WebSocket and IV score data
  useEffect(() => {
    if (!data || !data.sentimentHistory || data.sentimentHistory.length === 0) return;
    
    // Initialize with the last 20 points from historical data
    if (localLiveData.length === 0) {
      const initialData = combinedHistoricalData.slice(-20);
      setLocalLiveData(initialData);
    }
    
    // Update with WebSocket data when available
    if (externalLiveData && externalLiveData.length > 0) {
      setLocalLiveData(externalLiveData);
      setLastUpdate(new Date().toLocaleTimeString());
    }
  }, [data, externalLiveData, localLiveData.length, ivScoreData]);

  // Calculate visible data range and update displayed data
  useEffect(() => {
    if (!combinedHistoricalData || combinedHistoricalData.length === 0) return;
    
    const totalPoints = combinedHistoricalData.length;
    const startIndex = Math.floor(currentPosition * totalPoints);
    const endIndex = Math.ceil((currentPosition + maxRange) * totalPoints);
    
    const visibleData = combinedHistoricalData.slice(startIndex, endIndex);
    setDisplayedData(visibleData);
  }, [combinedHistoricalData, currentPosition, maxRange]);

  // Calculate Y-axis domain based on visible data
  const calculateYAxisDomain = (data: CombinedDataPoint[]) => {
    if (!data || data.length === 0) return { left: [0, 100], right: [0, 100] };
    
    const scores = data.map(d => d.score);
    const prices = data.map(d => d.closePrice);
    
    const scoreMin = Math.min(...scores);
    const scoreMax = Math.max(...scores);
    const priceMin = Math.min(...prices);
    const priceMax = Math.max(...prices);
    
    // Add 5% padding to the range
    const scorePadding = (scoreMax - scoreMin) * 0.05;
    const pricePadding = (priceMax - priceMin) * 0.05;
    
    return {
      left: [scoreMin - scorePadding, scoreMax + scorePadding],
      right: [priceMin - pricePadding, priceMax + pricePadding]
    };
  };

  const yAxisDomain = calculateYAxisDomain(displayedData);

  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    // Ensure the position doesn't go beyond the maximum allowed position
    const maxPosition = 1 - maxRange;
    const newPosition = Math.min(Math.max(0, value[0]), maxPosition);
    setCurrentPosition(newPosition);
  };

  // Format x-axis labels based on timeframe
  const formatXAxis = (timestamp: string) => {
    const date = new Date(timestamp);
    switch (timeFrame) {
      case "1D": return format(date, "HH:mm");
      case "1W": return format(date, "EEE");
      case "1M": return format(date, "MMM d");
      case "3M": return format(date, "MMM d");
      case "1Y": return format(date, "MMM");
      case "All": return format(date, "MMM yyyy");
      default: return format(date, "MMM d");
    }
  };

  // Update Y-axis formatter
  const formatYAxis = (value: number) => {
    return value.toFixed(1);
  };
  
  // Get event color based on impact type
  const getEventColor = (impact: string) => {
    if (impact === 'positive') return document.documentElement.classList.contains('dark') ? '#00FF95' : '#00C853';
    if (impact === 'negative') return document.documentElement.classList.contains('dark') ? '#FF4F4F' : '#D32F2F';
    return document.documentElement.classList.contains('dark') ? '#00C2FF' : '#1E88E5';
  };

  if (isLoading || !data) {
    return (
      <div className="bg-background rounded-lg shadow-sm p-6 md:col-span-2 border border-border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Sentiment Trend</h3>
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        </div>
        <Skeleton className="h-[240px] w-full rounded" />
        <div className="mt-4">
          <Skeleton className="h-4 w-32 mb-2" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-8 w-32 rounded-full" />
            <Skeleton className="h-8 w-32 rounded-full" />
            <Skeleton className="h-8 w-32 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  const { keyEvents } = data;
  
  return (
    <div className="bg-background rounded-lg shadow-sm p-4 md:col-span-2 border border-border">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">Sentiment Trend</h3>
        <div className="flex space-x-2">
          <button className="p-1 rounded text-sm text-muted-foreground hover:bg-background focus:outline-none">
            <Image className="h-4 w-4" />
          </button>
          <button className="p-1 rounded text-sm text-muted-foreground hover:bg-background focus:outline-none">
            <FileText className="h-4 w-4" />
          </button>
          <button className="p-1 rounded text-sm text-muted-foreground hover:bg-background focus:outline-none">
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Chart Tabs */}
      <Tabs defaultValue="historical" className="mb-2">
        <TabsList className="grid w-48 grid-cols-2">
          <TabsTrigger value="historical">Historical</TabsTrigger>
          <TabsTrigger value="live">Live</TabsTrigger>
        </TabsList>
        
        <TabsContent value="historical" className="chart-container mt-2 pb-8">
          <div ref={chartContainerRef} className="relative">
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart
                data={displayedData}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                onMouseMove={(e) => {
                  if (e.activeTooltipIndex !== undefined) {
                    setHoveredPoint(e.activeTooltipIndex);
                  }
                }}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={document.documentElement.classList.contains('dark') ? "#00C2FF" : "#1E88E5"} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={document.documentElement.classList.contains('dark') ? "#00C2FF" : "#1E88E5"} stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={document.documentElement.classList.contains('dark') ? "#3C3C4E" : "#D0D0D0"} 
                  vertical={false}
                />
                <XAxis 
                  dataKey="timestamp" 
                  tick={{ fontSize: 10, fill: '#757575' }}
                  tickFormatter={formatXAxis}
                  minTickGap={30}
                />
                <YAxis 
                  yAxisId="left"
                  domain={yAxisDomain.left} 
                  tick={{ fontSize: 10, fill: '#757575' }}
                  tickFormatter={formatYAxis}
                  orientation="left"
                  label={{ value: 'IV Score', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#757575', fontSize: 10 } }}
                />
                <YAxis 
                  yAxisId="right"
                  domain={yAxisDomain.right}
                  tick={{ fontSize: 10, fill: '#757575' }}
                  tickFormatter={(value) => value.toFixed(0)}
                  orientation="right"
                  label={{ value: 'Nifty 50', angle: 90, position: 'insideRight', style: { textAnchor: 'middle', fill: '#757575', fontSize: 10 } }}
                />
                <Tooltip
                  formatter={(value: number, name: string) => {
                    if (name === 'score') return [`${value.toFixed(1)}%`, 'IV Score'];
                    if (name === 'closePrice') return [`${value.toFixed(2)}`, 'Nifty 50'];
                    return [value, name];
                  }}
                  labelFormatter={(label) => format(new Date(label), 'MMM d, yyyy HH:mm')}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke={document.documentElement.classList.contains('dark') ? "#00C2FF" : "#1E88E5"} 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: document.documentElement.classList.contains('dark') ? "#00C2FF" : "#1E88E5", stroke: "white", strokeWidth: 1 }}
                  yAxisId="left"
                />
                <Line 
                  type="monotone" 
                  dataKey="closePrice" 
                  stroke={document.documentElement.classList.contains('dark') ? "#FF4F4F" : "#D32F2F"} 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: document.documentElement.classList.contains('dark') ? "#FF4F4F" : "#D32F2F", stroke: "white", strokeWidth: 1 }}
                  yAxisId="right"
                />
              </ComposedChart>
            </ResponsiveContainer>
            
            {/* Scrollbar */}
            <div className="mt-2 px-4">
              <Slider
                value={[currentPosition]}
                onValueChange={handleSliderChange}
                min={0}
                max={1}
                step={0.01}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>
                  {combinedHistoricalData[0]?.timestamp ? 
                    format(new Date(combinedHistoricalData[0].timestamp), 'MMM d, yyyy') : 
                    'Loading...'}
                </span>
                <span>
                  {combinedHistoricalData[combinedHistoricalData.length - 1]?.timestamp ? 
                    format(new Date(combinedHistoricalData[combinedHistoricalData.length - 1].timestamp), 'MMM d, yyyy') : 
                    'Loading...'}
                </span>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="live" className="relative mt-2">
          <div className="absolute top-0 right-0 z-10 text-xs text-muted-foreground p-1 flex items-center gap-2">
            <div className="flex items-center gap-1">
              <button 
                className={`px-1.5 py-0.5 rounded-md text-xs flex items-center gap-1 ${showIVScore ? 'bg-primary-foreground' : 'bg-transparent'}`}
                onClick={() => setShowIVScore(!showIVScore)}
              >
                <TrendingUp className="h-3 w-3" />
                <span>IV Score</span>
              </button>
            </div>
            <div className="flex items-center">
              {isConnected ? (
                <Wifi className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <WifiOff className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
            {lastUpdate && (
              <div className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                <span>Last update: {lastUpdate}</span>
              </div>
            )}
          </div>
          
          <div className="flex gap-2 mt-1 mb-2">
            <Badge variant="outline" className="bg-primary/10 hover:bg-primary/20">
              <span className="w-2 h-2 rounded-full bg-primary mr-1"></span>
              IV Score
            </Badge>
            <Badge variant="outline" className="bg-red-500/10 hover:bg-red-500/20">
              <span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span>
              Nifty 50
            </Badge>
          </div>
          
          <ResponsiveContainer width="100%" height={250}>
            <ComposedChart
              data={localLiveData}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={document.documentElement.classList.contains('dark') ? "#3C3C4E" : "#D0D0D0"} 
                vertical={false}
              />
              <XAxis 
                dataKey="timestamp" 
                tick={{ fontSize: 10, fill: document.documentElement.classList.contains('dark') ? '#A0A0A0' : '#757575' }}
                tickFormatter={(timestamp) => format(new Date(timestamp), 'HH:mm:ss')}
                minTickGap={30}
              />
              <YAxis 
                yAxisId="left"
                domain={yAxisDomain.left} 
                tick={{ fontSize: 10, fill: '#757575' }}
                tickFormatter={formatYAxis}
                orientation="left"
                label={{ value: 'IV Score', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#757575', fontSize: 10 } }}
              />
              <YAxis 
                yAxisId="right"
                domain={yAxisDomain.right}
                tick={{ fontSize: 10, fill: '#757575' }}
                tickFormatter={(value) => value.toFixed(0)}
                orientation="right"
                label={{ value: 'Nifty 50', angle: 90, position: 'insideRight', style: { textAnchor: 'middle', fill: '#757575', fontSize: 10 } }}
              />
              <Tooltip
                formatter={(value: number, name: string) => {
                  if (name === 'score') return [`${value.toFixed(1)}`, 'IV Score'];
                  if (name === 'closePrice') return [`${value.toFixed(2)}`, 'Nifty 50'];
                  return [value, name];
                }}
                labelFormatter={(label) => format(new Date(label), 'HH:mm:ss')}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke={document.documentElement.classList.contains('dark') ? "#00C2FF" : "#1E88E5"} 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: document.documentElement.classList.contains('dark') ? "#00C2FF" : "#1E88E5", stroke: "white", strokeWidth: 1 }}
                yAxisId="left"
              />
              <Line 
                type="monotone" 
                dataKey="closePrice" 
                stroke={document.documentElement.classList.contains('dark') ? "#FF4F4F" : "#D32F2F"} 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: document.documentElement.classList.contains('dark') ? "#FF4F4F" : "#D32F2F", stroke: "white", strokeWidth: 1 }}
                yAxisId="right"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </TabsContent>
      </Tabs>
      
      {/* Key Events Section with improved styling */}
      <div className="mt-8 border-t border-border pt-6 mt-200" style={{marginTop: '210px'}}>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium">Key Market Events</h4>
          <Badge variant="outline" className="text-xs">
            {keyEvents.length} events
          </Badge>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {keyEvents.map((event, index) => (
            <div 
              key={index}
              className="flex items-center p-3 rounded-md bg-muted/50 hover:bg-muted transition-colors"
            >
              <div 
                className="w-3 h-3 rounded-full mr-3 flex-shrink-0"
                style={{ backgroundColor: getEventColor(event.impact) }}
              ></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{event.title}</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(event.timestamp), 'MMM d, HH:mm')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
