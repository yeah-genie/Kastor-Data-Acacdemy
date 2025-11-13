import { test } from '@playwright/test';
import path from 'path';

/**
 * Screenshot Capture Script for Landing Page
 *
 * Captures high-quality screenshots of key app screens for marketing materials
 */

test.describe('Landing Page Screenshots', () => {
  const screenshotsDir = path.join(process.cwd(), 'marketing', 'screenshots');

  test('capture hero screenshot - main dashboard', async ({ page }) => {
    console.log('📸 Capturing hero screenshot...');

    // Set viewport to desktop size for hero image
    await page.setViewportSize({ width: 1920, height: 1080 });

    await page.goto('/', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);

    // Click through to main dashboard
    const startButton = page.locator('text=/TAP TO START|Tap to Start/i').first();
    if (await startButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await startButton.click();
      await page.waitForTimeout(2000);
    }

    // Take hero screenshot
    await page.screenshot({
      path: `${screenshotsDir}/01-hero-dashboard.png`,
      fullPage: false,
      type: 'png'
    });

    console.log('✓ Hero screenshot saved');
  });

  test('capture chat view screenshot', async ({ page }) => {
    console.log('📸 Capturing chat view...');

    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    // Navigate through initial screens
    const startButton = page.locator('text=/TAP TO START|Tap to Start/i').first();
    if (await startButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await startButton.click();
      await page.waitForTimeout(2000);
    }

    const newGameButton = page.locator('text="New Game"').first();
    if (await newGameButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await newGameButton.click();
      await page.waitForTimeout(3000);
    }

    const episodeStart = page.locator('text="START"').first();
    if (await episodeStart.isVisible({ timeout: 3000 }).catch(() => false)) {
      await episodeStart.click();
      await page.waitForTimeout(5000);
    }

    // Ensure we're on Chat tab
    const chatTab = page.locator('button:has-text("Chat"), [role="tab"]:has-text("Chat")').first();
    if (await chatTab.isVisible({ timeout: 3000 }).catch(() => false)) {
      await chatTab.click();
      await page.waitForTimeout(2000);
    }

    await page.screenshot({
      path: `${screenshotsDir}/02-chat-view.png`,
      fullPage: false,
      type: 'png'
    });

    console.log('✓ Chat view screenshot saved');
  });

  test('capture data view screenshot', async ({ page }) => {
    console.log('📸 Capturing data view...');

    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/dashboard/data', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);

    await page.screenshot({
      path: `${screenshotsDir}/03-data-view.png`,
      fullPage: false,
      type: 'png'
    });

    console.log('✓ Data view screenshot saved');
  });

  test('capture files view screenshot', async ({ page }) => {
    console.log('📸 Capturing files view...');

    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/dashboard/files', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);

    await page.screenshot({
      path: `${screenshotsDir}/04-files-view.png`,
      fullPage: false,
      type: 'png'
    });

    console.log('✓ Files view screenshot saved');
  });

  test('capture team view screenshot', async ({ page }) => {
    console.log('📸 Capturing team view...');

    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/dashboard/team', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);

    await page.screenshot({
      path: `${screenshotsDir}/05-team-view.png`,
      fullPage: false,
      type: 'png'
    });

    console.log('✓ Team view screenshot saved');
  });

  test('capture mobile screenshots', async ({ page }) => {
    console.log('📸 Capturing mobile screenshots...');

    // Set viewport to mobile size (iPhone 12 Pro)
    await page.setViewportSize({ width: 390, height: 844 });

    await page.goto('/', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    // Mobile hero
    await page.screenshot({
      path: `${screenshotsDir}/06-mobile-hero.png`,
      fullPage: false,
      type: 'png'
    });

    // Navigate to chat
    const startButton = page.locator('text=/TAP TO START|Tap to Start/i').first();
    if (await startButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await startButton.click();
      await page.waitForTimeout(2000);
    }

    const newGameButton = page.locator('text="New Game"').first();
    if (await newGameButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await newGameButton.click();
      await page.waitForTimeout(3000);
    }

    const episodeStart = page.locator('text="START"').first();
    if (await episodeStart.isVisible({ timeout: 3000 }).catch(() => false)) {
      await episodeStart.click();
      await page.waitForTimeout(5000);
    }

    // Mobile chat
    await page.screenshot({
      path: `${screenshotsDir}/07-mobile-chat.png`,
      fullPage: false,
      type: 'png'
    });

    console.log('✓ Mobile screenshots saved');
  });

  test('capture settings modal', async ({ page }) => {
    console.log('📸 Capturing settings modal...');

    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/dashboard', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);

    // Open settings
    const settingsButton = page.locator('button[aria-label*="Settings"], button:has-text("Settings")').first();
    if (await settingsButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await settingsButton.click();
      await page.waitForTimeout(1000);

      await page.screenshot({
        path: `${screenshotsDir}/08-settings-modal.png`,
        fullPage: false,
        type: 'png'
      });

      console.log('✓ Settings modal screenshot saved');
    } else {
      console.log('⚠ Settings button not found');
    }
  });
});
