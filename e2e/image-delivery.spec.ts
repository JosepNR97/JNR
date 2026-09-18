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

test.describe(
  'responsive About image',
  () => {
    test.describe(
      'mobile viewport',
      () => {
        test.use({
          viewport: {
            width: 390,
            height: 844,
          },
          deviceScaleFactor:
            1,
        });

        test(
          'selects the mobile profile candidate and keeps reserved dimensions',
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

            const picture =
              page
                .locator(
                  '#about picture',
                )
                .first();

            const image =
              picture.locator(
                'img',
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

            const currentSrc =
              await image.evaluate(
                (
                  element,
                ) =>
                  (
                    element as HTMLImageElement
                  ).currentSrc,
              );

            expect(
              new URL(
                currentSrc,
              ).pathname,
            ).toMatch(
              /\/assets\/generated\/people\/josep-nunez-riba-2-480\.(?:avif|webp)$/,
            );

            const reservedBox =
              await picture.boundingBox();

            expect(
              reservedBox,
            ).not.toBeNull();

            expect(
              reservedBox?.width ??
                0,
            ).toBeGreaterThan(
              0,
            );

            expect(
              reservedBox?.height ??
                0,
            ).toBeGreaterThan(
              0,
            );

            expect(
              failedImages,
            ).toEqual([]);
          },
        );
      },
    );

    test.describe(
      'desktop high-density viewport',
      () => {
        test.use({
          viewport: {
            width: 1440,
            height: 900,
          },
          deviceScaleFactor:
            2,
        });

        test(
          'selects the larger profile candidate without requesting the full source',
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

            const currentSrc =
              await image.evaluate(
                (
                  element,
                ) =>
                  (
                    element as HTMLImageElement
                  ).currentSrc,
              );

            expect(
              new URL(
                currentSrc,
              ).pathname,
            ).toMatch(
              /\/assets\/generated\/people\/josep-nunez-riba-2-960\.(?:avif|webp)$/,
            );

            expect(
              failedImages,
            ).toEqual([]);
          },
        );
      },
    );
  },
);

test(
  'closed certification vendors do not request badge images and opening one loads optimized sources',
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

    const requestedCertificationImages: string[] =
      [];

    page.on(
      'request',
      (
        request,
      ) => {
        if (
          request.resourceType() !==
          'image'
        ) {
          return;
        }

        const url =
          request.url();

        const isOriginalBadge =
          url.includes(
            '/assets/certifications/',
          );

        const isGeneratedBadge =
          url.includes(
            '/assets/generated/certifications/',
          );

        if (
          !isOriginalBadge &&
          !isGeneratedBadge
        ) {
          return;
        }

        requestedCertificationImages.push(
          url,
        );
      },
    );

    await page.goto(
      '/es/',
    );

    expect(
      requestedCertificationImages,
    ).toEqual([]);

    const githubCard =
      page.locator(
        '#education-card-v_github',
      );

    await githubCard.scrollIntoViewIfNeeded();

    const githubPanel =
      page.locator(
        '#education-panel-v_github',
      );

    const badges =
      githubPanel.locator(
        'img',
      );

    await expect(
      badges,
    ).toHaveCount(2);

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
      requestedCertificationImages,
    ).toEqual([]);

    const githubTrigger =
      page.locator(
        '#education-trigger-v_github',
      );

    await githubTrigger.click();

    await expect(
      badges.first(),
    ).toHaveAttribute(
      'src',
      /github-actions/,
    );

    await expect(
      badges.last(),
    ).toHaveAttribute(
      'src',
      /github-administration/,
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
    }

    await expect
      .poll(
        () =>
          requestedCertificationImages.some(
            (
              url,
            ) =>
              /github-(?:actions|administration)-192\.(?:avif|webp)(?:\?|$)/.test(
                url,
              ),
          ),
      )
      .toBe(true);

    const selectedSources =
      await badges.evaluateAll(
        (
          images,
        ) =>
          images.map(
            (
              image,
            ) =>
              new URL(
                image.currentSrc,
              ).pathname,
          ),
      );

    expect(
      selectedSources,
    ).toHaveLength(2);

    selectedSources.forEach(
      (
        path,
      ) => {
        expect(
          path,
        ).toMatch(
          /\/assets\/generated\/certifications\/github-(?:actions|administration)-192\.(?:avif|webp)$/,
        );
      },
    );

    expect(
      failedImages,
    ).toEqual([]);
  },
);
