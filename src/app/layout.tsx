import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WCAG Scanner — Free Accessibility Audit Tool",
  description: "Scan any public URL for WCAG accessibility violations. Free first-pass audit using axe-core. Built for developers and QA teams.",
  openGraph: {
    title: "WCAG Scanner — Free Accessibility Audit Tool",
    description: "Scan any public URL for WCAG accessibility violations. Free, fast, developer-friendly.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const umamiSrc = process.env.NEXT_PUBLIC_UMAMI_SRC;
  const umamiId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-slate-950 font-sans text-white antialiased">
        {children}
        {umamiSrc && umamiId && (
          <Script
            src={umamiSrc}
            data-website-id={umamiId}
            strategy="afterInteractive"
            defer
          />
        )}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
