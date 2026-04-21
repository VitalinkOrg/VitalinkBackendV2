#!/bin/bash

set -e

APP_NAME="vitalink-backend"
APP_DIR="/home/vita-backend-dev/VitalinkBackendV2"

echo "🌿 Deploy VITALINK Backend"

cd $APP_DIR

echo "🔄 Pull latest"
git pull origin dev

echo "📦 Install deps"
npm ci --omit=dev

echo "🏗 Build"
npm run build

echo "🧹 Clean old process (si existe)"
pm2 delete $APP_NAME || true

echo "🚀 Start con ecosystem"
pm2 start ecosystem.config.dev.js --only $APP_NAME

echo "💾 Save"
pm2 save

echo "📊 Status"
pm2 list

echo "✅ Backend deploy listo"