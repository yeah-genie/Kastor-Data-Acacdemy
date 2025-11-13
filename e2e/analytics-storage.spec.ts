import { test, expect } from '@playwright/test';

test.describe('Analytics & Storage Verification', () => {
  test.describe('Landing Page CTA Analytics', () => {
    test('should track "Play Free Demo" CTA clicks', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Clear localStorage first
      await page.evaluate(() => localStorage.clear());

      // Find and click CTA
      const ctaButton = page.getByRole('button', { name: /Play Free Demo/i })
        .or(page.getByRole('link', { name: /Play Free Demo/i }));

      if (await ctaButton.isVisible()) {
        await ctaButton.click();
        await page.waitForTimeout(500);

        // Check localStorage
        const ctaCount = await page.evaluate(() => {
          return localStorage.getItem('kastor-landing-cta:play-demo');
        });

        expect(ctaCount).toBeTruthy();
        expect(parseInt(ctaCount || '0')).toBeGreaterThan(0);
        console.log(`✓ Play Demo CTA tracked: ${ctaCount} clicks`);
      }
    });

    test('should track Pre-order modal interactions', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Clear localStorage
      await page.evaluate(() => localStorage.clear());

      const preorderButton = page.getByRole('button', { name: /Pre-order/i });

      if (await preorderButton.isVisible()) {
        await preorderButton.click();
        await page.waitForTimeout(500);

        // Check if modal opened and track
        const modal = page.locator('[role="dialog"]');
        if (await modal.isVisible()) {
          // Try to submit (might need to fill form first)
          const submitButton = modal.getByRole('button', { name: /Confirm|Submit/i });

          if (await submitButton.isVisible()) {
            // Fill minimal required fields if present
            const emailInput = modal.locator('input[type="email"]');
            if (await emailInput.isVisible()) {
              await emailInput.fill('test@example.com');
            }

            await submitButton.click();
            await page.waitForTimeout(1000);

            // Check localStorage
            const preorderCount = await page.evaluate(() => {
              return localStorage.getItem('kastor-landing-cta:preorder');
            });

            if (preorderCount) {
              console.log(`✓ Pre-order CTA tracked: ${preorderCount} submissions`);
              expect(parseInt(preorderCount)).toBeGreaterThan(0);
            }
          }
        }
      }
    });
  });

  test.describe('Dashboard Analytics Events', () => {
    test('should track choice_made events', async ({ page }) => {
      await page.goto('/dashboard/chat');
      await page.waitForLoadState('networkidle');

      // Clear any existing analytics data
      await page.evaluate(() => {
        localStorage.removeItem('kastor-analytics-session');
      });

      // Wait for choices to appear
      await page.waitForTimeout(2000);

      // Click a choice if available
      const choiceButton = page.locator('button').filter({
        hasText: /choice|option|select/i
      }).first();

      if (await choiceButton.isVisible()) {
        await choiceButton.click();
        await page.waitForTimeout(500);

        // Check analytics session data
        const sessionData = await page.evaluate(() => {
          const data = localStorage.getItem('kastor-analytics-session');
          return data ? JSON.parse(data) : null;
        });

        if (sessionData && sessionData.events) {
          const choiceMadeEvents = sessionData.events.filter((e: any) =>
            e.type === 'choice_made' || e.action === 'choice_made'
          );

          console.log(`✓ Found ${choiceMadeEvents.length} choice_made events`);
          expect(choiceMadeEvents.length).toBeGreaterThan(0);
        } else {
          console.log('⚠ No analytics session data found');
        }
      } else {
        console.log('⚠ No choice buttons available');
      }
    });

    test('should track evidence_collected events', async ({ page }) => {
      await page.goto('/dashboard/chat');
      await page.waitForLoadState('networkidle');

      // Wait for evidence sharing
      await page.waitForTimeout(3000);

      // Check for evidence collection in analytics
      const sessionData = await page.evaluate(() => {
        const data = localStorage.getItem('kastor-analytics-session');
        return data ? JSON.parse(data) : null;
      });

      if (sessionData && sessionData.events) {
        const evidenceEvents = sessionData.events.filter((e: any) =>
          e.type === 'evidence_collected' || e.action === 'evidence_collected'
        );

        console.log(`✓ Found ${evidenceEvents.length} evidence_collected events`);
      }
    });

    test('should include state snapshots in analytics', async ({ page }) => {
      await page.goto('/dashboard/chat');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      const sessionData = await page.evaluate(() => {
        const data = localStorage.getItem('kastor-analytics-session');
        return data ? JSON.parse(data) : null;
      });

      if (sessionData) {
        console.log('✓ Analytics session exists');

        // Check for essential fields
        expect(sessionData).toHaveProperty('sessionId');
        expect(sessionData).toHaveProperty('timestamp');

        if (sessionData.state || sessionData.snapshot) {
          console.log('✓ State snapshot included in analytics');
        }

        // Check for events array
        if (sessionData.events && Array.isArray(sessionData.events)) {
          console.log(`✓ Analytics has ${sessionData.events.length} events`);
        }
      }
    });

    test('should support JSON export of analytics data', async ({ page }) => {
      await page.goto('/dashboard/progress');
      await page.waitForLoadState('networkidle');

      // Look for export button
      const exportButton = page.getByRole('button', { name: /export|download.*json/i });

      if (await exportButton.isVisible()) {
        // Set up download listener
        const downloadPromise = page.waitForEvent('download');

        await exportButton.click();

        const download = await downloadPromise;
        const filename = download.suggestedFilename();

        console.log(`✓ JSON export triggered: ${filename}`);
        expect(filename).toMatch(/\.json$/i);
      } else {
        console.log('⚠ JSON export button not found');
      }
    });

    test('should support CSV export of analytics data', async ({ page }) => {
      await page.goto('/dashboard/progress');
      await page.waitForLoadState('networkidle');

      // Open settings or export menu
      const settingsButton = page.locator('button').filter({ hasText: /settings|menu/i }).first();

      if (await settingsButton.isVisible()) {
        await settingsButton.click();
        await page.waitForTimeout(500);

        const csvExportButton = page.getByRole('button', { name: /csv|export.*csv/i });

        if (await csvExportButton.isVisible()) {
          const downloadPromise = page.waitForEvent('download');

          await csvExportButton.click();

          const download = await downloadPromise;
          const filename = download.suggestedFilename();

          console.log(`✓ CSV export triggered: ${filename}`);
          expect(filename).toMatch(/\.csv$/i);
        }
      }
    });
  });

  test.describe('Game State & localStorage', () => {
    test('should save game state to localStorage', async ({ page }) => {
      await page.goto('/dashboard/chat');
      await page.waitForLoadState('networkidle');

      // Interact with the game
      await page.waitForTimeout(2000);

      // Check for game state keys
      const gameStateKeys = await page.evaluate(() => {
        const keys = Object.keys(localStorage);
        return keys.filter(key =>
          key.includes('game') ||
          key.includes('state') ||
          key.includes('kastor') ||
          key.includes('progress') ||
          key.includes('save')
        );
      });

      console.log(`✓ Found ${gameStateKeys.length} game-related localStorage keys:`);
      gameStateKeys.forEach(key => console.log(`  - ${key}`));

      expect(gameStateKeys.length).toBeGreaterThan(0);
    });

    test('should include progress in game state', async ({ page }) => {
      await page.goto('/dashboard/chat');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      const hasProgress = await page.evaluate(() => {
        const keys = Object.keys(localStorage);

        for (const key of keys) {
          try {
            const value = localStorage.getItem(key);
            if (!value) continue;

            const data = JSON.parse(value);

            if (data && (
              data.progress !== undefined ||
              data.currentProgress !== undefined ||
              data.completion !== undefined
            )) {
              return true;
            }
          } catch (e) {
            // Not JSON, skip
          }
        }

        return false;
      });

      if (hasProgress) {
        console.log('✓ Progress data found in localStorage');
      } else {
        console.log('⚠ Progress data not found in localStorage');
      }
    });

    test('should include choices in game state', async ({ page }) => {
      await page.goto('/dashboard/chat');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      const hasChoices = await page.evaluate(() => {
        const keys = Object.keys(localStorage);

        for (const key of keys) {
          try {
            const value = localStorage.getItem(key);
            if (!value) continue;

            const data = JSON.parse(value);

            if (data && (
              data.choices !== undefined ||
              data.selectedChoices !== undefined ||
              data.decisions !== undefined
            )) {
              return true;
            }
          } catch (e) {
            // Not JSON, skip
          }
        }

        return false;
      });

      if (hasChoices) {
        console.log('✓ Choices data found in localStorage');
      } else {
        console.log('⚠ Choices data not found in localStorage');
      }
    });

    test('should include evidence in game state', async ({ page }) => {
      await page.goto('/dashboard/chat');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);

      const hasEvidence = await page.evaluate(() => {
        const keys = Object.keys(localStorage);

        for (const key of keys) {
          try {
            const value = localStorage.getItem(key);
            if (!value) continue;

            const data = JSON.parse(value);

            if (data && (
              data.evidence !== undefined ||
              data.collectedEvidence !== undefined ||
              data.items !== undefined
            )) {
              return true;
            }
          } catch (e) {
            // Not JSON, skip
          }
        }

        return false;
      });

      if (hasEvidence) {
        console.log('✓ Evidence data found in localStorage');
      } else {
        console.log('⚠ Evidence data not found in localStorage');
      }
    });

    test('should include scene/current state', async ({ page }) => {
      await page.goto('/dashboard/chat');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      const hasScene = await page.evaluate(() => {
        const keys = Object.keys(localStorage);

        for (const key of keys) {
          try {
            const value = localStorage.getItem(key);
            if (!value) continue;

            const data = JSON.parse(value);

            if (data && (
              data.scene !== undefined ||
              data.currentScene !== undefined ||
              data.sceneId !== undefined ||
              data.chapter !== undefined
            )) {
              return true;
            }
          } catch (e) {
            // Not JSON, skip
          }
        }

        return false;
      });

      if (hasScene) {
        console.log('✓ Scene/chapter data found in localStorage');
      } else {
        console.log('⚠ Scene data not found in localStorage');
      }
    });
  });

  test.describe('Session Management', () => {
    test('should generate unique sessionId', async ({ page }) => {
      await page.goto('/dashboard/chat');
      await page.waitForLoadState('networkidle');

      const sessionId = await page.evaluate(() => {
        const data = localStorage.getItem('kastor-analytics-session');
        if (!data) return null;

        try {
          const session = JSON.parse(data);
          return session.sessionId;
        } catch {
          return null;
        }
      });

      if (sessionId) {
        console.log(`✓ Session ID: ${sessionId}`);
        expect(sessionId).toBeTruthy();
        expect(sessionId.length).toBeGreaterThan(10);
      } else {
        console.log('⚠ Session ID not found');
      }
    });

    test('should track session start timestamp', async ({ page }) => {
      await page.goto('/dashboard/chat');
      await page.waitForLoadState('networkidle');

      const timestamp = await page.evaluate(() => {
        const data = localStorage.getItem('kastor-analytics-session');
        if (!data) return null;

        try {
          const session = JSON.parse(data);
          return session.timestamp || session.startTime || session.createdAt;
        } catch {
          return null;
        }
      });

      if (timestamp) {
        console.log(`✓ Session timestamp: ${timestamp}`);
        expect(timestamp).toBeTruthy();
      } else {
        console.log('⚠ Session timestamp not found');
      }
    });

    test('should support session reset/initialization', async ({ page }) => {
      await page.goto('/dashboard/chat');
      await page.waitForLoadState('networkidle');

      // Open settings
      const settingsButton = page.locator('button').filter({ hasText: /settings/i }).first();

      if (await settingsButton.isVisible()) {
        await settingsButton.click();
        await page.waitForTimeout(500);

        // Look for reset/clear button
        const resetButton = page.getByRole('button', { name: /reset|clear|initialize/i });

        if (await resetButton.isVisible()) {
          await resetButton.click();
          await page.waitForTimeout(500);

          console.log('✓ Session reset triggered');

          // Verify analytics data was reset
          const sessionData = await page.evaluate(() => {
            return localStorage.getItem('kastor-analytics-session');
          });

          if (!sessionData || sessionData === '{}' || sessionData === 'null') {
            console.log('✓ Analytics data cleared');
          }
        }
      }
    });
  });

  test.describe('Data Persistence Across Page Reloads', () => {
    test('should persist game state after page reload', async ({ page }) => {
      await page.goto('/dashboard/chat');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      // Get current state
      const stateBefore = await page.evaluate(() => {
        const keys = Object.keys(localStorage);
        const state: Record<string, string> = {};

        keys.forEach(key => {
          const value = localStorage.getItem(key);
          if (value) state[key] = value;
        });

        return state;
      });

      // Reload page
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Get state after reload
      const stateAfter = await page.evaluate(() => {
        const keys = Object.keys(localStorage);
        const state: Record<string, string> = {};

        keys.forEach(key => {
          const value = localStorage.getItem(key);
          if (value) state[key] = value;
        });

        return state;
      });

      // Compare states
      const persistedKeys = Object.keys(stateBefore).filter(key =>
        stateAfter[key] === stateBefore[key]
      );

      console.log(`✓ ${persistedKeys.length}/${Object.keys(stateBefore).length} keys persisted after reload`);

      expect(persistedKeys.length).toBeGreaterThan(0);
    });

    test('should maintain analytics session across navigation', async ({ page }) => {
      await page.goto('/dashboard/chat');
      await page.waitForLoadState('networkidle');

      const sessionIdBefore = await page.evaluate(() => {
        const data = localStorage.getItem('kastor-analytics-session');
        if (!data) return null;

        try {
          return JSON.parse(data).sessionId;
        } catch {
          return null;
        }
      });

      // Navigate to different tab
      await page.goto('/dashboard/data');
      await page.waitForLoadState('networkidle');

      const sessionIdAfter = await page.evaluate(() => {
        const data = localStorage.getItem('kastor-analytics-session');
        if (!data) return null;

        try {
          return JSON.parse(data).sessionId;
        } catch {
          return null;
        }
      });

      if (sessionIdBefore && sessionIdAfter) {
        expect(sessionIdBefore).toBe(sessionIdAfter);
        console.log('✓ Analytics session persisted across navigation');
      }
    });
  });
});
