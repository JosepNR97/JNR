import { assetPath } from './assetPath';
import {
  CERTIFICATION_BADGE_DELIVERY,
  PROFILE_IMAGE_DELIVERY,
} from './imageDeliveryConfig';

export interface ResponsiveImageSource {
  type:
    | 'image/avif'
    | 'image/webp';
  srcSet: string;
}

const getStem = (
  filename: string,
) =>
  filename.replace(
    /\.[^.]+$/,
    '',
  );

const getFilename = (
  src: string,
) => {
  const pathname =
    src.split(/[?#]/, 1)[0] ??
    src;

  return (
    pathname
      .split('/')
      .pop() ?? pathname
  );
};

const certificationBadgeFilenames =
  new Set<string>(
    CERTIFICATION_BADGE_DELIVERY.filenames,
  );

export const PROFILE_IMAGE_SIZES =
  '(min-width: 480px) 448px, calc(100vw - 32px)';

export const getProfileImageSources = (
  fallbackSrc: string,
): ResponsiveImageSource[] => {
  const sourceFilename =
    PROFILE_IMAGE_DELIVERY.source
      .split('/')
      .pop() ?? 'profile.png';

  const stem =
    getStem(sourceFilename);

  const avifSrcSet =
    PROFILE_IMAGE_DELIVERY.responsiveWidths
      .map(
        (width) =>
          `${assetPath(
            `generated/people/${stem}-${width}.avif`,
          )} ${width}w`,
      )
      .join(', ');

  const webpSrcSet = [
    ...PROFILE_IMAGE_DELIVERY.responsiveWidths.map(
      (width) =>
        `${assetPath(
          `generated/people/${stem}-${width}.webp`,
        )} ${width}w`,
    ),
    `${fallbackSrc} ${PROFILE_IMAGE_DELIVERY.width}w`,
  ].join(', ');

  return [
    {
      type: 'image/avif',
      srcSet: avifSrcSet,
    },
    {
      type: 'image/webp',
      srcSet: webpSrcSet,
    },
  ];
};

export const getCertificationBadgeSources =
  (
    src: string,
  ): ResponsiveImageSource[] => {
    const filename =
      getFilename(src);

    if (
      !certificationBadgeFilenames.has(
        filename,
      )
    ) {
      return [];
    }

    const stem =
      getStem(filename);

    const width =
      CERTIFICATION_BADGE_DELIVERY.width;

    return [
      {
        type: 'image/avif',
        srcSet: assetPath(
          `generated/certifications/${stem}-${width}.avif`,
        ),
      },
      {
        type: 'image/webp',
        srcSet: assetPath(
          `generated/certifications/${stem}-${width}.webp`,
        ),
      },
    ];
  };
