import { useState, useEffect } from "react";
import { Calendar, Clock, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { UpcomingEvent } from "@/types";
import { useQuery } from "@tanstack/react-query";

export default function UpcomingEventsPanel() {
  const { data, isLoading, error } = useQuery<UpcomingEvent[]>({
    queryKey: ['/api/upcoming-events'],
    refetchInterval: 60000, // Refetch every minute
  });

  if (isLoading) {
    return (
      <div className="bg-card rounded-lg shadow-sm p-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Upcoming Events</h3>
        </div>
        <div className="space-y-4">
          {Array(4).fill(0).map((_, index) => (
            <div key={index} className="border-b border-background pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <Skeleton className="h-5 w-48 mb-2" />
                  <div className="flex items-center">
                    <Skeleton className="h-4 w-4 mr-1" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full mt-2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card rounded-lg shadow-sm p-6 mt-6">
        <h3 className="text-lg font-medium mb-4">Upcoming Events</h3>
        <div className="flex items-center justify-center p-8 text-destructive">
          <AlertTriangle className="mr-2" />
          <span>Failed to load upcoming events</span>
        </div>
      </div>
    );
  }

  const events: UpcomingEvent[] = data ? data as UpcomingEvent[] : [];

  // Function to get impact badge color
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive':
        return 'dark:bg-[#00FF95] dark:bg-opacity-10 dark:text-[#00FF95] bg-[#00C853] bg-opacity-10 text-[#00C853]';
      case 'negative':
        return 'dark:bg-[#FF4F4F] dark:bg-opacity-10 dark:text-[#FF4F4F] bg-destructive bg-opacity-10 text-destructive';
      default:
        return 'dark:bg-[#00C2FF] dark:bg-opacity-10 dark:text-[#00C2FF] bg-primary bg-opacity-10 text-primary';
    }
  };

  // Function to get impact icon
  const getImpactIcon = (impact: string) => {
    if (impact === 'positive') return <TrendingUp className="h-3 w-3 mr-1" />;
    if (impact === 'negative') return <TrendingDown className="h-3 w-3 mr-1" />;
    return null;
  };
  
  // Function to get importance class
  const getImportanceClass = (importance: string) => {
    switch (importance) {
      case 'high':
        return 'border-l-[3px] dark:border-[#FF4F4F] border-destructive';
      case 'medium':
        return 'border-l-[3px] dark:border-amber-400 border-yellow-500';
      default:
        return 'border-l-[3px] dark:border-gray-600 border-gray-300';
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-sm p-6 mt-6">
      <h3 className="text-lg font-medium mb-4">Upcoming Events</h3>
      
      {events.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No upcoming events scheduled
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div 
              key={event.id} 
              className={`border-b border-background pb-4 pl-3 ${getImportanceClass(event.importance)}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium">{event.title}</h4>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>
                      {format(new Date(event.eventDate), 'MMM d, yyyy')}
                    </span>
                    <Clock className="h-3 w-3 ml-2 mr-1" />
                    <span>
                      {format(new Date(event.eventDate), 'h:mm a')}
                    </span>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs flex items-center ${getImpactColor(event.impact)}`}>
                  {getImpactIcon(event.impact)}
                  <span className="capitalize">{event.impact}</span>
                </div>
              </div>
              {event.description && (
                <p className="text-sm text-muted-foreground mt-2">
                  {event.description}
                </p>
              )}
              <div className="mt-2">
                <span className="text-xs px-2 py-1 bg-background rounded-full">
                  {event.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}