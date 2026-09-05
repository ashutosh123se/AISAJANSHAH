#!/bin/bash
# Cloudways zero-dependency deployment script for AI Sajan Shah

APP_DIR="/home/master/applications/jpkbjeavpe"
REPO_DIR="$APP_DIR/git_repo"
WEB_DIR="$APP_DIR/public_html"

echo "=== Deploying AI Sajan Shah ==="

# 1. Sync git_repo to public_html cleanly
if [ -d "$REPO_DIR" ] && [ "$PWD" != "$WEB_DIR" ]; then
    echo "Syncing repository files..."
    rsync -r --no-perms --no-owner --no-group --exclude='node_modules' --exclude='.env' --exclude='data' --exclude='backend/data' --exclude='*.log' --exclude='.git' "$REPO_DIR/" "$WEB_DIR/"
fi

# 2. Restart zero-dependency standalone backend
echo "Restarting backend process..."
pkill -f "node" || true
sleep 1

cd "$WEB_DIR" || exit 1
nohup node backend/bundle.js > /tmp/server.log 2>&1 &

echo "✅ Standalone backend launched!"
sleep 2
curl -s http://127.0.0.1:5000/api/health || echo "⚠️ Backend starting..."
echo "=== Deployment complete ==="
