import { expect, test } from '@playwright/test';

const LANGUAGE_STORAGE_KEY = 'jnr-language-v1';

const LOCALES = [
  {
    code: 'ca',
    name: 'Català',
    nextCode: 'es',
    nextName: 'Español',
  },
  {
    code: 'es',
    name: 'Español',
    nextCode: 'en',
    nextName: 'English',
  },
  {
    code: 'en',
    name: 'English',
    nextCode: 'ca',
    nextName: 'Català',
  },
] as const;

const productionUrl = (locale: string) =>
  `https://josepnr97.github.io/JNR/${locale}/`;

test.describe('multilingual SEO routes', () => {
  for (const locale of LOCALES) {
    test(`${locale.code} has indexable initial metadata and language navigation`, async ({
      page,
      request,
    }) => {
      const response = await request.get(
        `/${locale.code}/`,
      );

      expect(response.ok()).toBe(true);

      const initialHtml = await response.text();

      expect(initialHtml).toContain(
        `<html lang="${locale.code}">`,
      );

      expect(initialHtml).toContain(
        `rel="canonical" href="${productionUrl(
          locale.code,
        )}"`,
      );

      expect(initialHtml).toContain(
        'name="twitter:card" content="summary"',
      );

      expect(initialHtml).toContain(
        'type="application/ld+json"',
      );

      await page.route(
        'https://www.googletagmanager.com/**',
        async (route) => {
          await route.abort();
        },
      );

      await page.goto(
        `/${locale.code}/#about`,
      );

      await expect(
        page.locator('html'),
      ).toHaveAttribute(
        'lang',
        locale.code,
      );

      await expect(
        page.locator('link[rel="canonical"]'),
      ).toHaveAttribute(
        'href',
        productionUrl(locale.code),
      );

      const currentLanguageButton = page
        .getByRole('banner')
        .getByRole('button', {
          name: locale.name,
        });

      const nextLanguageButton = page
        .getByRole('banner')
        .getByRole('button', {
          name: locale.nextName,
        });

      await expect(
        currentLanguageButton,
      ).toHaveAttribute(
        'aria-pressed',
        'true',
      );

      await expect(
        nextLanguageButton,
      ).toHaveAttribute(
        'aria-pressed',
        'false',
      );

      await nextLanguageButton.click();

      await expect(page).toHaveURL(
        new RegExp(
          `/${locale.nextCode}/#about$`,
        ),
      );

      await expect(
        page.locator('html'),
      ).toHaveAttribute(
        'lang',
        locale.nextCode,
      );

      await expect(
        page.locator('link[rel="canonical"]'),
      ).toHaveAttribute(
        'href',
        productionUrl(locale.nextCode),
      );
    });
  }

  test('an explicit locale URL overrides a conflicting stored preference', async ({
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
        storedLanguage: 'ca',
      },
    );

    await page.goto('/en/');

    await expect(page).toHaveURL(
      /\/en\/$/,
    );

    await expect(
      page.locator('html'),
    ).toHaveAttribute(
      'lang',
      'en',
    );

    await expect(
      page
        .getByRole('banner')
        .getByRole('button', {
          name: 'English',
        }),
    ).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    await expect
      .poll(() =>
        page.evaluate(
          (storageKey) =>
            window.localStorage.getItem(storageKey),
          LANGUAGE_STORAGE_KEY,
        ),
      )
      .toBe('en');
  });

  test('root entry redirects once and preserves the section anchor', async ({
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
        storedLanguage: 'ca',
      },
    );

    await page.goto('/#services');

    await expect(page).toHaveURL(
      /\/ca\/#services$/,
    );

    await expect(
      page.locator('html'),
    ).toHaveAttribute(
      'lang',
      'ca',
    );

    await expect
      .poll(() =>
        page.evaluate(
          (storageKey) =>
            window.localStorage.getItem(storageKey),
          LANGUAGE_STORAGE_KEY,
        ),
      )
      .toBe('ca');
  });

  test('language selection immediately after reload stays on the selected locale', async ({
    page,
  }) => {
    await page.route(
      'https://www.googletagmanager.com/**',
      async (route) => {
        await route.abort();
      },
    );

    await page.goto('/es/');

    await page.reload({
      waitUntil: 'domcontentloaded',
    });

    await page
      .getByRole('banner')
      .getByRole('button', {
        name: 'English',
      })
      .click();

    await page.waitForLoadState('load');

    await expect(page).toHaveURL(
      /\/en\/$/,
    );

    await expect(
      page.locator('html'),
    ).toHaveAttribute(
      'lang',
      'en',
    );

    await expect(
      page
        .getByRole('banner')
        .getByRole('button', {
          name: 'English',
        }),
    ).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    await expect(
      page.locator('link[rel="canonical"]'),
    ).toHaveAttribute(
      'href',
      productionUrl('en'),
    );

    await expect
      .poll(() =>
        page.evaluate(
          (storageKey) =>
            window.localStorage.getItem(storageKey),
          LANGUAGE_STORAGE_KEY,
        ),
      )
      .toBe('en');

    await page.reload({
      waitUntil: 'domcontentloaded',
    });

    await page
      .getByRole('banner')
      .getByRole('button', {
        name: 'Català',
      })
      .click();

    await page.waitForLoadState('load');

    await expect(page).toHaveURL(
      /\/ca\/$/,
    );

    await expect(
      page.locator('html'),
    ).toHaveAttribute(
      'lang',
      'ca',
    );

    await expect(
      page
        .getByRole('banner')
        .getByRole('button', {
          name: 'Català',
        }),
    ).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    await expect
      .poll(() =>
        page.evaluate(
          (storageKey) =>
            window.localStorage.getItem(storageKey),
          LANGUAGE_STORAGE_KEY,
        ),
      )
      .toBe('ca');
  });
});
