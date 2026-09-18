import type {
  ImgHTMLAttributes,
} from 'react';
import type {
  ResponsiveImageSource,
} from '../imageAssets';

interface ResponsiveImageProps
  extends Omit<
    ImgHTMLAttributes<HTMLImageElement>,
    | 'alt'
    | 'height'
    | 'sizes'
    | 'srcSet'
    | 'width'
  > {
  alt: string;
  width: number;
  height: number;
  sources?: readonly ResponsiveImageSource[];
  sizes?: string;
  pictureClassName?: string;
}

export const ResponsiveImage = ({
  sources = [],
  sizes,
  pictureClassName,
  alt,
  width,
  height,
  ...imageProps
}: ResponsiveImageProps) => (
  <picture
    className={pictureClassName}
  >
    {sources.map((source) => (
      <source
        key={source.type}
        type={source.type}
        srcSet={source.srcSet}
        sizes={sizes}
      />
    ))}

    <img
      {...imageProps}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
    />
  </picture>
);
