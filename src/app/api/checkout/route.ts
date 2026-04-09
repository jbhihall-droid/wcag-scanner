import { NextResponse } from "next/server";
import Stripe from "stripe";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export async function POST(request: Request) {
  // Capture A/B variant from query param (?ab=control|value) appended by PricingCard
  const url = new URL(request.url);
  const abVariant = url.searchParams.get("ab") ?? "unknown";

  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PRICE_ID) {
    // Stripe not yet configured — send the user back to the pricing section
    // with a query param so the page can show a "payment coming soon" notice.
    return NextResponse.redirect(`${BASE_URL}/?checkout=unavailable#pricing`, 303);
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-03-25.dahlia",
  });

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      success_url: `${BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}&ab=${abVariant}`,
      cancel_url: `${BASE_URL}/`,
      // Collect email at checkout — passed back in webhook via customer_email
      metadata: { ab_variant: abVariant, experiment_id: "pricing-cta-v1" },
    });

    return NextResponse.redirect(session.url!, 303);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
