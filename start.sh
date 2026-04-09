#!/usr/bin/env bash
# wcag-scanner start.sh — start app + cloudflared tunnel
# Usage: ./start.sh [port]
set -euo pipefail

PORT="${1:-3001}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "[wcag] Stopping existing processes on port $PORT..."
fuser -k "$PORT/tcp" 2>/dev/null || true
sleep 1

echo "[wcag] Starting Next.js on port $PORT..."
cd "$SCRIPT_DIR"
node_modules/.bin/next start -p "$PORT" > /tmp/wcag-app.log 2>&1 &
APP_PID=$!
echo $APP_PID > /tmp/wcag-app.pid
sleep 3

if ! kill -0 $APP_PID 2>/dev/null; then
  echo "[wcag] ERROR: App failed to start. Check /tmp/wcag-app.log"
  cat /tmp/wcag-app.log
  exit 1
fi

echo "[wcag] App running (PID $APP_PID)"

echo "[wcag] Starting cloudflared tunnel..."
pkill cloudflared 2>/dev/null || true
sleep 1
~/.local/bin/cloudflared tunnel --url "http://localhost:$PORT" --no-autoupdate > /tmp/cloudflared.log 2>&1 &
CF_PID=$!
echo $CF_PID > /tmp/cloudflared.pid
sleep 7

PUBLIC_URL=$(grep -o 'https://[a-z0-9-]*\.trycloudflare\.com' /tmp/cloudflared.log | head -1)

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  WCAG Scanner is LIVE"
echo "  Local:  http://localhost:$PORT"
echo "  Public: $PUBLIC_URL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Update .env.local if URL changed:"
echo "  NEXT_PUBLIC_BASE_URL=$PUBLIC_URL"
