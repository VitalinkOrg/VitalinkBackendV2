#!/bin/bash

set -e

echo "🌿 Deploy VITALINK Backend"

cd /home/ubuntu/Vitalink-Backend

echo "🔄 Pull latest"
git pull origin main

echo "📦 Install deps"
npm ci --omit=dev

echo "🏗 Build"
npm run build

echo "♻️ Reload PM2"
pm2 reload ecosystem.config.prod.js || pm2 start ecosystem.config.prod.js

echo "💾 Save"
pm2 save

echo "✅ Backend deploy listo"