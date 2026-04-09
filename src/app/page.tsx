import { ScanForm } from "@/components/scan-form";

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.2),_transparent_35%),linear-gradient(180deg,_#020617,_#111827)] text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center gap-12 px-6 py-16 sm:px-10">
        <div className="max-w-3xl space-y-6">
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
            This is an honest first-pass audit, not a legal compliance certification. Automated checks help you triage problems quickly, then validate fixes with manual testing.
          </p>
        </div>

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
