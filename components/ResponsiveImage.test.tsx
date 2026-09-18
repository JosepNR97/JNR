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
    it('preserves image attributes and renders responsive sources without letting picture own the layout box', () => {
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
        image.closest(
          'picture',
        );

      expect(
        picture,
      ).not.toBeNull();

      expect(
        picture,
      ).toHaveClass(
        'contents',
      );

      const layoutWrapper =
        picture?.parentElement;

      expect(
        layoutWrapper,
      ).not.toBeNull();

      expect(
        layoutWrapper?.tagName,
      ).toBe(
        'SPAN',
      );

      expect(
        layoutWrapper,
      ).toHaveClass(
        'block',
        'h-full',
        'w-full',
      );

      const sourceElements =
        picture?.querySelectorAll(
          'source',
        );

      expect(
        sourceElements,
      ).toHaveLength(
        2,
      );

      expect(
        sourceElements?.[0],
      ).toHaveAttribute(
        'type',
        'image/avif',
      );

      expect(
        sourceElements?.[0],
      ).toHaveAttribute(
        'srcset',
        '/image-480.avif 480w, /image-960.avif 960w',
      );

      expect(
        sourceElements?.[0],
      ).toHaveAttribute(
        'sizes',
        '(min-width: 800px) 600px, 100vw',
      );

      expect(
        sourceElements?.[1],
      ).toHaveAttribute(
        'type',
        'image/webp',
      );

      expect(
        sourceElements?.[1],
      ).toHaveAttribute(
        'srcset',
        '/image-480.webp 480w, /image-960.webp 960w',
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
        'block',
        'h-full',
        'w-full',
        'object-cover',
      );
    });

    it('uses the same stable layout wrapper when no optimized source exists', () => {
      render(
        <ResponsiveImage
          src="/small-logo.svg"
          alt="Small logo"
          width={64}
          height={64}
          className="object-contain"
          pictureClassName="grid h-full w-full place-items-center"
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
        image.closest(
          'picture',
        ),
      ).toBeNull();

      const layoutWrapper =
        image.parentElement;

      expect(
        layoutWrapper,
      ).not.toBeNull();

      expect(
        layoutWrapper?.tagName,
      ).toBe(
        'SPAN',
      );

      expect(
        layoutWrapper,
      ).toHaveClass(
        'grid',
        'h-full',
        'w-full',
        'place-items-center',
      );

      expect(
        image,
      ).toHaveAttribute(
        'src',
        '/small-logo.svg',
      );

      expect(
        image,
      ).toHaveClass(
        'block',
        'object-contain',
      );
    });

    it('keeps optimized and unoptimized assets on the same wrapper contract', () => {
      const {
        rerender,
      } = render(
        <ResponsiveImage
          sources={[
            {
              type:
                'image/webp',
              srcSet:
                '/logo-80.webp 80w',
            },
          ]}
          src="/logo.png"
          alt="Logo"
          width={160}
          height={100}
          className="max-h-full max-w-full object-contain"
          pictureClassName="grid h-full w-full place-items-center"
        />,
      );

      let image =
        screen.getByRole(
          'img',
          {
            name:
              'Logo',
          },
        );

      let wrapper =
        image
          .closest(
            'picture',
          )
          ?.parentElement;

      expect(
        wrapper,
      ).toHaveClass(
        'grid',
        'h-full',
        'w-full',
        'place-items-center',
      );

      rerender(
        <ResponsiveImage
          sources={[]}
          src="/logo.svg"
          alt="Logo"
          width={160}
          height={100}
          className="max-h-full max-w-full object-contain"
          pictureClassName="grid h-full w-full place-items-center"
        />,
      );

      image =
        screen.getByRole(
          'img',
          {
            name:
              'Logo',
          },
        );

      wrapper =
        image.parentElement;

      expect(
        image.closest(
          'picture',
        ),
      ).toBeNull();

      expect(
        wrapper,
      ).toHaveClass(
        'grid',
        'h-full',
        'w-full',
        'place-items-center',
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
          pictureClassName="grid h-full w-full place-items-center"
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
        image,
      ).toHaveClass(
        'block',
      );

      expect(
        image?.parentElement,
      ).toHaveClass(
        'grid',
        'h-full',
        'w-full',
        'place-items-center',
      );

      expect(
        container.querySelector(
          'picture',
        ),
      ).toBeNull();

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
