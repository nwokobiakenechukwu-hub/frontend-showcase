import { test, expect } from '@playwright/test';

test('showcase grid renders', async ({ page }) => {
  await page.goto('http://localhost:3000/(showcase)');
  await expect(page.getByTestId('showcase-grid')).toBeVisible();
});
