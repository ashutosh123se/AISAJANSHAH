#!/bin/bash
# Cloudways safe sync and deployment script for AI Sajan Shah

APP_DIR="/home/master/applications/jpkbjeavpe"
REPO_DIR="$APP_DIR/git_repo"
WEB_DIR="$APP_DIR/public_html"

echo "=== Deploying AI Sajan Shah ==="

# 1. Safely sync git_repo to public_html without deleting node_modules, .env, data, or logs
if [ -d "$REPO_DIR" ] && [ "$PWD" != "$WEB_DIR" ]; then
    echo "Syncing code from $REPO_DIR to $WEB_DIR..."
    rsync -av \
      --exclude='node_modules' \
      --exclude='.env' \
      --exclude='data' \
      --exclude='backend/data' \
      --exclude='*.log' \
      --exclude='.git' \
      "$REPO_DIR/" "$WEB_DIR/"
fi

# 2. Ensure backend node_modules exist (reinstall if they were deleted)
if [ ! -d "$WEB_DIR/backend/node_modules" ] || [ ! -d "$WEB_DIR/backend/node_modules/express" ]; then
    echo "backend/node_modules missing, running npm install in backend..."
    cd "$WEB_DIR/backend" && npm install --omit=dev
fi

# 3. Restart Node.js backend
echo "Restarting backend process on port 5000..."
pkill -f "node server.js" || true
sleep 1

cd "$WEB_DIR/backend" || exit 1
nohup node server.js > server.log 2>&1 &

echo "✅ Backend process launched!"
sleep 2
curl -s http://127.0.0.1:5000/api/health || echo "⚠️ Backend starting..."

echo "=== Deployment finished successfully ==="
