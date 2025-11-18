# email-scraper

A TypeScript library and CLI tool for scraping email addresses from webpages and entire websites. Supports both HTTP requests and headless browsers (Playwright/Puppeteer).

## Installation

```bash
npm install email-scraper
```

For browser support, also install one of:
```bash
npm install playwright
# or
npm install puppeteer
```

## CLI Usage

### Scrape emails from a single webpage

```bash
# Using HTTP requests (default)
npx email-scraper page https://example.com/contact

# Using headless browser
npx email-scraper page https://example.com/contact --browser
```

Options:
- `-t, --timeout <ms>` - Request timeout in milliseconds (default: 10000)
- `-b, --browser` - Use headless browser (Playwright/Puppeteer) instead of HTTP requests
- `--wait-until <event>` - Wait until event: `load`, `domcontentloaded`, or `networkidle` (default: `load`, browser mode only)

### Scrape emails from an entire website

```bash
# Using HTTP requests (default)
npx email-scraper website https://example.com

# Using headless browser
npx email-scraper website https://example.com --browser
```

Options:
- `-d, --max-depth <number>` - Maximum crawl depth (default: 3)
- `-p, --max-pages <number>` - Maximum number of pages to crawl (default: 50)
- `--cross-domain` - Allow crawling to different domains (default: false)
- `-b, --browser` - Use headless browser (Playwright/Puppeteer) instead of HTTP requests
- `--wait-until <event>` - Wait until event: `load`, `domcontentloaded`, or `networkidle` (default: `load`, browser mode only)

## Library Usage

### Basic HTTP Scraping

```typescript
import { scrapeEmailsFromUrl } from 'email-scraper';

const emails = await scrapeEmailsFromUrl('https://example.com/contact');
console.log(Array.from(emails));
```

### Using with Playwright

```typescript
import { chromium } from 'playwright';
import { scrapeEmailsFromPage } from 'email-scraper';

const browser = await chromium.launch();
const page = await browser.newPage();
const emails = await scrapeEmailsFromPage(page, 'https://example.com/contact');
await browser.close();
```

### Using with Puppeteer

```typescript
import puppeteer from 'puppeteer';
import { scrapeEmailsFromPage } from 'email-scraper';

const browser = await puppeteer.launch();
const page = await browser.newPage();
const emails = await scrapeEmailsFromPage(page, 'https://example.com/contact');
await browser.close();
```

### Crawling an Entire Website

```typescript
import { scrapeEmailsFromWebsite } from 'email-scraper';

const emails = await scrapeEmailsFromWebsite('https://example.com', {
  maxDepth: 3,
  maxPages: 50,
  sameDomainOnly: true,
  useBrowser: false, // Set to true if you want to use a browser
  browser: browserInstance, // Optional: pass browser instance
});
```

### Using the EmailScraper Class

```typescript
import { EmailScraper } from 'email-scraper';
import { chromium } from 'playwright';

// With browser
const browser = await chromium.launch();
const scraper = new EmailScraper(browser);
const emails = await scraper.scrapeFromWebsite('https://example.com');
await browser.close();

// Without browser (HTTP only)
const scraper = new EmailScraper();
const emails = await scraper.scrapeFromUrl('https://example.com/contact');
```

## API Reference

### Functions

- `scrapeEmailsFromUrl(url: string, options?: HttpScraperOptions): Promise<Set<string>>`
- `scrapeEmailsFromPage(page: Page, url: string, options?: WebpageScraperOptions): Promise<Set<string>>`
- `scrapeEmailsFromWebsite(url: string, options?: WebsiteCrawlerOptions): Promise<Set<string>>`
- `extractEmails(text: string): Set<string>`
- `normalizeEmail(email: string): string`

### Classes

- `EmailScraper` - Main scraper class with convenience methods

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run CLI in development
npm run dev page https://example.com
```

## License

MIT
