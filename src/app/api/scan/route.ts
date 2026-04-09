import { NextResponse } from "next/server";
import { runAccessibilityScan } from "@/lib/scan";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { url?: string };

    if (!body.url) {
      return NextResponse.json({ error: "Missing url in request body." }, { status: 400 });
    }

    const result = await runAccessibilityScan(body.url);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Scan failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
