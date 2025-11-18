# email-scraper

A TypeScript library and CLI tool for scraping email addresses from webpages and entire websites. Supports both HTTP requests and headless browsers (Playwright/Puppeteer).

## Installation

1. Clone this repository:
```bash
git clone https://github.com/web-scraping-apis/email-scraper
cd email-scraper
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

For browser support, also install one of:
```bash
npm install playwright
# or
npm install puppeteer
```

If using Playwright, install the browser binaries:
```bash
npx playwright install chromium
```

## CLI Usage

### Scrape emails from a single webpage

```bash
# Using HTTP requests (default)
npm run dev page https://example.com/contact

# Using headless browser
npm run dev page https://example.com/contact --browser

# After building, you can also use:
npm run scrape page https://example.com/contact
```

Options:
- `-t, --timeout <ms>` - Request timeout in milliseconds (default: 10000)
- `-b, --browser` - Use headless browser (Playwright/Puppeteer) instead of HTTP requests
- `--wait-until <event>` - Wait until event: `load`, `domcontentloaded`, or `networkidle` (default: `load`, browser mode only)

### Scrape emails from an entire website

```bash
# Using HTTP requests (default)
npm run dev website https://example.com

# Using headless browser
npm run dev website https://example.com --browser

# After building, you can also use:
npm run scrape website https://example.com
```

Options:
- `-d, --max-depth <number>` - Maximum crawl depth (default: 3)
- `-p, --max-pages <number>` - Maximum number of pages to crawl (default: 50)
- `--cross-domain` - Allow crawling to different domains (default: false)
- `-b, --browser` - Use headless browser (Playwright/Puppeteer) instead of HTTP requests
- `--wait-until <event>` - Wait until event: `load`, `domcontentloaded`, or `networkidle` (default: `load`, browser mode only)

## Library Usage

You can also import and use the scraper functions in your own TypeScript/JavaScript projects:

### Basic HTTP Scraping

```typescript
import { scrapeEmailsFromUrl } from './src/index';

const emails = await scrapeEmailsFromUrl('https://example.com/contact');
console.log(Array.from(emails));
```

### Using with Playwright

```typescript
import { chromium } from 'playwright';
import { scrapeEmailsFromPage } from './src/index';

const browser = await chromium.launch();
const page = await browser.newPage();
const emails = await scrapeEmailsFromPage(page, 'https://example.com/contact');
await browser.close();
```

### Using with Puppeteer

```typescript
import puppeteer from 'puppeteer';
import { scrapeEmailsFromPage } from './src/index';

const browser = await puppeteer.launch();
const page = await browser.newPage();
const emails = await scrapeEmailsFromPage(page, 'https://example.com/contact');
await browser.close();
```

### Crawling an Entire Website

```typescript
import { scrapeEmailsFromWebsite } from './src/index';

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
import { EmailScraper } from './src/index';
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

**Note:** After building (`npm run build`), you can import from `./dist/index` instead of `./src/index`.

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

# Build TypeScript to JavaScript
npm run build

# Run CLI in development mode (uses ts-node, no build needed)
npm run dev page https://example.com
npm run dev website https://example.com

# Run CLI after building (uses compiled JavaScript)
npm run scrape page https://example.com
npm run scrape website https://example.com
```

## License

MIT
