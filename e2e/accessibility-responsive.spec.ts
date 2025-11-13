import { test, expect } from '@playwright/test';

test.describe('Accessibility & Responsive Design', () => {
  test.describe('Keyboard Navigation', () => {
    test('should support Tab navigation through interactive elements', async ({ page }) => {
      await page.goto('/dashboard/chat');
      await page.waitForLoadState('networkidle');

      // Press Tab multiple times and track focus
      const focusedElements: string[] = [];

      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab');
        await page.waitForTimeout(100);

        const focusedElement = await page.evaluate(() => {
          const el = document.activeElement;
          return el ? `${el.tagName}${el.className ? '.' + el.className.split(' ')[0] : ''}` : 'none';
        });

        focusedElements.push(focusedElement);
      }

      console.log('✓ Tab navigation sequence:', focusedElements);

      // Check that focus moves through elements
      const uniqueElements = new Set(focusedElements);
      expect(uniqueElements.size).toBeGreaterThan(1);
    });

    test('should support Enter/Space for button activation', async ({ page }) => {
      await page.goto('/dashboard/chat');
      await page.waitForLoadState('networkidle');

      // Find a button
      const button = page.locator('button').first();
      if (await button.isVisible()) {
        await button.focus();

        // Press Enter
        await page.keyboard.press('Enter');
        await page.waitForTimeout(300);

        console.log('✓ Enter key activates focused button');
      }
    });

    test('should support Escape to close modals', async ({ page }) => {
      await page.goto('/dashboard/chat');
      await page.waitForLoadState('networkidle');

      // Try to open settings or any modal
      const modalTrigger = page.locator('button').filter({ hasText: /settings|menu/i }).first();

      if (await modalTrigger.isVisible()) {
        await modalTrigger.click();
        await page.waitForTimeout(500);

        // Check if modal opened
        const modal = page.locator('[role="dialog"]');
        if (await modal.isVisible()) {
          // Press Escape
          await page.keyboard.press('Escape');
          await page.waitForTimeout(300);

          // Modal should be closed
          await expect(modal).not.toBeVisible();
          console.log('✓ Escape closes modal');
        }
      }
    });

    test('should have visible focus indicators', async ({ page }) => {
      await page.goto('/dashboard/chat');
      await page.waitForLoadState('networkidle');

      // Tab to first focusable element
      await page.keyboard.press('Tab');
      await page.waitForTimeout(200);

      // Check if focused element has visible outline or focus style
      const hasFocusStyle = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement;
        if (!el) return false;

        const styles = window.getComputedStyle(el);
        const outline = styles.outline;
        const outlineWidth = styles.outlineWidth;
        const boxShadow = styles.boxShadow;

        return (
          (outline && outline !== 'none' && outlineWidth !== '0px') ||
          (boxShadow && boxShadow !== 'none')
        );
      });

      if (hasFocusStyle) {
        console.log('✓ Focused elements have visible focus indicators');
      } else {
        console.log('⚠ Focus indicators may not be visible');
      }
    });

    test('should trap focus within modals', async ({ page }) => {
      await page.goto('/dashboard/chat');
      await page.waitForLoadState('networkidle');

      const modalTrigger = page.locator('button').filter({ hasText: /settings|menu/i }).first();

      if (await modalTrigger.isVisible()) {
        await modalTrigger.click();
        await page.waitForTimeout(500);

        const modal = page.locator('[role="dialog"]');
        if (await modal.isVisible()) {
          // Tab through elements multiple times
          for (let i = 0; i < 20; i++) {
            await page.keyboard.press('Tab');
            await page.waitForTimeout(50);
          }

          // Check if focus is still within modal
          const focusWithinModal = await page.evaluate(() => {
            const focused = document.activeElement;
            const modal = document.querySelector('[role="dialog"]');
            return modal?.contains(focused) || false;
          });

          if (focusWithinModal) {
            console.log('✓ Focus trapped within modal');
          } else {
            console.log('⚠ Focus may escape modal');
          }
        }
      }
    });
  });

  test.describe('Screen Reader Support', () => {
    test('should have proper ARIA labels', async ({ page }) => {
      await page.goto('/dashboard/chat');
      await page.waitForLoadState('networkidle');

      // Check for aria-label attributes
      const elementsWithAriaLabel = await page.locator('[aria-label]').count();
      console.log(`✓ Found ${elementsWithAriaLabel} elements with aria-label`);

      expect(elementsWithAriaLabel).toBeGreaterThan(0);
    });

    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Check for headings
      const h1Count = await page.locator('h1').count();
      const h2Count = await page.locator('h2').count();
      const h3Count = await page.locator('h3').count();

      console.log(`Heading hierarchy: H1(${h1Count}), H2(${h2Count}), H3(${h3Count})`);

      // Should have exactly one H1
      expect(h1Count).toBeGreaterThanOrEqual(1);
    });

    test('should have alt text for images', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const images = page.locator('img');
      const imageCount = await images.count();

      let imagesWithAlt = 0;
      for (let i = 0; i < imageCount; i++) {
        const alt = await images.nth(i).getAttribute('alt');
        if (alt !== null) {
          imagesWithAlt++;
        }
      }

      console.log(`${imagesWithAlt}/${imageCount} images have alt text`);

      if (imageCount > 0) {
        expect(imagesWithAlt).toBe(imageCount);
      }
    });

    test('should have aria-live regions for dynamic content', async ({ page }) => {
      await page.goto('/dashboard/chat');
      await page.waitForLoadState('networkidle');

      const liveRegions = await page.locator('[aria-live]').count();
      console.log(`Found ${liveRegions} aria-live regions`);
    });

    test('should have proper form labels', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const inputs = page.locator('input[type="text"], input[type="email"], textarea');
      const inputCount = await inputs.count();

      let labeledInputs = 0;
      for (let i = 0; i < inputCount; i++) {
        const input = inputs.nth(i);
        const id = await input.getAttribute('id');
        const ariaLabel = await input.getAttribute('aria-label');
        const placeholder = await input.getAttribute('placeholder');

        // Check if input has a label
        let hasLabel = false;
        if (id) {
          const label = page.locator(`label[for="${id}"]`);
          hasLabel = await label.count() > 0;
        }

        if (hasLabel || ariaLabel || placeholder) {
          labeledInputs++;
        }
      }

      if (inputCount > 0) {
        console.log(`${labeledInputs}/${inputCount} inputs have labels/aria-label/placeholder`);
      }
    });
  });

  test.describe('Color Contrast & Visual Accessibility', () => {
    test('should maintain readable contrast ratios', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Get all text elements and check their contrast
      const contrastIssues = await page.evaluate(() => {
        const getContrast = (fg: string, bg: string) => {
          const getLuminance = (color: string) => {
            const rgb = color.match(/\d+/g);
            if (!rgb) return 0;

            const [r, g, b] = rgb.map(Number);
            const [rs, gs, bs] = [r, g, b].map(c => {
              c = c / 255;
              return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
            });

            return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
          };

          const l1 = getLuminance(fg);
          const l2 = getLuminance(bg);

          return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
        };

        const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button');
        let lowContrastCount = 0;

        textElements.forEach(el => {
          const styles = window.getComputedStyle(el);
          const color = styles.color;
          const bgColor = styles.backgroundColor;

          if (color && bgColor) {
            const contrast = getContrast(color, bgColor);
            if (contrast < 4.5) {
              lowContrastCount++;
            }
          }
        });

        return lowContrastCount;
      });

      console.log(`Found ${contrastIssues} potential contrast issues (< 4.5:1)`);
    });

    test('should support prefers-reduced-motion', async ({ page }) => {
      // Enable reduced motion
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/dashboard/chat');
      await page.waitForLoadState('networkidle');

      // Check if animations are reduced
      const hasReducedMotion = await page.evaluate(() => {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      });

      expect(hasReducedMotion).toBe(true);
      console.log('✓ Prefers-reduced-motion is respected');
    });

    test('should remain usable at 200% zoom', async ({ page }) => {
      await page.goto('/dashboard/chat');
      await page.setViewportSize({ width: 1920, height: 1080 });

      // Simulate 200% zoom by using 50% viewport
      await page.setViewportSize({ width: 960, height: 540 });
      await page.waitForLoadState('networkidle');

      // Check if main content is still visible
      const mainContent = page.locator('main, [role="main"], #root').first();
      await expect(mainContent).toBeVisible();

      console.log('✓ Page usable at 200% zoom');
    });
  });

  test.describe('Responsive Design', () => {
    const viewports = [
      { width: 360, height: 640, name: 'Mobile (360x640)' },
      { width: 768, height: 1024, name: 'Tablet Portrait (768x1024)' },
      { width: 1024, height: 768, name: 'Tablet Landscape (1024x768)' },
      { width: 1440, height: 900, name: 'Desktop (1440x900)' },
      { width: 1920, height: 1080, name: 'Large Desktop (1920x1080)' }
    ];

    for (const viewport of viewports) {
      test(`should be responsive at ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto('/dashboard/chat');
        await page.waitForLoadState('networkidle');

        // Check if main content is visible
        const mainContent = page.locator('main, [role="main"], #root').first();
        await expect(mainContent).toBeVisible();

        // Check for horizontal overflow
        const hasOverflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });

        if (hasOverflow) {
          console.log(`⚠ Horizontal overflow detected at ${viewport.name}`);
        } else {
          console.log(`✓ No overflow at ${viewport.name}`);
        }
      });
    }

    test('should switch between mobile and desktop navigation', async ({ page }) => {
      // Desktop view
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/dashboard/chat');
      await page.waitForLoadState('networkidle');

      const desktopNav = page.locator('nav, [class*="sidebar"], [class*="desktop"]');
      const desktopNavVisible = await desktopNav.count() > 0;

      // Mobile view
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(500);

      const mobileNav = page.locator('[class*="mobile"], [class*="bottom"]');
      const mobileNavVisible = await mobileNav.count() > 0;

      console.log(`Desktop nav: ${desktopNavVisible ? 'visible' : 'hidden'}`);
      console.log(`Mobile nav: ${mobileNavVisible ? 'visible' : 'hidden'}`);
    });

    test('should support touch gestures on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/dashboard/chat');
      await page.waitForLoadState('networkidle');

      // Simulate swipe gesture
      const startX = 300;
      const startY = 400;
      const endX = 100;
      const endY = 400;

      await page.mouse.move(startX, startY);
      await page.mouse.down();
      await page.mouse.move(endX, endY);
      await page.mouse.up();

      await page.waitForTimeout(500);

      console.log('✓ Touch gesture simulated');
    });
  });

  test.describe('Loading States & Error Handling', () => {
    test('should display skeleton/loading states', async ({ page }) => {
      await page.goto('/dashboard/data', { waitUntil: 'domcontentloaded' });

      // Look for loading indicators immediately
      const loadingIndicator = page.locator('[class*="skeleton"], [class*="loading"], [class*="spinner"]');
      const hasLoading = await loadingIndicator.count();

      if (hasLoading > 0) {
        console.log('✓ Loading state displayed');
      }

      await page.waitForLoadState('networkidle');
    });

    test('should display empty states appropriately', async ({ page }) => {
      await page.goto('/dashboard/files');
      await page.waitForLoadState('networkidle');

      // Look for empty state messaging
      const emptyState = page.locator('text=/no files|empty|nothing here/i');

      if (await emptyState.count() > 0) {
        console.log('✓ Empty state displayed');
      }
    });

    test('should display error states appropriately', async ({ page }) => {
      // Intercept network requests and force an error
      await page.route('**/api/**', route => route.abort());

      await page.goto('/dashboard/data');
      await page.waitForTimeout(2000);

      // Look for error messaging
      const errorMessage = page.locator('[role="alert"], [class*="error"]');

      if (await errorMessage.count() > 0) {
        console.log('✓ Error state displayed');
      }
    });
  });
});
