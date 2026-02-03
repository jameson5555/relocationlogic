#!/usr/bin/env bash
set -euo pipefail

# update-and-build.sh
# Pull latest code, install deps, build Next.js, and restart the process if PM2 is available.

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "Updating repository..."
git pull origin main || true

echo "Installing dependencies..."
npm ci

echo "Building application..."
npm run build

echo "Build complete. Attempting to restart using pm2 (if installed)..."
if command -v pm2 >/dev/null 2>&1; then
  if pm2 list | grep -q relocationlogic; then
    pm2 restart relocationlogic
  else
    pm2 start ./.next/standalone/server.js --name relocationlogic --env production
  fi
  echo "PM2 restarted the app."
else
  echo "pm2 not found. Please restart the Node process manually or install pm2: npm i -g pm2"
fi

echo "Done."
