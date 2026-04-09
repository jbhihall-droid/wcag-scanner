"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { ScanResult, ScanViolation, Severity } from "@/lib/types";

const severityOrder: Severity[] = ["critical", "serious", "moderate", "minor"];

const severityStyles: Record<Severity, string> = {
  critical: "border-rose-500/30 bg-rose-500/10 text-rose-200",
  serious: "border-orange-500/30 bg-orange-500/10 text-orange-200",
  moderate: "border-amber-500/30 bg-amber-500/10 text-amber-200",
  minor: "border-sky-500/30 bg-sky-500/10 text-sky-200",
};

export function ResultsClient({ url }: { url: string }) {
  const [data, setData] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function runScan() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });

        const payload = (await response.json()) as ScanResult & { error?: string };

        if (!response.ok) {
          throw new Error(payload.error || "Scan failed.");
        }

        if (!cancelled) {
          setData(payload);
        }
      } catch (scanError) {
        if (!cancelled) {
          setError(scanError instanceof Error ? scanError.message : "Scan failed.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void runScan();
    return () => {
      cancelled = true;
    };
  }, [url]);

  const groupedViolations = useMemo(() => {
    const grouped = new Map<Severity, ScanViolation[]>();

    for (const severity of severityOrder) {
      grouped.set(severity, []);
    }

    for (const violation of data?.violations ?? []) {
      const severity = violation.impact ?? "minor";
      if (grouped.has(severity)) {
        grouped.get(severity)?.push(violation);
      }
    }

    return grouped;
  }, [data]);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-6 py-10 text-white sm:px-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Accessibility scan results</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">First-pass audit for {url}</h1>
          <p className="mt-3 max-w-3xl text-sm text-slate-300 sm:text-base">
            This catches automated WCAG issues quickly. It is helpful for triage, but it is not a legal certification or full manual accessibility audit.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-cyan-300 hover:text-cyan-200"
        >
          Scan another site
        </Link>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <div className="flex items-center gap-3 text-lg font-medium text-cyan-200">
            <span className="h-3 w-3 animate-pulse rounded-full bg-cyan-300" />
            Running axe-core and collecting violations...
          </div>
          <p className="mt-3 text-sm text-slate-300">Large or script-heavy pages can take a little longer.</p>
        </div>
      ) : null}

      {error ? (
        <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-8 text-rose-100">
          <h2 className="text-xl font-semibold">Scan failed</h2>
          <p className="mt-2 text-sm text-rose-100/90">{error}</p>
        </div>
      ) : null}

      {data ? (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <SummaryCard label="Violations" value={String(data.violationCount)} />
            {severityOrder.map((severity) => (
              <SummaryCard
                key={severity}
                label={severity}
                value={String(groupedViolations.get(severity)?.length ?? 0)}
              />
            ))}
          </section>

          <section className="space-y-6">
            {severityOrder.map((severity) => {
              const violations = groupedViolations.get(severity) ?? [];
              if (!violations.length) return null;

              return (
                <div key={severity} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold capitalize">{severity}</h2>
                    <span className={`rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] ${severityStyles[severity]}`}>
                      {violations.length} issue{violations.length === 1 ? "" : "s"}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {violations.map((violation) => (
                      <ViolationCard key={`${severity}-${violation.id}`} violation={violation} severity={severity} />
                    ))}
                  </div>
                </div>
              );
            })}
          </section>
        </>
      ) : null}
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <div className="text-sm uppercase tracking-[0.18em] text-slate-400">{label}</div>
      <div className="mt-3 text-3xl font-semibold text-white">{value}</div>
    </div>
  );
}

function ViolationCard({ violation, severity }: { violation: ScanViolation; severity: Severity }) {
  return (
    <article className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-lg shadow-black/20">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">{violation.help}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">{violation.description}</p>
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] ${severityStyles[severity]}`}>
          {severity}
        </span>
      </div>

      <div className="mt-5 space-y-4">
        {violation.nodes.map((node, index) => (
          <div key={`${violation.id}-${index}`} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs uppercase tracking-[0.16em] text-slate-400">Element selector</div>
            <code className="mt-2 block overflow-x-auto rounded-xl bg-slate-950 px-3 py-2 text-sm text-cyan-200">
              {node.target.join(", ")}
            </code>
            <div className="mt-4 text-xs uppercase tracking-[0.16em] text-slate-400">Failure summary</div>
            <p className="mt-2 text-sm leading-6 text-slate-300">{node.failureSummary || "No summary returned by axe-core."}</p>
          </div>
        ))}
      </div>

      <a
        href={violation.helpUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-5 inline-flex text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
      >
        Read remediation guidance
      </a>
    </article>
  );
}
