/**
 * Browser interface abstraction for Playwright and Puppeteer compatibility
 */
export interface Browser {
  newPage(): Promise<Page>;
  close(): Promise<void>;
}

export interface Page {
  goto(url: string, options?: { waitUntil?: string; timeout?: number }): Promise<void>;
  content(): Promise<string>;
  evaluate<T>(fn: () => T): Promise<T>;
  close(): Promise<void>;
}

/**
 * Browser factory type for creating browser instances
 */
export type BrowserFactory = () => Promise<Browser>;

