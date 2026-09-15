import { expect, test } from '@playwright/test';

const LANGUAGE_STORAGE_KEY = 'jnr-language-v1';

test.beforeEach(async ({ page }) => {
  await page.route('https://www.googletagmanager.com/**', async (route) => {
    await route.abort();
  });

  await page.addInitScript(
    ({ storageKey }) => {
      window.localStorage.setItem(storageKey, 'es');
    },
    {
      storageKey: LANGUAGE_STORAGE_KEY,
    },
  );
});

test('skip link is the first keyboard stop and moves focus to main content', async ({
  page,
}) => {
  const response = await page.goto('/');

  expect(response?.ok()).toBe(true);

  const skipLink = page.getByRole('link', {
    name: 'Saltar al contenido principal',
  });
  const mainContent = page.locator('#main-content');

  const hiddenBox = await skipLink.boundingBox();

  expect(hiddenBox).not.toBeNull();
  expect(hiddenBox!.y + hiddenBox!.height).toBeLessThanOrEqual(0);

  await page.keyboard.press('Tab');

  await expect(skipLink).toBeFocused();

  const focusedBox = await skipLink.boundingBox();

  expect(focusedBox).not.toBeNull();
  expect(focusedBox!.y).toBeGreaterThanOrEqual(0);

  await page.keyboard.press('Enter');

  await expect(page).toHaveURL(/#main-content$/);
  await expect(mainContent).toBeFocused();

  await expect(page.locator('header :focus')).toHaveCount(0);
});
