"use client";

import { useState } from "react";
import { ScanForm } from "@/components/scan-form";

const SOLO_PAYMENT_LINK = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK ?? "#pricing";
const TEAM_PAYMENT_LINK = process.env.NEXT_PUBLIC_STRIPE_TEAM_PAYMENT_LINK ?? "#pricing";
const LTD_PAYMENT_LINK = process.env.NEXT_PUBLIC_STRIPE_LTD_PAYMENT_LINK ?? "#pricing";

const CHECK_ICON = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="mt-0.5 shrink-0 text-cyan-400">
    <path d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" />
  </svg>
);

const EMERALD_CHECK = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="mt-0.5 shrink-0 text-emerald-400">
    <path d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" />
  </svg>
);

const AMBER_CHECK = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="mt-0.5 shrink-0 text-amber-400">
    <path d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" />
  </svg>
);

// Flash LTD: limited to first 50 buyers. Update LTD_SPOTS_REMAINING in env or hardcode to create urgency.
const LTD_SPOTS_REMAINING = parseInt(process.env.NEXT_PUBLIC_LTD_SPOTS_REMAINING ?? "50");

export default function Home() {
  const [plan, setPlan] = useState<"solo" | "team" | "lifetime">("solo");

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.2),_transparent_35%),linear-gradient(180deg,_#020617,_#111827)] text-white">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-16 px-6 py-20 sm:px-10">

        {/* Hero */}
        <div id="scan" className="space-y-6">
          <div className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] text-cyan-200">
            Free WCAG scan — pay for unlimited
          </div>
          <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
            Instant accessibility audit for any URL.
          </h1>
          <p className="text-lg leading-8 text-slate-300">
            Paste a URL, get a full WCAG violation report in seconds. Free for one scan. Unlimited scans from $9/mo.
          </p>
          <ScanForm ctaLabel="Scan now — it&apos;s free" />
        </div>

        {/* Pricing */}
        <section id="pricing" className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-semibold">Want unlimited scans?</h2>
            {/* Flash LTD banner */}
            <p className="text-sm text-amber-400/90 font-medium">
              Flash deal: Lifetime access for $49 — {LTD_SPOTS_REMAINING} spots left
            </p>
          </div>

          {/* Plan toggle */}
          <div className="flex justify-center">
            <div className="inline-flex rounded-full border border-slate-700 bg-slate-800/60 p-1 text-sm font-medium">
              <button
                onClick={() => setPlan("solo")}
                className={`rounded-full px-5 py-2 transition ${
                  plan === "solo"
                    ? "bg-cyan-400 text-slate-950 shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Solo
              </button>
              <button
                onClick={() => setPlan("team")}
                className={`rounded-full px-5 py-2 transition ${
                  plan === "team"
                    ? "bg-cyan-400 text-slate-950 shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Team
                <span className="ml-2 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                  New
                </span>
              </button>
              <button
                onClick={() => setPlan("lifetime")}
                className={`rounded-full px-5 py-2 transition ${
                  plan === "lifetime"
                    ? "bg-amber-400 text-slate-950 shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Lifetime
                <span className="ml-2 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-400">
                  Deal
                </span>
              </button>
            </div>
          </div>

          {/* Solo plan */}
          {plan === "solo" && (
            <div className="rounded-3xl border border-cyan-400/40 bg-cyan-400/5 p-8 flex flex-col gap-6 shadow-lg shadow-cyan-400/10">
              <div>
                <div className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">Solo — Unlimited</div>
                <div className="mt-2 flex items-end gap-1">
                  <span className="text-4xl font-bold text-white">$9</span>
                  <span className="text-slate-400 mb-1">/mo</span>
                </div>
                <p className="mt-2 text-sm text-slate-400">One plan. Unlimited audits. Cancel any time.</p>
              </div>
              <ul className="space-y-3">
                {[
                  "Unlimited scans — no daily limits",
                  "Full violation detail with selector targets",
                  "Severity breakdown (critical, serious, moderate)",
                  "No signup, no onboarding — just pay and scan",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                    {CHECK_ICON}
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href={SOLO_PAYMENT_LINK}
                className="block w-full rounded-2xl bg-cyan-400 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 active:scale-[0.98]"
              >
                Buy unlimited scans →
              </a>
            </div>
          )}

          {/* Team plan */}
          {plan === "team" && (
            <div className="rounded-3xl border border-emerald-400/40 bg-emerald-400/5 p-8 flex flex-col gap-6 shadow-lg shadow-emerald-400/10">
              <div>
                <div className="flex items-center gap-3">
                  <div className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">Team — 3 Seats</div>
                  <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                    Best value
                  </span>
                </div>
                <div className="mt-2 flex items-end gap-1">
                  <span className="text-4xl font-bold text-white">$29</span>
                  <span className="text-slate-400 mb-1">/mo</span>
                </div>
                <p className="mt-2 text-sm text-slate-400">
                  3 seats included. That&apos;s <span className="text-emerald-400 font-medium">$9.67/seat</span> — same price as solo, but your whole team is covered.
                </p>
              </div>
              <ul className="space-y-3">
                {[
                  "3 team seats — each with their own unlimited scans",
                  "Full violation detail with selector targets",
                  "Severity breakdown (critical, serious, moderate)",
                  "Shared billing — one invoice for the whole team",
                  "Perfect for dev + designer + QA trios",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                    {EMERALD_CHECK}
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href={TEAM_PAYMENT_LINK}
                className="block w-full rounded-2xl bg-emerald-400 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 active:scale-[0.98]"
              >
                Upgrade to Team →
              </a>
              <p className="text-center text-xs text-slate-500">
                Need more than 3 seats?{" "}
                <a href="mailto:hello@wcag-scanner.com" className="text-slate-400 underline underline-offset-2 hover:text-white">
                  Contact us for a custom plan.
                </a>
              </p>
            </div>
          )}

          {/* Lifetime plan */}
          {plan === "lifetime" && (
            <div className="rounded-3xl border border-amber-400/40 bg-amber-400/5 p-8 flex flex-col gap-6 shadow-lg shadow-amber-400/10">
              <div>
                <div className="flex items-center gap-3">
                  <div className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">Lifetime — Solo</div>
                  <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-amber-400">
                    Flash deal
                  </span>
                </div>
                <div className="mt-2 flex items-end gap-2">
                  <span className="text-4xl font-bold text-white">$49</span>
                  <span className="text-slate-500 mb-1 line-through text-lg">$108/yr</span>
                  <span className="text-amber-400 mb-1 text-sm font-medium">one-time</span>
                </div>
                <p className="mt-2 text-sm text-slate-400">
                  Pay once, scan forever. Equivalent to <span className="text-amber-400 font-medium">5.4 months</span> of the monthly plan — everything after that is free.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-2 flex-1 rounded-full bg-slate-700">
                    <div
                      className="h-2 rounded-full bg-amber-400 transition-all"
                      style={{ width: `${Math.round(((50 - LTD_SPOTS_REMAINING) / 50) * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-amber-400 font-medium whitespace-nowrap">
                    {LTD_SPOTS_REMAINING} of 50 left
                  </span>
                </div>
              </div>
              <ul className="space-y-3">
                {[
                  "Unlimited scans — forever, no recurring charge",
                  "Full violation detail with selector targets",
                  "Severity breakdown (critical, serious, moderate)",
                  "All future features included at no extra cost",
                  "Priority support via email",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                    {AMBER_CHECK}
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href={LTD_PAYMENT_LINK}
                className="block w-full rounded-2xl bg-amber-400 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-amber-300 active:scale-[0.98]"
              >
                Get lifetime access — $49 →
              </a>
              <p className="text-center text-xs text-slate-500">
                First 50 buyers only. No coupon needed — price shown is the deal price.
              </p>
            </div>
          )}
        </section>

        <footer className="text-center text-xs text-slate-500">
          © {new Date().getFullYear()} WCAG Scanner — Built for developers who care about accessibility.
        </footer>
      </div>
    </main>
  );
}
