import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const getSentimentData = async () => {
  try {
    const response = await api.get('/sentiment/current');
    return response.data;
  } catch (error) {
    console.error('Error fetching sentiment data:', error);
    throw error;
  }
};

export const getHistoricalSentiment = async () => {
  try {
    const response = await api.get('/sentiment/historical');
    return response.data;
  } catch (error) {
    console.error('Error fetching historical sentiment:', error);
    throw error;
  }
};

export const getNews = async () => {
  try {
    const response = await api.get('/news');
    return response.data;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};

export const getIndiaVIX = async () => {
  try {
    const response = await api.get('/india-vix');
    return response.data;
  } catch (error) {
    console.error('Error fetching India VIX data:', error);
    throw error;
  }
};

export const getNiftyPCR = async () => {
  try {
    const response = await api.get('/nifty-pcr');
    return response.data;
  } catch (error) {
    console.error('Error fetching Nifty PCR data:', error);
    throw error;
  }
}; 