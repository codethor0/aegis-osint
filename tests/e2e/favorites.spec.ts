import { test, expect } from '@playwright/test';

test.describe('Favorites', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.context().clearCookies();
    await page.evaluate(() => {
      window.localStorage.clear();
      sessionStorage.clear();
    });
  });

  test('can add a resource to favorites and see it on the favorites page', async ({
    page,
  }) => {
    await page.goto('/');

    const firstCategoryCard = page.getByTestId('category-card').first();
    await expect(firstCategoryCard).toBeVisible();
    await firstCategoryCard.click();

    const firstResource = page.getByTestId('resource-card').first();
    await expect(firstResource).toBeVisible();

    const firstResourceTitle = await firstResource
      .getByTestId('resource-card-title')
      .innerText();

    const favoriteToggle = firstResource.getByTestId('favorite-toggle');
    await favoriteToggle.click();

    await page.goto('/favorites');

    const favoritesList = page.getByTestId('favorites-list');
    await expect(favoritesList).toBeVisible();

    const favoriteTitles = favoritesList.getByTestId('resource-card-title');
    await expect(favoriteTitles).toContainText(firstResourceTitle);
  });

  test('can remove a favorite and see the empty state', async ({ page }) => {
    await page.goto('/');

    const firstCategoryCard = page.getByTestId('category-card').first();
    await firstCategoryCard.click();

    const firstResource = page.getByTestId('resource-card').first();
    const favoriteToggle = firstResource.getByTestId('favorite-toggle');
    await favoriteToggle.click();

    await page.goto('/favorites');

    const favoritesList = page.getByTestId('favorites-list');
    await expect(favoritesList).toBeVisible();

    const favoriteOnPage = favoritesList.getByTestId('resource-card').first();
    const toggleOnFavorites = favoriteOnPage.getByTestId('favorite-toggle');
    await toggleOnFavorites.click();

    await expect(page.getByTestId('favorites-empty-state')).toBeVisible({ timeout: 2000 });

    const remaining = page.getByTestId('resource-card');
    await expect(remaining).toHaveCount(0);
  });
});
