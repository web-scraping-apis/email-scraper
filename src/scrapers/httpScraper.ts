import { extractAndNormalizeEmails } from '../utils/emailExtractor';

/**
 * Options for HTTP scraping
 */
export interface HttpScraperOptions {
  timeout?: number;
  headers?: Record<string, string>;
}

/**
 * Scrapes emails from a webpage using HTTP requests
 */
export async function scrapeEmailsFromUrl(
  url: string,
  options: HttpScraperOptions = {}
): Promise<Set<string>> {
  const { timeout = 10000, headers = {} } = options;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ...headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    return extractAndNormalizeEmails(html);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to scrape ${url}: ${error.message}`);
    }
    throw error;
  }
}

