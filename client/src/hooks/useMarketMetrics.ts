import { useQuery } from '@tanstack/react-query';
import { MarketMetricsData, NiftyPCRData } from '@/types';

async function fetchMarketMetrics(): Promise<MarketMetricsData> {
  const [indianIndicesResponse, globalIndicesResponse] = await Promise.all([
    fetch('/api/moneycontrol/indian-indices'),
    fetch('/api/moneycontrol/global-indices')
  ]);

  if (!indianIndicesResponse.ok || !globalIndicesResponse.ok) {
    throw new Error('Failed to fetch market metrics');
  }

  const indianIndices = await indianIndicesResponse.json();
  const globalIndices = await globalIndicesResponse.json();

  const defaultNiftyPCR: NiftyPCRData = {
    value: 0,
    change: 0,
    putVolume: 0,
    callVolume: 0,
    lastUpdated: new Date().toISOString()
  };

  return {
    indices: globalIndices.map((index: any) => ({
      name: index.index,
      value: index.value,
      change: index.changePercent
    })),
    indianIndices: indianIndices.map((index: any) => ({
      name: index.index,
      value: index.value,
      change: index.changePercent
    })),
    sectorPerformance: [], // We'll add this later if needed
    niftyPCR: defaultNiftyPCR
  };
}

export function useMarketMetrics() {
  return useQuery({
    queryKey: ['marketMetrics'],
    queryFn: fetchMarketMetrics,
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000 // Consider data stale after 30 seconds
  });
} 