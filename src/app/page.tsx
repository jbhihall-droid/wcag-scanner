import { ScanForm } from "@/components/scan-form";

const PAYMENT_LINK = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK ?? "#pricing";

export default function Home() {
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
            Paste a URL, get a full WCAG violation report in seconds. Free for one scan. Unlimited scans for $9/mo.
          </p>
          <ScanForm ctaLabel="Scan now — it&apos;s free" />
        </div>

        {/* Pricing */}
        <section id="pricing" className="space-y-6">
          <h2 className="text-2xl font-semibold text-center">Want unlimited scans?</h2>
          <div className="rounded-3xl border border-cyan-400/40 bg-cyan-400/5 p-8 flex flex-col gap-6 shadow-lg shadow-cyan-400/10">
            <div>
              <div className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">Unlimited</div>
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
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="mt-0.5 shrink-0 text-cyan-400">
                    <path d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" />
                  </svg>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <a
              href={PAYMENT_LINK}
              className="block w-full rounded-2xl bg-cyan-400 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 active:scale-[0.98]"
            >
              Buy unlimited scans →
            </a>
          </div>
        </section>

        <footer className="text-center text-xs text-slate-500">
          © {new Date().getFullYear()} WCAG Scanner — Built for developers who care about accessibility.
        </footer>
      </div>
    </main>
  );
}
