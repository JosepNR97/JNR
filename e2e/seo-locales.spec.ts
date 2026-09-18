import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const LANGUAGE_STORAGE_KEY = 'jnr-language-v1';
const NAVIGATION_LANGUAGE_MARKER = 'jnr-e2e-navigation-language';

const LOCALES = [
  {
    code: 'ca',
    name: 'Català',
  },
  {
    code: 'es',
    name: 'Español',
  },
  {
    code: 'en',
    name: 'English',
  },
] as const;

const SECTION_CONTEXT_IDS = [
  'about',
  'certifications',
  'services',
  'experience',
  'education',
  'contact',
] as const;

type LocaleCode = (typeof LOCALES)[number]['code'];
type Locale = (typeof LOCALES)[number];
type SectionContextId = (typeof SECTION_CONTEXT_IDS)[number];

const productionUrl = (locale: LocaleCode) =>
  `https://josepnr97.github.io/JNR/${locale}/`;

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
      window.localStorage.setItem(storageKey, storedLanguage);
    },
    {
      storageKey: LANGUAGE_STORAGE_KEY,
      storedLanguage: language,
    },
  );
};

const setStoredLanguage = async (
  page: Page,
  language: LocaleCode,
) => {
  await page.evaluate(
    ({ storageKey, storedLanguage }) => {
      window.localStorage.setItem(storageKey, storedLanguage);
    },
    {
      storageKey: LANGUAGE_STORAGE_KEY,
      storedLanguage: language,
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
          window.localStorage.getItem(storageKey),
        LANGUAGE_STORAGE_KEY,
      ),
    )
    .toBe(language);
};

const expectLocaleState = async (
  page: Page,
  locale: Locale,
) => {
  await expect(page.locator('html')).toHaveAttribute(
    'lang',
    locale.code,
  );

  await expect(
    page
      .getByRole('banner')
      .getByRole('button', {
        name: locale.name,
      }),
  ).toHaveAttribute(
    'aria-pressed',
    'true',
  );

  await expect(
    page.locator('link[rel="canonical"]'),
  ).toHaveAttribute(
    'href',
    productionUrl(locale.code),
  );

  await expectStoredLanguage(
    page,
    locale.code,
  );
};

const trackMainFramePathnames = (
  page: Page,
): string[] => {
  const pathnames: string[] = [];

  page.on('framenavigated', (frame) => {
    if (frame !== page.mainFrame()) {
      return;
    }

    const url = frame.url();

    if (
      !url.startsWith('http://') &&
      !url.startsWith('https://')
    ) {
      return;
    }

    pathnames.push(
      new URL(url).pathname,
    );
  });

  return pathnames;
};

const getConflictingLocale = (
  excludedLanguages: readonly LocaleCode[],
): Locale => {
  const locale = LOCALES.find(
    ({ code }) =>
      !excludedLanguages.includes(code),
  );

  if (!locale) {
    throw new Error(
      'Expected at least one conflicting locale',
    );
  }

  return locale;
};

const getLocale = (
  code: LocaleCode,
): Locale => {
  const locale = LOCALES.find(
    (candidate) =>
      candidate.code === code,
  );

  if (!locale) {
    throw new Error(
      `Unknown locale: ${code}`,
    );
  }

  return locale;
};

const installNavigationLanguageMarker = async (
  page: Page,
) => {
  await page.evaluate(
    ({ storageKey, markerKey }) => {
      window.sessionStorage.removeItem(markerKey);

      window.addEventListener(
        'pagehide',
        () => {
          window.sessionStorage.setItem(
            markerKey,
            window.localStorage.getItem(storageKey) ?? '',
          );
        },
        {
          once: true,
        },
      );
    },
    {
      storageKey: LANGUAGE_STORAGE_KEY,
      markerKey: NAVIGATION_LANGUAGE_MARKER,
    },
  );
};

const expectPersistedBeforeNavigation = async (
  page: Page,
  language: LocaleCode,
) => {
  const persistedLanguage =
    await page.evaluate(
      (markerKey) =>
        window.sessionStorage.getItem(markerKey),
      NAVIGATION_LANGUAGE_MARKER,
    );

  expect(persistedLanguage).toBe(language);
};

const isSectionCurrentContext = async (
  page: Page,
  sectionId: SectionContextId,
) =>
  page.evaluate((id) => {
    const target = document.getElementById(id);

    if (!target) {
      return false;
    }

    const documentHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight,
    );

    const viewportBottom =
      window.scrollY + window.innerHeight;

    if (
      id === 'contact' &&
      documentHeight > 0 &&
      viewportBottom >= documentHeight - 2
    ) {
      return true;
    }

    const readingLineY = Math.max(
      96,
      Math.min(window.innerHeight * 0.25, 240),
    );

    const rect =
      target.getBoundingClientRect();

    return (
      rect.top <= readingLineY &&
      rect.bottom > readingLineY
    );
  }, sectionId);

const expectSectionContext = async (
  page: Page,
  sectionId: SectionContextId,
) => {
  await expect
    .poll(() =>
      isSectionCurrentContext(
        page,
        sectionId,
      ),
    )
    .toBe(true);
};

const scrollToSection = async (
  page: Page,
  sectionId: SectionContextId,
) => {
  await page.evaluate((id) => {
    const target =
      document.getElementById(id);

    if (!target) {
      throw new Error(
        `Could not find section #${id}`,
      );
    }

    /*
     * Production intentionally uses smooth scrolling for ordinary in-page
     * navigation. This test needs a stable position before clicking the
     * language selector, so temporarily disable smooth scrolling while
     * arranging the test state.
     */
    const documentElement =
      document.documentElement;

    const previousScrollBehavior =
      documentElement.style.scrollBehavior;

    documentElement.style.scrollBehavior =
      'auto';

    target.scrollIntoView({
      block: 'start',
      behavior: 'auto',
    });

    documentElement.style.scrollBehavior =
      previousScrollBehavior;
  }, sectionId);

  await expectSectionContext(
    page,
    sectionId,
  );
};

test.describe(
  'multilingual SEO routes',
  () => {
    for (const locale of LOCALES) {
      test(`${locale.code} exposes indexable initial metadata`, async ({
        page,
        request,
      }) => {
        const response = await request.get(
          `/${locale.code}/`,
        );

        expect(response.ok()).toBe(true);

        const initialHtml =
          await response.text();

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

        await blockAnalytics(page);

        await page.goto(
          `/${locale.code}/#about`,
        );

        await expect(page).toHaveURL(
          new RegExp(
            `/${locale.code}/#about$`,
          ),
        );

        await expectLocaleState(
          page,
          locale,
        );

        await expectSectionContext(
          page,
          'about',
        );
      });
    }

    for (const locale of LOCALES) {
      for (const storedLocale of LOCALES) {
        if (
          storedLocale.code ===
          locale.code
        ) {
          continue;
        }

        test(`explicit ${locale.code} URL overrides stored ${storedLocale.code}`, async ({
          page,
        }) => {
          await blockAnalytics(page);

          await initializeStoredLanguage(
            page,
            storedLocale.code,
          );

          await page.goto(
            `/${locale.code}/`,
          );

          await expect(page).toHaveURL(
            new RegExp(
              `/${locale.code}/$`,
            ),
          );

          await expectLocaleState(
            page,
            locale,
          );
        });
      }
    }

    for (const originLocale of LOCALES) {
      for (const targetLocale of LOCALES) {
        if (
          originLocale.code ===
          targetLocale.code
        ) {
          continue;
        }

        const conflictingLocale =
          getConflictingLocale([
            originLocale.code,
            targetLocale.code,
          ]);

        test(`${originLocale.code} -> ${targetLocale.code} navigates directly to the selected locale from the top of the page`, async ({
          page,
        }) => {
          await blockAnalytics(page);

          await page.goto(
            `/${originLocale.code}/`,
          );

          await page.reload({
            waitUntil:
              'domcontentloaded',
          });

          await expect(page).toHaveURL(
            new RegExp(
              `/${originLocale.code}/$`,
            ),
          );

          await expectLocaleState(
            page,
            originLocale,
          );

          await setStoredLanguage(
            page,
            conflictingLocale.code,
          );

          await expectStoredLanguage(
            page,
            conflictingLocale.code,
          );

          await installNavigationLanguageMarker(
            page,
          );

          const navigationPathnames =
            trackMainFramePathnames(
              page,
            );

          await page
            .getByRole('banner')
            .getByRole('button', {
              name:
                targetLocale.name,
            })
            .click();

          await expect(page).toHaveURL(
            new RegExp(
              `/${targetLocale.code}/$`,
            ),
          );

          await page.waitForLoadState(
            'networkidle',
          );

          await expect(page).toHaveURL(
            new RegExp(
              `/${targetLocale.code}/$`,
            ),
          );

          await expectLocaleState(
            page,
            targetLocale,
          );

          await expectPersistedBeforeNavigation(
            page,
            targetLocale.code,
          );

          expect(
            navigationPathnames,
          ).toEqual([
            `/${targetLocale.code}/`,
          ]);
        });
      }
    }

    for (const sectionId of SECTION_CONTEXT_IDS) {
      test(`language selection preserves the visible ${sectionId} section`, async ({
        page,
      }) => {
        await blockAnalytics(page);

        await page.goto(
          '/es/?source=section-context',
        );

        await expectLocaleState(
          page,
          getLocale('es'),
        );

        await scrollToSection(
          page,
          sectionId,
        );

        await page
          .getByRole('banner')
          .getByRole('button', {
            name: 'English',
          })
          .click();

        await expect(page).toHaveURL(
          new RegExp(
            `/en/\\?source=section-context#${sectionId}$`,
          ),
        );

        await page.waitForLoadState(
          'networkidle',
        );

        await expect(page).toHaveURL(
          new RegExp(
            `/en/\\?source=section-context#${sectionId}$`,
          ),
        );

        await expectLocaleState(
          page,
          getLocale('en'),
        );

        /*
         * The hash existing in the URL is not enough. Because React creates
         * the section after the initial HTML document has loaded, verify that
         * the application has explicitly restored the real viewport context.
         */
        await expectSectionContext(
          page,
          sectionId,
        );
      });
    }

    test('the visible section replaces a stale section hash when changing language', async ({
      page,
    }) => {
      await blockAnalytics(page);

      await page.goto(
        '/es/#about',
      );

      await expect(page).toHaveURL(
        /\/es\/#about$/,
      );

      await expectSectionContext(
        page,
        'about',
      );

      await scrollToSection(
        page,
        'services',
      );

      /*
       * The URL deliberately remains on #about. The user's actual viewport
       * context must win when the language is changed.
       */
      await expect(page).toHaveURL(
        /\/es\/#about$/,
      );

      await page
        .getByRole('banner')
        .getByRole('button', {
          name: 'English',
        })
        .click();

      await expect(page).toHaveURL(
        /\/en\/#services$/,
      );

      await page.waitForLoadState(
        'networkidle',
      );

      await expectLocaleState(
        page,
        getLocale('en'),
      );

      await expectSectionContext(
        page,
        'services',
      );
    });

    for (const locale of LOCALES) {
      test(`root entry respects stored ${locale.code} preference and preserves the section anchor`, async ({
        page,
      }) => {
        await blockAnalytics(page);

        await initializeStoredLanguage(
          page,
          locale.code,
        );

        await page.goto(
          '/#services',
        );

        await expect(page).toHaveURL(
          new RegExp(
            `/${locale.code}/#services$`,
          ),
        );

        await expectLocaleState(
          page,
          locale,
        );

        await expectSectionContext(
          page,
          'services',
        );
      });
    }

    for (const locale of LOCALES) {
      const conflictingLocale =
        getConflictingLocale([
          locale.code,
        ]);

      test(`unexpected root visit from ${locale.code} preserves the explicit referrer locale`, async ({
        page,
      }) => {
        await blockAnalytics(page);

        await page.goto(
          `/${locale.code}/`,
        );

        await expectLocaleState(
          page,
          locale,
        );

        await setStoredLanguage(
          page,
          conflictingLocale.code,
        );

        await expectStoredLanguage(
          page,
          conflictingLocale.code,
        );

        const navigationPathnames =
          trackMainFramePathnames(
            page,
          );

        await page.evaluate(() => {
          window.location.assign('/');
        });

        await expect(page).toHaveURL(
          new RegExp(
            `/${locale.code}/$`,
          ),
        );

        await page.waitForLoadState(
          'networkidle',
        );

        await expectLocaleState(
          page,
          locale,
        );

        expect(
          navigationPathnames,
        ).toEqual([
          '/',
          `/${locale.code}/`,
        ]);
      });
    }
  },
);
