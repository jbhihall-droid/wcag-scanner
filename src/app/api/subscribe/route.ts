import { NextResponse } from "next/server";

// Simple email capture — stores to a local JSON file on the server.
// On Vercel, swap this for a Resend audience, Mailchimp, or KV store.
import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

const SUBSCRIBERS_PATH = join("/tmp", "wcag-subscribers.json");

function loadSubscribers(): string[] {
  try {
    if (existsSync(SUBSCRIBERS_PATH)) {
      return JSON.parse(readFileSync(SUBSCRIBERS_PATH, "utf-8")) as string[];
    }
  } catch {
    // ignore
  }
  return [];
}

function saveSubscribers(list: string[]): void {
  try {
    writeFileSync(SUBSCRIBERS_PATH, JSON.stringify(list));
  } catch {
    // non-fatal
  }
}

export async function POST(request: Request) {
  let email: string;
  try {
    const body = (await request.json()) as { email?: string };
    email = (body.email ?? "").trim().toLowerCase();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email." }, { status: 400 });
  }

  // Log to stdout so Vercel function logs capture it
  console.log(`[subscribe] new subscriber: ${email}`);

  const subscribers = loadSubscribers();
  if (!subscribers.includes(email)) {
    subscribers.push(email);
    saveSubscribers(subscribers);
  }

  // If Resend is configured, also add to audience
  if (process.env.RESEND_API_KEY) {
    try {
      await fetch("https://api.resend.com/audiences/" + (process.env.RESEND_AUDIENCE_ID ?? "") + "/contacts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, unsubscribed: false }),
      });
    } catch {
      // non-fatal — local list still captured it
    }
  }

  return NextResponse.json({ ok: true });
}
