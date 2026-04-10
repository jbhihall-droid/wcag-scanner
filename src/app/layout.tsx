import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  description:
    "Scan any public URL for WCAG accessibility violations. Free first-pass audit using axe-core. Unlimited scans for $9/mo.",
  openGraph: {
    title: "WCAG Scanner — Free Accessibility Audit Tool",
    description:
      "Scan any public URL for WCAG accessibility violations. Free, fast, developer-friendly.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-slate-950 font-sans text-white antialiased">
        {children}
      </body>
    </html>
  );
}
