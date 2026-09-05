#!/bin/bash
# Cloudways auto-sync and deployment script for AI Sajan Shah

APP_DIR="/home/master/applications/jpkbjeavpe"
REPO_DIR="$APP_DIR/git_repo"
WEB_DIR="$APP_DIR/public_html"

echo "=== Deploying AI Sajan Shah ==="

# 1. Sync git_repo to public_html if running from git_repo
if [ -d "$REPO_DIR" ] && [ "$PWD" != "$WEB_DIR" ]; then
    echo "Syncing code from $REPO_DIR to $WEB_DIR..."
    rsync -av --delete "$REPO_DIR/" "$WEB_DIR/"
fi

# 2. Restart Node.js backend
echo "Restarting backend process on port 5000..."
pkill -f "node server.js" || true
sleep 1

cd "$WEB_DIR/backend" || exit 1
nohup node server.js > server.log 2>&1 &

echo "✅ Backend started! Checking health..."
sleep 2
curl -s http://127.0.0.1:5000/api/health || echo "⚠️ Backend starting..."

echo "=== Deployment finished successfully ==="
