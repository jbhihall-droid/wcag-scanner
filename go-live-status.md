# WCAG Scanner — Go-Live Status
**Date:** 2026-04-10 (verified 06:35 ACST first run; re-verified ENG-014 final run)
**Task:** ENG-014 (go-live gate)
**Status:** CODE COMPLETE — all endpoints green, build clean, CI/CD workflow committed, awaiting host Stripe + Vercel

---

## Live URL

**https://involving-ranges-sporting-interactive.trycloudflare.com**

> trycloudflare.com URLs are ephemeral (reset on cloudflared restart).
> Permanent URL: deploy to Vercel via GitHub import (5 min — see DEPLOY.md).

---

## Smoke Test Results (ENG-014 final — all passes)

| Endpoint | Local | Public | Notes |
|----------|-------|--------|-------|
| `GET /` | ✅ 200 | ✅ 200 | Landing page, A/B experiment headers set |
| `POST /api/scan` | ✅ 2 violations | ✅ 2 violations | axe-core via Playwright, Chromium headless |
| `POST /api/subscribe` | ✅ `{"ok":true}` | ✅ `{"ok":true}` | Persists to `data/subscribers.json` (gitignored) |
| `POST /api/checkout` | ✅ 303 graceful | ✅ 303 | Redirects to `?checkout=unavailable#pricing` until Stripe added |
| `GET /sitemap.xml` | ✅ 200 | ✅ 200 | SEO-ready |
| `GET /robots.txt` | ✅ 200 | ✅ 200 | No crawl blocks |
| `npm run build` | ✅ clean | — | 9 routes, TypeScript OK, 0 errors |
| Subscribers persisted | ✅ 3 entries | — | `data/subscribers.json` confirmed on disk |

---

## What Changed This Run (ENG-014 final)

- **CI/CD workflow committed:** `.github/workflows/deploy.yml` popped from stash and committed
- **go-live-status updated** with final verified smoke test pass
- All previous fixes confirmed: subscriber persistence, axe-core scanning, Stripe graceful degradation
- **Current commit pushed to origin main**

---

## Running Processes

```
Port 3001:  next start  (wcag-scanner Next.js app)
Tunnel:     cloudflared  (proxying → trycloudflare.com)
```

Restart both:
```bash
~/projects/wcag-scanner/start.sh
```

---

## Host Checklist — What Remains (~25 min total)

### 1. Vercel Deploy (5 min)
1. vercel.com → New Project → Import `jbhihall-droid/wcag-scanner`
2. Deploy (Next.js auto-detected, no config needed)
3. Copy `*.vercel.app` URL
4. Add env vars in Vercel dashboard → Settings → Environment Variables:
   - `NEXT_PUBLIC_BASE_URL=https://<your-url>.vercel.app`
   - (Remove `SUBSCRIBERS_PATH` on Vercel — Resend handles that)
5. Upgrade to Vercel Pro ($20/mo) — Hobby plan has 10s function timeout, scans need 60s

### 2. Stripe Setup (10 min)
1. dashboard.stripe.com → Developers → API Keys → copy Secret key
2. Products → Add "WCAG Scanner Pro" → $9/month → copy Price ID
3. Webhooks → Add endpoint at `https://<vercel-url>/api/webhook`
   Events: `checkout.session.completed`, `customer.subscription.deleted`, `invoice.paid`
4. Add to Vercel env vars: `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID`, `STRIPE_WEBHOOK_SECRET`
5. Redeploy

### 3. Activate CI/CD (2 min, optional)
The workflow file `.github/workflows/deploy.yml` is already committed and pushed.
To activate auto-deploy on push, add GitHub secrets to the repo:
1. vercel.com/account/tokens → Create token
2. github.com/jbhihall-droid/wcag-scanner → Settings → Secrets → add:
   - `VERCEL_TOKEN` — from step 1
   - `VERCEL_ORG_ID` — from `vercel env pull` or Vercel project settings
   - `VERCEL_PROJECT_ID` — from Vercel project settings → General

### 4. Launch (after Vercel + Stripe live)
Posts ready: `~/research/RES-006-launch-posts.md`
Update URL placeholder (`wcag-scanner.vercel.app`) → actual Vercel URL, then post to r/webdev, r/accessibility, Show HN.
Best time: weekday 9–11 AM ET.

---

## After First Payment
```bash
# Update stripe_product_id to activate 2-week audit clock (RES-014)
~/ledgers/revenue-engine/state/revenue.json
```
