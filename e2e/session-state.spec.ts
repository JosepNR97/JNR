import {
  expect,
  test,
} from '@playwright/test';

const LANGUAGE_STORAGE_KEY =
  'jnr-language-v1';

const LANGUAGE_NAVIGATION_STORAGE_KEY =
  'jnr-language-navigation-v1';

const PORTFOLIO_SESSION_STATE_STORAGE_KEY =
  'jnr-portfolio-session-state-v1';

test.beforeEach(
  async ({
    page,
  }) => {
    await page.route(
      'https://www.googletagmanager.com/**',
      async (route) => {
        await route.abort();
      },
    );

    await page.addInitScript(
      ({
        languageStorageKey,
      }) => {
        window.localStorage.setItem(
          languageStorageKey,
          'es',
        );
      },
      {
        languageStorageKey:
          LANGUAGE_STORAGE_KEY,
      },
    );

    await page.emulateMedia({
      reducedMotion:
        'reduce',
    });
  },
);

test.describe(
  'portfolio tab session state',
  () => {
    test(
      'reload preserves expanded content and browsing context',
      async ({
        page,
      }) => {
        await page.goto(
          '/es/',
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
          experienceTriggerId,
        ).not.toBeNull();

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
         * Place the Education trigger deliberately inside the viewport rather
         * than leaving it aligned to a browser-generated scroll position.
         */
        await educationTrigger.evaluate(
          (
            element,
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
                140,
              left: 0,
              behavior:
                'auto',
            });

            documentElement.style
              .scrollBehavior =
              previousScrollBehavior;
          },
        );

        await expect
          .poll(() =>
            page.evaluate(
              (
                storageKey,
              ) => {
                const rawState =
                  window.sessionStorage.getItem(
                    storageKey,
                  );

                if (!rawState) {
                  return null;
                }

                return JSON.parse(
                  rawState,
                );
              },
              PORTFOLIO_SESSION_STATE_STORAGE_KEY,
            ),
          )
          .toEqual(
            expect.objectContaining({
              version: 1,
              expandedExperienceId:
                experienceTriggerId.replace(
                  'experience-trigger-',
                  '',
                ),
              expandedVendorId:
                educationTriggerId.replace(
                  'education-trigger-',
                  '',
                ),
            }),
          );

        const scrollYBefore =
          await page.evaluate(
            () =>
              window.scrollY,
          );

        expect(
          scrollYBefore,
        ).toBeGreaterThan(
          0,
        );

        await page.reload({
          waitUntil:
            'networkidle',
        });

        await expect(
          page,
        ).toHaveURL(
          /\/es\/$/,
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
         * Chrome owns ordinary reload scroll restoration. The application
         * must restore the same layout state early enough that this native
         * behavior still lands in the same browsing context.
         */
        await expect
          .poll(() =>
            restoredEducationTrigger.evaluate(
              (
                element,
              ) => {
                const rect =
                  element.getBoundingClientRect();

                return (
                  rect.bottom >
                    0 &&
                  rect.top <
                    window.innerHeight
                );
              },
            ),
          )
          .toBe(true);

        const scrollYAfter =
          await page.evaluate(
            () =>
              window.scrollY,
          );

        expect(
          scrollYAfter,
        ).toBeGreaterThan(
          0,
        );

        /*
         * A normal reload must not masquerade as a locale transition.
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

        /*
         * The meaningful UI state remains available for subsequent reloads
         * during the lifetime of this browser tab.
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
              PORTFOLIO_SESSION_STATE_STORAGE_KEY,
            ),
          )
          .not.toBeNull();
      },
    );
  },
);
