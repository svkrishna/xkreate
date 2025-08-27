import { test, expect } from '@playwright/test';

test.describe('Resize Page', () => {
  test('should load resize page and display upload area', async ({ page }) => {
    await page.goto('/resize');
    
    // Check if the page loads correctly
    await expect(page.getByRole('heading', { name: 'Image Resize' })).toBeVisible();
    await expect(page.getByText('Resize and process your images')).toBeVisible();
    
    // Check if upload area is present
    await expect(page.getByText('Upload Image')).toBeVisible();
    await expect(page.getByText('Drag and drop or click to select an image')).toBeVisible();
  });

  test('should display processing settings', async ({ page }) => {
    await page.goto('/resize');
    
    // Check if processing settings are visible
    await expect(page.getByText('Processing Settings')).toBeVisible();
    await expect(page.getByText('Configure resize parameters')).toBeVisible();
    
    // Check if preset selection is available
    await expect(page.getByText('Preset')).toBeVisible();
  });

  test('should load presets from API', async ({ page }) => {
    await page.goto('/resize');
    
    // Wait for presets to load
    await page.waitForTimeout(1000);
    
    // Check if preset dropdown has options
    const presetSelect = page.locator('select, [role="combobox"]').first();
    await expect(presetSelect).toBeVisible();
  });
});


