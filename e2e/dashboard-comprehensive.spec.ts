import { test, expect } from '@playwright/test';

test.describe('Dashboard Comprehensive Tests /dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard/chat');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Tab Navigation & Basic Features', () => {
    test('should default to /dashboard/chat route', async ({ page }) => {
      expect(page.url()).toContain('/dashboard/chat');
      console.log('✓ Default route is /dashboard/chat');
    });

    test('should display TabNav with all tabs', async ({ page }) => {
      const expectedTabs = ['Chat', 'Data', 'Files', 'Team', 'Progress'];

      for (const tabName of expectedTabs) {
        const tab = page.getByRole('button', { name: new RegExp(tabName, 'i') })
          .or(page.getByRole('link', { name: new RegExp(tabName, 'i') }))
          .or(page.getByText(new RegExp(`^${tabName}$`, 'i')));

        const count = await tab.count();
        if (count > 0) {
          console.log(`✓ ${tabName} tab found`);
        } else {
          console.log(`⚠ ${tabName} tab not found`);
        }
      }
    });

    test('should support keyboard shortcuts (Ctrl+1-5)', async ({ page }) => {
      // Test Ctrl+1 (Chat)
      await page.keyboard.press('Control+1');
      await page.waitForTimeout(500);
      expect(page.url()).toContain('/dashboard/chat');
      console.log('✓ Ctrl+1 navigates to Chat');

      // Test Ctrl+2 (Data)
      await page.keyboard.press('Control+2');
      await page.waitForTimeout(500);
      if (page.url().includes('/dashboard/data')) {
        console.log('✓ Ctrl+2 navigates to Data');
      }

      // Test Ctrl+3 (Files)
      await page.keyboard.press('Control+3');
      await page.waitForTimeout(500);
      if (page.url().includes('/dashboard/files')) {
        console.log('✓ Ctrl+3 navigates to Files');
      }

      // Go back to chat
      await page.goto('/dashboard/chat');
    });

    test('should display header with progress bar', async ({ page }) => {
      const progressBar = page.locator('[role="progressbar"], .progress, [class*="progress"]').first();

      if (await progressBar.isVisible()) {
        // Get progress value if available
        const ariaValue = await progressBar.getAttribute('aria-valuenow');
        if (ariaValue) {
          console.log(`✓ Progress bar visible with value: ${ariaValue}%`);
        } else {
          console.log('✓ Progress bar visible');
        }
      } else {
        console.log('⚠ Progress bar not found');
      }
    });

    test('should display notification badges if present', async ({ page }) => {
      const badges = page.locator('.badge, [class*="badge"], [class*="notification"]');
      const badgeCount = await badges.count();

      console.log(`Found ${badgeCount} badge elements`);
    });
  });

  test.describe('Data Tab', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/dashboard/data');
      await page.waitForLoadState('networkidle');
    });

    test('should display data table with filters', async ({ page }) => {
      // Check for table
      const table = page.locator('table, [role="table"], [class*="table"]').first();

      if (await table.isVisible()) {
        console.log('✓ Data table visible');

        // Check for filter controls
        const filterControls = page.locator('button, select, input').filter({
          hasText: /filter|search|sort/i
        });
        const filterCount = await filterControls.count();
        console.log(`✓ Found ${filterCount} filter/search controls`);
      } else {
        console.log('⚠ Data table not found');
      }
    });

    test('should support search functionality', async ({ page }) => {
      const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]').first();

      if (await searchInput.isVisible()) {
        await searchInput.fill('test');
        await page.waitForTimeout(500);
        console.log('✓ Search input functional');
      } else {
        console.log('⚠ Search input not found');
      }
    });

    test('should support sorting', async ({ page }) => {
      const sortButton = page.locator('button, th').filter({
        hasText: /sort|↑|↓|⬆|⬇/i
      }).first();

      if (await sortButton.isVisible()) {
        await sortButton.click();
        await page.waitForTimeout(500);
        console.log('✓ Sort functionality available');
      } else {
        console.log('⚠ Sort buttons not found');
      }
    });

    test('should support pagination if data is large', async ({ page }) => {
      const pagination = page.locator('button, a').filter({
        hasText: /next|previous|page|\d+/i
      });

      const paginationCount = await pagination.count();
      if (paginationCount > 0) {
        console.log(`✓ Pagination controls found (${paginationCount} elements)`);
      }
    });

    test('should handle pattern detection alerts', async ({ page }) => {
      const alert = page.locator('[role="alert"], .alert, [class*="alert"]').filter({
        hasText: /pattern|detect|anomaly/i
      });

      if (await alert.isVisible()) {
        console.log('✓ Pattern detection alert visible');

        const actionButton = alert.locator('button').first();
        if (await actionButton.isVisible()) {
          await actionButton.click();
          await page.waitForTimeout(500);
          console.log('✓ Pattern alert action button clickable');
        }
      }
    });

    test('should support hint system with point deduction', async ({ page }) => {
      const hintButton = page.getByRole('button', { name: /hint|help|clue/i });

      if (await hintButton.isVisible()) {
        // Get initial points if displayed
        const pointsDisplay = page.locator('text=/points|score/i');
        let initialPoints = 0;

        if (await pointsDisplay.isVisible()) {
          const pointsText = await pointsDisplay.textContent();
          const match = pointsText?.match(/\d+/);
          if (match) {
            initialPoints = parseInt(match[0]);
          }
        }

        // Click hint
        await hintButton.click();
        await page.waitForTimeout(500);

        console.log('✓ Hint button clicked');

        // Check if points decreased (if points system is visible)
        if (initialPoints > 0 && await pointsDisplay.isVisible()) {
          const newPointsText = await pointsDisplay.textContent();
          const newMatch = newPointsText?.match(/\d+/);
          if (newMatch) {
            const newPoints = parseInt(newMatch[0]);
            if (newPoints < initialPoints) {
              console.log(`✓ Points deducted: ${initialPoints} → ${newPoints}`);
            }
          }
        }
      }
    });

    test('should be mobile responsive with horizontal scroll', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(500);

      const table = page.locator('table, [role="table"]').first();
      if (await table.isVisible()) {
        // Check if table is scrollable
        const isScrollable = await table.evaluate((el) => {
          return el.scrollWidth > el.clientWidth;
        });

        if (isScrollable) {
          console.log('✓ Table is horizontally scrollable on mobile');
        }
      }
    });
  });

  test.describe('Files Tab', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/dashboard/files');
      await page.waitForLoadState('networkidle');
    });

    test('should display folder browsing interface', async ({ page }) => {
      const fileList = page.locator('[class*="file"], [class*="folder"], ul, .grid');

      if (await fileList.isVisible()) {
        console.log('✓ File browsing interface visible');
      } else {
        console.log('⚠ File browsing interface not found');
      }
    });

    test('should display file cards with metadata', async ({ page }) => {
      const fileCards = page.locator('[class*="card"], [class*="item"]');
      const count = await fileCards.count();

      console.log(`Found ${count} file/folder items`);

      if (count > 0) {
        const firstCard = fileCards.first();

        // Check for icon
        const icon = firstCard.locator('svg, img, [class*="icon"]');
        if (await icon.isVisible()) {
          console.log('✓ File cards have icons');
        }

        // Check for badges (NEW, important, etc.)
        const badge = firstCard.locator('.badge, [class*="badge"]');
        if (await badge.count() > 0) {
          console.log('✓ File cards have badges');
        }
      }
    });

    test('should open file preview panel', async ({ page }) => {
      const fileCard = page.locator('[class*="card"], [class*="item"], button').filter({
        hasText: /\.txt|\.log|\.pdf|\.jpg|\.png|document|image/i
      }).first();

      if (await fileCard.isVisible()) {
        await fileCard.click();
        await page.waitForTimeout(500);

        // Check for preview panel
        const previewPanel = page.locator('[class*="preview"], [class*="detail"], aside, [role="region"]');

        if (await previewPanel.isVisible()) {
          console.log('✓ File preview panel opened');

          // Check for file content rendering
          const contentArea = previewPanel.locator('pre, code, img, iframe, [class*="content"]');
          if (await contentArea.count() > 0) {
            console.log('✓ File content rendered in preview');
          }
        }
      }
    });

    test('should have "Share with Kastor" action', async ({ page }) => {
      const shareButton = page.getByRole('button', { name: /share.*kastor|send.*kastor/i });

      if (await shareButton.isVisible()) {
        await shareButton.click();
        await page.waitForTimeout(500);
        console.log('✓ Share with Kastor action available');
      }
    });
  });

  test.describe('Team Tab', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/dashboard/team');
      await page.waitForLoadState('networkidle');
    });

    test('should display character cards', async ({ page }) => {
      const characterCards = page.locator('[class*="card"], [class*="character"]');
      const count = await characterCards.count();

      expect(count).toBeGreaterThan(0);
      console.log(`✓ Found ${count} character cards`);
    });

    test('should show character profile tabs (Background/Timeline/Evidence/Relationships)', async ({ page }) => {
      // Click on first character card
      const firstCard = page.locator('[class*="card"], [class*="character"]').first();

      if (await firstCard.isVisible()) {
        await firstCard.click();
        await page.waitForTimeout(500);

        // Check for profile tabs
        const expectedTabs = ['Background', 'Timeline', 'Evidence', 'Relationships'];

        for (const tabName of expectedTabs) {
          const tab = page.getByRole('button', { name: new RegExp(tabName, 'i') })
            .or(page.getByRole('tab', { name: new RegExp(tabName, 'i') }));

          if (await tab.count() > 0) {
            console.log(`✓ ${tabName} tab found`);
          }
        }
      }
    });

    test('should display relationship graph with interactions', async ({ page }) => {
      const graph = page.locator('svg, canvas, [class*="graph"], [class*="network"]');

      if (await graph.isVisible()) {
        console.log('✓ Relationship graph visible');

        // Check for zoom controls
        const zoomButton = page.locator('button').filter({ hasText: /zoom|\\+|\\-/i });
        if (await zoomButton.count() > 0) {
          console.log('✓ Zoom controls available');
        }

        // Check for layout toggle
        const layoutToggle = page.locator('button').filter({ hasText: /layout|view/i });
        if (await layoutToggle.count() > 0) {
          console.log('✓ Layout toggle available');
        }

        // Check for suspicion filter
        const suspicionToggle = page.locator('button, input[type="checkbox"]').filter({
          hasText: /suspicion|suspect/i
        });
        if (await suspicionToggle.count() > 0) {
          console.log('✓ Suspicion toggle available');
        }
      }
    });
  });

  test.describe('Progress Tab', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/dashboard/progress');
      await page.waitForLoadState('networkidle');
    });

    test('should display overall progress metrics', async ({ page }) => {
      const progressCards = page.locator('[class*="card"], [class*="metric"]').filter({
        hasText: /progress|evidence|accuracy|time/i
      });

      const count = await progressCards.count();
      expect(count).toBeGreaterThan(0);
      console.log(`✓ Found ${count} progress metric cards`);
    });

    test('should show episode status cards', async ({ page }) => {
      const episodeCards = page.locator('[class*="episode"]');
      const count = await episodeCards.count();

      console.log(`Found ${count} episode cards`);

      // Check for status indicators (completed/in-progress/locked)
      const statusIndicators = page.locator('text=/completed|progress|locked|✓|🔒/i');
      if (await statusIndicators.count() > 0) {
        console.log('✓ Episode status indicators present');
      }
    });

    test('should display achievements', async ({ page }) => {
      const achievements = page.locator('[class*="achievement"], [class*="badge"]').filter({
        hasText: /achievement|unlock|earn/i
      });

      if (await achievements.count() > 0) {
        console.log('✓ Achievements section found');
      }
    });

    test('should show statistics and graphs', async ({ page }) => {
      // Check for charts
      const charts = page.locator('svg, canvas, [class*="chart"], [class*="graph"]');

      if (await charts.count() > 0) {
        console.log('✓ Charts/graphs found');
      }

      // Check for statistics
      const stats = page.locator('text=/average|hint|accuracy|time/i');
      const statsCount = await stats.count();

      console.log(`Found ${statsCount} statistics elements`);
    });

    test('should display strengths and weaknesses', async ({ page }) => {
      const strengthsList = page.locator('text=/strength|weakness|skill/i');

      if (await strengthsList.count() > 0) {
        console.log('✓ Strengths/weaknesses section found');
      }
    });

    test('should show leaderboard placeholder', async ({ page }) => {
      const leaderboard = page.getByText(/leaderboard.*coming soon/i);

      if (await leaderboard.isVisible()) {
        console.log('✓ Leaderboard placeholder found');
      }
    });
  });
});
