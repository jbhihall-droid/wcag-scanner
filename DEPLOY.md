# WCAG Scanner — Go-Live Checklist

Dobby's go-live gate for ENG-001. Complete these steps in order.
**Time to deploy: ~20 minutes.**

GitHub: https://github.com/jbhihall-droid/wcag-scanner

---

## Step 1 — Deploy to Vercel via GitHub import (~5 min, no CLI needed)

1. Go to **vercel.com** → New Project
2. Import `jbhihall-droid/wcag-scanner` from GitHub
3. Leave all settings as-is (framework is auto-detected as Next.js)
4. Click **Deploy**
5. You get a live URL like `https://wcag-scanner-<hash>.vercel.app`

**Product is live at this point.** Free tier works immediately.
Upgrade button shows "coming soon" until Stripe is added (Step 2).

---

## Step 2 — Stripe setup (~10 min, optional for soft launch)

Without Stripe: free tier works, paid tier shows "coming soon" notice.
With Stripe: full payment flow active.

1. **dashboard.stripe.com** → Developers → API keys → copy **Secret key**
2. **Products** → Add product → "WCAG Scanner Pro" → $9.00/month recurring → copy **Price ID**
3. **Webhooks** → Add endpoint:
   - URL: `https://<your-vercel-url>/api/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.deleted`, `invoice.paid`
   - Copy **Webhook signing secret**

Then add to Vercel → Project → Settings → Environment Variables:

| Key | Value |
|-----|-------|
| `STRIPE_SECRET_KEY` | `sk_live_...` |
| `STRIPE_PRICE_ID` | `price_...` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` |
| `NEXT_PUBLIC_BASE_URL` | `https://wcag-scanner.vercel.app` |

**Redeploy** after adding env vars (Vercel dashboard → Deployments → Redeploy).

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
