import { cookies } from "next/headers";
import Link from "next/link";

export default async function PaymentSuccess({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  let email: string | null = null;

  if (session_id && process.env.STRIPE_SECRET_KEY) {
    try {
      const { default: Stripe } = await import("stripe");
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2026-03-25.dahlia",
      });
      const session = await stripe.checkout.sessions.retrieve(session_id);
      email = session.customer_email;
    } catch {
      // non-critical — user is still pro via webhook
    }
  }

  // Set a persistent pro_email cookie so future requests bypass the paywall.
  if (email) {
    const cookieStore = await cookies();
    cookieStore.set("pro_email", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
    });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,_#020617,_#111827)] px-6 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-10 text-center shadow-2xl shadow-black/40">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan-300">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h1 className="text-3xl font-semibold">You&apos;re all set</h1>
        <p className="mt-3 text-slate-300">
          {email ? (
            <>Pro access granted to <strong className="text-white">{email}</strong>.</>
          ) : (
            "Your Pro access is now active."
          )}
        </p>
        <p className="mt-2 text-sm text-slate-400">
          Unlimited scans, full exports, and scan history are now unlocked.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-cyan-400 py-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
        >
          Start scanning →
        </Link>
      </div>
    </main>
  );
}
