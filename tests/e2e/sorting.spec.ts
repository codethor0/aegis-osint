import { test, expect } from '@playwright/test';

function isSortedAscending(values: string[]): boolean {
  const normalized = values.map((v) => v.toLowerCase().trim());
  const sorted = [...normalized].sort((a, b) => a.localeCompare(b));
  return normalized.every((v, i) => v === sorted[i]);
}

function isSortedDescending(values: string[]): boolean {
  const normalized = values.map((v) => v.toLowerCase().trim());
  const sorted = [...normalized].sort((a, b) => b.localeCompare(a));
  return normalized.every((v, i) => v === sorted[i]);
}

async function getVisibleResourceTitles(page: import('@playwright/test').Page) {
  const cards = page.getByTestId('resource-card');
  const count = await cards.count();
  const titles: string[] = [];

  for (let i = 0; i < count; i++) {
    const title = await cards.nth(i).getByTestId('resource-card-title').innerText();
    titles.push(title.trim());
  }

  return titles;
}

test.describe('OSINT sorting', () => {
  test('sorts resources by name ascending', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.getByTestId('search-input');
    await searchInput.fill('people');
    await page.getByTestId('search-submit').click();

    await page.waitForURL(/\/search\?q=people/);

    const baselineTitles = await getVisibleResourceTitles(page);
    expect(baselineTitles.length).toBeGreaterThan(1);

    const sortControls = page.getByTestId('sort-controls');
    await expect(sortControls).toBeVisible();

    const sortSelect = page.getByTestId('sort-select');
    await sortSelect.selectOption('name');

    await page.waitForURL(/sort=name/);

    const orderSelect = page.getByTestId('sort-order');
    await expect(orderSelect).toBeVisible();
    await orderSelect.selectOption('asc');

    await page.waitForURL(/order=asc/);

    const ascTitles = await getVisibleResourceTitles(page);
    expect(ascTitles.length).toBeGreaterThan(1);
    expect(isSortedAscending(ascTitles)).toBe(true);
  });

  test('sorts resources by name descending', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.getByTestId('search-input');
    await searchInput.fill('people');
    await page.getByTestId('search-submit').click();

    await page.waitForURL(/\/search\?q=people/);

    const sortControls = page.getByTestId('sort-controls');
    await expect(sortControls).toBeVisible();

    const sortSelect = page.getByTestId('sort-select');
    await sortSelect.selectOption('name');

    await page.waitForURL(/sort=name/);

    const orderSelect = page.getByTestId('sort-order');
    await expect(orderSelect).toBeVisible();
    await orderSelect.selectOption('desc');

    await page.waitForURL(/order=desc/);

    const descTitles = await getVisibleResourceTitles(page);
    expect(descTitles.length).toBeGreaterThan(1);
    expect(isSortedDescending(descTitles)).toBe(true);
  });
});
