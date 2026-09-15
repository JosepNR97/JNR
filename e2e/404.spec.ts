import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const PORTFOLIO_URL = 'https://josepnr97.github.io/JNR/';
const WCAG_TAGS = [
  'wcag2a',
  'wcag2aa',
  'wcag21a',
  'wcag21aa',
  'wcag22aa',
];

test('404 page renders and returns to the deployed portfolio', async ({ page }) => {
  const response = await page.goto('/404.html');

  expect(response?.ok()).toBe(true);
  await expect(page).toHaveTitle('Página no encontrada | Josep Núñez Riba');
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    'noindex',
  );
  await expect(
    page.getByRole('heading', { name: 'Página no encontrada' }),
  ).toBeVisible();

  const returnLink = page.getByRole('link', { name: 'Volver al portfolio' });

  await expect(returnLink).toBeVisible();
  await expect(returnLink).toHaveAttribute('href', PORTFOLIO_URL);
  await expect(page.locator('script')).toHaveCount(0);
  await expect(page.locator('link[rel="stylesheet"]')).toHaveCount(0);

  const { violations } = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .analyze();
  const blockingViolations = violations.filter(
    (violation) =>
      violation.impact === 'critical' || violation.impact === 'serious',
  );

  expect(blockingViolations).toEqual([]);
});
