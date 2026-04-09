/**
 * paywall.ts — Serverless-safe freemium gate
 *
 * Pro tier: verified by `pro_email` cookie set on /payment/success
 *   after Stripe confirms the checkout session.
 *
 * Free tier: in-memory per-process rate limit (3 scans/day per IP).
 *   State resets on cold starts — acceptable for MVP traffic levels.
 *   Upgrade to Redis/Vercel KV for persistent enforcement post-launch.
 *
 * No filesystem I/O — safe for Vercel serverless functions.
 */

export const FREE_DAILY_LIMIT = 3;

// ─── In-memory free tier store ────────────────────────────────────────────────

type UsageEntry = { count: number; date: string };
const usageMap = new Map<string, UsageEntry>();

function today(): string {
  return new Date().toISOString().split("T")[0];
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type PaywallAllowed = {
  allowed: true;
  isPro: boolean;
  /** null = unlimited (pro). Number = scans left today. */
  remaining: number | null;
};

export type PaywallBlocked = {
  allowed: false;
  reason: "limit_reached";
  remaining: 0;
  used: number;
  limit: number;
};

export type PaywallResult = PaywallAllowed | PaywallBlocked;

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Check whether this request is allowed through the paywall.
 *
 * Pro: any request carrying a `pro_email` cookie is granted unlimited access.
 * The cookie is set by /payment/success after Stripe verifies the checkout.
 *
 * Free: tracked in-memory per IP, 3 scans per calendar day (UTC).
 */
export function checkPaywall(ip: string, email?: string | null): PaywallResult {
  if (email) {
    return { allowed: true, isPro: true, remaining: null };
  }

  const todayStr = today();
  const entry = usageMap.get(ip);
  const usedToday = entry && entry.date === todayStr ? entry.count : 0;

  if (usedToday >= FREE_DAILY_LIMIT) {
    return {
      allowed: false,
      reason: "limit_reached",
      remaining: 0,
      used: usedToday,
      limit: FREE_DAILY_LIMIT,
    };
  }

  return {
    allowed: true,
    isPro: false,
    remaining: FREE_DAILY_LIMIT - usedToday,
  };
}

/**
 * Record one unit of usage for this IP.
 * Call this after the gated action succeeds.
 */
export function markUsed(ip: string): void {
  const todayStr = today();
  const entry = usageMap.get(ip);

  if (!entry || entry.date !== todayStr) {
    usageMap.set(ip, { count: 1, date: todayStr });
  } else {
    entry.count += 1;
  }
}

/**
 * No-op in serverless mode.
 * Pro access is granted via the `pro_email` cookie set by /payment/success,
 * not a server-side store lookup.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function grantPro(_email: string): void {}

/** No-op in serverless mode. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function revokePro(_email: string): void {}

/** How many free scans has this IP used today? */
export function usageToday(ip: string): number {
  const entry = usageMap.get(ip);
  const todayStr = today();
  return entry && entry.date === todayStr ? entry.count : 0;
}

// ─── Header helpers ───────────────────────────────────────────────────────────

/**
 * Extract the best IP from a Next.js request.
 * Pass `request.headers` from route handlers.
 */
export function extractIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const real = headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

/** Extract the pro-user email from the session cookie, if present. */
export function extractEmail(headers: Headers): string | null {
  const cookie = headers.get("cookie") ?? "";
  const match = cookie.match(/pro_email=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}
