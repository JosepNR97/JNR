import {
  expect,
  test,
} from '@playwright/test';
import type {
  Locator,
  Page,
} from '@playwright/test';

test.use({
  reducedMotion:
    'reduce',
});

const waitForScheduledLayoutScroll =
  async (
    page: Page,
  ) => {
    await page.evaluate(
      () =>
        new Promise<void>(
          (
            resolve,
          ) => {
            window.requestAnimationFrame(
              () => {
                window.requestAnimationFrame(
                  () => {
                    resolve();
                  },
                );
              },
            );
          },
        ),
    );
  };

const setViewportTop =
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
          left:
            0,
          behavior:
            'auto',
        });

        documentElement.style
          .scrollBehavior =
          previousScrollBehavior;
      },
      desiredTop,
    );
  };

const getViewportTop =
  (
    locator: Locator,
  ) =>
    locator.evaluate(
      (
        element,
      ) =>
        element
          .getBoundingClientRect()
          .top,
    );

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
  },
);

test.describe(
  'portfolio tab session state',
  () => {
    test(
      'reload preserves expanded Experience, Education and viewport context',
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

        if (
          !experienceTriggerId ||
          !educationTriggerId
        ) {
          throw new Error(
            'Expected stable accordion trigger IDs.',
          );
        }

        /*
         * Opening an accordion schedules its layout-aware scroll over two
         * animation frames. Let it finish before establishing the exact
         * viewport position whose reload continuity we want to validate.
         */
        await waitForScheduledLayoutScroll(
          page,
        );

        await setViewportTop(
          educationTrigger,
          140,
        );

        const viewportTopBefore =
          await getViewportTop(
            educationTrigger,
          );

        expect(
          viewportTopBefore,
        ).toBeGreaterThanOrEqual(
          139,
        );

        expect(
          viewportTopBefore,
        ).toBeLessThanOrEqual(
          141,
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
         * F5 continuity is an explicit application contract instead of an
         * assumption about Chromium's native scroll restoration.
         */
        await expect
          .poll(
            async () => {
              const viewportTopAfter =
                await getViewportTop(
                  restoredEducationTrigger,
                );

              return Math.abs(
                viewportTopAfter -
                  viewportTopBefore,
              );
            },
          )
          .toBeLessThanOrEqual(
            4,
          );
      },
    );

    test(
      'vendor opened from the certifications carousel remains expanded after reload',
      async ({
        page,
      }) => {
        await page.goto(
          '/es/',
        );

        const certificationsViewport =
          page.getByTestId(
            'certifications-viewport',
          );

        await certificationsViewport.scrollIntoViewIfNeeded();

        const awsLogo =
          certificationsViewport.getByRole(
            'button',
            {
              name:
                /AWS/i,
            },
          );

        const awsEducationTrigger =
          page.locator(
            '#education-trigger-v_aws',
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

        await page.reload({
          waitUntil:
            'networkidle',
        });

        await expect(
          page.locator(
            '#education-trigger-v_aws',
          ),
        ).toHaveAttribute(
          'aria-expanded',
          'true',
        );
      },
    );
  },
);
