import { test, expect } from '@playwright/test';

test.describe('OSINT categories and resources', () => {
  test('should display categories on the homepage and navigate to a category page', async ({
    page,
  }) => {
    await page.goto('/');

    const categoryCards = page.getByTestId('category-card');
    await expect(categoryCards.first()).toBeVisible();

    const firstCategory = categoryCards.first();
    const firstCategoryTitle = await firstCategory
      .getByTestId('category-card-title')
      .innerText();

    await firstCategory.click();

    await expect(page.getByTestId('category-title')).toHaveText(firstCategoryTitle);
  });

  test('should list resources for a category', async ({ page }) => {
    await page.goto('/');

    const firstCategory = page.getByTestId('category-card').first();
    await firstCategory.click();

    const resourceCards = page.getByTestId('resource-card');
    await expect(resourceCards.first()).toBeVisible();
  });

  test('should open a resource detail view with title and link', async ({ page }) => {
    await page.goto('/');

    const firstCategory = page.getByTestId('category-card').first();
    await firstCategory.click();

    const firstResource = page.getByTestId('resource-card').first();
    await firstResource.click();

    await expect(page.getByTestId('resource-detail-title')).toBeVisible();

    const link = page.getByTestId('resource-detail-link');
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', /https?:\/\//);
  });
});
