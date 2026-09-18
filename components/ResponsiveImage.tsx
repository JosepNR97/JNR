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

  /*
   * This class defines the stable layout box used by the image.
   *
   * When responsive sources exist, the nested <picture> uses
   * display: contents so adding AVIF/WebP delivery cannot alter
   * the geometry that the original <img> had.
   *
   * The existing prop name is retained to avoid changing every
   * current caller.
   */
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

  const content =
    resolvedSources.length >
    0 ? (
      <picture className="contents">
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
    ) : (
      image
    );

  /*
   * Always use the same explicit layout wrapper when the caller
   * provides layout classes. This makes optimized and unoptimized
   * assets geometrically equivalent:
   *
   * wrapper -> img
   *
   * and:
   *
   * wrapper -> picture(display: contents) -> img
   *
   * therefore behave identically in Grid/Flex layouts.
   */
  if (
    pictureClassName
  ) {
    return (
      <span
        className={
          pictureClassName
        }
      >
        {content}
      </span>
    );
  }

  return content;
};
