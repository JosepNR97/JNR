import {
  expect,
  test,
} from '@playwright/test';
import type {
  Locator,
  Page,
} from '@playwright/test';

const LANGUAGE_STORAGE_KEY =
  'jnr-language-v1';

const LANGUAGE_NAVIGATION_STORAGE_KEY =
  'jnr-language-navigation-v1';

const NAVIGATION_LANGUAGE_MARKER =
  'jnr-e2e-navigation-language';

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

type LocaleCode =
  (typeof LOCALES)[number]['code'];

type Locale =
  (typeof LOCALES)[number];

const productionUrl = (
  locale: LocaleCode,
) =>
  `https://josepnr97.github.io/JNR/${locale}/`;

const blockAnalytics =
  async (
    page: Page,
  ) => {
    await page.route(
      'https://www.googletagmanager.com/**',
      async (route) => {
        await route.abort();
      },
    );
  };

const initializeStoredLanguage =
  async (
    page: Page,
    language: LocaleCode,
  ) => {
    await page.addInitScript(
      ({
        storageKey,
        storedLanguage,
      }) => {
        window.localStorage.setItem(
          storageKey,
          storedLanguage,
        );
      },
      {
        storageKey:
          LANGUAGE_STORAGE_KEY,
        storedLanguage:
          language,
      },
    );
  };

const setStoredLanguage =
  async (
    page: Page,
    language: LocaleCode,
  ) => {
    await page.evaluate(
      ({
        storageKey,
        storedLanguage,
      }) => {
        window.localStorage.setItem(
          storageKey,
          storedLanguage,
        );
      },
      {
        storageKey:
          LANGUAGE_STORAGE_KEY,
        storedLanguage:
          language,
      },
    );
  };

const expectStoredLanguage =
  async (
    page: Page,
    language: LocaleCode,
  ) => {
    await expect
      .poll(() =>
        page.evaluate(
          (
            storageKey,
          ) =>
            window.localStorage.getItem(
              storageKey,
            ),
          LANGUAGE_STORAGE_KEY,
        ),
      )
      .toBe(language);
  };

const expectLocaleState =
  async (
    page: Page,
    locale: Locale,
  ) => {
    await expect(
      page.locator('html'),
    ).toHaveAttribute(
      'lang',
      locale.code,
    );

    await expect(
      page
        .getByRole(
          'banner',
        )
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

    await expect(
      page.locator(
        'link[rel="canonical"]',
      ),
    ).toHaveAttribute(
      'href',
      productionUrl(
        locale.code,
      ),
    );

    await expectStoredLanguage(
      page,
      locale.code,
    );
  };

const getLocale = (
  code: LocaleCode,
): Locale => {
  const locale =
    LOCALES.find(
      (
        candidate,
      ) =>
        candidate.code ===
        code,
    );

  if (!locale) {
    throw new Error(
      `Unknown locale: ${code}`,
    );
  }

  return locale;
};

const trackMainFramePathnames =
  (
    page: Page,
  ): string[] => {
    const pathnames:
      string[] = [];

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
          !url.startsWith(
            'http://',
          ) &&
          !url.startsWith(
            'https://',
          )
        ) {
          return;
        }

        pathnames.push(
          new URL(
            url,
          ).pathname,
        );
      },
    );

    return pathnames;
  };

const getConflictingLocale =
  (
    excludedLanguages:
      readonly LocaleCode[],
  ): Locale => {
    const locale =
      LOCALES.find(
        ({
          code,
        }) =>
          !excludedLanguages.includes(
            code,
          ),
      );

    if (!locale) {
      throw new Error(
        'Expected at least one conflicting locale',
      );
    }

    return locale;
  };

const installNavigationLanguageMarker =
  async (
    page: Page,
  ) => {
    await page.evaluate(
      ({
        storageKey,
        markerKey,
      }) => {
        window.sessionStorage.removeItem(
          markerKey,
        );

        window.addEventListener(
          'pagehide',
          () => {
            window.sessionStorage.setItem(
              markerKey,
              window.localStorage.getItem(
                storageKey,
              ) ?? '',
            );
          },
          {
            once: true,
          },
        );
      },
      {
        storageKey:
          LANGUAGE_STORAGE_KEY,
        markerKey:
          NAVIGATION_LANGUAGE_MARKER,
      },
    );
  };

const expectPersistedBeforeNavigation =
  async (
    page: Page,
    language: LocaleCode,
  ) => {
    const persistedLanguage =
      await page.evaluate(
        (
          markerKey,
        ) =>
          window.sessionStorage.getItem(
            markerKey,
          ),
        NAVIGATION_LANGUAGE_MARKER,
      );

    expect(
      persistedLanguage,
    ).toBe(language);
  };

const expectHashTargetRestored =
  async (
    page: Page,
    targetId: string,
  ) => {
    await expect
      .poll(() =>
        page.evaluate(
          (id) => {
            const target =
              document.getElementById(
                id,
              );

            if (!target) {
              return false;
            }

            const rect =
              target.getBoundingClientRect();

            return (
              rect.bottom > 0 &&
              rect.top <
                window.innerHeight
            );
          },
          targetId,
        ),
      )
      .toBe(true);
  };

const setLocatorViewportTop =
  async (
    locator: Locator,
    desiredTop: number,
  ) => {
    await locator.evaluate(
      (
        element,
        targetTop,
      ) => {
        const rect =
          element.getBoundingClientRect();

        const documentElement =
          document.documentElement;

        const previousScrollBehavior =
          documentElement.style
            .scrollBehavior;

        documentElement.style
          .scrollBehavior =
          'auto';

        window.scrollTo({
          top:
            window.scrollY +
            rect.top -
            targetTop,
          left: 0,
          behavior: 'auto',
        });

        documentElement.style
          .scrollBehavior =
          previousScrollBehavior;
      },
      desiredTop,
    );
  };

const getLocatorViewportTop =
  (
    locator: Locator,
  ) =>
    locator.evaluate(
      (element) =>
        element.getBoundingClientRect()
          .top,
    );

test.describe(
  'multilingual SEO routes',
  () => {
    for (
      const locale
      of LOCALES
    ) {
      test(
        `${locale.code} exposes indexable initial metadata and restores an explicit hash`,
        async ({
          page,
          request,
        }) => {
          const response =
            await request.get(
              `/${locale.code}/`,
            );

          expect(
            response.ok(),
          ).toBe(true);

          const initialHtml =
            await response.text();

          expect(
            initialHtml,
          ).toContain(
            `<html lang="${locale.code}">`,
          );

          expect(
            initialHtml,
          ).toContain(
            `rel="canonical" href="${productionUrl(
              locale.code,
            )}"`,
          );

          expect(
            initialHtml,
          ).toContain(
            'name="twitter:card" content="summary"',
          );

          expect(
            initialHtml,
          ).toContain(
            'type="application/ld+json"',
          );

          await blockAnalytics(
            page,
          );

          await page.goto(
            `/${locale.code}/#about`,
          );

          await expect(
            page,
          ).toHaveURL(
            new RegExp(
              `/${locale.code}/#about$`,
            ),
          );

          await expectLocaleState(
            page,
            locale,
          );

          await expectHashTargetRestored(
            page,
            'about',
          );
        },
      );
    }

    for (
      const locale
      of LOCALES
    ) {
      for (
        const storedLocale
        of LOCALES
      ) {
        if (
          storedLocale.code ===
          locale.code
        ) {
          continue;
        }

        test(
          `explicit ${locale.code} URL overrides stored ${storedLocale.code}`,
          async ({
            page,
          }) => {
            await blockAnalytics(
              page,
            );

            await initializeStoredLanguage(
              page,
              storedLocale.code,
            );

            await page.goto(
              `/${locale.code}/`,
            );

            await expect(
              page,
            ).toHaveURL(
              new RegExp(
                `/${locale.code}/$`,
              ),
            );

            await expectLocaleState(
              page,
              locale,
            );
          },
        );
      }
    }

    for (
      const originLocale
      of LOCALES
    ) {
      for (
        const targetLocale
        of LOCALES
      ) {
        if (
          originLocale.code ===
          targetLocale.code
        ) {
          continue;
        }

        const conflictingLocale =
          getConflictingLocale(
            [
              originLocale.code,
              targetLocale.code,
            ],
          );

        test(
          `${originLocale.code} -> ${targetLocale.code} navigates directly to the selected locale`,
          async ({
            page,
          }) => {
            await blockAnalytics(
              page,
            );

            await page.goto(
              `/${originLocale.code}/`,
            );

            await page.reload({
              waitUntil:
                'domcontentloaded',
            });

            await expect(
              page,
            ).toHaveURL(
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
              .getByRole(
                'banner',
              )
              .getByRole(
                'button',
                {
                  name:
                    targetLocale.name,
                },
              )
              .click();

            await expect(
              page,
            ).toHaveURL(
              new RegExp(
                `/${targetLocale.code}/$`,
              ),
            );

            await page.waitForLoadState(
              'networkidle',
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

            await expect
              .poll(() =>
                page.evaluate(
                  (
                    storageKey,
                  ) =>
                    window.sessionStorage.getItem(
                      storageKey,
                    ),
                  LANGUAGE_NAVIGATION_STORAGE_KEY,
                ),
              )
              .toBeNull();
          },
        );
      }
    }

    test(
      'language selection preserves an existing query string and hash',
      async ({
        page,
      }) => {
        await blockAnalytics(
          page,
        );

        await page.goto(
          '/es/?source=hash-test#experience',
        );

        await expectLocaleState(
          page,
          getLocale('es'),
        );

        await expectHashTargetRestored(
          page,
          'experience',
        );

        await page
          .getByRole(
            'banner',
          )
          .getByRole(
            'button',
            {
              name: 'English',
            },
          )
          .click();

        await expect(
          page,
        ).toHaveURL(
          /\/en\/\?source=hash-test#experience$/,
        );

        await page.waitForLoadState(
          'networkidle',
        );

        await expectLocaleState(
          page,
          getLocale('en'),
        );

        await expectHashTargetRestored(
          page,
          'experience',
        );
      },
    );

    test(
      'language selection preserves expanded content and the exact viewport context',
      async ({
        page,
      }) => {
        await blockAnalytics(
          page,
        );

        await page.emulateMedia({
          reducedMotion:
            'reduce',
        });

        await page.goto(
          '/es/?source=continuity',
        );

        await expectLocaleState(
          page,
          getLocale('es'),
        );

        const experienceTrigger =
          page
            .locator(
              '[id^="experience-trigger-"]',
            )
            .first();

        await experienceTrigger.scrollIntoViewIfNeeded();

        await experienceTrigger.click();

        await expect(
          experienceTrigger,
        ).toHaveAttribute(
          'aria-expanded',
          'true',
        );

        const experienceTriggerId =
          await experienceTrigger.getAttribute(
            'id',
          );

        expect(
          experienceTriggerId,
        ).not.toBeNull();

        const educationTrigger =
          page
            .locator(
              '[id^="education-trigger-"]',
            )
            .first();

        await educationTrigger.scrollIntoViewIfNeeded();

        await educationTrigger.click();

        await expect(
          educationTrigger,
        ).toHaveAttribute(
          'aria-expanded',
          'true',
        );

        const educationTriggerId =
          await educationTrigger.getAttribute(
            'id',
          );

        expect(
          educationTriggerId,
        ).not.toBeNull();

        if (
          !experienceTriggerId ||
          !educationTriggerId
        ) {
          throw new Error(
            'Expected stable accordion trigger IDs.',
          );
        }

        /*
         * Put the expanded Education trigger at a deliberately non-default
         * viewport position. The locale change should reproduce this visual
         * context rather than merely scrolling to the start of Education.
         */
        await setLocatorViewportTop(
          educationTrigger,
          120,
        );

        const viewportTopBefore =
          await getLocatorViewportTop(
            educationTrigger,
          );

        await page
          .getByRole(
            'banner',
          )
          .getByRole(
            'button',
            {
              name: 'English',
            },
          )
          .click();

        await expect(
          page,
        ).toHaveURL(
          /\/en\/\?source=continuity$/,
        );

        await page.waitForLoadState(
          'networkidle',
        );

        await expectLocaleState(
          page,
          getLocale('en'),
        );

        const restoredExperienceTrigger =
          page.locator(
            `#${experienceTriggerId}`,
          );

        const restoredEducationTrigger =
          page.locator(
            `#${educationTriggerId}`,
          );

        await expect(
          restoredExperienceTrigger,
        ).toHaveAttribute(
          'aria-expanded',
          'true',
        );

        await expect(
          restoredEducationTrigger,
        ).toHaveAttribute(
          'aria-expanded',
          'true',
        );

        /*
         * Exact text heights can vary between translations, so allow a tiny
         * rendering tolerance while requiring the same UI element to remain
         * at effectively the same viewport position.
         */
        await expect
          .poll(
            async () => {
              const viewportTopAfter =
                await getLocatorViewportTop(
                  restoredEducationTrigger,
                );

              return Math.abs(
                viewportTopAfter -
                  viewportTopBefore,
              );
            },
            {
              timeout: 5_000,
            },
          )
          .toBeLessThanOrEqual(
            4,
          );

        /*
         * The hand-off is one-shot. Once restored, it must not become
         * persistent navigation state that can affect later reloads or
         * history navigation.
         */
        await expect
          .poll(() =>
            page.evaluate(
              (
                storageKey,
              ) =>
                window.sessionStorage.getItem(
                  storageKey,
                ),
              LANGUAGE_NAVIGATION_STORAGE_KEY,
            ),
          )
          .toBeNull();
      },
    );

    for (
      const locale
      of LOCALES
    ) {
      test(
        `root entry respects stored ${locale.code} preference and preserves the section anchor`,
        async ({
          page,
        }) => {
          await blockAnalytics(
            page,
          );

          await initializeStoredLanguage(
            page,
            locale.code,
          );

          await page.goto(
            '/#services',
          );

          await expect(
            page,
          ).toHaveURL(
            new RegExp(
              `/${locale.code}/#services$`,
            ),
          );

          await expectLocaleState(
            page,
            locale,
          );

          await expectHashTargetRestored(
            page,
            'services',
          );
        },
      );
    }

    for (
      const locale
      of LOCALES
    ) {
      const conflictingLocale =
        getConflictingLocale(
          [
            locale.code,
          ],
        );

      test(
        `unexpected root visit from ${locale.code} preserves the explicit referrer locale`,
        async ({
          page,
        }) => {
          await blockAnalytics(
            page,
          );

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

          await page.evaluate(
            () => {
              window.location.assign(
                '/',
              );
            },
          );

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
        },
      );
    }
  },
);
