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

const expectAllFramesCentered =
  async (
    frames: Locator,
  ) => {
    const count =
      await frames.count();

    expect(
      count,
    ).toBeGreaterThan(
      0,
    );

    for (
      let index = 0;
      index < count;
      index += 1
    ) {
      const frame =
        frames.nth(
          index,
        );

      const image =
        frame
          .locator(
            'img',
          )
          .first();

      await image.scrollIntoViewIfNeeded();

      await expectLoadedImage(
        image,
      );

      await expectCenteredWithin(
        frame,
        image,
      );
    }
  };

const expectAllImagesLoaded =
  async (
    images: Locator,
  ) => {
    const count =
      await images.count();

    expect(
      count,
    ).toBeGreaterThan(
      0,
    );

    for (
      let index = 0;
      index < count;
      index += 1
    ) {
      const image =
        images.nth(
          index,
        );

      await image.scrollIntoViewIfNeeded();

      await expectLoadedImage(
        image,
      );
    }
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
      'automatically optimizes a raster without per-file configuration',
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

        const academicFrames =
          page.locator(
            '[data-image-frame="academic-logo"]',
          );

        const frameCount =
          await academicFrames.count();

        expect(
          frameCount,
        ).toBeGreaterThan(
          0,
        );

        let foundGeneratedCandidate =
          false;

        for (
          let index = 0;
          index <
          frameCount;
          index += 1
        ) {
          const image =
            academicFrames
              .nth(
                index,
              )
              .locator(
                'img',
              );

          await image.scrollIntoViewIfNeeded();

          await expectLoadedImage(
            image,
          );

          const selectedWidth =
            await getSelectedSourceWidth(
              image,
            );

          if (
            selectedWidth !==
            null
          ) {
            foundGeneratedCandidate =
              true;

            break;
          }
        }

        expect(
          foundGeneratedCandidate,
        ).toBe(
          true,
        );

        expect(
          failedImages,
        ).toEqual(
          [],
        );
      },
    );

    test(
      'keeps every visible logo frame centered without a per-logo allowlist',
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

        /*
         * Every academic logo is covered dynamically.
         * New academic entries automatically join this test.
         */
        await expectAllFramesCentered(
          page.locator(
            '[data-image-frame="academic-logo"]',
          ),
        );

        /*
         * Every professional vendor logo is covered dynamically.
         * No vendor names or image filenames are hardcoded here.
         */
        await expectAllFramesCentered(
          page.locator(
            '[data-image-frame="vendor-logo"]',
          ),
        );

        /*
         * Experience does not use a visible fixed logo frame,
         * so centering against an arbitrary container would not
         * be meaningful. Still verify every experience logo loads.
         */
        await expectAllImagesLoaded(
          page.locator(
            '#experience img[alt^="Logo "]',
          ),
        );

        /*
         * Pause carousel movement before comparing geometry.
         * Only inspect the accessible middle copy; repeated copies
         * contain the same assets and geometry.
         */
        const carouselViewport =
          page.getByTestId(
            'certifications-viewport',
          );

        await carouselViewport.hover();

        const interactiveCarouselSegment =
          page.locator(
            '[data-carousel-segment="true"]',
          );

        await expectAllFramesCentered(
          interactiveCarouselSegment.locator(
            '[data-image-frame="carousel-logo"]',
          ),
        );

        expect(
          failedImages,
        ).toEqual(
          [],
        );
      },
    );

    test(
      'defers every certification badge until its vendor is opened and keeps every badge centered',
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

        /*
         * This assertion is deliberately global rather than
         * vendor-specific. Every certification badge starts
         * without a source while all vendors are unvisited.
         */
        const allBadgeImages =
          page.locator(
            '[data-image-frame="certification-badge"] img',
          );

        const initialBadgeCount =
          await allBadgeImages.count();

        expect(
          initialBadgeCount,
        ).toBeGreaterThan(
          0,
        );

        expect(
          await allBadgeImages.evaluateAll(
            (
              images,
            ) =>
              images.every(
                (
                  image,
                ) =>
                  !image.hasAttribute(
                    'src',
                  ),
              ),
          ),
        ).toBe(
          true,
        );

        const vendorTriggers =
          page.locator(
            '#education [id^="education-trigger-"]',
          );

        const vendorCount =
          await vendorTriggers.count();

        expect(
          vendorCount,
        ).toBeGreaterThan(
          0,
        );

        let checkedBadgeCount =
          0;

        /*
         * Open every vendor dynamically and verify every badge.
         * A future vendor added to constants.ts automatically
         * participates without updating this test.
         */
        for (
          let vendorIndex =
            0;
          vendorIndex <
          vendorCount;
          vendorIndex +=
            1
        ) {
          const trigger =
            vendorTriggers.nth(
              vendorIndex,
            );

          await trigger.scrollIntoViewIfNeeded();

          const panelId =
            await trigger.getAttribute(
              'aria-controls',
            );

          expect(
            panelId,
          ).not.toBeNull();

          if (!panelId) {
            continue;
          }

          await trigger.click();

          await expect(
            trigger,
          ).toHaveAttribute(
            'aria-expanded',
            'true',
          );

          const panel =
            page.locator(
              `#${panelId}`,
            );

          const badgeFrames =
            panel.locator(
              '[data-image-frame="certification-badge"]',
            );

          const badgeCount =
            await badgeFrames.count();

          checkedBadgeCount +=
            badgeCount;

          for (
            let badgeIndex =
              0;
            badgeIndex <
            badgeCount;
            badgeIndex +=
              1
          ) {
            const frame =
              badgeFrames.nth(
                badgeIndex,
              );

            const image =
              frame
                .locator(
                  'img',
                )
                .first();

            await expect(
              image,
            ).toHaveAttribute(
              'src',
              /.+/,
            );

            await expect(
              image,
            ).toHaveAttribute(
              'width',
              '64',
            );

            await expect(
              image,
            ).toHaveAttribute(
              'height',
              '64',
            );

            await expectLoadedImage(
              image,
            );

            await expectCenteredWithin(
              frame,
              image,
            );
          }
        }

        expect(
          checkedBadgeCount,
        ).toBe(
          initialBadgeCount,
        );

        expect(
          failedImages,
        ).toEqual(
          [],
        );
      },
    );

    test(
      'restores optimized certification badges after reload with a vendor expanded',
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

        /*
         * One stable vendor is enough for this specific
         * state-restoration contract. Systematic badge
         * coverage is handled by the previous test.
         */
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

        await githubTrigger.click();

        await expect(
          githubTrigger,
        ).toHaveAttribute(
          'aria-expanded',
          'true',
        );

        const badges =
          githubPanel.locator(
            '[data-image-frame="certification-badge"] img',
          );

        await expect(
          badges,
        ).toHaveCount(
          2,
        );

        for (
          const badge of
          await badges.all()
        ) {
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

        /*
         * expandedVendorId lives in the existing
         * tab-scoped portfolio session state.
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
            '[data-image-frame="certification-badge"] img',
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
