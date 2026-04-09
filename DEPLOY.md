# WCAG Scanner — Go-Live Checklist

Dobby's go-live gate for ENG-001. Complete these steps in order.
**Time to deploy: ~45 minutes.**

---

## Step 1 — Stripe setup (~15 min)

1. Create account at https://stripe.com (free)
2. In the Stripe dashboard:
   - **API Keys** → copy your **Secret key** (`sk_live_...` for prod, `sk_test_...` to test first)
   - **Products** → Add product → Name: "WCAG Scanner Pro" → Price: $9.00/month → Recurring → Copy the **Price ID** (`price_...`)
   - **Webhooks** → Add endpoint:
     - URL: `https://<your-vercel-url>/api/webhook`
     - Events: `checkout.session.completed`, `customer.subscription.deleted`, `invoice.paid`, `invoice.payment_failed`
     - Copy the **Webhook signing secret** (`whsec_...`)

---

## Step 2 — Vercel deploy (~10 min)

```bash
# Authenticate (one-time)
vercel login

# From the project directory
cd ~/projects/wcag-scanner

# First deploy — creates the project on Vercel
vercel

# Get your preview URL, test it works, then promote to prod
vercel --prod
```

The default URL will be `https://wcag-scanner-<hash>.vercel.app`.
If you want a custom domain, add it in the Vercel dashboard after first deploy.

---

## Step 3 — Set env vars on Vercel (~5 min)

In the Vercel dashboard → Project → Settings → Environment Variables, add:

| Key | Value | Environment |
|-----|-------|-------------|
| `STRIPE_SECRET_KEY` | `sk_live_...` | Production |
| `STRIPE_PRICE_ID` | `price_...` | Production |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Production |
| `NEXT_PUBLIC_BASE_URL` | `https://wcag-scanner.vercel.app` | Production |

Or push them via CLI:
```bash
vercel env add STRIPE_SECRET_KEY production
vercel env add STRIPE_PRICE_ID production
vercel env add STRIPE_WEBHOOK_SECRET production
vercel env add NEXT_PUBLIC_BASE_URL production
```

After adding env vars, **redeploy** to pick them up:
```bash
vercel --prod
```

---

## Step 4 — Smoke test (~5 min)

1. Open your live URL
2. Paste `https://example.com` into the scanner → should return results
3. Click "Upgrade to Pro" → should redirect to Stripe checkout
4. Complete a test payment (use Stripe test card `4242 4242 4242 4242`)
5. Verify `/payment/success` renders and sets the `pro_email` cookie
6. Re-scan → paywall should be bypassed (no 429)
7. Subscribe to the email list → check Vercel function logs for `[subscribe] new subscriber: <email>`

---

## Step 5 — Umami analytics (optional, ~5 min)

1. Go to https://umami.is → Sign up (free cloud)
2. Add a website → copy the **Script URL** and **Website ID**
3. Add to Vercel env vars:
   - `NEXT_PUBLIC_UMAMI_SRC=https://analytics.umami.is/script.js`
   - `NEXT_PUBLIC_UMAMI_WEBSITE_ID=<your-id>`
4. Redeploy

---

## Step 6 — Post to communities

Posts are ready at: `~/research/RES-006-launch-posts.md`

Channels:
- r/webdev
- r/accessibility
- Hacker News (Show HN)

Best time: weekday 9–11 AM ET.

---

## Post-deploy monitoring

```bash
# Tail live function logs
vercel logs wcag-scanner --follow

# Check email subscriber log
vercel logs wcag-scanner | grep subscribe

# Check scan errors
vercel logs wcag-scanner | grep "Scan failed"
```

---

## Vercel plan note

The scan function needs `maxDuration: 60`. This is already set in the code
(`src/app/api/scan/route.ts`). However:
- **Hobby plan**: hard cap at 10s — scans will timeout on complex pages
- **Pro plan**: up to 900s — required for reliable scan performance

Upgrade the Vercel project to Pro ($20/mo) before launch.
The product revenue (first 3 paying customers at $9/mo = $27/mo) covers it.
