import tlds from 'tlds';

/**
 * Creates a Set of TLDs for fast lookup
 */
const tldSet = new Set(tlds.map(tld => tld.toLowerCase()));

/**
 * Extracts and validates the TLD from an email address
 * Handles multi-part TLDs like .co.uk, .com.au, etc.
 */
function hasValidTld(email: string): boolean {
  const parts = email.split('@');
  if (parts.length !== 2) return false;
  
  const domain = parts[1].toLowerCase();
  const domainParts = domain.split('.');
  
  if (domainParts.length < 2) return false;
  
  // Check single TLD (e.g., .com, .org)
  const lastPart = domainParts[domainParts.length - 1];
  if (tldSet.has(lastPart)) {
    return true;
  }
  
  // Check two-part TLD (e.g., .co.uk, .com.au)
  if (domainParts.length >= 3) {
    const twoPartTld = domainParts.slice(-2).join('.');
    if (tldSet.has(twoPartTld)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Extracts email addresses from a given text string using regex
 */
export function extractEmails(text: string): Set<string> {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const matches = text.match(emailRegex);
  if (!matches) return new Set();
  
  // Filter out emails with invalid TLDs
  const validEmails = matches.filter(hasValidTld);
  return new Set(validEmails);
}

/**
 * Normalizes email addresses (lowercase, trim)
 */
export function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

/**
 * Extracts and normalizes emails from text, filtering out invalid TLDs
 */
export function extractAndNormalizeEmails(text: string): Set<string> {
  const emails = extractEmails(text);
  return new Set(Array.from(emails).map(normalizeEmail));
}

