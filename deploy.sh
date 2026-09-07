#!/bin/bash
# Cloudways deployment script for AI Sajan Shah (PM2 managed)

APP_DIR="/home/master/applications/jpkbjeavpe"
REPO_DIR="$APP_DIR/git_repo"
WEB_DIR="$APP_DIR/public_html"

echo "=== Deploying AI Sajan Shah ==="

# 1. Sync git_repo to public_html cleanly
if [ -d "$REPO_DIR" ] && [ "$PWD" != "$WEB_DIR" ]; then
    echo "Syncing repository files..."
    rsync -r --no-perms --no-owner --no-group --exclude='node_modules' --exclude='.env' --exclude='data' --exclude='backend/data' --exclude='*.log' --exclude='.git' "$REPO_DIR/" "$WEB_DIR/"
fi

cd "$WEB_DIR" || exit 1

# 2. Determine PM2 binary (global pm2 or npx pm2)
PM2_CMD="pm2"
if ! command -v pm2 &> /dev/null; then
    PM2_CMD="npx pm2"
fi

# 3. Start or restart the backend with PM2
if $PM2_CMD describe aisajanshah-backend &> /dev/null; then
    echo "Restarting backend with PM2..."
    $PM2_CMD restart ecosystem.config.js
else
    echo "Starting backend with PM2..."
    pkill -f "node backend/bundle.js" || true
    pkill -f "node backend/server.js" || true
    sleep 1
    $PM2_CMD start ecosystem.config.js
fi

# 4. Save PM2 process list
$PM2_CMD save 2>/dev/null || true

# 5. Setup PM2 startup script (auto-start on server reboot)
pm2 startup 2>/dev/null || true

sleep 2
echo ""
pm2 status
echo ""
curl -s http://127.0.0.1:5000/api/health || echo "⚠️ Backend starting..."
echo ""
echo "=== Deployment complete ==="
