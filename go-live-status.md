# WCAG Scanner — Go-Live Status
**Date:** 2026-04-10 (verified 06:25 ACST)
**Task:** ENG-014  
**Status:** VERIFIED LIVE — build clean, all endpoints green (local + public tunnel), awaiting host Stripe + Vercel

---

## Live URL

**https://involving-ranges-sporting-interactive.trycloudflare.com**

> Note: trycloudflare.com URLs are ephemeral (reset on daemon restart).
> Permanent URL: deploy to Vercel via GitHub import (5 min, no CLI — see DEPLOY.md Step 1).

---

## Smoke Test Results (ENG-014 verified 2026-04-10 06:25 ACST)

Tested against both localhost:3001 and public tunnel.

| Endpoint | Local | Public | Notes |
|----------|-------|--------|-------|
| `GET /` | ✅ 200 | ✅ 200 | Landing page, A/B experiment headers set |
| `POST /api/scan` | ✅ 2 violations | ✅ 2 violations | axe-core injected from disk, Chromium headless |
| `POST /api/subscribe` | ✅ `{"ok":true}` | ✅ `{"ok":true}` | Logs to stdout (no Resend key — fine for launch) |
| `POST /api/checkout` | ✅ 303 graceful | ✅ 303 | Redirects to `?checkout=unavailable#pricing` until Stripe added |
| `GET /sitemap.xml` | ✅ 200 | ✅ 200 | SEO-ready |
| `GET /robots.txt` | ✅ 200 | ✅ 200 | No crawl blocks |
| `npm run build` | ✅ clean | — | TypeScript OK, 9 routes, 0 errors |
| `git push origin main` | ✅ pushed | — | Commit 43cf4d1 |

---

## Running Processes

```
Port 3001:  next start  (wcag-scanner Next.js app)
Tunnel:     cloudflared  (proxying → trycloudflare.com)
```

Restart both with:
```bash
~/projects/wcag-scanner/start.sh
```

---

## What's Live Now

- ✅ Free tier scanner — scans any URL for WCAG violations
- ✅ Email capture — `POST /api/subscribe` (logs to stdout, build list before drip)
- ✅ A/B experiment — pricing CTA variant `x-wcag-experiment: pricing-cta-v1`
- ✅ Sitemap + robots.txt — ready for Google indexing
- ⏳ Stripe payments — 10-min setup (see below)
- ⏳ Resend email — optional, emails log to stdout until connected
- ⏳ Umami analytics — optional, add script ID to .env.local

---

## Host Checklist — Stripe (10 minutes)

1. **dashboard.stripe.com** → Developers → API Keys → copy **Secret key** (`sk_live_...`)
2. **Products** → Add product → "WCAG Scanner Pro" → $9.00/month recurring → copy **Price ID** (`price_...`)
3. **Webhooks** → Add endpoint:
   - URL: `https://<your-vercel-url>/api/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.deleted`, `invoice.paid`
   - Copy **Webhook signing secret** (`whsec_...`)
4. Edit `~/projects/wcag-scanner/.env.local` — uncomment and fill in:
   ```
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_PRICE_ID=price_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```
5. Restart: `fuser -k 3001/tcp && cd ~/projects/wcag-scanner && node_modules/.bin/next start -p 3001 &`

---

## Permanent Deployment (Vercel — 5 minutes, no CLI)

1. vercel.com → New Project → Import `jbhihall-droid/wcag-scanner`
2. Deploy (auto-detects Next.js, no config needed)
3. Copy the `*.vercel.app` URL
4. Add Stripe env vars in Vercel dashboard → Settings → Environment Variables
5. Update `NEXT_PUBLIC_BASE_URL` to the Vercel URL → Redeploy

This is the production path. The cloudflare tunnel is a live proof-of-concept.

---

## Revenue.json — Update After Stripe Connected

```bash
# After first real payment, update:
~/ledgers/revenue-engine/state/revenue.json
```

Set `stripe_product_id` to activate the 2-week audit clock (RES-014).
