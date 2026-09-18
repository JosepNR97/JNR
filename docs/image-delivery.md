# Image delivery

The portfolio generates a small, evidence-based set of responsive image derivatives during development and production builds.

## Scope

`npm run generate:images` uses `sharp` to generate only:

- 480 px and 960 px AVIF/WebP candidates for the About profile photograph;
- 192 px AVIF/WebP derivatives for certification badges whose existing source files have material transfer cost.

SVG assets, small credential-issuer logos, employer logos, academic logos and original source files are not rewritten.

## Profile image

Responsive derivatives are generated from:

`public/assets/people/josep-nunez-riba-2.png`

The PNG is retained as the high-quality generation source.

The existing runtime image:

`public/assets/people/josep-nunez-riba-2.webp`

remains the fallback presented to browsers that do not select one of the generated responsive candidates.

The generator verifies that the source image still has the expected intrinsic dimensions before producing derivatives.

Changing the profile photograph in the future may therefore require updating `PROFILE_IMAGE_DELIVERY` when its filename or intrinsic dimensions change.

## Certification badges

Certification content continues to be managed through the existing `constants.ts` data model.

Adding a new certification does not require changing the image-delivery configuration for the certification to work.

A new certification can continue to be added by:

1. adding its badge to `public/assets/certifications/`;
2. referencing the badge from `constants.ts`;
3. adding the certification metadata and credential URL as usual.

If the new source image is unusually large, it can optionally be added to the optimized badge list in `imageDeliveryConfig.ts`.

This optimization list is not a second content source of truth. An image that is not listed continues to use its original source normally.

## Deferred certification loading

Professional certification panels retain their existing accordion structure and accessibility semantics.

Certification badge URLs are not assigned for vendors that have never been expanded. This prevents hidden badges from generating image requests during the initial portfolio load.

When a vendor is expanded:

- its certification image URLs are assigned;
- optimized AVIF/WebP sources are offered where configured;
- the existing source remains the fallback;
- image URLs remain assigned after the first expansion so closing animations retain their content and subsequent expansions reuse the browser cache.

## Generated files

Generated files are written to:

`public/assets/generated/`

and are intentionally ignored by Git.

Vite copies them into the production build after `generate:images` runs.

The generator:

- removes the generated directory before every run;
- uses fixed dimensions and encoder settings;
- never upscales an image;
- fails if an expected source is unavailable;
- fails if a generated optimized derivative is not smaller than its source.

This prevents stale build artifacts and keeps generation deterministic and idempotent.

## Development and build integration

Image generation is part of the normal project scripts.

Development preparation runs:

```bash
npm run generate:cv
npm run generate:images
```

Production builds run:

```bash
npm run generate:cv
npm run generate:images
tsc --noEmit
vite build
```

No generated image derivative needs to be committed to the repository.

## Validation

After changing image-delivery behavior, the normal validation set is:

```bash
npm run audit:security
npm run check
npm run test:e2e
npm run test:a11y
```

The image-delivery E2E coverage verifies that:

- responsive About candidates load successfully;
- mobile and high-density desktop contexts select appropriately sized candidates;
- intrinsic dimensions remain present;
- generated images do not return HTTP errors;
- certification badges are not requested while their vendor has never been opened;
- opening an optimized vendor loads the generated badge candidate.

## Performance validation

Performance comparisons should use the canonical localized page:

`/JNR/es/`

or `/es/` under the local preview server.

Before/after Lighthouse or PageSpeed measurements should use equivalent mobile and desktop conditions and record:

- Largest Contentful Paint (LCP);
- First Contentful Paint (FCP);
- Cumulative Layout Shift (CLS);
- transferred image bytes;
- image-delivery estimated savings;
- the identified LCP element.

The existence of generated files alone is not considered evidence that the optimization is successful.
