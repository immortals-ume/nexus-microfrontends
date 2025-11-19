#!/bin/bash

echo "Starting all microfrontend apps..."

# Start dashboard
(cd nexus-dashboard && npm run dev) &
DASH_PID=$!

# Start admin
(cd nexus-admin && npm run dev) &
ADMIN_PID=$!

# Start analytics
(cd nexus-analytics && npm run dev) &
ANALYTICS_PID=$!

# Start host
(cd host && npm run dev) &
HOST_PID=$!

# Wait for all
wait $DASH_PID $ADMIN_PID $ANALYTICS_PID $HOST_PID
