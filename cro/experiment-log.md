# CRO Experiment Log — WCAG Scanner

> **Decision rule:** minimum 200 visitors per variant AND ≥15% relative uplift in checkout-click rate before calling a winner.  
> **Winner implementation:** remove losing variant from `cro.ts`, delete middleware split, ship winning copy to 100% of traffic.

---

## Experiment 1 — pricing-cta-v1

| Field | Value |
|---|---|
| **Experiment ID** | `pricing-cta-v1` |
| **Cookie** | `wcag_ab_v1` |
| **Start date** | 2026-04-10 |
| **End date** | 2026-04-24 (2 weeks) |
| **Split** | 50/50 deterministic hash on IP + UA |
| **Goal metric** | `/api/checkout` POST click-through rate |
| **Secondary metric** | Free scan → email capture conversion |
| **Minimum sample** | 200 visitors per variant |
| **Minimum effect** | ≥15% relative uplift |
| **Status** | 🟡 Running |

### Hypothesis

Conversion-first copy emphasising business risk ("revenue-killing accessibility issues") will outperform developer-first copy ("know exactly what's breaking") because the target buyer at the pricing-page stage is likely a manager or team lead, not just the individual developer who ran the scan.

### Variants

**Control (A) — developer-first**
- Badge: `developer-first`
- Hero: "Know exactly what's breaking your site's accessibility"
- CTA: "Scan my site" / "See pricing"
- Pro CTA: "Upgrade to Pro"
- Pro description: "For teams shipping accessible products"

**Value (B) — conversion-first**
- Badge: `conversion-first`
- Hero: "Catch revenue-killing accessibility issues before customers do"
- CTA: "Run free audit" / "Compare plans"
- Pro CTA: "Start Pro trial"
- Pro description: "For teams that want faster triage, repeat scans, and cleaner reporting"

### Tracking

Stripe `metadata.ab_variant` is set on every checkout session.  
Vercel Analytics captures pageviews. Umami (if configured) tracks custom events.  
Microsoft Clarity session recordings are live — tag sessions by variant in Clarity using the JS API: `clarity("set", "ab_variant", "<value>")`.

To add Clarity custom tag (add to layout.tsx after variant is known):
```js
window.clarity?.("set", "ab_variant", cookieValue);
```

### Weekly tally

| Date | Control visitors | Control checkouts | Control CVR | Value visitors | Value checkouts | Value CVR | Δ CVR | Note |
|---|---|---|---|---|---|---|---|---|
| Week 1 end (2026-04-17) | — | — | — | — | — | — | — | |
| Week 2 end (2026-04-24) | — | — | — | — | — | — | — | |

### Result

| Field | Value |
|---|---|
| **Winner** | TBD |
| **Effect size** | TBD |
| **Decision** | TBD |
| **Decision date** | TBD |
| **Next experiment** | TBD |

### Decision options

- **Control wins or no significant difference** → ship control copy to 100%, design next experiment around pricing anchor or feature framing.
- **Value wins** → ship value copy to 100%, design next experiment around urgency ("Your competitors are fixing this now") or social proof ("Used by 500+ dev teams").
- **Inconclusive after 2 weeks** → extend by 1 week, then decide; if still flat, treat as "no effect" and kill the experiment.

---

## How to read Stripe data

```bash
# List checkout sessions with ab_variant metadata
stripe checkout sessions list --limit 100 | jq '[.data[] | {id, amount_total, metadata}]'
```

Group by `metadata.ab_variant` to get conversion count per variant.

---

## Experiment backlog

| ID | Hypothesis | Primary metric | Status |
|---|---|---|---|
| pricing-cta-v1 | Conversion-first hero copy → higher checkout CVR | Checkout click rate | 🟡 Running |
| pricing-anchor-v1 | Adding annual pricing option increases monthly plan uptake | Monthly plan checkout CVR | ⬜ Backlog |
| social-proof-v1 | Adding "X scans run" counter increases trust → CVR | Checkout click rate | ⬜ Backlog |
| urgency-v1 | "Limited free scans remaining today" nudge → CVR | Checkout click rate | ⬜ Backlog |
| email-gate-v1 | Require email to see full results → email list growth | Email capture rate | ⬜ Backlog |

---

## Experiment template

Copy this block to log a new experiment:

```markdown
## Experiment N — <experiment-id>

| Field | Value |
|---|---|
| **Experiment ID** | `` |
| **Cookie** | `` |
| **Start date** | YYYY-MM-DD |
| **End date** | YYYY-MM-DD |
| **Split** | 50/50 |
| **Goal metric** | |
| **Secondary metric** | |
| **Minimum sample** | 200 visitors per variant |
| **Minimum effect** | ≥15% relative uplift |
| **Status** | 🟡 Running |

### Hypothesis
<one sentence: IF <change> THEN <outcome> BECAUSE <reason>>

### Variants
**Control (A):** ...
**Treatment (B):** ...

### Weekly tally
| Date | Control V | Control C | Control CVR | Treat V | Treat C | Treat CVR | Δ CVR | Note |
|---|---|---|---|---|---|---|---|---|

### Result
Winner: TBD | Effect: TBD | Decision: TBD
```
