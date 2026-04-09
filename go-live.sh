#!/usr/bin/env bash
# go-live.sh — Deploy WCAG Scanner to Vercel production
# Usage: ./go-live.sh
# Requires: vercel auth (run `vercel login` first), .env.local with real credentials

set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_PIPELINE="$HOME/tools/deploy-pipeline"

echo "=== WCAG Scanner go-live ==="
echo ""

# ── Preflight checks ──────────────────────────────────────────────────────────

VERCEL_BIN="${HOME}/.npm-global/bin/vercel"
[[ ! -f "$VERCEL_BIN" ]] && VERCEL_BIN="$(command -v vercel 2>/dev/null || true)"

if [[ -z "$VERCEL_BIN" ]]; then
  echo "ERROR: vercel CLI not found. Run: npm install -g vercel"
  exit 1
fi

# Support VERCEL_TOKEN for headless/CI auth
if [[ -n "${VERCEL_TOKEN:-}" ]]; then
  echo "✓ Vercel auth: VERCEL_TOKEN from environment"
elif ! timeout 8 "$VERCEL_BIN" whoami &>/dev/null 2>&1; then
  echo "ERROR: Not authenticated with Vercel."
  echo "Option A: vercel login"
  echo "Option B: export VERCEL_TOKEN=<token>  (get from vercel.com/account/tokens)"
  echo "Then re-run this script."
  exit 1
else
  echo "✓ Vercel auth: $(timeout 8 "$VERCEL_BIN" whoami 2>/dev/null)"
fi

if [[ ! -f "$PROJECT_DIR/.env.local" ]]; then
  echo "WARNING: .env.local not found — deploying without Stripe (checkout shows 'coming soon')"
  echo "  To add Stripe later: cp .env.local.example .env.local && nvim .env.local"
else
  # Validate — Stripe is optional at launch (checkout degrades gracefully)
  # shellcheck disable=SC1090
  source "$PROJECT_DIR/.env.local"
  MISSING=()
  [[ -z "${STRIPE_SECRET_KEY:-}" || "${STRIPE_SECRET_KEY}" == *"REPLACE_ME"* ]] && MISSING+=("STRIPE_SECRET_KEY")
  [[ -z "${STRIPE_PRICE_ID:-}" || "${STRIPE_PRICE_ID}" == *"REPLACE_ME"* ]] && MISSING+=("STRIPE_PRICE_ID")
  [[ -z "${STRIPE_WEBHOOK_SECRET:-}" || "${STRIPE_WEBHOOK_SECRET}" == *"REPLACE_ME"* ]] && MISSING+=("STRIPE_WEBHOOK_SECRET")

  if [[ ${#MISSING[@]} -gt 0 ]]; then
    echo "WARNING: Stripe not configured (checkout will show 'coming soon'):"
    for v in "${MISSING[@]}"; do echo "  - $v"; done
    echo "  Product is still deployable — free tier works without Stripe."
    echo ""
  else
    echo "✓ Stripe credentials OK"
  fi
fi

echo "✓ .env.local checked"
echo ""

# ── Build verification ────────────────────────────────────────────────────────
echo "Building..."
cd "$PROJECT_DIR"
npm run build
echo "✓ Build OK"
echo ""

# ── Deploy ────────────────────────────────────────────────────────────────────
echo "Deploying to Vercel..."

# Push env vars first
if [[ -f "$DEPLOY_PIPELINE/env-push.sh" ]]; then
  "$DEPLOY_PIPELINE/env-push.sh" "$PROJECT_DIR"
else
  # Fallback: push env vars directly
  while IFS='=' read -r key value; do
    [[ "$key" =~ ^#.*$ ]] && continue
    [[ -z "$key" ]] && continue
    vercel env add "$key" production <<< "$value" 2>/dev/null || true
  done < "$PROJECT_DIR/.env.local"
fi

# Build Vercel command
VCMD=("$VERCEL_BIN" --prod --yes)
[[ -n "${VERCEL_TOKEN:-}" ]] && VCMD+=(--token "$VERCEL_TOKEN")

# Deploy to production
DEPLOY_URL=$("${VCMD[@]}" 2>&1 | grep -E 'https://[^ ]+\.vercel\.app' | tail -1)
echo ""
echo "✓ Deployed: $DEPLOY_URL"
echo ""

# ── Post-deploy checklist ─────────────────────────────────────────────────────
echo "=== Post-deploy steps ==="
echo ""
echo "1. Register Stripe webhook:"
echo "   URL: ${NEXT_PUBLIC_BASE_URL}/api/webhook"
echo "   Events: checkout.session.completed, customer.subscription.deleted"
echo "   https://dashboard.stripe.com/webhooks/create"
echo ""
echo "2. Update .env.local STRIPE_WEBHOOK_SECRET with the webhook signing secret"
echo "   Then re-run: vercel env rm STRIPE_WEBHOOK_SECRET production && vercel env add STRIPE_WEBHOOK_SECRET production"
echo ""
echo "3. Submit sitemap to Google Search Console:"
echo "   ${NEXT_PUBLIC_BASE_URL}/sitemap.xml"
echo ""
echo "4. Launch posts (see ~/research/RES-006-launch-distribution-playbook.md):"
echo "   - r/webdev, r/accessibility, r/webdesign"
echo "   - Show HN"
echo "   - Indie Hackers"
echo ""
echo "Done. Product is live at: $DEPLOY_URL"
