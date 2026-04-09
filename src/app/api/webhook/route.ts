import { NextResponse } from "next/server";
import Stripe from "stripe";
import { grantPro, revokePro } from "@/lib/paywall";

// Next.js App Router — disable body parsing so we get the raw buffer for Stripe signature verification.
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const rawBody = await request.arrayBuffer();
  const sig = request.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET || !process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Missing signature or webhook secret." }, { status: 400 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-03-25.dahlia",
  });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      Buffer.from(rawBody),
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook verification failed.";
    console.error("[webhook] signature error:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  console.log(`[webhook] ${event.type}`);

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const email = session.customer_email ?? session.metadata?.email;
      if (email) grantPro(email);
      break;
    }

    case "invoice.paid": {
      // Recurring renewal — keep pro active.
      const invoice = event.data.object as Stripe.Invoice;
      const email = (invoice as { customer_email?: string }).customer_email;
      if (email) grantPro(email);
      break;
    }

    case "invoice.payment_failed":
    case "customer.subscription.deleted": {
      // Payment failed or subscription cancelled — drop to free.
      const obj = event.data.object as Stripe.Invoice | Stripe.Subscription;
      const email = (obj as { customer_email?: string }).customer_email;
      if (email) revokePro(email);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
