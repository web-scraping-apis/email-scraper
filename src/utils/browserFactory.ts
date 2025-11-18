import { Browser } from '../types/browser';

/**
 * Creates a browser instance using Playwright or Puppeteer (whichever is available)
 * Prefers Playwright if both are installed
 */
export async function createBrowser(): Promise<Browser> {
  // Try Playwright first
  try {
    // @ts-expect-error - Playwright is an optional peer dependency
    const playwright = await import('playwright');
    const browser = await playwright.chromium.launch();
    return browser as unknown as Browser;
  } catch (error) {
    // Playwright not available, try Puppeteer
  }

  // Try Puppeteer
  try {
    // @ts-expect-error - Puppeteer is an optional peer dependency
    const puppeteer = await import('puppeteer');
    const browser = await puppeteer.launch();
    return browser as unknown as Browser;
  } catch (error) {
    throw new Error(
      'No browser library found. Please install either playwright or puppeteer:\n' +
      '  npm install playwright\n' +
      '  or\n' +
      '  npm install puppeteer'
    );
  }
}

