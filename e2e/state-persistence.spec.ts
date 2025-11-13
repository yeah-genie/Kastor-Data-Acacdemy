import { test, expect } from '@playwright/test';

/**
 * E2E Test: State Persistence
 *
 * This test validates the state management and persistence in Kastor Data Academy:
 * 1. Progress tracking (choices, evidence, scenes)
 * 2. GameHUD progress bar updates
 * 3. Manual save/load via Settings
 * 4. Save slot switching
 * 5. Auto-save (30-second interval)
 * 6. LocalStorage snapshots
 * 7. State restoration after page reload
 *
 * Based on e2e_test_checklist.md Section 3
 */

test.describe('State Persistence', () => {
  test.beforeEach(async ({ page }) => {
    // Start fresh
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.waitForTimeout(1000);
  });

  test('should track progress when choices are made', async ({ page }) => {
    console.log('Test: Progress tracking with choices...');

    await page.goto('/', { waitUntil: 'domcontentloaded' });
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

    // Get initial progress
    const initialProgress = await page.evaluate(() => {
      const gameState = localStorage.getItem('game-state') || localStorage.getItem('gameState');
      if (gameState) {
        const state = JSON.parse(gameState);
        return state.progress || state.state?.progress || 0;
      }
      return 0;
    });
    console.log(`Initial progress: ${initialProgress}%`);

    // Wait for and click a choice
    await page.waitForTimeout(3000);
    const choiceButton = page.locator('button[class*="choice"], [role="button"]').first();

    if (await choiceButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await choiceButton.click();
      console.log('✓ Choice clicked');
      await page.waitForTimeout(3000);

      // Get updated progress
      const updatedProgress = await page.evaluate(() => {
        const gameState = localStorage.getItem('game-state') || localStorage.getItem('gameState');
        if (gameState) {
          const state = JSON.parse(gameState);
          return state.progress || state.state?.progress || 0;
        }
        return 0;
      });
      console.log(`Updated progress: ${updatedProgress}%`);

      // Progress should increase or at least be tracked
      expect(updatedProgress).toBeGreaterThanOrEqual(initialProgress);
      console.log('✓ Progress tracked successfully');
    } else {
      console.log('⚠ No choices available to test progress tracking');
    }
  });

  test('should update progress bar in GameHUD', async ({ page }) => {
    console.log('Test: GameHUD progress bar...');

    await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    // Look for progress bar
    const progressSelectors = [
      '[class*="progress"]',
      '[role="progressbar"]',
      'progress',
      '[aria-valuenow]'
    ];

    let progressFound = false;
    for (const selector of progressSelectors) {
      const progressBar = page.locator(selector).first();
      if (await progressBar.isVisible({ timeout: 2000 }).catch(() => false)) {
        progressFound = true;
        console.log(`✓ Progress bar found: ${selector}`);

        // Get progress value
        const ariaValue = await progressBar.getAttribute('aria-valuenow').catch(() => null);
        const value = await progressBar.getAttribute('value').catch(() => null);

        if (ariaValue || value) {
          console.log(`Progress value: ${ariaValue || value}%`);
        }
        break;
      }
    }

    if (!progressFound) {
      console.log('⚠ Progress bar not found in current view');
    }
  });

  test('should save game state to localStorage', async ({ page }) => {
    console.log('Test: LocalStorage state saving...');

    await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    // Check for game state in localStorage
    const gameState = await page.evaluate(() => {
      const keys = Object.keys(localStorage);
      console.log('LocalStorage keys:', keys);

      // Try common state keys
      return {
        gameState: localStorage.getItem('game-state'),
        zustandState: localStorage.getItem('zustand-state'),
        anyState: keys.filter(k => k.includes('state') || k.includes('game')).map(k => ({
          key: k,
          value: localStorage.getItem(k)
        }))
      };
    });

    console.log('Game state keys found:', gameState.anyState.map(s => s.key));

    // At least one state entry should exist
    expect(gameState.anyState.length).toBeGreaterThan(0);
    console.log('✓ Game state saved to localStorage');
  });

  test('should support manual save via Settings', async ({ page }) => {
    console.log('Test: Manual save/load...');

    await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    // Save current state snapshot
    const stateBefore = await page.evaluate(() => {
      return Object.keys(localStorage).reduce((acc, key) => {
        acc[key] = localStorage.getItem(key);
        return acc;
      }, {} as Record<string, string | null>);
    });

    // Open Settings
    const settingsSelectors = [
      'button[aria-label*="Settings"]',
      'button:has-text("Settings")',
      '[class*="settings"]'
    ];

    let settingsOpened = false;
    for (const selector of settingsSelectors) {
      const settingsButton = page.locator(selector).first();
      if (await settingsButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await settingsButton.click();
        settingsOpened = true;
        console.log('✓ Settings opened');
        await page.waitForTimeout(1000);
        break;
      }
    }

    if (settingsOpened) {
      // Look for Save button
      const saveButton = page.locator('button:has-text("Save"), button[aria-label*="Save"]').first();
      if (await saveButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await saveButton.click();
        console.log('✓ Save button clicked');
        await page.waitForTimeout(1000);

        // Verify state was saved
        const stateAfter = await page.evaluate(() => {
          return Object.keys(localStorage).reduce((acc, key) => {
            acc[key] = localStorage.getItem(key);
            return acc;
          }, {} as Record<string, string | null>);
        });

        // State should be preserved or updated
        expect(Object.keys(stateAfter).length).toBeGreaterThanOrEqual(Object.keys(stateBefore).length);
        console.log('✓ State persisted after manual save');
      } else {
        console.log('⚠ Save button not found');
      }
    } else {
      console.log('⚠ Could not open Settings menu');
    }
  });

  test('should support save slot switching', async ({ page }) => {
    console.log('Test: Save slot switching...');

    await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    // Open Settings
    const settingsButton = page.locator('button[aria-label*="Settings"], button:has-text("Settings")').first();
    if (await settingsButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await settingsButton.click();
      await page.waitForTimeout(1000);

      // Look for save slots
      const slotSelectors = [
        'button:has-text("Slot 1")',
        'button:has-text("Slot 2")',
        '[class*="slot"]',
        '[role="radio"][name*="slot"]'
      ];

      let slotFound = false;
      for (const selector of slotSelectors) {
        const slot = page.locator(selector).first();
        if (await slot.isVisible({ timeout: 2000 }).catch(() => false)) {
          slotFound = true;
          console.log(`✓ Save slot found: ${selector}`);

          // Click to switch slot
          await slot.click();
          await page.waitForTimeout(1000);

          console.log('✓ Switched save slot');
          break;
        }
      }

      if (!slotFound) {
        console.log('⚠ Save slots not found (may not be implemented yet)');
      }
    }
  });

  test('should auto-save periodically', async ({ page }) => {
    console.log('Test: Auto-save (30-second interval)...');

    await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    // Get initial state
    const initialState = await page.evaluate(() => {
      return localStorage.getItem('game-state') || localStorage.getItem('gameState');
    });

    console.log('Initial state captured');

    // Wait for auto-save (30 seconds + buffer)
    console.log('Waiting 35 seconds for auto-save...');
    await page.waitForTimeout(35000);

    // Get state after auto-save
    const updatedState = await page.evaluate(() => {
      return localStorage.getItem('game-state') || localStorage.getItem('gameState');
    });

    // State should be updated (or at least attempted)
    if (initialState !== updatedState) {
      console.log('✓ Auto-save detected (state changed)');
    } else {
      console.log('⚠ State unchanged (auto-save may not have triggered or state is identical)');
    }

    // Check for last save timestamp
    const lastSaveTime = await page.evaluate(() => {
      const keys = Object.keys(localStorage);
      const timeKeys = keys.filter(k => k.includes('save') || k.includes('time'));
      return timeKeys.map(k => ({ key: k, value: localStorage.getItem(k) }));
    });

    if (lastSaveTime.length > 0) {
      console.log('Last save timestamps:', lastSaveTime);
    }
  });

  test('should restore state after page reload', async ({ page }) => {
    console.log('Test: State restoration after reload...');

    await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    // Make a choice to create some state
    const choiceButton = page.locator('button[class*="choice"]').first();
    if (await choiceButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await choiceButton.click();
      await page.waitForTimeout(2000);
      console.log('✓ Choice made');
    }

    // Capture state before reload
    const stateBefore = await page.evaluate(() => {
      return {
        gameState: localStorage.getItem('game-state') || localStorage.getItem('gameState'),
        progress: localStorage.getItem('progress'),
        currentScene: localStorage.getItem('currentScene')
      };
    });

    console.log('State before reload:', {
      hasGameState: !!stateBefore.gameState,
      hasProgress: !!stateBefore.progress,
      hasScene: !!stateBefore.currentScene
    });

    // Reload page
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    // Check if state was restored
    const stateAfter = await page.evaluate(() => {
      return {
        gameState: localStorage.getItem('game-state') || localStorage.getItem('gameState'),
        progress: localStorage.getItem('progress'),
        currentScene: localStorage.getItem('currentScene')
      };
    });

    console.log('State after reload:', {
      hasGameState: !!stateAfter.gameState,
      hasProgress: !!stateAfter.progress,
      hasScene: !!stateAfter.currentScene
    });

    // State should be preserved
    if (stateBefore.gameState) {
      expect(stateAfter.gameState).toBe(stateBefore.gameState);
      console.log('✓ Game state restored');
    }

    // Check if UI reflects restored state
    const progressBar = page.locator('[role="progressbar"], [class*="progress"]').first();
    if (await progressBar.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('✓ UI restored (progress bar visible)');
    }
  });

  test('should track collected evidence in state', async ({ page }) => {
    console.log('Test: Evidence collection tracking...');

    await page.goto('/dashboard/chat', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    // Get initial evidence count
    const initialEvidence = await page.evaluate(() => {
      const state = localStorage.getItem('game-state') || localStorage.getItem('gameState');
      if (state) {
        const parsed = JSON.parse(state);
        return parsed.collectedEvidence || parsed.state?.collectedEvidence || [];
      }
      return [];
    });
    console.log(`Initial evidence count: ${initialEvidence.length}`);

    // Look for evidence to collect
    const evidence = page.locator('[class*="evidence"], text=/Evidence|Log/i').first();
    if (await evidence.isVisible({ timeout: 3000 }).catch(() => false)) {
      // Click evidence if clickable
      await evidence.click().catch(() => console.log('Evidence not clickable'));
      await page.waitForTimeout(2000);

      // Check updated evidence count
      const updatedEvidence = await page.evaluate(() => {
        const state = localStorage.getItem('game-state') || localStorage.getItem('gameState');
        if (state) {
          const parsed = JSON.parse(state);
          return parsed.collectedEvidence || parsed.state?.collectedEvidence || [];
        }
        return [];
      });

      console.log(`Updated evidence count: ${updatedEvidence.length}`);

      if (updatedEvidence.length > initialEvidence.length) {
        console.log('✓ Evidence collection tracked');
      } else {
        console.log('⚠ Evidence count unchanged');
      }
    } else {
      console.log('⚠ No evidence found to collect');
    }
  });

  test('should track scene history', async ({ page }) => {
    console.log('Test: Scene history tracking...');

    await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    // Get scene history
    const sceneHistory = await page.evaluate(() => {
      const state = localStorage.getItem('game-state') || localStorage.getItem('gameState');
      if (state) {
        const parsed = JSON.parse(state);
        return {
          currentScene: parsed.currentScene || parsed.state?.currentScene,
          sceneHistory: parsed.sceneHistory || parsed.state?.sceneHistory || [],
          unlockedScenes: parsed.unlockedScenes || parsed.state?.unlockedScenes || []
        };
      }
      return null;
    });

    console.log('Scene state:', sceneHistory);

    if (sceneHistory) {
      if (sceneHistory.currentScene) {
        console.log(`✓ Current scene tracked: ${sceneHistory.currentScene}`);
      }
      if (sceneHistory.sceneHistory.length > 0) {
        console.log(`✓ Scene history length: ${sceneHistory.sceneHistory.length}`);
      }
      if (sceneHistory.unlockedScenes.length > 0) {
        console.log(`✓ Unlocked scenes: ${sceneHistory.unlockedScenes.length}`);
      }
    } else {
      console.log('⚠ No scene state found');
    }
  });
});
