#!/bin/bash

set -e

echo "🌿 Deploy VITALINK Backend"

cd /home/vita-backend-dev/VitalinkBackendV2

echo "🔄 Pull latest"
git pull origin dev

echo "📦 Install deps"
npm ci --omit=dev

echo "🏗 Build"
npm run build

echo "♻️ Reload PM2"
pm2 reload ecosystem.config.dev.js || pm2 start ecosystem.config.dev.js

echo "💾 Save"
pm2 save

echo "✅ Backend deploy listo"