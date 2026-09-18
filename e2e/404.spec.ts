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
    name: 'Català',
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
    name: 'Español',
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
    name: 'English',
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

const VIEWPORTS = [
  {
    name: 'mobile',
    width: 360,
    height: 800,
  },
  {
    name: 'tablet',
    width: 768,
    height: 1024,
  },
  {
    name: 'desktop',
    width: 1440,
    height: 900,
  },
  {
    name: 'ultrawide',
    width: 2560,
    height: 1080,
  },
] as const;

type LocaleCode = (typeof LOCALES)[number]['code'];

let notFoundHtml = '';

const blockAnalytics = async (page: Page) => {
  await page.route(
    'https://www.googletagmanager.com/**',
    async (route) => {
      await route.abort();
    },
  );
};

const initializeStoredLanguage = async (
  page: Page,
  language: LocaleCode,
) => {
  await page.addInitScript(
    ({ storageKey, storedLanguage }) => {
      window.localStorage.setItem(
        storageKey,
        storedLanguage,
      );
    },
    {
      storageKey: LANGUAGE_STORAGE_KEY,
      storedLanguage: language,
    },
  );
};

const serveNotFoundAt = async (
  page: Page,
  pathname: string,
) => {
  await page.route(
    `**${pathname}`,
    async (route) => {
      await route.fulfill({
        status: 404,
        contentType:
          'text/html; charset=utf-8',
        body: notFoundHtml,
      });
    },
  );
};

const expectStoredLanguage = async (
  page: Page,
  language: LocaleCode,
) => {
  await expect
    .poll(() =>
      page.evaluate(
        (storageKey) =>
          window.localStorage.getItem(
            storageKey,
          ),
        LANGUAGE_STORAGE_KEY,
      ),
    )
    .toBe(language);
};

const assertHeroAlignedStructure = async (
  page: Page,
) => {
  await expect(
    page.locator(
      'meta[name="theme-color"]',
    ),
  ).toHaveAttribute(
    'content',
    '#0f172a',
  );

  await expect(
    page.locator('main.page-shell'),
  ).toHaveCount(1);

  await expect(
    page.locator('.brand'),
  ).toHaveAttribute(
    'aria-label',
    'JNR',
  );

  await expect(
    page.locator('.error-badge'),
  ).toHaveText('Error 404');

  const watermark =
    page.locator('.watermark');

  await expect(
    watermark,
  ).toHaveText('404');

  await expect(
    watermark,
  ).toHaveAttribute(
    'aria-hidden',
    'true',
  );

  await expect(
    page.locator('.route-art'),
  ).toHaveAttribute(
    'aria-hidden',
    'true',
  );

  await expect(
    page.locator(
      '.route-art svg',
    ),
  ).toHaveAttribute(
    'role',
    'presentation',
  );

  await expect(
    page.locator('.card'),
  ).toHaveCount(0);
};

const trackMainFramePathnames = (
  page: Page,
): string[] => {
  const pathnames: string[] = [];

  page.on(
    'framenavigated',
    (frame) => {
      if (
        frame !==
        page.mainFrame()
      ) {
        return;
      }

      const url =
        frame.url();

      if (
        !url.startsWith('http://') &&
        !url.startsWith('https://')
      ) {
        return;
      }

      pathnames.push(
        new URL(url).pathname,
      );
    },
  );

  return pathnames;
};

const assertAccessibilityBaseline = async (
  page: Page,
  state: string,
) => {
  const { violations } =
    await new AxeBuilder({
      page,
    })
      .withTags(WCAG_TAGS)
      .analyze();

  const blockingViolations =
    violations.filter(
      (violation) =>
        violation.impact ===
          'critical' ||
        violation.impact ===
          'serious',
    );

  expect(
    blockingViolations,
    `Blocking accessibility violations for ${state}`,
  ).toEqual([]);
};

test.beforeAll(
  async ({ request }) => {
    const response =
      await request.get(
        '/404.html',
      );

    expect(
      response.ok(),
    ).toBe(true);

    notFoundHtml =
      await response.text();
  },
);

test.describe(
  'localized 404 page',
  () => {
    for (const locale of LOCALES) {
      test(
        `explicit ${locale.code} URL renders the ${locale.code} 404 and returns to the same locale`,
        async ({ page }) => {
          await initializeStoredLanguage(
            page,
            locale.conflictingStoredLanguage,
          );

          const pathname =
            `/JNR/${locale.code}/missing-page`;

          await serveNotFoundAt(
            page,
            pathname,
          );

          const response =
            await page.goto(
              pathname,
            );

          expect(
            response?.status(),
          ).toBe(404);

          await expect(
            page.locator('html'),
          ).toHaveAttribute(
            'lang',
            locale.code,
          );

          await expect(
            page,
          ).toHaveTitle(
            locale.title,
          );

          await expect(
            page.locator(
              'meta[name="description"]',
            ),
          ).toHaveAttribute(
            'content',
            locale.description,
          );

          await expect(
            page.locator(
              'meta[name="robots"]',
            ),
          ).toHaveAttribute(
            'content',
            'noindex',
          );

          await assertHeroAlignedStructure(
            page,
          );

          await expect(
            page.getByRole(
              'heading',
              {
                name:
                  locale.heading,
              },
            ),
          ).toBeVisible();

          await expect(
            page.locator(
              '#not-found-message',
            ),
          ).toHaveText(
            locale.message,
          );

          const returnLink =
            page.getByRole(
              'link',
              {
                name:
                  locale.returnLabel,
              },
            );

          await expect(
            returnLink,
          ).toBeVisible();

          await expect(
            returnLink,
          ).toHaveAttribute(
            'href',
            `/JNR/${locale.code}/`,
          );

          await expect(
            page.locator(
              'script[src]',
            ),
          ).toHaveCount(0);

          await expect(
            page.locator(
              'link[rel="stylesheet"]',
            ),
          ).toHaveCount(0);

          await expectStoredLanguage(
            page,
            locale.code,
          );

          await assertAccessibilityBaseline(
            page,
            `404 (${locale.code})`,
          );
        },
      );
    }

    test(
      'stored preference is used when the missing URL has no explicit locale',
      async ({ page }) => {
        await initializeStoredLanguage(
          page,
          'ca',
        );

        const pathname =
          '/JNR/missing-page';

        await serveNotFoundAt(
          page,
          pathname,
        );

        const response =
          await page.goto(
            pathname,
          );

        expect(
          response?.status(),
        ).toBe(404);

        await expect(
          page.locator('html'),
        ).toHaveAttribute(
          'lang',
          'ca',
        );

        await expect(
          page,
        ).toHaveTitle(
          'Pàgina no trobada | Josep Núñez Riba',
        );

        await expect(
          page.getByRole(
            'link',
            {
              name:
                'Tornar al portafoli',
            },
          ),
        ).toHaveAttribute(
          'href',
          '/JNR/ca/',
        );
      },
    );

    test(
      'hero-aligned 404 remains usable across target viewports',
      async ({ page }) => {
        const pathname =
          '/JNR/es/missing-responsive';

        await serveNotFoundAt(
          page,
          pathname,
        );

        const response =
          await page.goto(
            pathname,
          );

        expect(
          response?.status(),
        ).toBe(404);

        for (
          const viewport
          of VIEWPORTS
        ) {
          await page.setViewportSize({
            width:
              viewport.width,
            height:
              viewport.height,
          });

          await expect(
            page.locator(
              '.error-badge',
            ),
          ).toBeVisible();

          await expect(
            page.getByRole(
              'heading',
              {
                name:
                  'Página no encontrada',
              },
            ),
          ).toBeVisible();

          await expect(
            page.getByRole(
              'link',
              {
                name:
                  'Volver al portfolio',
              },
            ),
          ).toBeVisible();

          const layout =
            await page.evaluate(
              () => ({
                documentWidth:
                  document.documentElement
                    .scrollWidth,
                viewportWidth:
                  document.documentElement
                    .clientWidth,
                documentHeight:
                  document.documentElement
                    .scrollHeight,
                viewportHeight:
                  document.documentElement
                    .clientHeight,
              }),
            );

          expect(
            layout.documentWidth,
            `${viewport.name} 404 must not overflow horizontally`,
          ).toBeLessThanOrEqual(
            layout.viewportWidth,
          );

          expect(
            layout.documentHeight,
            `${viewport.name} 404 must not overflow vertically`,
          ).toBeLessThanOrEqual(
            layout.viewportHeight,
          );
        }
      },
    );

    test(
      'decorative motion is disabled when reduced motion is requested',
      async ({ page }) => {
        await page.emulateMedia({
          reducedMotion:
            'reduce',
        });

        const pathname =
          '/JNR/en/missing-reduced-motion';

        await serveNotFoundAt(
          page,
          pathname,
        );

        const response =
          await page.goto(
            pathname,
          );

        expect(
          response?.status(),
        ).toBe(404);

        const animations =
          await page.evaluate(
            () => {
              const selectors = [
                '.ambient-primary',
                '.ambient-secondary',
                '.route-line-active',
                '.route-pulse',
              ];

              return selectors.map(
                (selector) => {
                  const element =
                    document.querySelector(
                      selector,
                    );

                  if (!element) {
                    return null;
                  }

                  return window
                    .getComputedStyle(
                      element,
                    )
                    .animationName;
                },
              );
            },
          );

        expect(
          animations,
        ).toEqual([
          'none',
          'none',
          'none',
          'none',
        ]);
      },
    );

    for (const locale of LOCALES) {
      test(
        `returning from a ${locale.code} 404 navigates only to ${locale.code}`,
        async ({ page }) => {
          await blockAnalytics(
            page,
          );

          /*
           * Start with a deliberately conflicting stored preference. The 404
           * URL itself must establish the correct language.
           */
          await initializeStoredLanguage(
            page,
            locale.conflictingStoredLanguage,
          );

          /*
           * The local preview does not live below /JNR/, so use the equivalent
           * local path for the roundtrip test. The static 404 supports both
           * shapes and will therefore generate /<locale>/ as the return URL.
           */
          const pathname =
            `/${locale.code}/missing-page`;

          await serveNotFoundAt(
            page,
            pathname,
          );

          const response =
            await page.goto(
              pathname,
            );

          expect(
            response?.status(),
          ).toBe(404);

          await expect(
            page.locator('html'),
          ).toHaveAttribute(
            'lang',
            locale.code,
          );

          await expectStoredLanguage(
            page,
            locale.code,
          );

          const returnLink =
            page.getByRole(
              'link',
              {
                name:
                  locale.returnLabel,
              },
            );

          await expect(
            returnLink,
          ).toHaveAttribute(
            'href',
            `/${locale.code}/`,
          );

          const navigationPathnames =
            trackMainFramePathnames(
              page,
            );

          await returnLink.click();

          await expect(
            page,
          ).toHaveURL(
            new RegExp(
              `/${locale.code}/$`,
            ),
          );

          await page.waitForLoadState(
            'networkidle',
          );

          await expect(
            page,
          ).toHaveURL(
            new RegExp(
              `/${locale.code}/$`,
            ),
          );

          await expect(
            page.locator('html'),
          ).toHaveAttribute(
            'lang',
            locale.code,
          );

          await expect(
            page
              .getByRole('banner')
              .getByRole(
                'button',
                {
                  name:
                    locale.name,
                },
              ),
          ).toHaveAttribute(
            'aria-pressed',
            'true',
          );

          await expectStoredLanguage(
            page,
            locale.code,
          );

          /*
           * No root and no alternative locale may appear between the 404 and
           * its destination. This assertion is symmetric for CA, ES and EN.
           */
          expect(
            navigationPathnames,
          ).toEqual([
            `/${locale.code}/`,
          ]);
        },
      );
    }
  },
);
