import { test, expect } from '@playwright/test';

test('should load the login page', async ({ page, baseURL }) => {
  await page.goto(baseURL || 'http://localhost:5173/login');
  await expect(page).toHaveTitle(/Global Analytics|Login|Analytics/);
  await expect(page.locator('text=Sign In')).toBeVisible({ timeout: 20000 });
});
