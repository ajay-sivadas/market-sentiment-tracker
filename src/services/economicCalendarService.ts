import axios from 'axios';

interface EconomicEvent {
  date: string;
  event: string;
  importance: 'High' | 'Medium' | 'Low';
  previous: string;
  actual: string;
  unit: string;
  country: string;
}

class EconomicCalendarService {
  private baseUrl = '/api/economic-calendar';

  async getEconomicEvents(): Promise<EconomicEvent[]> {
    try {
      const response = await axios.get(this.baseUrl);
      return response.data;
    } catch (error) {
      console.error('Error fetching economic calendar:', error);
      throw new Error('Failed to fetch economic calendar data');
    }
  }
}

export const economicCalendarService = new EconomicCalendarService(); 