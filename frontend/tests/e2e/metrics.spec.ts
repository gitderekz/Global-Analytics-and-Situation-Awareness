import { test, expect } from '@playwright/test';

test('should display the metrics dashboard', async ({ page, baseURL }) => {
  await page.goto(`${baseURL || 'http://localhost:5173'}/metrics`);
  await expect(page.locator('text=System Metrics')).toBeVisible();
  await expect(page.locator('text=Uptime')).toBeVisible();
});
