import { SUPPORTED_LANGUAGES } from '../localeRouting';
import { getLocalizedUrl, getSeoLocaleData } from '../seo';
import { renderLocalizedHtml, renderSitemap } from './generate-localized-html';

const escapeExpectedHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

describe('localized HTML generator', () => {
  for (const language of SUPPORTED_LANGUAGES) {
    it(`renders crawler-visible metadata for ${language}`, () => {
      const seo = getSeoLocaleData(language);
      const html = renderLocalizedHtml(language);

      expect(html).toContain(`<html lang="${language}">`);
      expect(html).toContain(`<title>${escapeExpectedHtml(seo.title)}</title>`);
      expect(html).toContain(
        `name="description" content="${escapeExpectedHtml(seo.description)}"`,
      );
      expect(html).toContain(`rel="canonical" href="${seo.canonicalUrl}"`);
      expect(html).toContain(
        `property="og:locale" content="${seo.openGraphLocale}"`,
      );
      expect(html).toContain('name="twitter:card" content="summary"');
      expect(html).toContain('type="application/ld+json"');
      expect(html).toContain('src="../index.tsx"');

      for (const alternateLanguage of SUPPORTED_LANGUAGES) {
        expect(html).toContain(
          `hreflang="${alternateLanguage}" href="${getLocalizedUrl(alternateLanguage)}"`,
        );
      }
    });
  }

  it('renders sitemap alternates for all indexable locale URLs', () => {
    const sitemap = renderSitemap();

    expect(sitemap).toContain(
      'xmlns:xhtml="http://www.w3.org/1999/xhtml"',
    );

    for (const language of SUPPORTED_LANGUAGES) {
      expect(sitemap).toContain(`<loc>${getLocalizedUrl(language)}</loc>`);
      expect(sitemap).toContain(
        `hreflang="${language}" href="${getLocalizedUrl(language)}"`,
      );
    }

    expect(sitemap).toContain(
      `hreflang="x-default" href="${getLocalizedUrl('es')}"`,
    );
  });
});
