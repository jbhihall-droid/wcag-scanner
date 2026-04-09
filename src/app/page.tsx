import { ScanForm } from "@/components/scan-form";
import { EmailCapture } from "@/components/email-capture";

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.2),_transparent_35%),linear-gradient(180deg,_#020617,_#111827)] text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-6 py-16 sm:px-10">

        {/* Hero */}
        <div className="max-w-3xl space-y-6 pt-8">
          <div className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] text-cyan-200">
            First-pass WCAG audit for growing teams
          </div>
          <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
            Know exactly what&apos;s breaking your site&apos;s accessibility
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
            Scan any public URL, surface the most important axe-core violations, and get a clean issue list your team can act on fast.
          </p>
          <ScanForm />
          <p className="text-sm leading-6 text-slate-400">
            Honest first-pass audit — not a legal compliance certification. Automated checks help you triage fast, then validate with manual testing.
          </p>
        </div>

        {/* Features */}
        <section className="grid gap-4 sm:grid-cols-3">
          <FeatureCard
            title="Developer-friendly output"
            body="See severity, selector targets, and remediation links without digging through raw browser tooling."
          />
          <FeatureCard
            title="Built for fast triage"
            body="Spot critical and serious accessibility blockers first, then prioritize the rest with confidence."
          />
          <FeatureCard
            title="Serverless-ready scanner"
            body="Uses Chromium packaging that plays nicely with Vercel deployments and modern Next.js APIs."
          />
        </section>

        {/* Pricing */}
        <section id="pricing" className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Simple pricing</h2>
            <p className="text-slate-400">Start free. Upgrade when you need more.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 max-w-3xl mx-auto">
            <PricingCard
              tier="Free"
              price="$0"
              period=""
              description="For developers exploring accessibility issues"
              features={[
                "3 scans per day",
                "Full violation details",
                "Severity breakdown",
                "Remediation links",
              ]}
              cta="Start scanning"
              ctaHref="/#scan"
              highlight={false}
            />
            <PricingCard
              tier="Pro"
              price="$9"
              period="/mo"
              description="For teams shipping accessible products"
              features={[
                "Unlimited scans",
                "Export results as JSON or CSV",
                "Scan history — compare over time",
                "Priority email support",
              ]}
              cta="Upgrade to Pro"
              ctaHref="/api/checkout"
              ctaPost={true}
              highlight={true}
            />
          </div>
        </section>

        {/* Email capture */}
        <section className="rounded-3xl border border-white/10 bg-white/5 px-8 py-12 text-center space-y-5 max-w-2xl mx-auto w-full">
          <h2 className="text-2xl font-semibold">Stay updated</h2>
          <p className="text-slate-400 text-sm">Get notified when new features ship — export, history, API access, and more.</p>
          <EmailCapture />
        </section>

        <footer className="pb-8 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} WCAG Scanner. Built for developers who care about accessibility.
        </footer>
      </div>
    </main>
  );
}

function FeatureCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-300">{body}</p>
    </div>
  );
}

function PricingCard({
  tier,
  price,
  period,
  description,
  features,
  cta,
  ctaHref,
  ctaPost,
  highlight,
}: {
  tier: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  ctaHref: string;
  ctaPost?: boolean;
  highlight: boolean;
}) {
  return (
    <div
      className={`rounded-3xl border p-8 flex flex-col gap-6 ${
        highlight
          ? "border-cyan-400/40 bg-cyan-400/5 shadow-lg shadow-cyan-400/10"
          : "border-white/10 bg-white/5"
      }`}
    >
      <div>
        <div className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">{tier}</div>
        <div className="mt-2 flex items-end gap-1">
          <span className="text-4xl font-bold text-white">{price}</span>
          {period && <span className="text-slate-400 mb-1">{period}</span>}
        </div>
        <p className="mt-2 text-sm text-slate-400">{description}</p>
      </div>

      <ul className="space-y-3 flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="mt-0.5 shrink-0 text-cyan-400">
              <path d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" />
            </svg>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {ctaPost ? (
        <form action={ctaHref} method="POST">
          <button
            type="submit"
            className="w-full rounded-2xl bg-cyan-400 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 active:scale-[0.98]"
          >
            {cta} →
          </button>
        </form>
      ) : (
        <a
          href={ctaHref}
          className={`block w-full rounded-2xl py-3 text-center text-sm font-semibold transition active:scale-[0.98] ${
            highlight
              ? "bg-cyan-400 text-slate-950 hover:bg-cyan-300"
              : "border border-white/20 text-white hover:border-cyan-400/40 hover:text-cyan-200"
          }`}
        >
          {cta}
        </a>
      )}
    </div>
  );
}
