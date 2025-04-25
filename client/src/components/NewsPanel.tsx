import { ArrowUp, ArrowDown } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { NewsItemData } from "@/types";

interface NewsPanelProps {
  data?: NewsItemData[];
  isLoading: boolean;
}

export default function NewsPanel({ data, isLoading }: NewsPanelProps) {
  if (isLoading || !data) {
    return (
      <div className="bg-card rounded-lg shadow-sm md:col-span-2">
        <div className="p-4 border-b border-background">
          <h3 className="text-lg font-medium">Market News Impact</h3>
        </div>
        <div className="p-4">
          {Array(5).fill(0).map((_, index) => (
            <div key={index} className="mb-6 last:mb-0">
              <div className="flex justify-between mb-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <div className="flex items-center mt-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full ml-2" />
                <Skeleton className="h-6 w-16 rounded-full ml-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-sm md:col-span-2">
      <div className="p-4 border-b border-background">
        <h3 className="text-lg font-medium">Market News Impact</h3>
      </div>
      
      <div className="custom-scrollbar overflow-y-auto" style={{ maxHeight: '500px' }}>
        {data.map((newsItem, index) => (
          <div 
            key={index} 
            className={`news-item p-4 ${index < data.length - 1 ? 'border-b border-background' : ''} hover:cursor-pointer`}
          >
            <div className="flex justify-between mb-1">
              <span className="text-sm text-muted-foreground font-mono">
                {format(new Date(newsItem.timestamp), 'MMM d, HH:mm')}
              </span>
              <div className={`flex items-center ${newsItem.sentimentImpact > 0 ? 'dark:text-[#00FF95] text-[#00C853]' : 'dark:text-[#FF4F4F] text-destructive'}`}>
                {newsItem.sentimentImpact > 0 ? (
                  <ArrowUp className="h-4 w-4" />
                ) : (
                  <ArrowDown className="h-4 w-4" />
                )}
                <span className="text-xs ml-1">
                  {newsItem.sentimentImpact > 0 ? '+' : ''}
                  {newsItem.sentimentImpact.toFixed(1)}
                </span>
              </div>
            </div>
            <h4 className="font-medium mb-1">{newsItem.title}</h4>
            <p className="text-sm text-muted-foreground">{newsItem.summary}</p>
            <div className="flex items-center mt-2">
              {newsItem.tags.map((tag, tagIndex) => (
                <span key={tagIndex} className="text-xs px-2 py-1 bg-background rounded-full ml-2 first:ml-0">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
