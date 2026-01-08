import { test, expect } from '@playwright/test';

const FILTER_ID = 'costs-free';
const FILTER_TAG_TYPE = 'cost';
const FILTER_TAG_VALUE = 'free';

test.describe('OSINT filters', () => {
  test('filters resources by cost and allows clearing filters', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.getByTestId('search-input');
    await searchInput.fill('people');
    await page.getByTestId('search-submit').click();

    await page.waitForURL(/\/search\?q=people/);

    const baselineResources = page.getByTestId('resource-card');
    const baselineCount = await baselineResources.count();
    await expect(baselineResources.first()).toBeVisible();

    const panel = page.getByTestId('filter-panel');
    await expect(panel).toBeVisible();

    const filterOption = panel.locator(
      `[data-testid="filter-option"][data-filter-id="${FILTER_ID}"]`
    );
    await filterOption.check();

    await page.waitForURL(/costs=free/);

    const filteredResources = page.getByTestId('resource-card');
    await expect(filteredResources.first()).toBeVisible();

    const costTags = filteredResources.locator(
      `[data-testid="resource-tag"][data-tag-type="${FILTER_TAG_TYPE}"]`
    );
    const tagCount = await costTags.count();

    expect(tagCount).toBeGreaterThan(0);

    for (let i = 0; i < tagCount; i++) {
      await expect(costTags.nth(i)).toHaveAttribute('data-tag-value', FILTER_TAG_VALUE);
    }

    const clearButton = page.getByTestId('filter-clear');
    await expect(clearButton).toBeVisible();
    await clearButton.click();

    await page.waitForURL((url) => !url.searchParams.has('costs'));

    const resourcesAfterClear = page.getByTestId('resource-card');
    await expect(resourcesAfterClear.first()).toBeVisible();

    const countAfterClear = await resourcesAfterClear.count();
    expect(countAfterClear).toBeGreaterThanOrEqual(tagCount);
  });
});
