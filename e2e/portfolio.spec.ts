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

const getTrackX = (
  track: Locator,
) =>
  track.evaluate(
    (element) =>
      element.getBoundingClientRect().x,
  );

const expectTrackToMove = async (
  track: Locator,
  startX: number,
  minimumDistance = 4,
) => {
  await expect
    .poll(
      async () =>
        Math.abs(
          (await getTrackX(track)) -
            startX,
        ),
      {
        timeout: 2_000,
      },
    )
    .toBeGreaterThan(minimumDistance);
};

const expectTrackToStayStill = async (
  page: Page,
  track: Locator,
  maximumDrift = 2,
) => {
  const before = await getTrackX(track);

  /*
   * The carousel moves at 52 px/s.
   * A 250 ms observation window is long
   * enough to distinguish movement from
   * a one-frame positioning tolerance
   * without coupling the test to an exact
   * animation timestamp.
   */
  await page.waitForTimeout(250);

  const after = await getTrackX(track);

  expect(
    Math.abs(after - before),
  ).toBeLessThanOrEqual(maximumDrift);
};

test.beforeEach(async ({ page }) => {
  /*
   * Analytics is not part of the product
   * behavior under test and must not make
   * the smoke suite depend on the network.
   */
  await page.route(
    'https://www.googletagmanager.com/**',
    async (route) => {
      await route.abort();
    },
  );

  /*
   * Make the initial language deterministic
   * instead of inheriting the CI runner
   * locale.
   */
  await page.addInitScript(
    ({ storageKey }) => {
      window.localStorage.setItem(
        storageKey,
        'es',
      );
    },
    {
      storageKey:
        LANGUAGE_STORAGE_KEY,
    },
  );
});

test.describe(
  'portfolio browser smoke',
  () => {
    test(
      'loads the React application with its primary landmarks',
      async ({ page }) => {
        const response =
          await page.goto('/');

        expect(response?.ok()).toBe(true);

        await expect(
          page.locator('#root'),
        ).not.toBeEmpty();

        await expect(
          page.getByRole('banner'),
        ).toBeVisible();

        await expect(
          page.getByRole('main'),
        ).toBeVisible();
      },
    );

    test(
      'switches CA, ES and EN with real browser state',
      async ({ page }) => {
        await page.goto('/');

        const spanishButton =
          page.getByRole('button', {
            name: 'Español',
          });

        const catalanButton =
          page.getByRole('button', {
            name: 'Català',
          });

        const englishButton =
          page.getByRole('button', {
            name: 'English',
          });

        await expect(
          spanishButton,
        ).toHaveAttribute(
          'aria-pressed',
          'true',
        );

        await expect(
          page.locator('html'),
        ).toHaveAttribute(
          'lang',
          'es',
        );

        await catalanButton.click();

        await expect(
          catalanButton,
        ).toHaveAttribute(
          'aria-pressed',
          'true',
        );

        await expect(
          spanishButton,
        ).toHaveAttribute(
          'aria-pressed',
          'false',
        );

        await expect(
          page.locator('html'),
        ).toHaveAttribute(
          'lang',
          'ca',
        );

        await englishButton.click();

        await expect(
          englishButton,
        ).toHaveAttribute(
          'aria-pressed',
          'true',
        );

        await expect(
          catalanButton,
        ).toHaveAttribute(
          'aria-pressed',
          'false',
        );

        await expect(
          page.locator('html'),
        ).toHaveAttribute(
          'lang',
          'en',
        );

        await spanishButton.click();

        await expect(
          spanishButton,
        ).toHaveAttribute(
          'aria-pressed',
          'true',
        );

        await expect(
          englishButton,
        ).toHaveAttribute(
          'aria-pressed',
          'false',
        );

        await expect(
          page.locator('html'),
        ).toHaveAttribute(
          'lang',
          'es',
        );
      },
    );

    test(
      'contact CTA keeps the real #contact navigation',
      async ({ page }) => {
        await page.goto('/');

        const contactLink =
          page
            .getByRole('banner')
            .getByRole('link', {
              name: /Contact/i,
            });

        await expect(
          contactLink,
        ).toHaveAttribute(
          'href',
          '#contact',
        );

        await contactLink.click();

        await expect(
          page,
        ).toHaveURL(/#contact$/);
      },
    );

    test(
      'mobile navigation opens, closes with Escape and keeps anchor navigation',
      async ({ page }) => {
        await page.setViewportSize({
          width: 390,
          height: 844,
        });

        await page.goto('/');

        const menuButton =
          page.locator(
            'button[aria-controls="mobile-navigation"]',
          );

        const mobileNavigation =
          page.locator(
            '#mobile-navigation',
          );

        await expect(
          menuButton,
        ).toHaveAccessibleName(
          'Abrir menú',
        );

        await expect(
          menuButton,
        ).toHaveAttribute(
          'aria-expanded',
          'false',
        );

        await menuButton.click();

        await expect(
          menuButton,
        ).toHaveAccessibleName(
          'Cerrar menú',
        );

        await expect(
          menuButton,
        ).toHaveAttribute(
          'aria-expanded',
          'true',
        );

        await expect(
          mobileNavigation,
        ).toHaveAttribute(
          'aria-hidden',
          'false',
        );

        await page.keyboard.press(
          'Escape',
        );

        await expect(
          menuButton,
        ).toHaveAttribute(
          'aria-expanded',
          'false',
        );

        await expect(
          mobileNavigation,
        ).toHaveAttribute(
          'aria-hidden',
          'true',
        );

        await menuButton.click();

        await mobileNavigation
          .locator(
            'a[href="#about"]',
          )
          .click();

        await expect(
          page,
        ).toHaveURL(/#about$/);

        await expect(
          menuButton,
        ).toHaveAttribute(
          'aria-expanded',
          'false',
        );
      },
    );

    test(
      'certifications carousel auto-plays using real layout and animation frames',
      async ({ page }) => {
        await page.goto('/');

        const viewport =
          page.getByTestId(
            'certifications-viewport',
          );

        const track =
          page.getByTestId(
            'certifications-track',
          );

        await viewport.scrollIntoViewIfNeeded();

        await expect(
          viewport,
        ).toBeVisible();

        const width =
          await track.evaluate(
            (element) =>
              element.getBoundingClientRect()
                .width,
          );

        expect(width).toBeGreaterThan(
          0,
        );

        const initialX =
          await getTrackX(track);

        await expectTrackToMove(
          track,
          initialX,
        );
      },
    );

    test(
      'certifications carousel pauses on real hover and resumes after leaving',
      async ({ page }) => {
        await page.goto('/');

        const viewport =
          page.getByTestId(
            'certifications-viewport',
          );

        const track =
          page.getByTestId(
            'certifications-track',
          );

        await viewport.scrollIntoViewIfNeeded();

        const movingFromX =
          await getTrackX(track);

        await expectTrackToMove(
          track,
          movingFromX,
        );

        await viewport.hover();

        await expectTrackToStayStill(
          page,
          track,
        );

        const pausedX =
          await getTrackX(track);

        await page
          .getByRole('banner')
          .hover();

        await expectTrackToMove(
          track,
          pausedX,
        );
      },
    );

    test(
      'certifications carousel responds to a real mouse drag',
      async ({ page }) => {
        await page.goto('/');

        const viewport =
          page.getByTestId(
            'certifications-viewport',
          );

        const track =
          page.getByTestId(
            'certifications-track',
          );

        await viewport.scrollIntoViewIfNeeded();
        await viewport.hover();

        await expectTrackToStayStill(
          page,
          track,
        );

        const viewportBox =
          await viewport.boundingBox();

        expect(
          viewportBox,
        ).not.toBeNull();

        if (!viewportBox) {
          throw new Error(
            'Certifications viewport has no browser geometry.',
          );
        }

        const startX =
          viewportBox.x +
          viewportBox.width * 0.65;

        const y =
          viewportBox.y +
          viewportBox.height / 2;

        const initialX =
          await getTrackX(track);

        await page.mouse.move(
          startX,
          y,
        );

        await page.mouse.down();

        await page.mouse.move(
          startX - 160,
          y,
          {
            steps: 8,
          },
        );

        await page.mouse.up();

        const draggedX =
          await getTrackX(track);

        expect(
          Math.abs(
            draggedX - initialX,
          ),
        ).toBeGreaterThan(30);
      },
    );

    test(
      'a logo click selects its vendor while a drag starting on the logo does not',
      async ({ page }) => {
        await page.goto('/');

        let viewport =
          page.getByTestId(
            'certifications-viewport',
          );

        let track =
          page.getByTestId(
            'certifications-track',
          );

        let awsLogo =
          viewport.getByRole(
            'button',
            {
              name: /AWS/i,
            },
          );

        let awsEducationTrigger =
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

        /*
         * Reload to obtain a clean application
         * state before validating that a drag
         * does not trigger the same selection.
         */
        await page.goto('/');

        viewport =
          page.getByTestId(
            'certifications-viewport',
          );

        track =
          page.getByTestId(
            'certifications-track',
          );

        awsLogo =
          viewport.getByRole(
            'button',
            {
              name: /AWS/i,
            },
          );

        awsEducationTrigger =
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

        await awsLogo.scrollIntoViewIfNeeded();
        await awsLogo.hover();

        const logoBox =
          await awsLogo.boundingBox();

        expect(
          logoBox,
        ).not.toBeNull();

        if (!logoBox) {
          throw new Error(
            'AWS carousel logo has no browser geometry.',
          );
        }

        const startX =
          logoBox.x +
          logoBox.width / 2;

        const y =
          logoBox.y +
          logoBox.height / 2;

        const initialX =
          await getTrackX(track);

        await page.mouse.move(
          startX,
          y,
        );

        await page.mouse.down();

        await page.mouse.move(
          startX - 120,
          y,
          {
            steps: 8,
          },
        );

        await page.mouse.up();

        const draggedX =
          await getTrackX(track);

        expect(
          Math.abs(
            draggedX - initialX,
          ),
        ).toBeGreaterThan(30);

        await expect(
          awsEducationTrigger,
        ).toHaveAttribute(
          'aria-expanded',
          'false',
        );
      },
    );

    test(
      'ultrawide layout keeps repeated carousel content covering the viewport',
      async ({ page }) => {
        await page.setViewportSize({
          width: 3440,
          height: 1440,
        });

        await page.goto('/');

        const viewport =
          page.getByTestId(
            'certifications-viewport',
          );

        await viewport.scrollIntoViewIfNeeded();

        const coverage =
          await viewport.evaluate(
            (element) => {
              const viewportRect =
                element.getBoundingClientRect();

              const segments =
                Array.from(
                  element.querySelectorAll<HTMLElement>(
                    '[data-testid="certifications-segment"]',
                  ),
                )
                  .map(
                    (segment) => {
                      const rect =
                        segment.getBoundingClientRect();

                      return {
                        left: rect.left,
                        right:
                          rect.right,
                        width:
                          rect.width,
                      };
                    },
                  )
                  .sort(
                    (a, b) =>
                      a.left -
                      b.left,
                  );

              const gaps =
                segments
                  .slice(1)
                  .map(
                    (
                      segment,
                      index,
                    ) => {
                      const previousSegment =
                        segments[
                          index
                        ];

                      if (
                        !previousSegment
                      ) {
                        return Number.POSITIVE_INFINITY;
                      }

                      return (
                        segment.left -
                        previousSegment.right
                      );
                    },
                  );

              return {
                viewportLeft:
                  viewportRect.left,
                viewportRight:
                  viewportRect.right,
                segmentCount:
                  segments.length,
                allSegmentsHaveWidth:
                  segments.every(
                    (
                      segment,
                    ) =>
                      segment.width >
                      0,
                  ),
                firstSegmentLeft:
                  segments[0]
                    ?.left ??
                  Number.POSITIVE_INFINITY,
                lastSegmentRight:
                  segments.at(-1)
                    ?.right ??
                  Number.NEGATIVE_INFINITY,
                maximumGap:
                  gaps.length > 0
                    ? Math.max(
                        ...gaps,
                      )
                    : 0,
              };
            },
          );

        expect(
          coverage.segmentCount,
        ).toBeGreaterThan(1);

        expect(
          coverage.allSegmentsHaveWidth,
        ).toBe(true);

        expect(
          coverage.firstSegmentLeft,
        ).toBeLessThanOrEqual(
          coverage.viewportLeft + 1,
        );

        expect(
          coverage.lastSegmentRight,
        ).toBeGreaterThanOrEqual(
          coverage.viewportRight - 1,
        );

        expect(
          coverage.maximumGap,
        ).toBeLessThanOrEqual(1);

        await expect
          .poll(
            async () =>
              viewport.evaluate(
                (element) => {
                  const viewportRect =
                    element.getBoundingClientRect();

                  const visibleImages =
                    Array.from(
                      element.querySelectorAll<HTMLImageElement>(
                        'img',
                      ),
                    ).filter(
                      (
                        image,
                      ) => {
                        const rect =
                          image.getBoundingClientRect();

                        return (
                          rect.right >
                            viewportRect.left &&
                          rect.left <
                            viewportRect.right &&
                          rect.bottom >
                            viewportRect.top &&
                          rect.top <
                            viewportRect.bottom
                        );
                      },
                    );

                  return (
                    visibleImages.length >
                      0 &&
                    visibleImages.every(
                      (
                        image,
                      ) =>
                        image.complete &&
                        image.naturalWidth >
                          0 &&
                        image.naturalHeight >
                          0,
                    )
                  );
                },
              ),
            {
              timeout: 5_000,
            },
          )
          .toBe(true);
      },
    );
  },
);

test.describe(
  'prefers-reduced-motion',
  () => {
    test.use({
      reducedMotion: 'reduce',
    });

    test(
      'disables carousel autoplay while keeping keyboard interaction available',
      async ({ page }) => {
        await page.goto('/');

        const viewport =
          page.getByTestId(
            'certifications-viewport',
          );

        const track =
          page.getByTestId(
            'certifications-track',
          );

        const awsLogo =
          viewport.getByRole(
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

        await viewport.scrollIntoViewIfNeeded();

        await expectTrackToStayStill(
          page,
          track,
        );

        await awsLogo.focus();

        await expect(
          awsLogo,
        ).toBeFocused();

        await page.keyboard.press(
          'Enter',
        );

        await expect(
          awsEducationTrigger,
        ).toHaveAttribute(
          'aria-expanded',
          'true',
        );
      },
    );
  },
);