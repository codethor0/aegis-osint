import { test, expect } from '@playwright/test';

const PRESET_NAME = 'E2E Preset Free';

test.describe('OSINT filter presets', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/search');
    await page.context().clearCookies();
    await page.evaluate(() => {
      window.localStorage.clear();
      sessionStorage.clear();
    });
  });

  test('can save, reload, apply, and delete a filter preset', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.getByTestId('search-input');
    await searchInput.fill('people');
    await page.getByTestId('search-submit').click();

    await page.waitForURL(/\/search\?q=people/);

    const initialCards = page.getByTestId('resource-card');
    await expect(initialCards.first()).toBeVisible();

    const filterPanel = page.getByTestId('filter-panel');
    await expect(filterPanel).toBeVisible();

    const freeFilterOption = page.locator(
      '[data-testid="filter-option"][data-filter-id="costs-free"]'
    );
    await freeFilterOption.check();

    await page.waitForURL(/costs=free/);

    const presetsPanel = page.getByTestId('presets-panel');
    await expect(presetsPanel).toBeVisible();

    const saveButton = page.getByTestId('preset-save-button');
    await saveButton.click();

    const nameInput = page.getByTestId('preset-name-input');
    await expect(nameInput).toBeVisible();
    await nameInput.fill(PRESET_NAME);

    const modalSaveButton = page.locator('button:has-text("Save")').last();
    await modalSaveButton.click();

    await page.waitForTimeout(500);

    const presetList = page.getByTestId('preset-list');
    await expect(presetList).toBeVisible();

    const presetItem = presetList.locator(
      `[data-testid="preset-item"][data-preset-name="${PRESET_NAME}"]`
    );
    await expect(presetItem).toBeVisible();

    await page.reload();

    const presetListAfterReload = page.getByTestId('preset-list');
    await expect(presetListAfterReload).toBeVisible();

    const presetItemAfterReload = presetListAfterReload.locator(
      `[data-testid="preset-item"][data-preset-name="${PRESET_NAME}"]`
    );
    await expect(presetItemAfterReload).toBeVisible();

    const clearButton = page.getByTestId('filter-clear');
    await clearButton.click();

    await page.waitForURL((url) => !url.searchParams.has('costs'));

    const applyButtonForPreset = presetItemAfterReload.getByTestId('preset-apply');
    await applyButtonForPreset.click();

    await page.waitForURL(/costs=free/);

    const filteredCards = page.getByTestId('resource-card');
    await expect(filteredCards.first()).toBeVisible();

    const costTags = filteredCards.locator(
      '[data-testid="resource-tag"][data-tag-type="cost"]'
    );
    const count = await costTags.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      await expect(costTags.nth(i)).toHaveAttribute('data-tag-value', 'free');
    }

    page.on('dialog', (dialog) => {
      dialog.accept();
    });

    const deleteButton = presetItemAfterReload.getByTestId('preset-delete');
    await deleteButton.click();

    await page.waitForTimeout(500);

    const presetItemAfterDelete = page
      .getByTestId('preset-list')
      .locator(`[data-testid="preset-item"][data-preset-name="${PRESET_NAME}"]`);

    await expect(presetItemAfterDelete).toHaveCount(0);
  });
});
