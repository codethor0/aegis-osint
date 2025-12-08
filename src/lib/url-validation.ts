/**
 * URL validation and sanitization utilities
 * Ensures only safe URLs are rendered in the application
 */

/**
 * Check if a URL is valid and uses an allowed protocol
 * @param url - The URL string to validate
 * @returns true if the URL is valid and uses http/https, false otherwise
 */
export function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  try {
    const parsed = new URL(url);
    const allowedProtocols = ['http:', 'https:'];
    return allowedProtocols.includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * Sanitize a URL by validating it and returning null if invalid
 * @param url - The URL string to sanitize
 * @returns The URL if valid, null otherwise
 */
export function sanitizeUrl(url: string): string | null {
  if (!url || typeof url !== 'string') {
    return null;
  }

  return isValidUrl(url) ? url : null;
}

/**
 * Validate an array of URLs
 * @param urls - Array of URL strings to validate
 * @returns Array of valid URLs only
 */
export function validateUrls(urls: string[]): string[] {
  if (!Array.isArray(urls)) {
    return [];
  }

  return urls.filter((url) => isValidUrl(url));
}
