import { useState } from "react";
import { format } from "date-fns";
import { Image, FileText, Download } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { HistoricalSentimentData, TimeFrame, KeyEvent } from "@/types";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  ReferenceDot
} from "recharts";

interface SentimentChartPanelProps {
  data?: HistoricalSentimentData;
  isLoading: boolean;
  timeFrame: TimeFrame;
}

export default function SentimentChartPanel({ 
  data, 
  isLoading,
  timeFrame 
}: SentimentChartPanelProps) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  if (isLoading || !data) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 md:col-span-2">
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
    if (impact === 'positive') return '#00C853';
    if (impact === 'negative') return '#D32F2F';
    return '#1E88E5';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 md:col-span-2">
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
      
      {/* Chart */}
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
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
                <stop offset="5%" stopColor="#1E88E5" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#1E88E5" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
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
              formatter={(value: number) => [`${value.toFixed(1)}`, 'Sentiment']}
              labelFormatter={(label) => format(new Date(label), 'MMM d, yyyy HH:mm')}
            />
            <Area 
              type="monotone" 
              dataKey="score" 
              stroke="#1E88E5" 
              fillOpacity={1} 
              fill="url(#colorScore)" 
            />
            
            {/* Event markers */}
            {keyEvents.map((event, index) => (
              <ReferenceDot
                key={index}
                x={event.timestamp}
                y={sentimentHistory.find(item => item.timestamp === event.timestamp)?.score || 50}
                r={4}
                fill={getEventColor(event.impact)}
                stroke="white"
                strokeWidth={1}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Key Events */}
      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2">Key Events</h4>
        <div className="flex flex-wrap gap-2">
          {keyEvents.map((event, index) => (
            <div 
              key={index}
              className={`inline-flex items-center px-2 py-1 rounded-full bg-opacity-10 text-xs`}
              style={{
                backgroundColor: `${getEventColor(event.impact)}10`,
                color: getEventColor(event.impact)
              }}
            >
              <span 
                className="w-2 h-2 rounded-full mr-1"
                style={{ backgroundColor: getEventColor(event.impact) }}
              ></span>
              {event.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
