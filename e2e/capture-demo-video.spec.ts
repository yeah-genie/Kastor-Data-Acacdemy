import { test } from '@playwright/test';
import path from 'path';

/**
 * Demo Video Capture Script for Landing Page
 *
 * Records a demo video showing the key features and user flow of Kastor Data Academy
 * Video duration: ~60-90 seconds
 */

test.describe('Demo Video Capture', () => {
  const videosDir = path.join(process.cwd(), 'marketing', 'videos');

  test('record complete demo video', async ({ page, browser }) => {
    console.log('🎥 Recording demo video...');

    // Create a new context with video recording enabled
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      recordVideo: {
        dir: videosDir,
        size: { width: 1920, height: 1080 }
      }
    });

    const videoPage = await context.newPage();

    try {
      // === SCENE 1: Landing Page (5 seconds) ===
      console.log('Scene 1: Landing page');
      await videoPage.goto('/', { waitUntil: 'networkidle', timeout: 30000 });
      await videoPage.waitForTimeout(3000);

      // === SCENE 2: Start Game (3 seconds) ===
      console.log('Scene 2: Starting game');
      const startButton = videoPage.locator('text=/TAP TO START|Tap to Start/i').first();
      if (await startButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await startButton.click();
        await videoPage.waitForTimeout(2000);
      }

      // === SCENE 3: New Game Selection (4 seconds) ===
      console.log('Scene 3: New game');
      const newGameButton = videoPage.locator('text="New Game"').first();
      if (await newGameButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await newGameButton.click();
        await videoPage.waitForTimeout(3000);
      }

      // === SCENE 4: Episode Selection (4 seconds) ===
      console.log('Scene 4: Episode selection');
      const episodeStart = videoPage.locator('text="START"').first();
      if (await episodeStart.isVisible({ timeout: 3000 }).catch(() => false)) {
        await episodeStart.click();
        await videoPage.waitForTimeout(4000);
      }

      // === SCENE 5: Chat View - Reading Messages (6 seconds) ===
      console.log('Scene 5: Chat view');
      await videoPage.waitForTimeout(4000);

      // Scroll through messages slowly
      const chatContainer = videoPage.locator('[class*="chat"], [class*="message"]').first();
      if (await chatContainer.isVisible().catch(() => false)) {
        await chatContainer.evaluate((el) => {
          el.scrollBy({ top: 100, behavior: 'smooth' });
        });
        await videoPage.waitForTimeout(2000);
      }

      // === SCENE 6: Making a Choice (5 seconds) ===
      console.log('Scene 6: Making a choice');
      const choiceButton = videoPage.locator('button[class*="choice"]').first();
      if (await choiceButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        // Hover over choice to show interaction
        await choiceButton.hover();
        await videoPage.waitForTimeout(1000);

        await choiceButton.click();
        await videoPage.waitForTimeout(3000);
      }

      // === SCENE 7: Data Tab (8 seconds) ===
      console.log('Scene 7: Data view');
      const dataTab = videoPage.locator('button:has-text("Data"), [role="tab"]:has-text("Data")').first();
      if (await dataTab.isVisible({ timeout: 3000 }).catch(() => false)) {
        await dataTab.click();
        await videoPage.waitForTimeout(3000);

        // Interact with filters
        const filterDropdown = videoPage.locator('select, [role="combobox"]').first();
        if (await filterDropdown.isVisible({ timeout: 2000 }).catch(() => false)) {
          await filterDropdown.click();
          await videoPage.waitForTimeout(1000);
          await filterDropdown.press('Escape');
        }

        await videoPage.waitForTimeout(2000);
      }

      // === SCENE 8: Files Tab (8 seconds) ===
      console.log('Scene 8: Files view');
      const filesTab = videoPage.locator('button:has-text("Files"), [role="tab"]:has-text("Files")').first();
      if (await filesTab.isVisible({ timeout: 3000 }).catch(() => false)) {
        await filesTab.click();
        await videoPage.waitForTimeout(3000);

        // Click on a file
        const fileItem = videoPage.locator('[class*="file"], [class*="evidence"]').first();
        if (await fileItem.isVisible({ timeout: 2000 }).catch(() => false)) {
          await fileItem.hover();
          await videoPage.waitForTimeout(1000);
          await fileItem.click();
          await videoPage.waitForTimeout(2000);
        }
      }

      // === SCENE 9: Team Tab (8 seconds) ===
      console.log('Scene 9: Team view');
      const teamTab = videoPage.locator('button:has-text("Team"), [role="tab"]:has-text("Team")').first();
      if (await teamTab.isVisible({ timeout: 3000 }).catch(() => false)) {
        await teamTab.click();
        await videoPage.waitForTimeout(3000);

        // Click on a character
        const characterCard = videoPage.locator('[class*="character"], [class*="card"]').first();
        if (await characterCard.isVisible({ timeout: 2000 }).catch(() => false)) {
          await characterCard.hover();
          await videoPage.waitForTimeout(1000);
          await characterCard.click();
          await videoPage.waitForTimeout(2000);
        }
      }

      // === SCENE 10: Back to Chat (5 seconds) ===
      console.log('Scene 10: Back to chat');
      const chatTab = videoPage.locator('button:has-text("Chat"), [role="tab"]:has-text("Chat")').first();
      if (await chatTab.isVisible({ timeout: 3000 }).catch(() => false)) {
        await chatTab.click();
        await videoPage.waitForTimeout(4000);
      }

      // === SCENE 11: Settings Modal (6 seconds) ===
      console.log('Scene 11: Settings');
      const settingsButton = videoPage.locator('button[aria-label*="Settings"], button:has-text("Settings")').first();
      if (await settingsButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await settingsButton.click();
        await videoPage.waitForTimeout(2000);

        // Interact with theme toggle
        const themeToggle = videoPage.locator('[class*="theme"], button:has-text("Dark"), button:has-text("Light")').first();
        if (await themeToggle.isVisible({ timeout: 2000 }).catch(() => false)) {
          await themeToggle.hover();
          await videoPage.waitForTimeout(1000);
        }

        // Close settings
        await videoPage.keyboard.press('Escape');
        await videoPage.waitForTimeout(2000);
      }

      // === FINAL SCENE: Dashboard Overview (4 seconds) ===
      console.log('Final scene: Dashboard overview');
      await videoPage.waitForTimeout(3000);

      console.log('✓ Demo video recording complete');

    } finally {
      // Close context to finish video recording
      await videoPage.close();
      await context.close();
    }

    // Video will be saved automatically to the videosDir
    console.log(`✓ Video saved to: ${videosDir}`);
  });

  test('record quick feature showcase (30 seconds)', async ({ page, browser }) => {
    console.log('🎥 Recording quick feature showcase...');

    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      recordVideo: {
        dir: videosDir,
        size: { width: 1920, height: 1080 }
      }
    });

    const videoPage = await context.newPage();

    try {
      // Quick 30-second showcase of each tab
      await videoPage.goto('/dashboard/chat', { waitUntil: 'networkidle' });
      await videoPage.waitForTimeout(5000);

      await videoPage.goto('/dashboard/data', { waitUntil: 'networkidle' });
      await videoPage.waitForTimeout(5000);

      await videoPage.goto('/dashboard/files', { waitUntil: 'networkidle' });
      await videoPage.waitForTimeout(5000);

      await videoPage.goto('/dashboard/team', { waitUntil: 'networkidle' });
      await videoPage.waitForTimeout(5000);

      await videoPage.goto('/dashboard/progress', { waitUntil: 'networkidle' });
      await videoPage.waitForTimeout(5000);

      console.log('✓ Quick showcase recording complete');

    } finally {
      await videoPage.close();
      await context.close();
    }
  });
});
