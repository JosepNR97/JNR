import type {
  ImgHTMLAttributes,
} from 'react';
import {
  getResponsiveImageSources,
} from '../imageAssets';
import type {
  ResponsiveImageSource,
} from '../imageAssets';

interface ResponsiveImageProps
  extends Omit<
    ImgHTMLAttributes<HTMLImageElement>,
    | 'alt'
    | 'sizes'
    | 'srcSet'
  > {
  alt: string;
  sources?: readonly ResponsiveImageSource[];
  sizes?: string;
  pictureClassName?: string;
}

export const ResponsiveImage = ({
  sources,
  sizes,
  pictureClassName,
  alt,
  ...imageProps
}: ResponsiveImageProps) => {
  const automaticSources =
    getResponsiveImageSources(
      typeof imageProps.src ===
        'string'
        ? imageProps.src
        : undefined,
    );

  const resolvedSources =
    sources ??
    automaticSources;

  return (
    <picture
      className={
        pictureClassName
      }
    >
      {resolvedSources.map(
        (
          source,
        ) => (
          <source
            key={`${source.type}-${source.srcSet}`}
            type={
              source.type
            }
            srcSet={
              source.srcSet
            }
            sizes={
              sizes
            }
          />
        ),
      )}

      <img
        {...imageProps}
        alt={alt}
        sizes={sizes}
      />
    </picture>
  );
};
