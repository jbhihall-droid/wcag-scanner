"use client";

import { useEffect, useRef } from "react";

type Props = {
  used: number;
  limit: number;
  onClose: () => void;
};

export function UpgradeModal({ used, limit, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#0c1120] p-8 shadow-2xl shadow-black/60">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-slate-400 transition hover:text-white"
          aria-label="Close"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan-300">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-white">You&apos;ve hit the free limit</h2>
          <p className="mt-2 text-sm text-slate-400">
            {used} of {limit} free scans used today. Resets at midnight UTC.
          </p>
        </div>

        {/* Price */}
        <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-5 text-center">
          <div className="text-4xl font-bold text-white">
            $9<span className="text-lg font-normal text-slate-400">/mo</span>
          </div>
          <p className="mt-1 text-sm text-slate-400">Cancel anytime</p>
        </div>

        {/* Features */}
        <ul className="mb-6 space-y-3 text-sm text-slate-300">
          <li className="flex items-start gap-2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="mt-0.5 shrink-0 text-cyan-400">
              <path d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" />
            </svg>
            <span>Unlimited scans — no daily cap</span>
          </li>
          <li className="flex items-start gap-2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="mt-0.5 shrink-0 text-cyan-400">
              <path d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" />
            </svg>
            <span>Full export — download results as JSON or CSV</span>
          </li>
          <li className="flex items-start gap-2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="mt-0.5 shrink-0 text-cyan-400">
              <path d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" />
            </svg>
            <span>Scan history — revisit and compare past audits</span>
          </li>
          <li className="flex items-start gap-2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="mt-0.5 shrink-0 text-cyan-400">
              <path d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" />
            </svg>
            <span>Priority support via email</span>
          </li>
        </ul>

        {/* CTA */}
        <form action="/api/checkout" method="POST">
          <button
            type="submit"
            className="w-full rounded-2xl bg-cyan-400 py-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 active:scale-[0.98]"
          >
            Upgrade to Pro — $9/mo →
          </button>
        </form>

        <p className="mt-3 text-center text-xs text-slate-500">
          Secure payment via Stripe. You&apos;ll enter your email on the next page.
        </p>
      </div>
    </div>
  );
}
