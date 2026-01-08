import { test, expect } from '@playwright/test';

test.describe('Security headers', () => {
  test('applies security headers on the homepage', async ({ page }) => {
    const response = await page.goto('/');

    expect(response).not.toBeNull();

    const headers = response!.headers();

    // Normalize header keys to lowercase for consistent checking
    const normalized: Record<string, string> = {};
    for (const [k, v] of Object.entries(headers)) {
      normalized[k.toLowerCase()] = v;
    }

    expect(normalized['content-security-policy']).toBeTruthy();
    expect(normalized['x-frame-options']).toBe('DENY');
    expect(normalized['x-content-type-options']).toBe('nosniff');
    expect(normalized['referrer-policy']).toBe('strict-origin-when-cross-origin');

    // HSTS will only be present when served over HTTPS in real deployments;
    // some local setups might omit it. If your local/server includes it:
    // expect(normalized['strict-transport-security']).toContain('max-age=');

    expect(normalized['permissions-policy']).toBeTruthy();
  });
});
