import { Skeleton } from "@/components/ui/skeleton";
import { MarketFactorsData, FactorElement } from "@/types";

interface MarketFactorsPanelProps {
  data?: MarketFactorsData;
  isLoading: boolean;
}

export default function MarketFactorsPanel({ data, isLoading }: MarketFactorsPanelProps) {
  if (isLoading || !data) {
    return (
      <div className="bg-card rounded-lg shadow-sm p-6 mt-6">
        <h3 className="text-lg font-medium mb-4">Contributing Factors</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array(3).fill(0).map((_, index) => (
            <div key={index} className="border border-background rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-16" />
              </div>
              <div className="space-y-2">
                {Array(4).fill(0).map((_, subIndex) => (
                  <div key={subIndex} className="flex justify-between text-sm">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const { factors } = data;
  
  // Helper function to get status color
  const getStatusColor = (status: string) => {
    if (status.toLowerCase().includes('strong') || 
        status.toLowerCase().includes('positive') || 
        status.toLowerCase().includes('bullish')) {
      return 'dark:text-[#00FF95] text-[#00C853]';
    }
    if (status.toLowerCase().includes('weak') || 
        status.toLowerCase().includes('negative') || 
        status.toLowerCase().includes('bearish')) {
      return 'dark:text-[#FF4F4F] text-destructive';
    }
    return 'text-primary';
  };

  return (
    <div className="bg-card rounded-lg shadow-sm p-6 mt-6">
      <h3 className="text-lg font-medium mb-4">Contributing Factors</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {factors.map((factor, index) => (
          <div key={index} className="border border-background rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">{factor.name}</h4>
              <span className={`text-sm font-mono font-medium ${factor.score > 0 ? 'dark:text-[#00FF95] text-[#00C853]' : 'dark:text-[#FF4F4F] text-destructive'}`}>
                {factor.score > 0 ? '+' : ''}{factor.score.toFixed(1)}
              </span>
            </div>
            <div className="space-y-2">
              {factor.elements.map((element: FactorElement, elementIndex: number) => (
                <div key={elementIndex} className="flex justify-between text-sm">
                  <span>{element.name}</span>
                  <span className={getStatusColor(element.status)}>{element.status}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
