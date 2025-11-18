import { Page } from '../types/browser';
import { extractAndNormalizeEmails } from '../utils/emailExtractor';

/**
 * Options for webpage scraping
 */
export interface WebpageScraperOptions {
  waitUntil?: 'load' | 'domcontentloaded' | 'networkidle';
  timeout?: number;
}

/**
 * Scrapes emails from a webpage using a browser page instance
 */
export async function scrapeEmailsFromPage(
  page: Page,
  url: string,
  options: WebpageScraperOptions = {}
): Promise<Set<string>> {
  const { waitUntil = 'load', timeout = 30000 } = options;

  try {
    await page.goto(url, {
      waitUntil,
      timeout,
    });

    const content = await page.content();
    return extractAndNormalizeEmails(content);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to scrape ${url}: ${error.message}`);
    }
    throw error;
  }
}

