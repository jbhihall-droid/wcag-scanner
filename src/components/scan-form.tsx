"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ScanForm({ ctaLabel = "Scan my site" }: { ctaLabel?: string }) {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <form
      className="flex w-full flex-col gap-3 rounded-3xl border border-white/10 bg-slate-950/70 p-4 shadow-2xl shadow-cyan-950/20 sm:flex-row"
      onSubmit={(event) => {
        event.preventDefault();
        if (!url.trim()) return;
        setIsSubmitting(true);
        router.push(`/results?url=${encodeURIComponent(url.trim())}`);
      }}
    >
      <label className="sr-only" htmlFor="scan-url">
        Website URL
      </label>
      <input
        id="scan-url"
        type="url"
        inputMode="url"
        placeholder="https://example.com"
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        className="min-h-14 flex-1 rounded-2xl border border-white/10 bg-white px-4 text-base text-slate-950 outline-none ring-0 placeholder:text-slate-400 focus:border-cyan-400"
        required
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="min-h-14 rounded-2xl bg-cyan-400 px-6 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-cyan-200"
      >
        {isSubmitting ? "Preparing scan..." : ctaLabel}
      </button>
    </form>
  );
}
