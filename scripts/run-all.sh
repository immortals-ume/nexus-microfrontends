#!/bin/bash

set -e
set -o pipefail

echo "🚀 Building and starting ALL Microfrontends..."

# Resolve root directory: /nexus-composite/nexus-ui
ROOT_DIR="$(cd "$(dirname "$0")"/.. && pwd)"
echo "📁 Root Directory: $ROOT_DIR"

echo ""
echo "============================="
echo "🔍 Auto-detecting Microfrontends..."
echo "============================="

# Find all folders that have a package.json (excluding scripts folder itself)
apps=($(find "$ROOT_DIR" -mindepth 1 -maxdepth 1 -type d ! -name "scripts" -exec test -f "{}/package.json" \; -print))

if [ ${#apps[@]} -eq 0 ]; then
  echo "❌ No microfrontend apps found!"
  exit 1
fi

echo "📦 Detected Apps:"
for app in "${apps[@]}"; do
  echo "   ➤ $app"
done

echo ""
echo "============================="
echo "📦 Installing + Building ALL"
echo "============================="

for app in "${apps[@]}"; do
  echo ""
  echo "----------------------------------"
  echo "📦 Processing: $app"
  echo "----------------------------------"

  (
    cd "$app"

    echo "📥 Installing dependencies..."
    npm install --silent

    echo "🏗️ Running build..."
    npm run build || echo "⚠️ Build warning for $app (continuing...)"
  )
done

echo ""
echo "=================================="
echo "🔥 Starting ALL dev servers..."
echo "=================================="

for app in "${apps[@]}"; do
  echo ""
  echo "👉 Starting $app..."
  (
    cd "$app"
    npm run dev
  ) &
done

echo ""
echo "🎉 ALL MICROFRONTENDS STARTED!"
echo "----------------------------------"
echo "⚡ HOST: http://localhost:5172/"
echo "----------------------------------"

wait
