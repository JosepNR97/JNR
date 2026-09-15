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

const LOCALES = [
  {
    code: 'ca',
    conflictingStoredLanguage: 'en',
    title: 'Pàgina no trobada | Josep Núñez Riba',
    description:
      'Pàgina no trobada al portafoli de Josep Núñez Riba.',
    heading: 'Pàgina no trobada',
    message:
      "L'adreça que busques no està disponible. Torna al portafoli per continuar navegant.",
    returnLabel: 'Tornar al portafoli',
  },
  {
    code: 'es',
    conflictingStoredLanguage: 'ca',
    title: 'Página no encontrada | Josep Núñez Riba',
    description:
      'Página no encontrada en el portfolio de Josep Núñez Riba.',
    heading: 'Página no encontrada',
    message:
      'La dirección que buscas no está disponible. Vuelve al portfolio para seguir navegando.',
    returnLabel: 'Volver al portfolio',
  },
  {
    code: 'en',
    conflictingStoredLanguage: 'es',
    title: 'Page not found | Josep Núñez Riba',
    description:
      "Page not found in Josep Núñez Riba's portfolio.",
    heading: 'Page not found',
    message:
      "The address you're looking for isn't available. Return to the portfolio to continue browsing.",
    returnLabel: 'Return to portfolio',
  },
] as const;

let notFoundHtml = '';

const serveNotFoundAt = async (
  page: Page,
  pathname: string,
) => {
  await page.route(`**${pathname}`, async (route) => {
    await route.fulfill({
      status: 404,
      contentType: 'text/html; charset=utf-8',
      body: notFoundHtml,
    });
  });
};

const assertAccessibilityBaseline = async (
  page: Page,
  state: string,
) => {
  const { violations } = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .analyze();

  const blockingViolations = violations.filter(
    (violation) =>
      violation.impact === 'critical' ||
      violation.impact === 'serious',
  );

  expect(
    blockingViolations,
    `Blocking accessibility violations for ${state}`,
  ).toEqual([]);
};

test.beforeAll(async ({ request }) => {
  const response = await request.get('/404.html');

  expect(response.ok()).toBe(true);

  notFoundHtml = await response.text();
});

test.describe('localized 404 page', () => {
  for (const locale of LOCALES) {
    test(`explicit ${locale.code} URL renders the ${locale.code} 404 and returns to the same locale`, async ({
      page,
    }) => {
      await page.addInitScript(
        ({ storageKey, storedLanguage }) => {
          window.localStorage.setItem(
            storageKey,
            storedLanguage,
          );
        },
        {
          storageKey: LANGUAGE_STORAGE_KEY,
          storedLanguage:
            locale.conflictingStoredLanguage,
        },
      );

      const pathname =
        `/JNR/${locale.code}/missing-page`;

      await serveNotFoundAt(page, pathname);

      const response = await page.goto(pathname);

      expect(response?.status()).toBe(404);

      await expect(page.locator('html')).toHaveAttribute(
        'lang',
        locale.code,
      );

      await expect(page).toHaveTitle(locale.title);

      await expect(
        page.locator('meta[name="description"]'),
      ).toHaveAttribute(
        'content',
        locale.description,
      );

      await expect(
        page.locator('meta[name="robots"]'),
      ).toHaveAttribute('content', 'noindex');

      await expect(
        page.getByRole('heading', {
          name: locale.heading,
        }),
      ).toBeVisible();

      await expect(
        page.locator('#not-found-message'),
      ).toHaveText(locale.message);

      const returnLink = page.getByRole('link', {
        name: locale.returnLabel,
      });

      await expect(returnLink).toBeVisible();

      await expect(returnLink).toHaveAttribute(
        'href',
        `/JNR/${locale.code}/`,
      );

      await expect(
        page.locator('script[src]'),
      ).toHaveCount(0);

      await expect(
        page.locator('link[rel="stylesheet"]'),
      ).toHaveCount(0);

      await expect
        .poll(() =>
          page.evaluate(
            (storageKey) =>
              window.localStorage.getItem(storageKey),
            LANGUAGE_STORAGE_KEY,
          ),
        )
        .toBe(locale.code);

      await assertAccessibilityBaseline(
        page,
        `404 (${locale.code})`,
      );
    });
  }

  test('stored preference is used when the missing URL has no explicit locale', async ({
    page,
  }) => {
    await page.addInitScript(
      ({ storageKey }) => {
        window.localStorage.setItem(
          storageKey,
          'ca',
        );
      },
      {
        storageKey: LANGUAGE_STORAGE_KEY,
      },
    );

    const pathname = '/JNR/missing-page';

    await serveNotFoundAt(page, pathname);

    const response = await page.goto(pathname);

    expect(response?.status()).toBe(404);

    await expect(page.locator('html')).toHaveAttribute(
      'lang',
      'ca',
    );

    await expect(page).toHaveTitle(
      'Pàgina no trobada | Josep Núñez Riba',
    );

    await expect(
      page.getByRole('link', {
        name: 'Tornar al portafoli',
      }),
    ).toHaveAttribute(
      'href',
      '/JNR/ca/',
    );
  });
});
