"use client";

import { useSearchParams } from "next/navigation";

export function CheckoutBanner() {
  const searchParams = useSearchParams();
  if (searchParams.get("checkout") !== "unavailable") return null;

  return (
    <div className="max-w-3xl mx-auto rounded-2xl border border-amber-400/20 bg-amber-400/10 px-6 py-4 text-center text-sm text-amber-200">
      Pro checkout is coming soon. Leave your email below and we&apos;ll notify you the moment it&apos;s live.
    </div>
  );
}
