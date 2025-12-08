import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Aegis-OSINT/);
  });

  test('should display categories', async ({ page }) => {
    await page.goto('/');
    const categories = page.locator('a[href^="/categories/"]');
    await expect(categories.first()).toBeVisible();
  });

  test('should navigate to categories page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Browse All Categories');
    await expect(page).toHaveURL(/\/categories/);
  });
});
