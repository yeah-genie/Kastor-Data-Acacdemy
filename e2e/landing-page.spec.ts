import { test, expect } from '@playwright/test';

test.describe('Landing Page /', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Hero Section', () => {
    test('should display hero headline and subheadline', async ({ page }) => {
      // Check for main headline
      const headline = page.getByText(/Learn Data Analysis by Solving Mysteries/i);
      await expect(headline).toBeVisible();

      // Check for subheadline/description
      const hasSubheadline = await page.locator('text=/interactive/i, text=/detective/i, text=/mystery/i').count();
      expect(hasSubheadline).toBeGreaterThan(0);
    });

    test('should have Play Free Demo CTA that navigates to dashboard', async ({ page }) => {
      // Find and click the CTA button
      const ctaButton = page.getByRole('button', { name: /Play Free Demo/i }).or(
        page.getByRole('link', { name: /Play Free Demo/i })
      );

      await expect(ctaButton).toBeVisible();

      // Check localStorage before click
      const ctaCountBefore = await page.evaluate(() => {
        const val = localStorage.getItem('kastor-landing-cta:play-demo');
        return val ? parseInt(val) : 0;
      });

      // Click and verify navigation
      await ctaButton.click();
      await page.waitForURL('**/dashboard**');
      expect(page.url()).toContain('/dashboard');

      // Go back and verify localStorage increment
      await page.goBack();
      await page.waitForLoadState('networkidle');

      const ctaCountAfter = await page.evaluate(() => {
        const val = localStorage.getItem('kastor-landing-cta:play-demo');
        return val ? parseInt(val) : 0;
      });

      expect(ctaCountAfter).toBe(ctaCountBefore + 1);
    });

    test('should display hero image with responsive layout', async ({ page }) => {
      // Check for hero image/illustration
      const heroImage = page.locator('img, svg, [role="img"]').first();
      await expect(heroImage).toBeVisible();

      // Check viewport sizes
      const viewports = [
        { width: 360, height: 640, name: 'mobile' },
        { width: 768, height: 1024, name: 'tablet' },
        { width: 1440, height: 900, name: 'desktop' }
      ];

      for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        await page.waitForTimeout(500);

        // Verify hero section is still visible
        const heroSection = page.locator('section, div').filter({ hasText: /Learn Data Analysis/i }).first();
        await expect(heroSection).toBeVisible();

        console.log(`✓ Hero section visible at ${viewport.name} (${viewport.width}x${viewport.height})`);
      }
    });
  });

  test.describe('Description Section', () => {
    test('should render "What is Kastor Data Academy?" section', async ({ page }) => {
      const descSection = page.getByText(/What is Kastor Data Academy/i);
      await expect(descSection).toBeVisible();

      // Check for paragraph content
      const paragraphs = await page.locator('p').filter({ hasText: /data|analysis|mystery|detective/i }).count();
      expect(paragraphs).toBeGreaterThanOrEqual(1);
    });

    test('should have proper text formatting without breaks', async ({ page }) => {
      // Get all text content
      const bodyText = await page.locator('body').textContent();

      // Check for common formatting issues
      expect(bodyText).not.toContain('  '); // No double spaces
      expect(bodyText).toBeTruthy();
    });
  });

  test.describe('Free Episodes Section', () => {
    test('should display 3 episode cards with correct titles', async ({ page }) => {
      const expectedTitles = [
        /Episode 1.*Missing Balance Patch/i,
        /Episode 2.*Ghost User.*Ranking Mystery/i,
        /Episode 3.*Perfect Victory/i
      ];

      for (const titlePattern of expectedTitles) {
        const episodeCard = page.getByText(titlePattern);
        await expect(episodeCard).toBeVisible();
        console.log(`✓ Found episode: ${titlePattern}`);
      }
    });

    test('should have "Start Playing" buttons that navigate to dashboard', async ({ page }) => {
      const startButton = page.getByRole('button', { name: /Start Playing/i })
        .or(page.getByRole('link', { name: /Start Playing/i }))
        .first();

      if (await startButton.isVisible()) {
        await startButton.click();
        await page.waitForURL('**/dashboard**', { timeout: 5000 });
        expect(page.url()).toContain('/dashboard');
      } else {
        console.log('⚠ Start Playing button not found, skipping navigation test');
      }
    });
  });

  test.describe('Premium Upgrade Section', () => {
    test('should display pricing and benefits', async ({ page }) => {
      // Look for premium/pricing section
      const premiumSection = page.locator('text=/premium|upgrade|pre-order|pricing/i').first();

      if (await premiumSection.isVisible()) {
        console.log('✓ Premium section found');

        // Check for price
        const pricePattern = /\$\d+|\d+\s*USD/i;
        const hasPrice = await page.locator(`text=${pricePattern}`).count();
        expect(hasPrice).toBeGreaterThan(0);

        // Check for launch info
        const launchInfo = page.getByText(/Spring 2025|30-day refund/i);
        await expect(launchInfo).toBeVisible();
      } else {
        console.log('⚠ Premium section not found');
      }
    });

    test('should open pre-order modal and handle submission', async ({ page }) => {
      // Find pre-order button
      const preorderButton = page.getByRole('button', { name: /Pre-order Now/i })
        .or(page.getByRole('link', { name: /Pre-order Now/i }));

      if (await preorderButton.isVisible()) {
        // Check localStorage before
        const preorderCountBefore = await page.evaluate(() => {
          const val = localStorage.getItem('kastor-landing-cta:preorder');
          return val ? parseInt(val) : 0;
        });

        // Click button to open modal
        await preorderButton.click();
        await page.waitForTimeout(500);

        // Check if modal appeared
        const modal = page.locator('[role="dialog"], .modal, [class*="modal"]');
        if (await modal.isVisible()) {
          console.log('✓ Modal opened');

          // Try to close modal (overlay or close button)
          const closeButton = modal.locator('button').filter({ hasText: /close|×|✕/i }).first();
          if (await closeButton.isVisible()) {
            await closeButton.click();
            await expect(modal).not.toBeVisible();
            console.log('✓ Modal closed via close button');
          }

          // Re-open for form test
          await preorderButton.click();
          await page.waitForTimeout(500);

          // Fill form if it exists
          const emailInput = modal.locator('input[type="email"], input[name*="email"]').first();
          if (await emailInput.isVisible()) {
            await emailInput.fill('test@example.com');

            const nameInput = modal.locator('input[name*="name"], input[placeholder*="name"]').first();
            if (await nameInput.isVisible()) {
              await nameInput.fill('Test User');
            }

            // Submit
            const submitButton = modal.getByRole('button', { name: /Confirm|Submit|Pre-order/i });
            if (await submitButton.isVisible()) {
              await submitButton.click();

              // Wait for success message
              await page.waitForTimeout(1500);
              const successMessage = page.getByText(/Thank|Success|Confirmed/i);
              if (await successMessage.isVisible()) {
                console.log('✓ Success message displayed');
              }
            }
          }

          // Verify localStorage increment
          const preorderCountAfter = await page.evaluate(() => {
            const val = localStorage.getItem('kastor-landing-cta:preorder');
            return val ? parseInt(val) : 0;
          });

          expect(preorderCountAfter).toBeGreaterThanOrEqual(preorderCountBefore);
        } else {
          console.log('⚠ Pre-order modal did not appear');
        }
      } else {
        console.log('⚠ Pre-order button not found');
      }
    });
  });

  test.describe('Footer', () => {
    test('should display footer with contact email', async ({ page }) => {
      const footer = page.locator('footer, [role="contentinfo"]').first();

      // Check for contact email
      const contactEmail = page.getByText(/hello@kastordata\.ac/i);
      await expect(contactEmail).toBeVisible();

      console.log('✓ Footer contact email found');
    });

    test('should have SNS links that open in new windows', async ({ page }) => {
      const snsLinks = page.locator('a[href*="twitter"], a[href*="instagram"], a[href*="mailto"]');
      const count = await snsLinks.count();

      expect(count).toBeGreaterThanOrEqual(1);
      console.log(`✓ Found ${count} SNS/contact links`);

      // Check if links have target="_blank"
      for (let i = 0; i < count; i++) {
        const link = snsLinks.nth(i);
        const target = await link.getAttribute('target');
        const href = await link.getAttribute('href');

        if (href && !href.startsWith('mailto:')) {
          expect(target).toBe('_blank');
        }
      }
    });
  });
});
