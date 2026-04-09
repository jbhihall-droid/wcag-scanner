import { NextRequest, NextResponse } from "next/server";
import { CRO_COOKIE, CRO_EXPERIMENT_ID, VariantKey } from "@/lib/cro-constants";

function chooseVariant(request: NextRequest): VariantKey {
  const existing = request.cookies.get(CRO_COOKIE)?.value;
  if (existing === "control" || existing === "value") {
    return existing;
  }

  const seed = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? request.headers.get("user-agent") ?? Math.random().toString();
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 2 === 0 ? "control" : "value";
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const variant = chooseVariant(request);

  if (!request.cookies.get(CRO_COOKIE)) {
    response.cookies.set(CRO_COOKIE, variant, {
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 14,
      path: "/",
    });
  }

  response.headers.set("x-wcag-experiment", CRO_EXPERIMENT_ID);
  response.headers.set("x-wcag-variant", variant);
  return response;
}

export const config = {
  matcher: ["/", "/pricing", "/results/:path*", "/api/checkout"],
};
