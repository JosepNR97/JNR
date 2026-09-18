import {
  render,
  screen,
} from '@testing-library/react';
import {
  ResponsiveImage,
} from './ResponsiveImage';

describe(
  'ResponsiveImage',
  () => {
    it('preserves image attributes and renders explicit responsive sources in order', () => {
      render(
        <ResponsiveImage
          sources={[
            {
              type:
                'image/avif',
              srcSet:
                '/image-480.avif 480w, /image-960.avif 960w',
            },
            {
              type:
                'image/webp',
              srcSet:
                '/image-480.webp 480w, /image-960.webp 960w',
            },
          ]}
          src="/image.jpg"
          alt="Example"
          width={1200}
          height={800}
          sizes="(min-width: 800px) 600px, 100vw"
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
          pictureClassName="block h-full w-full"
        />,
      );

      const image =
        screen.getByRole(
          'img',
          {
            name:
              'Example',
          },
        );

      const picture =
        image.parentElement;

      const sources =
        picture?.querySelectorAll(
          'source',
        );

      expect(
        picture,
      ).toHaveClass(
        'block',
        'h-full',
        'w-full',
      );

      expect(
        sources,
      ).toHaveLength(
        2,
      );

      expect(
        sources?.[0],
      ).toHaveAttribute(
        'type',
        'image/avif',
      );

      expect(
        sources?.[0],
      ).toHaveAttribute(
        'srcset',
        '/image-480.avif 480w, /image-960.avif 960w',
      );

      expect(
        sources?.[0],
      ).toHaveAttribute(
        'sizes',
        '(min-width: 800px) 600px, 100vw',
      );

      expect(
        sources?.[1],
      ).toHaveAttribute(
        'type',
        'image/webp',
      );

      expect(
        image,
      ).toHaveAttribute(
        'src',
        '/image.jpg',
      );

      expect(
        image,
      ).toHaveAttribute(
        'alt',
        'Example',
      );

      expect(
        image,
      ).toHaveAttribute(
        'width',
        '1200',
      );

      expect(
        image,
      ).toHaveAttribute(
        'height',
        '800',
      );

      expect(
        image,
      ).toHaveAttribute(
        'loading',
        'lazy',
      );

      expect(
        image,
      ).toHaveAttribute(
        'decoding',
        'async',
      );

      expect(
        image,
      ).toHaveClass(
        'h-full',
        'w-full',
        'object-cover',
      );
    });

    it('falls back to the original image when no optimized source exists', () => {
      render(
        <ResponsiveImage
          src="/small-logo.svg"
          alt="Small logo"
          width={64}
          height={64}
        />,
      );

      const image =
        screen.getByRole(
          'img',
          {
            name:
              'Small logo',
          },
        );

      expect(
        image.parentElement
          ?.querySelectorAll(
            'source',
          ),
      ).toHaveLength(
        0,
      );

      expect(
        image,
      ).toHaveAttribute(
        'src',
        '/small-logo.svg',
      );
    });

    it('does not create image sources while src is intentionally deferred', () => {
      const {
        container,
      } = render(
        <ResponsiveImage
          sources={[]}
          src={
            undefined
          }
          alt=""
          width={64}
          height={64}
          loading="eager"
        />,
      );

      const image =
        container.querySelector(
          'img',
        );

      expect(
        image,
      ).not.toBeNull();

      expect(
        image,
      ).not.toHaveAttribute(
        'src',
      );

      expect(
        container.querySelectorAll(
          'source',
        ),
      ).toHaveLength(
        0,
      );
    });
  },
);
