import React from 'react';
import { Grid, Paper } from '@mui/material';
import SentimentScorePanel from './SentimentScorePanel';
import MarketMetricsPanel from './MarketMetricsPanel';
import NewsPanel from './NewsPanel';
import EconomicCalendar from './EconomicCalendar';

const Dashboard: React.FC = () => {
  return (
    <Grid container spacing={3}>
      {/* Sentiment Score Panel */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2, height: '100%' }}>
          <SentimentScorePanel />
        </Paper>
      </Grid>

      {/* Market Metrics Panel */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2, height: '100%' }}>
          <MarketMetricsPanel />
        </Paper>
      </Grid>

      {/* News Panel */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2, height: '100%' }}>
          <NewsPanel />
        </Paper>
      </Grid>

      {/* Economic Calendar */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2, height: '100%' }}>
          <EconomicCalendar />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Dashboard; 