import express from 'express';
import newsRoutes from './news';

export async function registerRoutes(app: express.Application): Promise<express.Application> {
  // Register news routes
  app.use('/api/news', newsRoutes);

  return app;
} 