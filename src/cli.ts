#!/usr/bin/env node

import { Command } from 'commander';
import { scrapeEmailsFromUrl, scrapeEmailsFromWebsite, scrapeEmailsFromPage } from './index';
import { createBrowser } from './utils/browserFactory';

const program = new Command();

program
  .name('email-scraper')
  .description('A CLI tool for scraping emails from webpages and websites')
  .version('1.0.0');

program
  .command('page')
  .description('Scrape emails from a single webpage')
  .argument('<url>', 'URL of the webpage to scrape')
  .option('-t, --timeout <ms>', 'Request timeout in milliseconds', '10000')
  .option('-b, --browser', 'Use headless browser (Playwright/Puppeteer) instead of HTTP requests', false)
  .option('--wait-until <event>', 'Wait until event (load, domcontentloaded, networkidle)', 'load')
  .action(async (url: string, options: { timeout: string; browser: boolean; waitUntil: string }) => {
    try {
      console.log(`Scraping emails from: ${url}`);
      
      let emails: Set<string>;
      
      if (options.browser) {
        console.log('Using headless browser...');
        const browser = await createBrowser();
        try {
          const page = await browser.newPage();
          emails = await scrapeEmailsFromPage(page, url, {
            timeout: parseInt(options.timeout, 10),
            waitUntil: options.waitUntil as 'load' | 'domcontentloaded' | 'networkidle',
          });
          await page.close();
        } finally {
          await browser.close();
        }
      } else {
        emails = await scrapeEmailsFromUrl(url, {
          timeout: parseInt(options.timeout, 10),
        });
      }

      if (emails.size === 0) {
        console.log('No emails found.');
      } else {
        console.log(`\nFound ${emails.size} unique email(s):\n`);
        Array.from(emails).sort().forEach((email) => console.log(`  ${email}`));
      }
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program
  .command('website')
  .description('Scrape emails from an entire website (crawls from homepage)')
  .argument('<url>', 'URL of the website homepage to start crawling from')
  .option('-d, --max-depth <number>', 'Maximum crawl depth', '3')
  .option('-p, --max-pages <number>', 'Maximum number of pages to crawl', '50')
  .option('--cross-domain', 'Allow crawling to different domains', false)
  .option('-b, --browser', 'Use headless browser (Playwright/Puppeteer) instead of HTTP requests', false)
  .option('--wait-until <event>', 'Wait until event (load, domcontentloaded, networkidle)', 'load')
  .action(async (url: string, options: { maxDepth: string; maxPages: string; crossDomain: boolean; browser: boolean; waitUntil: string }) => {
    try {
      console.log(`Crawling website starting from: ${url}`);
      console.log(`Max depth: ${options.maxDepth}, Max pages: ${options.maxPages}`);
      
      let browser: import('./types/browser').Browser | undefined;
      
      if (options.browser) {
        console.log('Using headless browser...');
        browser = await createBrowser();
      }
      
      try {
        const emails = await scrapeEmailsFromWebsite(url, {
          maxDepth: parseInt(options.maxDepth, 10),
          maxPages: parseInt(options.maxPages, 10),
          sameDomainOnly: !options.crossDomain,
          useBrowser: options.browser,
          browser,
          waitUntil: options.waitUntil as 'load' | 'domcontentloaded' | 'networkidle',
        });

        if (emails.size === 0) {
          console.log('\nNo emails found.');
        } else {
          console.log(`\nFound ${emails.size} unique email(s):\n`);
          Array.from(emails).sort().forEach((email) => console.log(`  ${email}`));
        }
      } finally {
        if (browser) {
          await browser.close();
        }
      }
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program.parse();

