import { IVScoreDataPoint } from "@/types";

export function parseIVScoreCSV(csvContent: string): IVScoreDataPoint[] {
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',').map(header => header.trim());
  
  return lines.slice(1).map(line => {
    const values = line.split(',').map(value => value.trim());
    const data: any = {};
    
    headers.forEach((header, index) => {
      const value = values[index];
      switch (header.toLowerCase()) {
        case 'date_time':
          data.timestamp = value;
          break;
        case 'average_iv_score':
          data.averageIVScore = parseFloat(value);
          break;
        case 'close':
        case 'Close':
          data.closePrice = parseFloat(value);
          break;
      }
    });
    
    return data as IVScoreDataPoint;
  }).filter(point => 
    point.timestamp && 
    !isNaN(point.averageIVScore) && 
    !isNaN(point.closePrice)
  );
} 