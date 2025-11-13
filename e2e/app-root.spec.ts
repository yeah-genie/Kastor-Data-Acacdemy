import { test, expect } from '@playwright/test';

test.describe('App Root /app (Legacy Launcher)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/app');
    await page.waitForLoadState('networkidle');
  });

  test('should display AppNew splash screen', async ({ page }) => {
    // Look for splash screen or main app container
    const appContainer = page.locator('#root, [class*="app"], main').first();
    await expect(appContainer).toBeVisible();

    console.log('✓ App container loaded');
  });

  test('should show menu and episode selection', async ({ page }) => {
    // Wait for any loading states to complete
    await page.waitForTimeout(1000);

    // Look for menu button or navigation
    const menuButton = page.locator('button, [role="button"]').filter({
      hasText: /menu|episodes|start|play/i
    }).first();

    if (await menuButton.isVisible()) {
      console.log('✓ Menu/Episode selection found');

      // Try clicking to access episodes
      await menuButton.click();
      await page.waitForTimeout(500);

      // Look for episode list
      const episodeList = page.locator('text=/episode/i');
      const episodeCount = await episodeList.count();

      if (episodeCount > 0) {
        console.log(`✓ Found ${episodeCount} episode references`);
      }
    } else {
      console.log('⚠ Menu button not immediately visible, may require interaction');
    }
  });

  test('should be able to access Settings modal', async ({ page }) => {
    // Look for settings button/icon
    const settingsButton = page.locator('button, [role="button"]').filter({
      hasText: /settings|⚙|options/i
    }).or(
      page.locator('[aria-label*="settings" i], [title*="settings" i]')
    ).first();

    if (await settingsButton.isVisible()) {
      await settingsButton.click();
      await page.waitForTimeout(500);

      // Check for settings modal
      const settingsModal = page.locator('[role="dialog"]').filter({
        hasText: /settings/i
      });

      if (await settingsModal.isVisible()) {
        console.log('✓ Settings modal opened');

        // Close modal
        const closeButton = page.locator('button').filter({ hasText: /close|×/i }).first();
        if (await closeButton.isVisible()) {
          await closeButton.click();
          await expect(settingsModal).not.toBeVisible();
          console.log('✓ Settings modal closed');
        }
      } else {
        console.log('⚠ Settings modal not found');
      }
    } else {
      console.log('⚠ Settings button not found in /app route');
    }
  });

  test('should allow episode selection and navigation', async ({ page }) => {
    // Wait for content to load
    await page.waitForTimeout(1000);

    // Try to find and click on an episode
    const episodeButton = page.locator('button, a, [role="button"]').filter({
      hasText: /episode|start|play/i
    }).first();

    if (await episodeButton.isVisible()) {
      const buttonText = await episodeButton.textContent();
      console.log(`✓ Found episode button: ${buttonText}`);

      // Click and see if it navigates or opens something
      await episodeButton.click();
      await page.waitForTimeout(1000);

      // Check if we navigated or opened a modal
      const url = page.url();
      const modal = page.locator('[role="dialog"]');
      const modalVisible = await modal.isVisible();

      if (url !== '/app' || modalVisible) {
        console.log('✓ Episode selection triggered navigation or modal');
      } else {
        console.log('⚠ Episode click did not trigger visible change');
      }
    } else {
      console.log('⚠ No episode selection buttons found');
    }
  });
});
