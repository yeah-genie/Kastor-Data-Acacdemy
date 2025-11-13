import { test } from '@playwright/test';
import path from 'path';

const videosDir = path.join(process.cwd(), 'marketing', 'videos');

test.use({
  video: {
    mode: 'on',
    size: { width: 1920, height: 1080 }
  }
});

test.describe('Demo Video Recording', () => {

  test('record full demo - 60 seconds', async ({ page }) => {
    console.log('🎬 Starting demo video recording...');

    // Scene 1: Landing Page (5s)
    console.log('Scene 1: Landing Page');
    await page.goto('/', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(5000);

    // Scene 2: Click New Game (3s)
    console.log('Scene 2: New Game Button');
    const newGameButton = page.locator('button:has-text("New Game")');
    await newGameButton.waitFor({ state: 'visible', timeout: 10000 });
    await newGameButton.click();
    await page.waitForTimeout(3000);

    // Scene 3: Episode Selection (4s)
    console.log('Scene 3: Episode Selection');
    await page.waitForTimeout(2000);
    const firstEpisode = page.locator('[class*="episode"]').first();
    if (await firstEpisode.isVisible().catch(() => false)) {
      await firstEpisode.click();
      await page.waitForTimeout(2000);
    }

    // Scene 4: Chat Interface (8s)
    console.log('Scene 4: Chat Interface');
    await page.waitForTimeout(3000);

    // Wait for messages to appear
    const messages = page.locator('[class*="message"]');
    await messages.first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(5000);

    // Scene 5: Click a Choice (5s)
    console.log('Scene 5: Making a Choice');
    const choiceButton = page.locator('button[class*="choice"]').first();
    if (await choiceButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await choiceButton.click();
      await page.waitForTimeout(5000);
    }

    // Scene 6: Data Tab (8s)
    console.log('Scene 6: Data Analysis Tab');
    const dataTab = page.locator('text=/Data|데이터/i').first();
    if (await dataTab.isVisible({ timeout: 3000 }).catch(() => false)) {
      await dataTab.click();
      await page.waitForTimeout(8000);
    }

    // Scene 7: Files Tab (7s)
    console.log('Scene 7: Files Tab');
    const filesTab = page.locator('text=/Files|파일/i').first();
    if (await filesTab.isVisible({ timeout: 3000 }).catch(() => false)) {
      await filesTab.click();
      await page.waitForTimeout(7000);
    }

    // Scene 8: Team Tab (7s)
    console.log('Scene 8: Team Tab');
    const teamTab = page.locator('text=/Team|팀/i').first();
    if (await teamTab.isVisible({ timeout: 3000 }).catch(() => false)) {
      await teamTab.click();
      await page.waitForTimeout(7000);
    }

    // Scene 9: Back to Chat (5s)
    console.log('Scene 9: Back to Chat');
    const chatTab = page.locator('text=/Chat|채팅/i').first();
    if (await chatTab.isVisible({ timeout: 3000 }).catch(() => false)) {
      await chatTab.click();
      await page.waitForTimeout(5000);
    }

    console.log('✅ Demo recording complete!');
    console.log('Video will be saved automatically after test completion');
  });

  test('record quick showcase - 30 seconds', async ({ page }) => {
    console.log('🎬 Starting quick showcase recording...');

    // Quick flow through main features
    await page.goto('/', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);

    const newGameButton = page.locator('button:has-text("New Game")');
    if (await newGameButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await newGameButton.click();
      await page.waitForTimeout(2000);
    }

    // Quick episode selection
    const firstEpisode = page.locator('[class*="episode"]').first();
    if (await firstEpisode.isVisible({ timeout: 3000 }).catch(() => false)) {
      await firstEpisode.click();
      await page.waitForTimeout(3000);
    }

    // Show chat briefly
    await page.waitForTimeout(4000);

    // Cycle through tabs quickly
    const tabs = ['Data', 'Files', 'Team', 'Chat'];
    for (const tab of tabs) {
      const tabButton = page.locator(`text=/${tab}/i`).first();
      if (await tabButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await tabButton.click();
        await page.waitForTimeout(3000);
      }
    }

    console.log('✅ Quick showcase complete!');
  });
});
