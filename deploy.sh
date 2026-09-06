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

# 2. Install PM2 if not already installed
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2 process manager..."
    npm install -g pm2
fi

# 3. Start or restart the backend with PM2
if pm2 describe aisajanshah-backend &> /dev/null; then
    echo "Restarting backend with PM2..."
    pm2 restart ecosystem.config.js
else
    echo "Starting backend with PM2 for the first time..."
    # Kill any leftover nohup node processes
    pkill -f "node backend/bundle.js" || true
    sleep 1
    pm2 start ecosystem.config.js
fi

# 4. Save PM2 process list (survives server reboot)
pm2 save

# 5. Setup PM2 startup script (auto-start on server reboot)
pm2 startup 2>/dev/null || true

sleep 2
echo ""
pm2 status
echo ""
curl -s http://127.0.0.1:5000/api/health || echo "⚠️ Backend starting..."
echo ""
echo "=== Deployment complete ==="
