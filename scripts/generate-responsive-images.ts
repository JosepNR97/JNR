import {
  mkdir,
  readdir,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises';
import {
  extname,
  relative,
  resolve,
} from 'node:path';
import sharp from 'sharp';
import {
  IMAGE_DELIVERY_RULES,
} from '../imageDeliveryConfig.ts';
import type {
  ImageDeliveryRule,
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
    projectRoot,
    'generated-images',
  );

const legacyGeneratedRoot =
  resolve(
    assetsRoot,
    'generated',
  );

const RASTER_EXTENSIONS =
  new Set([
    '.png',
    '.jpg',
    '.jpeg',
    '.webp',
  ]);

const SOURCE_EXTENSION_PRIORITY:
  Readonly<
    Record<
      string,
      number
    >
  > = {
    '.png': 3,
    '.jpg': 2,
    '.jpeg': 2,
    '.webp': 1,
  };

interface RasterAsset {
  absolutePath: string;
  relativePath: string;
  logicalKey: string;
  extension: string;
  width: number;
  height: number;
  bytes: number;
}

interface RasterGroup {
  logicalKey: string;
  rule: ImageDeliveryRule;
  assets: RasterAsset[];
}

interface EncodedCandidate {
  width: number;
  avif: Buffer;
  webp: Buffer;
}

const normalizeRelativePath =
  (
    value: string,
  ) =>
    value.replaceAll(
      '\\',
      '/',
    );

const stripExtension =
  (
    value: string,
  ) => {
    const extension =
      extname(
        value,
      );

    if (!extension) {
      return value;
    }

    return value.slice(
      0,
      -extension.length,
    );
  };

const collectFiles =
  async (
    directory: string,
  ): Promise<
    string[]
  > => {
    let entries;

    try {
      entries =
        await readdir(
          directory,
          {
            withFileTypes:
              true,
          },
        );
    } catch (
      error
    ) {
      const fileSystemError =
        error as NodeJS.ErrnoException;

      if (
        fileSystemError.code ===
        'ENOENT'
      ) {
        return [];
      }

      throw error;
    }

    const files: string[] =
      [];

    for (
      const entry of
      entries
    ) {
      const entryPath =
        resolve(
          directory,
          entry.name,
        );

      if (
        entry.isDirectory()
      ) {
        files.push(
          ...(await collectFiles(
            entryPath,
          )),
        );

        continue;
      }

      if (
        entry.isFile()
      ) {
        files.push(
          entryPath,
        );
      }
    }

    return files;
  };

const inspectRasterAsset =
  async (
    absolutePath: string,
  ): Promise<RasterAsset> => {
    const [
      metadata,
      fileStats,
    ] =
      await Promise.all([
        sharp(
          absolutePath,
        ).metadata(),

        stat(
          absolutePath,
        ),
      ]);

    if (
      !metadata.width ||
      !metadata.height
    ) {
      throw new Error(
        `Could not determine raster dimensions for ${absolutePath}.`,
      );
    }

    const relativePath =
      normalizeRelativePath(
        relative(
          assetsRoot,
          absolutePath,
        ),
      );

    const extension =
      extname(
        relativePath,
      ).toLowerCase();

    return {
      absolutePath,
      relativePath,
      logicalKey:
        stripExtension(
          relativePath,
        ),
      extension,
      width:
        metadata.width,
      height:
        metadata.height,
      bytes:
        fileStats.size,
    };
  };

const discoverRasterGroups =
  async (): Promise<
    Map<
      string,
      RasterGroup
    >
  > => {
    const groups =
      new Map<
        string,
        RasterGroup
      >();

    for (
      const [
        directory,
        rule,
      ] of Object.entries(
        IMAGE_DELIVERY_RULES,
      )
    ) {
      const directoryPath =
        resolve(
          assetsRoot,
          directory,
        );

      const files =
        await collectFiles(
          directoryPath,
        );

      for (
        const absolutePath of
        files
      ) {
        const extension =
          extname(
            absolutePath,
          ).toLowerCase();

        if (
          !RASTER_EXTENSIONS.has(
            extension,
          )
        ) {
          continue;
        }

        const asset =
          await inspectRasterAsset(
            absolutePath,
          );

        const existingGroup =
          groups.get(
            asset.logicalKey,
          );

        if (
          existingGroup
        ) {
          existingGroup.assets.push(
            asset,
          );

          continue;
        }

        groups.set(
          asset.logicalKey,
          {
            logicalKey:
              asset.logicalKey,
            rule,
            assets: [
              asset,
            ],
          },
        );
      }
    }

    return groups;
  };

const validateGroupDimensions =
  (
    group: RasterGroup,
  ) => {
    const firstAsset =
      group.assets[0];

    if (
      !firstAsset
    ) {
      throw new Error(
        `Raster group ${group.logicalKey} contains no source assets.`,
      );
    }

    for (
      const asset of
      group.assets
    ) {
      if (
        asset.width !==
          firstAsset.width ||
        asset.height !==
          firstAsset.height
      ) {
        throw new Error(
          [
            `Raster files sharing the logical asset "${group.logicalKey}" have different dimensions.`,
            'Rename one of the files or make their dimensions match before building responsive derivatives.',
          ].join(
            ' ',
          ),
        );
      }
    }
  };

const chooseGenerationSource =
  (
    group: RasterGroup,
  ): RasterAsset => {
    validateGroupDimensions(
      group,
    );

    const candidates =
      [...group.assets].sort(
        (
          left,
          right,
        ) => {
          const leftPriority =
            SOURCE_EXTENSION_PRIORITY[
              left.extension
            ] ?? 0;

          const rightPriority =
            SOURCE_EXTENSION_PRIORITY[
              right.extension
            ] ?? 0;

          if (
            leftPriority !==
            rightPriority
          ) {
            return (
              rightPriority -
              leftPriority
            );
          }

          if (
            left.bytes !==
            right.bytes
          ) {
            return (
              right.bytes -
              left.bytes
            );
          }

          return left.relativePath.localeCompare(
            right.relativePath,
          );
        },
      );

    const source =
      candidates[0];

    if (!source) {
      throw new Error(
        `Could not select a source image for ${group.logicalKey}.`,
      );
    }

    return source;
  };

const getTargetWidths = (
  sourceWidth: number,
  rule: ImageDeliveryRule,
): number[] => {
  const maxConfiguredWidth =
    Math.max(
      ...rule.widths,
    );

  const requiredMaxWidth =
    Math.min(
      sourceWidth,
      maxConfiguredWidth,
    );

  const widths =
    new Set<number>(
      rule.widths.filter(
        (
          width,
        ) =>
          width <
          requiredMaxWidth,
      ),
    );

  /*
   * Ensure each generated format always
   * contains a candidate at the largest
   * resolution that can reasonably be used.
   *
   * This avoids a <source> winning format
   * selection while only offering an
   * undersized candidate.
   */
  widths.add(
    requiredMaxWidth,
  );

  return [
    ...widths,
  ].sort(
    (
      left,
      right,
    ) =>
      left -
      right,
  );
};

const encodeCandidate =
  async (
    source: RasterAsset,
    width: number,
    rule: ImageDeliveryRule,
  ): Promise<EncodedCandidate> => {
    const [
      avif,
      webp,
    ] =
      await Promise.all([
        sharp(
          source.absolutePath,
        )
          .rotate()
          .resize({
            width,
            withoutEnlargement:
              true,
          })
          .avif({
            quality:
              rule.avifQuality,
            effort: 4,
          })
          .toBuffer(),

        sharp(
          source.absolutePath,
        )
          .rotate()
          .resize({
            width,
            withoutEnlargement:
              true,
          })
          .webp({
            quality:
              rule.webpQuality,
            effort: 4,
            smartSubsample:
              true,
          })
          .toBuffer(),
      ]);

    return {
      width,
      avif,
      webp,
    };
  };

const generateGroup =
  async (
    group: RasterGroup,
  ) => {
    const source =
      chooseGenerationSource(
        group,
      );

    /*
     * If multiple equivalent source formats
     * exist (for example PNG + WebP), use
     * the smallest existing file as the
     * transfer-size baseline.
     *
     * This prevents a newly encoded variant
     * from being considered an optimization
     * merely because it is smaller than a
     * large master PNG while still being
     * larger than the existing WebP.
     */
    const baselineBytes =
      Math.min(
        ...group.assets.map(
          (
            asset,
          ) =>
            asset.bytes,
        ),
      );

    const widths =
      getTargetWidths(
        source.width,
        group.rule,
      );

    const candidates =
      await Promise.all(
        widths.map(
          (
            width,
          ) =>
            encodeCandidate(
              source,
              width,
              group.rule,
            ),
        ),
      );

    /*
     * A format is only exposed if every
     * candidate in its srcset improves on
     * the relevant baseline.
     *
     * This is important because browsers
     * choose formats by <source> order; they
     * do not compare transfer sizes.
     */
    const keepWebp =
      candidates.every(
        (
          candidate,
        ) =>
          candidate.webp
            .length <
          baselineBytes,
      );

    const keepAvif =
      candidates.every(
        (
          candidate,
        ) => {
          const comparisonBytes =
            keepWebp
              ? candidate.webp
                  .length
              : baselineBytes;

          return (
            candidate.avif
              .length <
            comparisonBytes
          );
        },
      );

    if (
      !keepWebp &&
      !keepAvif
    ) {
      return {
        optimized:
          false,
        generatedFiles:
          0,
      };
    }

    const outputDirectory =
      resolve(
        generatedRoot,
        group.logicalKey,
      );

    await mkdir(
      outputDirectory,
      {
        recursive:
          true,
      },
    );

    let generatedFiles =
      0;

    for (
      const candidate of
      candidates
    ) {
      if (
        keepAvif
      ) {
        await writeFile(
          resolve(
            outputDirectory,
            `${candidate.width}.avif`,
          ),
          candidate.avif,
        );

        generatedFiles +=
          1;
      }

      if (
        keepWebp
      ) {
        await writeFile(
          resolve(
            outputDirectory,
            `${candidate.width}.webp`,
          ),
          candidate.webp,
        );

        generatedFiles +=
          1;
      }
    }

    return {
      optimized:
        true,
      generatedFiles,
    };
  };

const main =
  async () => {
    /*
     * Generated files are disposable build
     * output. Always start clean so removed
     * or renamed originals cannot leave
     * stale responsive derivatives behind.
     */
    await Promise.all([
      rm(
        generatedRoot,
        {
          recursive:
            true,
          force: true,
        },
      ),

      rm(
        legacyGeneratedRoot,
        {
          recursive:
            true,
          force: true,
        },
      ),
    ]);

    await mkdir(
      generatedRoot,
      {
        recursive:
          true,
      },
    );

    const groups =
      await discoverRasterGroups();

    let optimizedAssets =
      0;

    let skippedAssets =
      0;

    let generatedFiles =
      0;

    for (
      const group of
      groups.values()
    ) {
      const result =
        await generateGroup(
          group,
        );

      if (
        result.optimized
      ) {
        optimizedAssets +=
          1;
      } else {
        skippedAssets +=
          1;
      }

      generatedFiles +=
        result.generatedFiles;
    }

    console.log(
      [
        'Responsive image generation complete.',
        `${groups.size} raster asset groups scanned.`,
        `${optimizedAssets} optimized.`,
        `${skippedAssets} kept on their original delivery path.`,
        `${generatedFiles} generated derivatives.`,
      ].join(
        ' ',
      ),
    );
  };

await main();
