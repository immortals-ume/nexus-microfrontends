#!/bin/bash

echo "Building and serving all remote microfrontends..."

# Build and serve dashboard
echo "Building dashboard..."
(cd nexus-ui/nexus-dashboard && npm run build && npm run preview) &

# Build and serve admin
echo "Building admin..."
(cd nexus-ui/nexus-admin && npm run build && npm run preview) &

# Build and serve analytics
echo "Building analytics..."
(cd nexus-ui/nexus-analytics && npm run build && npm run preview) &

# Build and serve auth
echo "Building auth..."
(cd nexus-ui/nexus-auth && npm run build && npm run preview) &

# Build and serve product
echo "Building product..."
(cd nexus-ui/nexus-product && npm run build && npm run preview) &

wait

echo "All remotes built and serving!"
