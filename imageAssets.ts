export interface ResponsiveImageSource {
  type:
    | 'image/avif'
    | 'image/webp';
  srcSet: string;
}

interface GeneratedImageVariant {
  type:
    | 'image/avif'
    | 'image/webp';
  width: number;
  url: string;
}

const generatedImageModules =
  import.meta.glob(
    './generated-images/**/*.{avif,webp}',
    {
      eager: true,
      query:
        '?no-inline',
      import:
        'default',
    },
  ) as Record<
    string,
    string
  >;

const GENERATED_VARIANT_PATTERN =
  /^\.\/generated-images\/(.+)\/(\d+)\.(avif|webp)$/;

const generatedVariantsByAsset =
  new Map<
    string,
    GeneratedImageVariant[]
  >();

for (
  const [
    modulePath,
    url,
  ] of Object.entries(
    generatedImageModules,
  )
) {
  const match =
    GENERATED_VARIANT_PATTERN.exec(
      modulePath,
    );

  const logicalAssetKey =
    match?.[1];

  const widthText =
    match?.[2];

  const format =
    match?.[3];

  if (
    !logicalAssetKey ||
    !widthText ||
    (format !==
      'avif' &&
      format !==
        'webp')
  ) {
    continue;
  }

  const width =
    Number.parseInt(
      widthText,
      10,
    );

  if (
    !Number.isFinite(
      width,
    ) ||
    width <= 0
  ) {
    continue;
  }

  const variants =
    generatedVariantsByAsset.get(
      logicalAssetKey,
    ) ?? [];

  variants.push({
    type:
      format ===
      'avif'
        ? 'image/avif'
        : 'image/webp',
    width,
    url,
  });

  generatedVariantsByAsset.set(
    logicalAssetKey,
    variants,
  );
}

const getAssetLogicalKey = (
  src: string,
):
  | string
  | null => {
  const pathWithoutQuery =
    src.split(
      /[?#]/,
      1,
    )[0];

  if (!pathWithoutQuery) {
    return null;
  }

  const normalizedPath =
    pathWithoutQuery.replaceAll(
      '\\',
      '/',
    );

  const assetMatch =
    normalizedPath.match(
      /(?:^|\/)assets\/(.+)$/,
    );

  const relativeAssetPath =
    assetMatch?.[1];

  if (
    !relativeAssetPath
  ) {
    return null;
  }

  const logicalAssetKey =
    relativeAssetPath.replace(
      /\.(?:png|jpe?g|webp)$/i,
      '',
    );

  if (
    logicalAssetKey ===
    relativeAssetPath
  ) {
    return null;
  }

  return logicalAssetKey;
};

export const getResponsiveImageSources =
  (
    src?: string,
  ): ResponsiveImageSource[] => {
    if (!src) {
      return [];
    }

    const logicalAssetKey =
      getAssetLogicalKey(
        src,
      );

    if (
      !logicalAssetKey
    ) {
      return [];
    }

    const variants =
      generatedVariantsByAsset.get(
        logicalAssetKey,
      );

    if (
      !variants ||
      variants.length ===
        0
    ) {
      return [];
    }

    const sourceOrder =
      [
        'image/avif',
        'image/webp',
      ] as const;

    return sourceOrder.flatMap(
      (
        type,
      ) => {
        const matchingVariants =
          variants
            .filter(
              (
                variant,
              ) =>
                variant.type ===
                type,
            )
            .sort(
              (
                left,
                right,
              ) =>
                left.width -
                right.width,
            );

        if (
          matchingVariants.length ===
          0
        ) {
          return [];
        }

        return [
          {
            type,
            srcSet:
              matchingVariants
                .map(
                  (
                    variant,
                  ) =>
                    `${variant.url} ${variant.width}w`,
                )
                .join(
                  ', ',
                ),
          },
        ];
      },
    );
  };

export const PROFILE_IMAGE_SIZES =
  '(min-width: 480px) 448px, calc(100vw - 32px)';
