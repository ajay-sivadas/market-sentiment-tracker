export const config = {
  port: process.env.PORT ? parseInt(process.env.PORT) : (process.env.NODE_ENV === 'development' ? 3001 : 0),
  databaseUrl: process.env.DATABASE_URL,
  nodeEnv: process.env.NODE_ENV || 'development',
}; 