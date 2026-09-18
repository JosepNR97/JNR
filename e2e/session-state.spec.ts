import {
  expect,
  test,
} from '@playwright/test';
import {
  LANGUAGE_NAVIGATION_STORAGE_KEY,
} from '../languageNavigationState';
import {
  LANGUAGE_STORAGE_KEY,
} from '../localeRouting';
import {
  PORTFOLIO_SESSION_STATE_STORAGE_KEY,
  parsePortfolioSessionState,
} from '../portfolioSessionState';

const getPersistedPortfolioSessionState =
  async (
    page: Parameters<
      Parameters<
        typeof test
      >[1]
    >[0]['page'],
  ) => {
    const rawState =
      await page.evaluate(
        (
          storageKey,
        ) =>
          window.sessionStorage.getItem(
            storageKey,
          ),
        PORTFOLIO_SESSION_STATE_STORAGE_KEY,
      );

    return parsePortfolioSessionState(
      rawState,
    );
  };

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

        const expectedExperienceId =
          experienceTriggerId.replace(
            'experience-trigger-',
            '',
          );

        const expectedVendorId =
          educationTriggerId.replace(
            'education-trigger-',
            '',
          );

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
          .poll(
            async () =>
              getPersistedPortfolioSessionState(
                page,
              ),
          )
          .toEqual({
            version: 1,
            expandedExperienceId:
              expectedExperienceId,
            expandedVendorId:
              expectedVendorId,
          });

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
         * Meaningful UI state remains available for subsequent reloads during
         * the lifetime of this browser tab.
         */
        await expect
          .poll(
            async () =>
              getPersistedPortfolioSessionState(
                page,
              ),
          )
          .toEqual({
            version: 1,
            expandedExperienceId:
              expectedExperienceId,
            expandedVendorId:
              expectedVendorId,
          });
      },
    );

    test(
      'vendor selected from the certifications carousel remains expanded after reload',
      async ({
        page,
      }) => {
        await page.goto(
          '/es/',
        );

        /*
         * Reduced motion is enabled in beforeEach, so the carousel is stable
         * and can be exercised without coupling this session-state test to its
         * autoplay implementation.
         */
        const certificationsViewport =
          page.getByTestId(
            'certifications-viewport',
          );

        await certificationsViewport.scrollIntoViewIfNeeded();

        const awsLogo =
          certificationsViewport.getByRole(
            'button',
            {
              name: /AWS/i,
            },
          );

        const awsEducationTrigger =
          page.getByRole(
            'button',
            {
              name: /Amazon Web Services \(AWS\)/i,
            },
          );

        await expect(
          awsEducationTrigger,
        ).toHaveAttribute(
          'aria-expanded',
          'false',
        );

        await awsLogo.click();

        await expect(
          awsEducationTrigger,
        ).toHaveAttribute(
          'aria-expanded',
          'true',
        );

        const educationTriggerId =
          await awsEducationTrigger.getAttribute(
            'id',
          );

        expect(
          educationTriggerId,
        ).not.toBeNull();

        if (!educationTriggerId) {
          throw new Error(
            'Expected AWS Education trigger to expose a stable ID.',
          );
        }

        const expectedVendorId =
          educationTriggerId.replace(
            'education-trigger-',
            '',
          );

        await expect
          .poll(
            async () =>
              getPersistedPortfolioSessionState(
                page,
              ),
          )
          .toEqual(
            expect.objectContaining({
              version: 1,
              expandedVendorId:
                expectedVendorId,
            }),
          );

        await page.reload({
          waitUntil:
            'networkidle',
        });

        const restoredAwsEducationTrigger =
          page.locator(
            `#${educationTriggerId}`,
          );

        await expect(
          restoredAwsEducationTrigger,
        ).toHaveAttribute(
          'aria-expanded',
          'true',
        );

        await expect
          .poll(
            async () =>
              getPersistedPortfolioSessionState(
                page,
              ),
          )
          .toEqual(
            expect.objectContaining({
              version: 1,
              expandedVendorId:
                expectedVendorId,
            }),
          );
      },
    );
  },
);
