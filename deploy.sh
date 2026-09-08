#!/bin/bash
# Cloudways deployment script for AI Sajan Shah (PM2 managed)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR" || exit 1

echo "=== Deploying AI Sajan Shah ==="
echo "Working directory: $(pwd)"

# If we are in git_repo next to public_html, sync files
if [[ "$SCRIPT_DIR" == *"git_repo"* ]]; then
    PARENT_DIR="$(dirname "$SCRIPT_DIR")"
    WEB_DIR="$PARENT_DIR/public_html"
    if [ -d "$WEB_DIR" ]; then
        echo "Syncing git_repo to public_html..."
        rsync -r --no-perms --no-owner --no-group --exclude='node_modules' --exclude='.env' --exclude='data' --exclude='backend/data' --exclude='*.log' --exclude='.git' "$SCRIPT_DIR/" "$WEB_DIR/"
        cd "$WEB_DIR" || exit 1
    fi
fi

# 1. Pull latest code if git is available
if [ -d ".git" ]; then
    echo "Pulling latest git changes..."
    git pull origin main 2>/dev/null || true
fi

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
    pkill -f "node backend/bundle.js" 2>/dev/null || true
    pkill -f "node backend/server.js" 2>/dev/null || true
    sleep 1
    $PM2_CMD start ecosystem.config.js
fi

# 4. Save PM2 process list
$PM2_CMD save 2>/dev/null || true

# 5. Setup PM2 startup script
$PM2_CMD startup 2>/dev/null || true

sleep 2
echo ""
$PM2_CMD status
echo ""
curl -s http://127.0.0.1:5000/api/health || echo "⚠️ Backend starting..."
echo ""
echo "=== Deployment complete ==="
