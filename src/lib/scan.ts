import { existsSync } from "node:fs";
import AxeBuilder from "@axe-core/playwright";
import chromium from "@sparticuz/chromium";
import { chromium as playwrightChromium } from "playwright-core";
import type { ScanResult, ScanViolation } from "@/lib/types";

const FALLBACK_CHROME_PATHS = [
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/google-chrome",
];

function normalizeUrl(input: string) {
  const trimmed = input.trim();
  if (!trimmed) throw new Error("Please enter a URL to scan.");

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  const url = new URL(withProtocol);

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Only http and https URLs are supported.");
  }

  return url.toString();
}

async function resolveExecutablePath() {
  if (process.env.CHROME_EXECUTABLE_PATH) return process.env.CHROME_EXECUTABLE_PATH;

  try {
    const path = await chromium.executablePath();
    if (path) return path;
  } catch {
    // ignore and fall back to local dev paths
  }

  const fallbackPath = FALLBACK_CHROME_PATHS.find((path) => existsSync(path));
  if (fallbackPath) return fallbackPath;

  throw new Error("No Chromium executable found. Set CHROME_EXECUTABLE_PATH for local development.");
}

export async function runAccessibilityScan(inputUrl: string): Promise<ScanResult> {
  const url = normalizeUrl(inputUrl);
  const executablePath = await resolveExecutablePath();

  const isLambda = !!process.env.AWS_LAMBDA_FUNCTION_NAME;
  const browser = await playwrightChromium.launch({
    executablePath,
    args: isLambda ? chromium.args : ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    headless: true,
  });

  try {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 960 },
    });

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45_000 });
    await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => undefined);

    const axeResult = await new AxeBuilder({ page }).analyze();

    const violations = (axeResult.violations as ScanViolation[]) ?? [];

    return {
      url,
      violationCount: violations.length,
      violations,
      scannedAt: new Date().toISOString(),
    };
  } finally {
    await browser.close();
  }
}
