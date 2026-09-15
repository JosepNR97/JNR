import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { SUPPORTED_LANGUAGES } from '../localeRouting';
import {
  getLocalizedUrl,
  getPersonJsonLd,
  getSeoLocaleData,
} from '../seo';
import type { Language } from '../types';

const FAVICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='20' fill='%230c4a6e'/%3E%3Ctext x='50' y='66' font-family='Georgia,serif' font-weight='bold' font-size='45' text-anchor='middle'%3E%3Ctspan fill='white'%3EJNR%3C/tspan%3E%3Ctspan fill='%230ea5e9'%3E.%3C/tspan%3E%3C/text%3E%3C/svg%3E";

const escapeHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const serializeJsonLd = (value: unknown): string =>
  JSON.stringify(value, null, 2).replaceAll('<', '\\u003c');

const renderAlternateLinks = () =>
  [
    ...SUPPORTED_LANGUAGES.map(
      (language) =>
        `    <link rel="alternate" hreflang="${language}" href="${getLocalizedUrl(language)}" />`,
    ),
    `    <link rel="alternate" hreflang="x-default" href="${getLocalizedUrl('es')}" />`,
  ].join('\n');

const renderOpenGraphAlternates = (language: Language) =>
  getSeoLocaleData(language).openGraphAlternateLocales
    .map(
      (locale) =>
        `    <meta property="og:locale:alternate" content="${locale}" />`,
    )
    .join('\n');

export const renderLocalizedHtml = (language: Language): string => {
  const seo = getSeoLocaleData(language);
  const jsonLd = serializeJsonLd(getPersonJsonLd(language));

  return `<!doctype html>
<html lang="${language}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#0c4a6e" />
    <meta name="robots" content="index,follow" />

    <title>${escapeHtml(seo.title)}</title>
    <meta name="description" content="${escapeHtml(seo.description)}" />
    <link rel="canonical" href="${seo.canonicalUrl}" />
${renderAlternateLinks()}

    <meta property="og:type" content="profile" />
    <meta property="og:url" content="${seo.canonicalUrl}" />
    <meta property="og:locale" content="${seo.openGraphLocale}" />
${renderOpenGraphAlternates(language)}
    <meta property="og:title" content="${escapeHtml(seo.title)}" />
    <meta property="og:description" content="${escapeHtml(seo.description)}" />
    <meta property="og:image" content="${seo.imageUrl}" />
    <meta property="og:image:alt" content="${escapeHtml(seo.imageAlt)}" />

    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${escapeHtml(seo.title)}" />
    <meta name="twitter:description" content="${escapeHtml(seo.description)}" />
    <meta name="twitter:image" content="${seo.imageUrl}" />
    <meta name="twitter:image:alt" content="${escapeHtml(seo.imageAlt)}" />

    <link rel="icon" type="image/svg+xml" href="${FAVICON}" />

    <script type="application/ld+json">
${jsonLd
  .split('\n')
  .map((line) => `      ${line}`)
  .join('\n')}
    </script>
  </head>
  <body>
    <div id="root"></div>
    <noscript>${escapeHtml(seo.noScriptText)}</noscript>
    <script type="module" src="../index.tsx"></script>
  </body>
</html>
`;
};

const renderSitemapAlternateLinks = () =>
  [
    ...SUPPORTED_LANGUAGES.map(
      (language) =>
        `    <xhtml:link rel="alternate" hreflang="${language}" href="${getLocalizedUrl(language)}" />`,
    ),
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${getLocalizedUrl('es')}" />`,
  ].join('\n');

export const renderSitemap = (): string => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${SUPPORTED_LANGUAGES.map(
  (language) => `  <url>
    <loc>${getLocalizedUrl(language)}</loc>
${renderSitemapAlternateLinks()}
  </url>`,
).join('\n')}
</urlset>
`;

export const generateLocalizedPages = (projectRoot: string): void => {
  for (const language of SUPPORTED_LANGUAGES) {
    const localeDirectory = join(projectRoot, language);
    mkdirSync(localeDirectory, { recursive: true });
    writeFileSync(
      join(localeDirectory, 'index.html'),
      renderLocalizedHtml(language),
      'utf8',
    );
  }

  const publicDirectory = join(projectRoot, 'public');
  mkdirSync(publicDirectory, { recursive: true });
  writeFileSync(join(publicDirectory, 'sitemap.xml'), renderSitemap(), 'utf8');
};
