import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { Image, FileText, Download, BarChart2, TrendingUp, Wifi, WifiOff } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { HistoricalSentimentData, TimeFrame, KeyEvent, SentimentHistoryPoint } from "@/types";
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
  ReferenceDot,
  Legend,
  ComposedChart,
  Bar
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useWebSocket } from "@/hooks/use-websocket";

interface SentimentChartPanelProps {
  data?: HistoricalSentimentData;
  isLoading: boolean;
  timeFrame: TimeFrame;
  liveData?: any[]; // For WebSocket real-time data
  isConnected?: boolean; // WebSocket connection status
}

// Type for combined sentiment and Nifty data points
interface CombinedDataPoint {
  timestamp: string;
  score: number;
  niftyValue?: number;
}

export default function SentimentChartPanel({ 
  data, 
  isLoading,
  timeFrame,
  liveData: externalLiveData,
  isConnected: wsConnected
}: SentimentChartPanelProps) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [localLiveData, setLocalLiveData] = useState<CombinedDataPoint[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [showNiftyData, setShowNiftyData] = useState<boolean>(true);
  
  // Use the connection status from props or default to false
  const isConnected = wsConnected ?? false;

  // Process data from WebSocket
  useEffect(() => {
    if (!data || !data.sentimentHistory || data.sentimentHistory.length === 0) return;
    
    // Initialize with the last 20 points from historical data
    // This will show initially before WebSocket data comes in
    if (localLiveData.length === 0) {
      const initialData = [...data.sentimentHistory].slice(-20).map(point => ({
        ...point,
        niftyValue: 22000 + (Math.random() - 0.5) * 200 // Initial value until WebSocket data arrives
      }));
      
      setLocalLiveData(initialData);
    }
    
    // Update with WebSocket data when available
    if (externalLiveData && externalLiveData.length > 0) {
      setLocalLiveData(externalLiveData);
      setLastUpdate(new Date().toLocaleTimeString());
    }
  }, [data, externalLiveData, localLiveData.length]);

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

  const { sentimentHistory, keyEvents } = data;
  
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
  
  // Set Y-axis domain with some padding
  const minScore = Math.min(...sentimentHistory.map(item => item.score)) - 5;
  const maxScore = Math.max(...sentimentHistory.map(item => item.score)) + 5;
  const yDomain = [Math.max(0, minScore), Math.min(100, maxScore)];
  
  // Get event color based on impact type
  const getEventColor = (impact: string) => {
    if (impact === 'positive') return document.documentElement.classList.contains('dark') ? '#00FF95' : '#00C853';
    if (impact === 'negative') return document.documentElement.classList.contains('dark') ? '#FF4F4F' : '#D32F2F';
    return document.documentElement.classList.contains('dark') ? '#00C2FF' : '#1E88E5';
  };

  return (
    <div className="bg-background rounded-lg shadow-sm p-6 md:col-span-2 border border-border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Sentiment Trend</h3>
        <div className="flex space-x-2">
          <button className="p-1 rounded text-sm text-muted-foreground hover:bg-background focus:outline-none">
            <Image className="h-5 w-5" />
          </button>
          <button className="p-1 rounded text-sm text-muted-foreground hover:bg-background focus:outline-none">
            <FileText className="h-5 w-5" />
          </button>
          <button className="p-1 rounded text-sm text-muted-foreground hover:bg-background focus:outline-none">
            <Download className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Chart Tabs */}
      <Tabs defaultValue="historical" className="mb-4">
        <TabsList className="grid w-48 grid-cols-2">
          <TabsTrigger value="historical">Historical</TabsTrigger>
          <TabsTrigger value="live">Live</TabsTrigger>
        </TabsList>
        
        <TabsContent value="historical" className="chart-container mt-2">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={sentimentHistory}
              margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
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
                tick={{ fontSize: 12, fill: '#757575' }}
                tickFormatter={formatXAxis}
                minTickGap={30}
              />
              <YAxis 
                domain={yDomain} 
                tick={{ fontSize: 12, fill: '#757575' }}
              />
              <Tooltip
                formatter={(value: number) => [`${value.toFixed(1)}`, 'IV Score']}
                labelFormatter={(label) => format(new Date(label), 'MMM d, yyyy HH:mm')}
                contentStyle={{
                  backgroundColor: document.documentElement.classList.contains('dark') ? '#1E1E2F' : '#fff',
                  border: document.documentElement.classList.contains('dark') ? '1px solid #3C3C4E' : '1px solid #E0E0E0',
                  borderRadius: '4px',
                  padding: '8px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                }}
                itemStyle={{ fontSize: '13px' }}
                labelStyle={{ fontWeight: 'bold', marginBottom: '5px', fontSize: '12px' }}
              />
              <Area 
                type="monotone" 
                dataKey="score" 
                stroke={document.documentElement.classList.contains('dark') ? "#00C2FF" : "#1E88E5"} 
                fillOpacity={1} 
                fill="url(#colorScore)"
                strokeWidth={3}
                activeDot={{ r: 6, fill: document.documentElement.classList.contains('dark') ? "#00C2FF" : "#1E88E5", stroke: "white", strokeWidth: 2 }}
                connectNulls={true}
                animationDuration={300}
              />
              
              {/* Event markers */}
              {keyEvents.map((event, index) => (
                <ReferenceDot
                  key={index}
                  x={event.timestamp}
                  y={sentimentHistory.find(item => item.timestamp === event.timestamp)?.score || 50}
                  r={5}
                  fill={getEventColor(event.impact)}
                  stroke="white"
                  strokeWidth={2}
                  ifOverflow="extendDomain"
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </TabsContent>
        
        <TabsContent value="live" className="relative mt-2">
          <div className="absolute top-0 right-0 z-10 text-xs text-muted-foreground p-2 flex items-center gap-3">
            <div className="flex items-center gap-2">
              <button 
                className={`px-2 py-1 rounded-md text-xs flex items-center gap-1 ${showNiftyData ? 'bg-primary-foreground' : 'bg-transparent'}`}
                onClick={() => setShowNiftyData(!showNiftyData)}
              >
                <TrendingUp className="h-3 w-3" />
                <span>Nifty</span>
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
          
          <div className="flex gap-2 mt-1 mb-3">
            <Badge variant="outline" className="bg-primary/10 hover:bg-primary/20">
              <span className="w-2 h-2 rounded-full bg-primary mr-1"></span>
              IV Score
            </Badge>
            {showNiftyData && (
              <Badge variant="outline" className="bg-emerald-500/10 hover:bg-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1"></span>
                Nifty50
              </Badge>
            )}
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart
              data={localLiveData}
              margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={document.documentElement.classList.contains('dark') ? "#3C3C4E" : "#D0D0D0"} 
                vertical={false}
              />
              <XAxis 
                dataKey="timestamp" 
                tick={{ fontSize: 12, fill: document.documentElement.classList.contains('dark') ? '#A0A0A0' : '#757575' }}
                tickFormatter={(timestamp) => format(new Date(timestamp), 'HH:mm:ss')}
                minTickGap={30}
              />
              <YAxis 
                yAxisId="left"
                domain={[
                  60, // Fixed y-axis range for better readability
                  75  // Setting a fixed range from 60-75 for the sentiment score
                ]} 
                tick={{ fontSize: 12, fill: '#757575' }}
                orientation="left"
                label={{ value: 'IV Score', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#757575', fontSize: 12 } }}
              />
              {showNiftyData && (
                <YAxis 
                  yAxisId="right"
                  domain={[
                    21900, // Fixed Y-axis for Nifty with a stable range
                    22100  // This will keep the chart more stable and readable
                  ]} 
                  tick={{ fontSize: 12, fill: '#757575' }}
                  orientation="right"
                  label={{ value: 'Nifty50', angle: 90, position: 'insideRight', style: { textAnchor: 'middle', fill: '#757575', fontSize: 12 } }}
                />
              )}
              <Tooltip
                formatter={(value: number, name: string) => {
                  if (name === 'score') return [`${value.toFixed(1)}`, 'IV Score'];
                  if (name === 'niftyValue') return [`${value.toFixed(1)}`, 'Nifty50'];
                  return [value, name];
                }}
                labelFormatter={(label) => format(new Date(label), 'HH:mm:ss')}
                contentStyle={{
                  backgroundColor: document.documentElement.classList.contains('dark') ? '#1E1E2F' : '#fff',
                  border: document.documentElement.classList.contains('dark') ? '1px solid #3C3C4E' : '1px solid #E0E0E0',
                  borderRadius: '4px',
                  padding: '8px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                }}
                itemStyle={{ fontSize: '13px' }}
                labelStyle={{ fontWeight: 'bold', marginBottom: '5px', fontSize: '12px' }}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke={document.documentElement.classList.contains('dark') ? "#00C2FF" : "#1E88E5"} 
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: document.documentElement.classList.contains('dark') ? "#00C2FF" : "#1E88E5", stroke: "white", strokeWidth: 2 }}
                yAxisId="left"
                connectNulls={true}
                animationDuration={300}
              />
              {showNiftyData && (
                <Line 
                  type="monotone" 
                  dataKey="niftyValue" 
                  stroke={document.documentElement.classList.contains('dark') ? "#00FF95" : "#10b981"} 
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, fill: document.documentElement.classList.contains('dark') ? "#00FF95" : "#10b981", stroke: "white", strokeWidth: 2 }}
                  yAxisId="right"
                  connectNulls={true}
                  animationDuration={300}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </TabsContent>
      </Tabs>
      
      {/* Key Events Section with improved styling */}
      <div className="mt-6 border-t border-border pt-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium">Key Market Events</h4>
          <Badge variant="outline" className="text-xs">
            {keyEvents.length} events
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {keyEvents.map((event, index) => (
            <div 
              key={index}
              className="flex items-center p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors"
            >
              <div 
                className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                style={{ backgroundColor: getEventColor(event.impact) }}
              ></div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{event.title}</p>
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
