import { NextResponse } from "next/server";
import Stripe from "stripe";

// Stripe webhook handler — handles subscription lifecycle events.
// Required env vars:
//   STRIPE_SECRET_KEY      — sk_live_... or sk_test_...
//   STRIPE_WEBHOOK_SECRET  — whsec_... (from Stripe dashboard > Webhooks)
//
// Register this endpoint in Stripe:
//   URL: https://<your-vercel-url>/api/webhook
//   Events: checkout.session.completed, customer.subscription.deleted, invoice.paid

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecret || !webhookSecret) {
    console.error("[webhook] Missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET");
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  const stripe = new Stripe(stripeSecret, { apiVersion: "2026-03-25.dahlia" });

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    console.error("[webhook] Signature verification failed:", message);
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const email = session.customer_email ?? session.customer_details?.email;
      const subscriptionId = session.subscription as string | null;
      console.log(`[webhook] New subscriber: ${email} | subscription: ${subscriptionId}`);
      // TODO: persist to DB when added — for now the /payment/success cookie flow handles auth
      break;
    }

    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      const email = invoice.customer_email;
      console.log(`[webhook] Invoice paid: ${email} | amount: ${invoice.amount_paid}`);
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      console.log(`[webhook] Subscription cancelled: ${subscription.id} | customer: ${subscription.customer}`);
      // TODO: clear pro_email cookie / revoke access when DB is added
      break;
    }

    default:
      // Silently ignore other events
      break;
  }

  return NextResponse.json({ received: true });
}
