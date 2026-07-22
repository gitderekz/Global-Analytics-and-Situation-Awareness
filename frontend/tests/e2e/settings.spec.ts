import { test, expect } from '@playwright/test';

test('should load the settings page and show map controls', async ({ page, baseURL }) => {
  await page.goto(`${baseURL || 'http://localhost:5173'}/settings`);
  await expect(page.locator('text=Map Defaults')).toBeVisible();
  await expect(page.locator('select#map-mode')).toBeVisible();
  await expect(page.locator('text=Upload MBTiles')).toBeVisible();
});
