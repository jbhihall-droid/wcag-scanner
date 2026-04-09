import { NextResponse } from "next/server";
import { runAccessibilityScan } from "@/lib/scan";
import { checkPaywall, markUsed, extractIp, extractEmail } from "@/lib/paywall";

// Allow up to 60 s on Vercel Pro / Enterprise.
// Vercel Hobby hard-caps at 10 s — upgrade the project if scans timeout.
export const maxDuration = 60;

export async function POST(request: Request) {
  // ─── Paywall check ───────────────────────────────────────────────────────
  const ip = extractIp(request.headers);
  const email = extractEmail(request.headers);
  const gate = checkPaywall(ip, email);

  if (!gate.allowed) {
    return NextResponse.json(
      {
        error: "paywall_limit",
        used: gate.used,
        limit: gate.limit,
      },
      { status: 429 }
    );
  }

  // ─── Run scan ────────────────────────────────────────────────────────────
  try {
    const body = (await request.json()) as { url?: string };

    if (!body.url) {
      return NextResponse.json({ error: "Missing url in request body." }, { status: 400 });
    }

    const result = await runAccessibilityScan(body.url);

    // Only charge usage after a successful scan.
    if (!gate.isPro) {
      markUsed(ip);
    }

    return NextResponse.json({
      ...result,
      remaining: gate.isPro ? null : (gate.remaining ?? 0) - 1,
      isPro: gate.isPro,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Scan failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
