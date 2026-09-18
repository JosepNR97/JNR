import {
  expect,
  test,
} from '@playwright/test';
import type {
  Locator,
  Page,
} from '@playwright/test';

const blockAnalytics =
  async (
    page: Page,
  ) => {
    await page.route(
      'https://www.googletagmanager.com/**',
      async (
        route,
      ) => {
        await route.abort();
      },
    );
  };

const expectLoadedImage =
  async (
    image: Locator,
  ) => {
    await expect(
      image,
    ).toBeVisible();

    await expect
      .poll(
        () =>
          image.evaluate(
            (
              element,
            ) => {
              const htmlImage =
                element as HTMLImageElement;

              return (
                htmlImage.complete &&
                htmlImage.naturalWidth >
                  0 &&
                htmlImage.naturalHeight >
                  0
              );
            },
          ),
      )
      .toBe(true);
  };

const expectCenteredWithin =
  async (
    frame: Locator,
    image: Locator,
  ) => {
    const [
      frameBox,
      imageBox,
    ] =
      await Promise.all([
        frame.boundingBox(),
        image.boundingBox(),
      ]);

    expect(
      frameBox,
    ).not.toBeNull();

    expect(
      imageBox,
    ).not.toBeNull();

    if (
      !frameBox ||
      !imageBox
    ) {
      return;
    }

    const frameCenterX =
      frameBox.x +
      frameBox.width /
        2;

    const frameCenterY =
      frameBox.y +
      frameBox.height /
        2;

    const imageCenterX =
      imageBox.x +
      imageBox.width /
        2;

    const imageCenterY =
      imageBox.y +
      imageBox.height /
        2;

    expect(
      Math.abs(
        frameCenterX -
          imageCenterX,
      ),
    ).toBeLessThanOrEqual(
      2,
    );

    expect(
      Math.abs(
        frameCenterY -
          imageCenterY,
      ),
    ).toBeLessThanOrEqual(
      2,
    );
  };

const collectFailedImageResponses =
  (
    page: Page,
  ) => {
    const failed: string[] =
      [];

    page.on(
      'response',
      (
        response,
      ) => {
        if (
          response
            .request()
            .resourceType() !==
          'image'
        ) {
          return;
        }

        if (
          response.status() <
          400
        ) {
          return;
        }

        failed.push(
          `${response.status()} ${response.url()}`,
        );
      },
    );

    return failed;
  };

const getSelectedSourceWidth =
  async (
    image: Locator,
  ) =>
    image.evaluate(
      (
        element,
      ) => {
        const htmlImage =
          element as HTMLImageElement;

        if (
          !htmlImage.currentSrc
        ) {
          return null;
        }

        const currentUrl =
          new URL(
            htmlImage.currentSrc,
            document.baseURI,
          ).href;

        const picture =
          htmlImage.closest(
            'picture',
          );

        if (!picture) {
          return null;
        }

        const sources =
          Array.from(
            picture.querySelectorAll(
              'source',
            ),
          );

        for (
          const source of
          sources
        ) {
          const candidates =
            (
              source.getAttribute(
                'srcset',
              ) ?? ''
            )
              .split(
                ',',
              )
              .map(
                (
                  candidate,
                ) =>
                  candidate.trim(),
              )
              .filter(
                Boolean,
              );

          for (
            const candidate of
            candidates
          ) {
            const parts =
              candidate.split(
                /\s+/,
              );

            const candidateUrl =
              parts[0];

            const descriptor =
              parts[1];

            if (
              !candidateUrl ||
              !descriptor?.endsWith(
                'w',
              )
            ) {
              continue;
            }

            const resolvedCandidateUrl =
              new URL(
                candidateUrl,
                document.baseURI,
              ).href;

            if (
              resolvedCandidateUrl !==
              currentUrl
            ) {
              continue;
            }

            const width =
              Number.parseInt(
                descriptor.slice(
                  0,
                  -1,
                ),
                10,
              );

            return Number.isFinite(
              width,
            )
              ? width
              : null;
          }
        }

        return null;
      },
    );

test.describe(
  'automatic responsive image delivery',
  () => {
    test.describe(
      'mobile profile image',
      () => {
        test.use({
          viewport: {
            width:
              390,
            height:
              844,
          },
          deviceScaleFactor:
            1,
        });

        test(
          'selects the 480w generated profile candidate',
          async ({
            page,
          }) => {
            await blockAnalytics(
              page,
            );

            const failedImages =
              collectFailedImageResponses(
                page,
              );

            await page.goto(
              '/es/',
            );

            const image =
              page.locator(
                '#about picture img',
              );

            await image.scrollIntoViewIfNeeded();

            await expectLoadedImage(
              image,
            );

            await expect(
              image,
            ).toHaveAttribute(
              'width',
              '1254',
            );

            await expect(
              image,
            ).toHaveAttribute(
              'height',
              '1254',
            );

            expect(
              await getSelectedSourceWidth(
                image,
              ),
            ).toBe(
              480,
            );

            expect(
              failedImages,
            ).toEqual(
              [],
            );
          },
        );
      },
    );

    test.describe(
      'high-density desktop profile image',
      () => {
        test.use({
          viewport: {
            width:
              1440,
            height:
              900,
          },
          deviceScaleFactor:
            2,
        });

        test(
          'selects the 960w generated profile candidate',
          async ({
            page,
          }) => {
            await blockAnalytics(
              page,
            );

            const failedImages =
              collectFailedImageResponses(
                page,
              );

            await page.goto(
              '/es/',
            );

            const image =
              page.locator(
                '#about picture img',
              );

            await image.scrollIntoViewIfNeeded();

            await expectLoadedImage(
              image,
            );

            expect(
              await getSelectedSourceWidth(
                image,
              ),
            ).toBe(
              960,
            );

            expect(
              failedImages,
            ).toEqual(
              [],
            );
          },
        );
      },
    );

    test(
      'automatically optimizes an academic raster without per-file configuration',
      async ({
        page,
      }) => {
        await blockAnalytics(
          page,
        );

        const failedImages =
          collectFailedImageResponses(
            page,
          );

        await page.goto(
          '/es/',
        );

        const image =
          page.getByRole(
            'img',
            {
              name:
                'Logo ISDI',
            },
          );

        await image.scrollIntoViewIfNeeded();

        await expectLoadedImage(
          image,
        );

        expect(
          await getSelectedSourceWidth(
            image,
          ),
        ).toBe(
          64,
        );

        expect(
          failedImages,
        ).toEqual(
          [],
        );
      },
    );

    test(
      'keeps optimized raster logos centered inside their visual frames',
      async ({
        page,
      }) => {
        await blockAnalytics(
          page,
        );

        const failedImages =
          collectFailedImageResponses(
            page,
          );

        await page.goto(
          '/es/',
        );

        const checks = [
          {
            name:
              'Logo ISDI',
            frame:
              'academic-logo',
          },
          {
            name:
              'Logo Universitat de Barcelona',
            frame:
              'academic-logo',
          },
          {
            name:
              'Logo Microsoft Azure',
            frame:
              'vendor-logo',
          },
          {
            name:
              'Logo SAP LeanIX',
            frame:
              'vendor-logo',
          },
          {
            name:
              'Logo ServiceNow',
            frame:
              'vendor-logo',
          },
          {
            name:
              'Logo Scaled Agile, Inc.',
            frame:
              'vendor-logo',
          },
        ] as const;

        for (
          const check of
          checks
        ) {
          const image =
            page
              .getByRole(
                'img',
                {
                  name:
                    check.name,
                  exact:
                    true,
                },
              )
              .first();

          await image.scrollIntoViewIfNeeded();

          await expectLoadedImage(
            image,
          );

          const frame =
            page
              .locator(
                `[data-image-frame="${check.frame}"]`,
              )
              .filter({
                has:
                  image,
              });

          await expect(
            frame,
          ).toHaveCount(
            1,
          );

          await expectCenteredWithin(
            frame,
            image,
          );
        }

        expect(
          failedImages,
        ).toEqual(
          [],
        );
      },
    );

    test(
      'defers certification badges, loads optimized candidates on expansion and restores them after reload',
      async ({
        page,
      }) => {
        await blockAnalytics(
          page,
        );

        const failedImages =
          collectFailedImageResponses(
            page,
          );

        await page.goto(
          '/es/',
        );

        const githubCard =
          page.locator(
            '#education-card-v_github',
          );

        await githubCard.scrollIntoViewIfNeeded();

        const githubTrigger =
          page.locator(
            '#education-trigger-v_github',
          );

        const githubPanel =
          page.locator(
            '#education-panel-v_github',
          );

        const badges =
          githubPanel.locator(
            'img',
          );

        await expect(
          githubTrigger,
        ).toHaveAttribute(
          'aria-expanded',
          'false',
        );

        await expect(
          badges,
        ).toHaveCount(
          2,
        );

        await expect(
          badges.first(),
        ).not.toHaveAttribute(
          'src',
          /.+/,
        );

        await expect(
          badges.last(),
        ).not.toHaveAttribute(
          'src',
          /.+/,
        );

        expect(
          await githubPanel
            .locator(
              'source',
            )
            .count(),
        ).toBe(
          0,
        );

        await githubTrigger.click();

        await expect(
          githubTrigger,
        ).toHaveAttribute(
          'aria-expanded',
          'true',
        );

        for (
          const badge of
          await badges.all()
        ) {
          await expectLoadedImage(
            badge,
          );

          await expect(
            badge,
          ).toHaveAttribute(
            'width',
            '64',
          );

          await expect(
            badge,
          ).toHaveAttribute(
            'height',
            '64',
          );

          expect(
            await getSelectedSourceWidth(
              badge,
            ),
          ).toBe(
            48,
          );
        }

        expect(
          await githubPanel
            .locator(
              'source',
            )
            .count(),
        ).toBeGreaterThan(
          0,
        );

        /*
         * expandedVendorId lives in the existing
         * tab-scoped portfolio session state.
         * Reloading must therefore render the
         * expanded panel with its images available
         * immediately.
         */
        await page.reload();

        await expect(
          githubTrigger,
        ).toHaveAttribute(
          'aria-expanded',
          'true',
        );

        const reloadedBadges =
          githubPanel.locator(
            'img',
          );

        await expect(
          reloadedBadges,
        ).toHaveCount(
          2,
        );

        for (
          const badge of
          await reloadedBadges.all()
        ) {
          await expect(
            badge,
          ).toHaveAttribute(
            'src',
            /.+/,
          );

          await expectLoadedImage(
            badge,
          );

          expect(
            await getSelectedSourceWidth(
              badge,
            ),
          ).toBe(
            48,
          );
        }

        expect(
          failedImages,
        ).toEqual(
          [],
        );
      },
    );
  },
);
