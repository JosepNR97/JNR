# Image delivery

The portfolio automatically generates responsive image derivatives for raster assets used by the application.

The image-delivery pipeline is designed so that adding normal portfolio content does not require maintaining a second list of optimized images.

## Content workflow

Portfolio content remains managed through the existing data files.

For example, adding a certification continues to require only:

1. adding its image to `public/assets/certifications/`;
2. referencing the image from `constants.ts`;
3. adding the certification metadata and credential URL as usual.

No image filename needs to be added to the image-delivery configuration.

The same principle applies to employer logos, credential issuers and academic logos.

## Automatically discovered assets

`npm run generate:images` scans raster files under:

- `public/assets/people/`;
- `public/assets/certifications/`;
- `public/assets/credential-issuers/`;
- `public/assets/education/`;
- `public/assets/employers/`;
- `public/assets/brand/`.

Supported source formats are:

- PNG;
- JPEG/JPG;
- WebP.

SVG files are intentionally ignored and continue to be served directly as vectors.

## Delivery rules

Responsive widths are defined by asset category rather than by individual filename.

Current rules are:

- people: 480 and 960 px;
- certification badges: 48, 96 and 192 px;
- credential issuers: 80, 160 and 320 px;
- academic logos: 64, 128 and 256 px;
- employer logos: 144 and 288 px;
- brand raster assets: 64, 128 and 256 px.

The generator never upscales a source.

When a source is smaller than the largest configured candidate, its natural width becomes the largest generated candidate so a responsive `<source>` never wins format selection while only providing an undersized image.

## Automatic source selection

When equivalent raster sources share the same logical name, such as:

```text
people/profile.png
people/profile.webp
```

they are treated as the same logical image.

The higher-quality source format is preferred for derivative generation while the smallest existing equivalent source is used as the transfer-size baseline.

This allows a high-quality PNG master to be used for encoding without incorrectly treating a derivative as an optimization merely because it is smaller than the PNG while still being larger than an existing WebP.

Equivalent files sharing the same logical name must have identical intrinsic dimensions.

## Format selection

For each logical raster image, the generator evaluates WebP and AVIF candidates.

A WebP source set is emitted only when every generated WebP candidate is smaller than the existing transfer-size baseline.

AVIF is emitted ahead of WebP only when every AVIF candidate is smaller than its equivalent WebP candidate.

If WebP is not beneficial, AVIF is compared directly with the original baseline.

As a result, a newer format is not automatically preferred merely because it is newer.

If no generated format improves delivery, no responsive derivative is emitted and the original image remains the only source.

## Generated files

Generated responsive assets are written to:

```text
generated-images/
```

The directory is ignored by Git and is disposable build output.

The generator removes the directory before every run so deleted or renamed source assets cannot leave stale derivatives behind.

The previous temporary output directory:

```text
public/assets/generated/
```

is also removed by the generator for migration safety.

## Runtime discovery

`imageAssets.ts` uses Vite's static glob asset discovery to identify the derivatives that actually exist after generation.

`ResponsiveImage` automatically maps an original public asset URL to the corresponding generated variants.

Application components therefore only provide the original source:

```tsx
<ResponsiveImage
  src={item.logoUrl}
  alt="..."
/>
```

They do not need to know which formats or widths were generated.

Generated assets use Vite's no-inline asset handling so small optimized badges remain independent files rather than being embedded into the initial JavaScript bundle.

This preserves deferred network loading for collapsed certification panels.

## Deferred certification loading

Professional certification panels retain their existing accordion structure and accessibility semantics.

Certification badge URLs are not assigned for vendors that have never been expanded.

A collapsed and unvisited vendor therefore generates no certification badge image request.

When a vendor is opened:

- its original image URL is assigned;
- `ResponsiveImage` automatically exposes any generated responsive variants;
- the browser selects the most appropriate generated width and supported format;
- the original asset remains the fallback.

Once a vendor has been opened, its image URLs remain assigned when the panel closes so:

- the closing animation does not blank the images;
- subsequent expansions can reuse the browser cache.

## Reload and restored state

Expanded professional-certification state is already persisted through the portfolio's existing tab-scoped session state.

If the page is reloaded while a certification vendor is expanded, `expandedVendorId` is reconstructed before the first Education render.

The expanded vendor therefore receives its badge image URLs immediately on mount and responsive image selection proceeds normally.

There is no intermediate state in which a restored open panel intentionally waits for user interaction before loading its badges.

## Carousel behavior

Certification carousel behavior is unchanged.

Carousel logos preserve:

- eager loading;
- autoplay;
- infinite looping;
- hover pause;
- keyboard interaction;
- drag behavior;
- click-to-open behavior;
- reduced-motion behavior.

Raster carousel logos can use automatically generated responsive variants while SVG logos continue to be served directly.

## Development and build integration

Development preparation continues to run:

```bash
npm run generate:cv
npm run generate:images
```

Production builds continue to run:

```bash
npm run generate:cv
npm run generate:images
tsc --noEmit
vite build
```

No generated responsive image needs to be committed to the repository.

## Adding future content

### New certification

Normal workflow:

```text
add badge
→ update constants.ts
→ commit
```

No image-delivery configuration change is required.

### New employer

Normal workflow:

```text
add employer logo
→ update portfolio data
→ commit
```

If the logo is SVG it is preserved directly.

If the logo is raster it is automatically evaluated for responsive optimization.

### New project

Projects do not require any image-delivery-specific maintenance.

### New profile photograph

A replacement profile photograph is automatically evaluated by the people image-delivery rule.

If its intrinsic dimensions differ from the current profile image, the explicit `width` and `height` attributes in `About.tsx` must also be updated so the HTML continues to describe the source image accurately.

## Validation

After changing image-delivery behavior, run:

```bash
npm run audit:security
npm run check
npm run test:e2e
npm run test:a11y
```

The image-delivery E2E coverage verifies:

- responsive About delivery on mobile;
- responsive About delivery on high-density desktop;
- automatic optimization of a raster asset that has no per-file configuration;
- explicit image dimensions;
- absence of image HTTP failures;
- no certification badge URLs before first expansion;
- responsive certification delivery after expansion;
- correct badge delivery after reloading with an expanded certification vendor.

## Performance validation

Performance comparisons should use the canonical localized page:

```text
/JNR/es/
```

or `/es/` under the local preview server.

Before/after Lighthouse or PageSpeed measurements should use equivalent mobile and desktop conditions and record:

- Largest Contentful Paint (LCP);
- First Contentful Paint (FCP);
- Cumulative Layout Shift (CLS);
- transferred image bytes;
- image-delivery estimated savings;
- identified LCP element.

The existence of generated derivatives alone is not considered evidence that the optimization is successful.
