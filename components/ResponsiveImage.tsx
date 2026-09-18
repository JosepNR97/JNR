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
    'alt' | 'sizes' | 'srcSet'
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
  className,
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
    sources ?? automaticSources;

  const imageClassName = [
    'block',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const image = (
    <img
      {...imageProps}
      alt={alt}
      sizes={sizes}
      className={
        imageClassName
      }
    />
  );

  if (
    resolvedSources.length ===
    0
  ) {
    return image;
  }

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

      {image}
    </picture>
  );
};
