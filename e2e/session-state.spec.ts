import {
  expect,
  test,
} from '@playwright/test';

test.use({
  reducedMotion:
    'reduce',
});

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
      'reload preserves expanded Experience and Education content',
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
         * Leave the user in the Education area before reloading so the test
         * also verifies that restoring expanded panels does not collapse the
         * document back to the top.
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
              name: /AWS/i,
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
