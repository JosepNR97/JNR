import {
  mkdir,
  rm,
  stat,
} from 'node:fs/promises';
import {
  basename,
  dirname,
  extname,
  resolve,
} from 'node:path';
import sharp from 'sharp';
import {
  CERTIFICATION_BADGE_DELIVERY,
  PROFILE_IMAGE_DELIVERY,
} from '../imageDeliveryConfig.ts';

const projectRoot =
  resolve(
    import.meta.dirname,
    '..',
  );

const assetsRoot =
  resolve(
    projectRoot,
    'public/assets',
  );

const generatedRoot =
  resolve(
    assetsRoot,
    'generated',
  );

const generatedPath = (
  ...segments: string[]
) =>
  resolve(
    generatedRoot,
    ...segments,
  );

const stemOf = (
  filename: string,
) =>
  basename(
    filename,
    extname(filename),
  );

const ensureParent =
  async (
    path: string,
  ) => {
    await mkdir(
      dirname(path),
      {
        recursive: true,
      },
    );
  };

const fileSize =
  async (
    path: string,
  ) =>
    (
      await stat(path)
    ).size;

const assertSmallerThanSource =
  async (
    source: string,
    output: string,
  ) => {
    const [
      sourceBytes,
      outputBytes,
    ] =
      await Promise.all([
        fileSize(
          source,
        ),
        fileSize(
          output,
        ),
      ]);

    if (
      outputBytes >=
      sourceBytes
    ) {
      throw new Error(
        `Generated image is not smaller than its source: ${output} (${outputBytes} >= ${sourceBytes} bytes)`,
      );
    }
  };

const assertProfileDimensions =
  async (
    source: string,
  ) => {
    const metadata =
      await sharp(
        source,
      ).metadata();

    if (
      metadata.width !==
        PROFILE_IMAGE_DELIVERY.width ||
      metadata.height !==
        PROFILE_IMAGE_DELIVERY.height
    ) {
      throw new Error(
        `Unexpected profile image dimensions: ${metadata.width ?? 'unknown'}x${metadata.height ?? 'unknown'}. Expected ${PROFILE_IMAGE_DELIVERY.width}x${PROFILE_IMAGE_DELIVERY.height}.`,
      );
    }
  };

const generateProfileImages =
  async () => {
    const source =
      resolve(
        assetsRoot,
        PROFILE_IMAGE_DELIVERY.source,
      );

    await assertProfileDimensions(
      source,
    );

    const stem =
      stemOf(
        PROFILE_IMAGE_DELIVERY.source,
      );

    for (
      const width of
      PROFILE_IMAGE_DELIVERY.responsiveWidths
    ) {
      const avifOutput =
        generatedPath(
          'people',
          `${stem}-${width}.avif`,
        );

      const webpOutput =
        generatedPath(
          'people',
          `${stem}-${width}.webp`,
        );

      await Promise.all([
        ensureParent(
          avifOutput,
        ),
        ensureParent(
          webpOutput,
        ),
      ]);

      await Promise.all([
        sharp(source)
          .rotate()
          .resize({
            width,
            withoutEnlargement:
              true,
          })
          .avif({
            quality: 55,
            effort: 4,
          })
          .toFile(
            avifOutput,
          ),

        sharp(source)
          .rotate()
          .resize({
            width,
            withoutEnlargement:
              true,
          })
          .webp({
            quality: 84,
            effort: 4,
            smartSubsample:
              true,
          })
          .toFile(
            webpOutput,
          ),
      ]);

      await Promise.all([
        assertSmallerThanSource(
          source,
          avifOutput,
        ),
        assertSmallerThanSource(
          source,
          webpOutput,
        ),
      ]);
    }
  };

const generateCertificationBadges =
  async () => {
    for (
      const filename of
      CERTIFICATION_BADGE_DELIVERY.filenames
    ) {
      const source =
        resolve(
          assetsRoot,
          'certifications',
          filename,
        );

      const stem =
        stemOf(
          filename,
        );

      const width =
        CERTIFICATION_BADGE_DELIVERY.width;

      const avifOutput =
        generatedPath(
          'certifications',
          `${stem}-${width}.avif`,
        );

      const webpOutput =
        generatedPath(
          'certifications',
          `${stem}-${width}.webp`,
        );

      await Promise.all([
        ensureParent(
          avifOutput,
        ),
        ensureParent(
          webpOutput,
        ),
      ]);

      await Promise.all([
        sharp(source)
          .rotate()
          .resize({
            width,
            height:
              width,
            fit: 'inside',
            withoutEnlargement:
              true,
          })
          .avif({
            quality: 70,
            effort: 4,
          })
          .toFile(
            avifOutput,
          ),

        sharp(source)
          .rotate()
          .resize({
            width,
            height:
              width,
            fit: 'inside',
            withoutEnlargement:
              true,
          })
          .webp({
            quality: 88,
            effort: 4,
            smartSubsample:
              true,
          })
          .toFile(
            webpOutput,
          ),
      ]);

      await Promise.all([
        assertSmallerThanSource(
          source,
          avifOutput,
        ),
        assertSmallerThanSource(
          source,
          webpOutput,
        ),
      ]);
    }
  };

const main =
  async () => {
    /*
     * Generated assets are disposable build
     * output. Removing the directory first
     * prevents stale derivatives when the
     * configuration changes.
     */
    await rm(
      generatedRoot,
      {
        recursive: true,
        force: true,
      },
    );

    await mkdir(
      generatedRoot,
      {
        recursive: true,
      },
    );

    await generateProfileImages();

    await generateCertificationBadges();

    console.log(
      `Generated responsive image assets in ${generatedRoot.replace(
        `${projectRoot}/`,
        '',
      )}`,
    );
  };

await main();
