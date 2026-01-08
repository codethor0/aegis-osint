import { test, expect } from '@playwright/test';

const KNOWN_QUERY = 'TruePeopleSearch';
const EXPECTED_TITLE = 'TruePeopleSearch';

test.describe('OSINT search', () => {
  test('returns matching resources for a known query', async ({ page }) => {
    await page.goto('/');

    const input = page.getByTestId('search-input');
    await expect(input).toBeVisible();

    await input.fill(KNOWN_QUERY);

    const submit = page.getByTestId('search-submit');
    await submit.click();

    await expect(page).toHaveURL(/\/search\?q=/);

    const results = page.getByTestId('search-results');
    await expect(results).toBeVisible();

    const firstTitle = results.getByTestId('resource-card-title').first();
    await expect(firstTitle).toContainText(EXPECTED_TITLE);
  });

  test('shows a no-results state for a nonsense query', async ({ page }) => {
    await page.goto('/');

    const input = page.getByTestId('search-input');
    await expect(input).toBeVisible();

    await input.fill('this-query-should-not-match-any-resource-zz9');

    const submit = page.getByTestId('search-submit');
    await submit.click();

    await expect(page).toHaveURL(/\/search\?q=/);

    const resourceCards = page.getByTestId('resource-card');
    await expect(resourceCards).toHaveCount(0);

    await expect(page.getByTestId('search-no-results')).toBeVisible();
  });
});
