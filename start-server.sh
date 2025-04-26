#!/bin/bash

# Kill any existing server process
pkill -f "tsx server/server.ts"

# Set environment variables
export DATABASE_URL=postgresql://postgres:postgres@localhost:5432/marketmood
export NODE_ENV=development

# Create logs directory if it doesn't exist
mkdir -p logs

# Start the server and keep it running
while true; do
  echo "Starting server..."
  timestamp=$(date +%Y%m%d_%H%M%S)
  if ! npx tsx server/server.ts > "logs/server_${timestamp}.log" 2>&1; then
    echo "Server exited with error. Check logs/server_${timestamp}.log for details."
    echo "Restarting in 5 seconds..."
    sleep 5
  else
    echo "Server exited normally. Restarting in 2 seconds..."
    sleep 2
  fi
done 