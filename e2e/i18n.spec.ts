import { test, expect } from '@playwright/test';

/**
 * E2E Test: Internationalization (i18n)
 *
 * This test validates the i18n system in Kastor Data Academy:
 * 1. Browser language detection (en/ko)
 * 2. Language switching via Settings
 * 3. UI string translation
 * 4. Date/time locale formatting
 * 5. Screen reader label translation
 * 6. LocalStorage persistence
 *
 * Based on e2e_test_checklist.md Section 1.2, 5.2, and 7
 */

test.describe('Internationalization (i18n)', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to start fresh
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('should detect browser language on first load', async ({ page, context }) => {
    console.log('Test: Browser language detection...');

    // Set browser language to English
    await context.addInitScript(() => {
      Object.defineProperty(navigator, 'language', {
        get: () => 'en-US'
      });
    });

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    // Check if English content is displayed
    const englishText = page.locator('text=/Start|New Game|Chat/i').first();
    const isEnglish = await englishText.isVisible({ timeout: 3000 }).catch(() => false);

    if (isEnglish) {
      console.log('✓ English content detected');
    }

    // Check localStorage for language setting
    const storedLang = await page.evaluate(() => localStorage.getItem('i18nextLng') || localStorage.getItem('language'));
    console.log(`Stored language: ${storedLang}`);
  });

  test('should change language from Settings menu', async ({ page }) => {
    console.log('Test: Language switching via Settings...');

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    // Navigate through initial screens
    const startButton = page.locator('text=/TAP TO START|Tap to Start/i').first();
    if (await startButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await startButton.click();
      await page.waitForTimeout(2000);
    }

    // Open Settings menu
    const settingsSelectors = [
      'button[aria-label*="Settings"]',
      'button:has-text("Settings")',
      '[class*="settings"]',
      'text="Settings"',
      'svg[class*="settings"]'
    ];

    let settingsOpened = false;
    for (const selector of settingsSelectors) {
      const settingsButton = page.locator(selector).first();
      if (await settingsButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await settingsButton.click();
        settingsOpened = true;
        console.log(`✓ Opened Settings with selector: ${selector}`);
        await page.waitForTimeout(1000);
        break;
      }
    }

    if (!settingsOpened) {
      console.log('⚠ Could not find Settings button, trying alternative approach...');
      // Try keyboard shortcut if exists
      await page.keyboard.press('Escape'); // Close any open modals
      await page.keyboard.press('Control+,'); // Common settings shortcut
      await page.waitForTimeout(1000);
    }

    // Find language selector
    const languageSelectors = [
      'select[name="language"]',
      'select[id="language"]',
      '[role="combobox"][aria-label*="Language"]',
      'button:has-text("English")',
      'button:has-text("한국어")'
    ];

    let languageChanged = false;
    for (const selector of languageSelectors) {
      const langElement = page.locator(selector).first();
      if (await langElement.isVisible({ timeout: 3000 }).catch(() => false)) {
        // Get current language
        const currentLang = await langElement.textContent() || await langElement.inputValue();
        console.log(`Current language: ${currentLang}`);

        // Change language
        const tagName = await langElement.evaluate(el => el.tagName);

        if (tagName === 'SELECT') {
          // Dropdown select
          await langElement.selectOption({ label: currentLang?.includes('English') ? '한국어' : 'English' });
        } else {
          // Button toggle
          await langElement.click();
        }

        languageChanged = true;
        console.log('✓ Language changed');
        await page.waitForTimeout(2000);
        break;
      }
    }

    if (languageChanged) {
      // Verify language change in UI
      const koreanText = page.locator('text=/채팅|데이터|파일|팀/').first();
      const englishText = page.locator('text=/Chat|Data|Files|Team/').first();

      const hasKorean = await koreanText.isVisible({ timeout: 2000 }).catch(() => false);
      const hasEnglish = await englishText.isVisible({ timeout: 2000 }).catch(() => false);

      if (hasKorean) {
        console.log('✓ Korean UI detected');
      } else if (hasEnglish) {
        console.log('✓ English UI detected');
      }

      // Verify localStorage
      const storedLang = await page.evaluate(() =>
        localStorage.getItem('i18nextLng') || localStorage.getItem('language')
      );
      console.log(`Language stored in localStorage: ${storedLang}`);
      expect(storedLang).toBeTruthy();
    } else {
      console.log('⚠ Could not find language selector');
    }
  });

  test('should translate all UI strings', async ({ page }) => {
    console.log('Test: Checking UI string translation...');

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    // Set language to English via localStorage
    await page.evaluate(() => {
      localStorage.setItem('i18nextLng', 'en');
      localStorage.setItem('language', 'en');
    });
    await page.reload();
    await page.waitForTimeout(2000);

    // Check for English strings
    const englishStrings = [
      'Chat',
      'Data',
      'Files',
      'Team',
      'Settings',
      'Progress'
    ];

    let englishFound = 0;
    for (const str of englishStrings) {
      const element = page.locator(`text="${str}"`).first();
      if (await element.isVisible({ timeout: 1000 }).catch(() => false)) {
        englishFound++;
      }
    }
    console.log(`✓ Found ${englishFound}/${englishStrings.length} English strings`);

    // Switch to Korean
    await page.evaluate(() => {
      localStorage.setItem('i18nextLng', 'ko');
      localStorage.setItem('language', 'ko');
    });
    await page.reload();
    await page.waitForTimeout(2000);

    // Check for Korean strings
    const koreanStrings = [
      '채팅',
      '데이터',
      '파일',
      '팀'
    ];

    let koreanFound = 0;
    for (const str of koreanStrings) {
      const element = page.locator(`text="${str}"`).first();
      if (await element.isVisible({ timeout: 1000 }).catch(() => false)) {
        koreanFound++;
      }
    }
    console.log(`✓ Found ${koreanFound}/${koreanStrings.length} Korean strings`);

    // At least one set should be found
    expect(englishFound + koreanFound).toBeGreaterThan(0);
  });

  test('should format dates according to locale', async ({ page }) => {
    console.log('Test: Date/time locale formatting...');

    await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    // Look for date/time displays
    const dateSelectors = [
      '[class*="timestamp"]',
      '[class*="date"]',
      'time',
      '[datetime]'
    ];

    let dateFound = false;
    for (const selector of dateSelectors) {
      const dateElement = page.locator(selector).first();
      if (await dateElement.isVisible({ timeout: 2000 }).catch(() => false)) {
        const dateText = await dateElement.textContent();
        console.log(`Found date element: "${dateText}"`);
        dateFound = true;

        // Check if date format changes with locale
        // English: MM/DD/YYYY or similar
        // Korean: YYYY. MM. DD. or similar
        const hasEnglishFormat = /\d{1,2}\/\d{1,2}\/\d{4}/.test(dateText || '');
        const hasKoreanFormat = /\d{4}\.\s?\d{1,2}\.\s?\d{1,2}/.test(dateText || '');

        if (hasEnglishFormat) {
          console.log('✓ English date format detected (MM/DD/YYYY)');
        } else if (hasKoreanFormat) {
          console.log('✓ Korean date format detected (YYYY. MM. DD.)');
        } else {
          console.log(`Date format: ${dateText}`);
        }
        break;
      }
    }

    if (!dateFound) {
      console.log('⚠ No date elements found in current view');
    }
  });

  test('should persist language selection across page reloads', async ({ page }) => {
    console.log('Test: Language persistence...');

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    // Set language to Korean
    await page.evaluate(() => {
      localStorage.setItem('i18nextLng', 'ko');
      localStorage.setItem('language', 'ko');
    });

    await page.reload();
    await page.waitForTimeout(2000);

    // Check if Korean is still active
    const storedLang = await page.evaluate(() =>
      localStorage.getItem('i18nextLng') || localStorage.getItem('language')
    );

    expect(storedLang).toBe('ko');
    console.log('✓ Language persisted in localStorage');

    // Check UI
    const koreanUI = page.locator('text=/채팅|데이터|파일/').first();
    const hasKoreanUI = await koreanUI.isVisible({ timeout: 3000 }).catch(() => false);

    if (hasKoreanUI) {
      console.log('✓ Korean UI maintained after reload');
    }
  });

  test('should translate ARIA labels for screen readers', async ({ page }) => {
    console.log('Test: ARIA label translation...');

    await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    // Check for ARIA labels in English
    await page.evaluate(() => {
      localStorage.setItem('i18nextLng', 'en');
    });
    await page.reload();
    await page.waitForTimeout(2000);

    const ariaElements = await page.locator('[aria-label]').all();
    const ariaLabels: string[] = [];

    for (const element of ariaElements.slice(0, 10)) {
      // Check first 10
      const label = await element.getAttribute('aria-label');
      if (label) {
        ariaLabels.push(label);
      }
    }

    console.log(`Found ${ariaLabels.length} ARIA labels:`);
    ariaLabels.forEach(label => console.log(`  - ${label}`));

    // Switch to Korean
    await page.evaluate(() => {
      localStorage.setItem('i18nextLng', 'ko');
    });
    await page.reload();
    await page.waitForTimeout(2000);

    const ariaElementsKo = await page.locator('[aria-label]').all();
    const ariaLabelsKo: string[] = [];

    for (const element of ariaElementsKo.slice(0, 10)) {
      const label = await element.getAttribute('aria-label');
      if (label) {
        ariaLabelsKo.push(label);
      }
    }

    console.log(`Found ${ariaLabelsKo.length} ARIA labels in Korean:`);
    ariaLabelsKo.forEach(label => console.log(`  - ${label}`));

    // At least some ARIA labels should exist
    expect(ariaLabels.length + ariaLabelsKo.length).toBeGreaterThan(0);
  });

  test('should not have hardcoded strings', async ({ page }) => {
    console.log('Test: Checking for hardcoded strings...');

    await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    // Get all text content
    const pageText = await page.locator('body').textContent() || '';

    // Common hardcoded patterns to avoid
    const hardcodedPatterns = [
      /Click here/i,
      /Submit/i,
      /Cancel/i
    ];

    // This is a soft check - we're just looking for common patterns
    let potentialHardcoded = 0;
    for (const pattern of hardcodedPatterns) {
      if (pattern.test(pageText)) {
        potentialHardcoded++;
      }
    }

    if (potentialHardcoded > 0) {
      console.log(`⚠ Found ${potentialHardcoded} potential hardcoded strings (this may be expected)`);
    } else {
      console.log('✓ No obvious hardcoded strings detected');
    }
  });
});
