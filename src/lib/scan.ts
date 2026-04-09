import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
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

  const context = await browser.newContext();
  try {
    const page = await context.newPage();
    await page.setViewportSize({ width: 1440, height: 960 });

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45_000 });
    await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => undefined);

    // Inject axe-core from disk — avoids bundler mangling and eval serialization issues
    const axeSource = readFileSync(
      resolve(process.cwd(), "node_modules/axe-core/axe.js"),
      "utf-8"
    );
    await page.addScriptTag({ content: axeSource });
    const axeResult = await page.evaluate(
      () => (window as unknown as { axe: { run: () => Promise<{ violations: unknown[] }> } }).axe.run()
    );

    const violations = (axeResult.violations as ScanViolation[]) ?? [];

    return {
      url,
      violationCount: violations.length,
      violations,
      scannedAt: new Date().toISOString(),
    };
  } finally {
    await context.close();
    await browser.close();
  }
}
