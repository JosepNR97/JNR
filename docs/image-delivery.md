# Image delivery

The portfolio generates a small, evidence-based set of responsive image derivatives during development and production builds.

## Scope

`npm run generate:images` uses `sharp` to generate only:

- 480 px and 960 px AVIF/WebP candidates for the About profile photograph;
- 192 px AVIF/WebP derivatives for certification badges whose source files have material transfer cost.

SVG assets, small logos, employer logos, academic logos and original source files are not rewritten.

## Profile image

Responsive derivatives are generated from:

`public/assets/people/josep-nunez-riba-2.png`

The original PNG is used as the high-quality generation source.

The existing:

`public/assets/people/josep-nunez-riba-2.webp`

remains the runtime fallback.

The generator verifies that the source image still has the expected intrinsic dimensions before producing derivatives.

## Generated files

Generated files are written to:

`public/assets/generated/`

and are intentionally ignored by Git.

Vite copies them into the production build after `generate:images` runs.

The generator removes the generated directory before every run, uses fixed dimensions and encoder settings, never upscales a source and fails if a generated derivative is not smaller than its original source.

This prevents stale derivatives and keeps generation deterministic and idempotent.

## Certification badges

Only certification badges with material source weight receive responsive derivatives.

Closed professional-certification vendors do not receive badge `src` or `<source>` URLs, preventing those images from being requested before the user expands the vendor.

When a vendor is opened:

- optimized AVIF/WebP sources are offered where configured;
- the existing original image remains the fallback;
- the source remains assigned after its first load so accordion closing animations retain their images and subsequent opens can reuse the browser cache.

## Validation

After changing image delivery, run:

```bash
npm run audit:security
npm run check
npm run test:e2e
npm run test:a11y
