#!/bin/bash

set -e

APP_NAME="vitalink-backend"
APP_DIR="/home/deploy/vitalinkBackendPROD/VitalinkBackendV2"

echo "🌿 Deploy VITALINK Backend"

cd $APP_DIR

echo "🔄 Pull latest"
git pull origin prod

echo "📦 Install deps"
npm ci --omit=dev

echo "🏗 Build"
npm run build

echo "🧹 Clean old process"
pm2 delete $APP_NAME || true

echo "🚀 Start app en CLUSTER"

pm2 start npm \
  --name "$APP_NAME" \
  -- run PRODAWS \
  -i max \
  --time \
  --update-env

echo "💾 Save PM2 state"
pm2 save

echo "📊 Status"
pm2 list

echo "✅ Backend deploy listo!"