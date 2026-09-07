import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const LANGUAGE_STORAGE_KEY = 'jnr-language-v1';

const WCAG_TAGS = [
  'wcag2a',
  'wcag2aa',
  'wcag21a',
  'wcag21aa',
  'wcag22aa',
];

const LANGUAGES = [
  { code: 'ca', name: 'Català' },
  { code: 'es', name: 'Español' },
  { code: 'en', name: 'English' },
] as const;

type Language = (typeof LANGUAGES)[number]['code'];
type AxeScanResults = Awaited<ReturnType<AxeBuilder['analyze']>>;
type AxeViolation = AxeScanResults['violations'][number];

const MAX_TARGETS_PER_RULE = 8;

const isBlockingViolation = (violation: AxeViolation) =>
  violation.impact === 'critical' || violation.impact === 'serious';

const formatTarget = (target: AxeViolation['nodes'][number]['target']) =>
  target
    .map((selector) =>
      Array.isArray(selector) ? selector.join(' >>> ') : selector,
    )
    .join(' >>> ');

const formatImpactSummary = (violations: AxeViolation[]) => {
  const impacts = ['critical', 'serious', 'moderate', 'minor'] as const;

  const entries: string[] = impacts.map((impact) => {
    const count = violations.filter(
      (violation) => violation.impact === impact,
    ).length;

    return `${impact}: ${count}`;
  });

  const unknownCount = violations.filter(
    (violation) =>
      violation.impact === null || violation.impact === undefined,
  ).length;

  if (unknownCount > 0) {
    entries.push(`unknown: ${unknownCount}`);
  }

  return entries.join(', ');
};

const formatViolation = (violation: AxeViolation) => {
  const targets = violation.nodes
    .slice(0, MAX_TARGETS_PER_RULE)
    .map((node) => `    - ${formatTarget(node.target)}`);

  const remainingTargets = violation.nodes.length - targets.length;

  if (remainingTargets > 0) {
    targets.push(`    - ... ${remainingTargets} additional target(s)`);
  }

  return [
    `- ${violation.id} [${violation.impact ?? 'unknown'}]`,
    `  Description: ${violation.description}`,
    `  Help: ${violation.help}`,
    `  Help URL: ${violation.helpUrl}`,
    '  Targets:',
    ...targets,
  ].join('\n');
};

const assertAccessibilityBaseline = async (page: Page, state: string) => {
  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();

  const blockingViolations = results.violations.filter(isBlockingViolation);

  if (blockingViolations.length === 0) return;

  throw new Error(
    [
      `Accessibility smoke failed for: ${state}`,
      `Axe violations by impact: ${formatImpactSummary(results.violations)}`,
      'This baseline blocks critical and serious WCAG A/AA violations.',
      '',
      ...blockingViolations.map(formatViolation),
    ].join('\n'),
  );
};

const openPortfolio = async (page: Page, language: Language) => {
  await page.route('https://www.googletagmanager.com/**', async (route) => {
    await route.abort();
  });

  await page.addInitScript(
    ({ storageKey, selectedLanguage }) => {
      window.localStorage.setItem(storageKey, selectedLanguage);
    },
    {
      storageKey: LANGUAGE_STORAGE_KEY,
      selectedLanguage: language,
    },
  );

  const response = await page.goto('/');

  expect(response?.ok()).toBe(true);

  await expect(page.locator('#root')).not.toBeEmpty();
  await expect(page.getByRole('main')).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('lang', language);

  await page.evaluate(async () => {
    await document.fonts.ready;
  });
};

test.describe('accessibility smoke', () => {
  for (const { code, name } of LANGUAGES) {
    test(`desktop homepage is accessible in ${name}`, async ({ page }) => {
      await openPortfolio(page, code);

      await assertAccessibilityBaseline(page, `desktop homepage (${code})`);
    });
  }

  test('mobile menu is accessible while open', async ({ page }) => {
    await page.setViewportSize({
      width: 390,
      height: 844,
    });

    await openPortfolio(page, 'es');

    const menuButton = page.locator(
      'button[aria-controls="mobile-navigation"]',
    );
    const mobileNavigation = page.locator('#mobile-navigation');

    await menuButton.click();

    await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    await expect(mobileNavigation).toHaveAttribute('aria-hidden', 'false');
    await expect(mobileNavigation).toBeVisible();

    await assertAccessibilityBaseline(page, 'mobile menu open (es)');

    await menuButton.focus();
    await page.keyboard.press('Tab');

    await expect(
      mobileNavigation.locator('a[href="#top"]'),
    ).toBeFocused();
  });

  test('certifications carousel is accessible in its keyboard state', async ({
    page,
  }) => {
    await openPortfolio(page, 'es');

    const viewport = page.getByTestId('certifications-viewport');
    const interactiveSegment = page.locator(
      '[data-carousel-segment="true"]',
    );
    const firstLogoButton = interactiveSegment.getByRole('button').first();
    const hiddenLogoButtons = page.locator(
      '[data-testid="certifications-segment"][aria-hidden="true"] button',
    );

    await viewport.scrollIntoViewIfNeeded();
    await expect(viewport).toBeVisible();

    await firstLogoButton.focus();
    await expect(firstLogoButton).toBeFocused();

    const hiddenTabbableButtonCount = await hiddenLogoButtons.evaluateAll(
      (buttons) =>
        buttons.filter((button) => (button as HTMLButtonElement).tabIndex >= 0)
          .length,
    );

    expect(
      hiddenTabbableButtonCount,
      'aria-hidden carousel copies must stay out of the tab order',
    ).toBe(0);

    await assertAccessibilityBaseline(page, 'certifications carousel (es)');
  });
});