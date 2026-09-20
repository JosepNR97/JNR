import {
  describe,
  expect,
  it,
} from 'vitest';
import {
  renderLocalizedHtml,
  renderSitemap,
} from './scripts/generate-localized-html.ts';
import {
  PERSON_ID,
  getPersonJsonLd,
  getProfilePageJsonLd,
  getSeoLocaleData,
} from './seo.ts';
import {
  SEO_IDENTITY,
  SEO_SAME_AS,
} from './seoIdentity.ts';

const LANGUAGES = [
  'ca',
  'es',
  'en',
] as const;

const ISO_DATE_PATTERN =
  /^\d{4}-\d{2}-\d{2}$/;

const ISO_DATE_TIME_PATTERN =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:Z|[+-]\d{2}:\d{2})$/;

describe(
  'SEO identity contract',
  () => {
    it(
      'uses one shared Person identity across all locales',
      () => {
        for (
          const language
          of LANGUAGES
        ) {
          const person =
            getPersonJsonLd(
              language,
            );

          expect(
            person['@id'],
          ).toBe(
            PERSON_ID,
          );

          expect(
            person.name,
          ).toBe(
            'Josep Núñez Riba',
          );

          expect(
            person.givenName,
          ).toBe(
            'Josep',
          );

          expect(
            person.familyName,
          ).toBe(
            'Núñez Riba',
          );

          expect(
            person.alternateName,
          ).toBe(
            'JosepNR97',
          );
        }
      },
    );

    it(
      'links every localized ProfilePage to the shared Person entity',
      () => {
        for (
          const language
          of LANGUAGES
        ) {
          const serialized =
            JSON.stringify(
              getProfilePageJsonLd(
                language,
              ),
            );

          expect(
            serialized,
          ).toContain(
            '"@type":"ProfilePage"',
          );

          expect(
            serialized,
          ).toContain(
            `"mainEntity":{"@id":"${PERSON_ID}"}`,
          );

          expect(
            serialized,
          ).toContain(
            `"@id":"${PERSON_ID}"`,
          );
        }
      },
    );

    it(
      'publishes all approved external identity profiles through sameAs',
      () => {
        for (
          const language
          of LANGUAGES
        ) {
          const person =
            getPersonJsonLd(
              language,
            );

          expect(
            person.sameAs,
          ).toEqual(
            [
              ...SEO_SAME_AS,
            ],
          );
        }
      },
    );

    it(
      'publishes the current profile image rather than the superseded portrait',
      () => {
        for (
          const language
          of LANGUAGES
        ) {
          const seo =
            getSeoLocaleData(
              language,
            );

          expect(
            seo.imageUrl,
          ).toBe(
            'https://josepnr97.github.io/JNR/assets/people/josep-nunez-riba-2.webp',
          );
        }
      },
    );

    it(
      'uses identity-focused localized descriptions without changing visible portfolio copy',
      () => {
        for (
          const language
          of LANGUAGES
        ) {
          const seo =
            getSeoLocaleData(
              language,
            );

          expect(
            seo.description,
          ).toContain(
            'Josep Núñez Riba',
          );

          expect(
            seo.description
              .length,
          ).toBeGreaterThan(
            80,
          );

          expect(
            seo.description
              .length,
          ).toBeLessThan(
            180,
          );
        }
      },
    );

    it(
      'publishes factual professional identity context',
      () => {
        const person =
          getPersonJsonLd(
            'es',
          );

        expect(
          person.worksFor,
        ).toEqual({
          '@type':
            'Organization',
          name:
            SEO_IDENTITY
              .employer
              .name,
        });

        expect(
          person.knowsAbout,
        ).toEqual(
          [
            ...SEO_IDENTITY.knowsAbout,
          ],
        );

        expect(
          person.alumniOf,
        ).toEqual([
          {
            '@type':
              'CollegeOrUniversity',
            name:
              'Universitat de Barcelona',
          },
          {
            '@type':
              'EducationalOrganization',
            name:
              'ISDI',
          },
        ]);
      },
    );

    it(
      'publishes a valid DateTime for ProfilePage dateModified',
      () => {
        for (
          const language
          of LANGUAGES
        ) {
          const seo =
            getSeoLocaleData(
              language,
            );

          expect(
            seo.dateModified,
          ).toMatch(
            ISO_DATE_TIME_PATTERN,
          );

          expect(
            Number.isNaN(
              Date.parse(
                seo.dateModified,
              ),
            ),
          ).toBe(
            false,
          );

          const structuredData =
            getProfilePageJsonLd(
              language,
            );

          expect(
            structuredData
              ['@graph'][0],
          ).toMatchObject({
            '@type':
              'ProfilePage',
            dateModified:
              seo.dateModified,
          });
        }
      },
    );

    it(
      'keeps sitemap lastmod as a date independently from ProfilePage dateModified',
      () => {
        for (
          const language
          of LANGUAGES
        ) {
          const seo =
            getSeoLocaleData(
              language,
            );

          expect(
            seo.lastModified,
          ).toMatch(
            ISO_DATE_PATTERN,
          );

          expect(
            seo.lastModified,
          ).not.toContain(
            'T',
          );

          expect(
            seo.dateModified,
          ).not.toBe(
            seo.lastModified,
          );
        }
      },
    );

    it(
      'renders the structured identity data into every initial locale HTML document',
      () => {
        for (
          const language
          of LANGUAGES
        ) {
          const html =
            renderLocalizedHtml(
              language,
            );

          const seo =
            getSeoLocaleData(
              language,
            );

          expect(
            html,
          ).toContain(
            'type="application/ld+json"',
          );

          expect(
            html,
          ).toContain(
            '"@type": "ProfilePage"',
          );

          expect(
            html,
          ).toContain(
            '"@type": "Person"',
          );

          expect(
            html,
          ).toContain(
            PERSON_ID,
          );

          expect(
            html,
          ).toContain(
            `"dateModified": "${seo.dateModified}"`,
          );
        }
      },
    );

    it(
      'lists only canonical locale URLs in the sitemap and publishes reliable lastmod values',
      () => {
        const sitemap =
          renderSitemap();

        for (
          const language
          of LANGUAGES
        ) {
          const seo =
            getSeoLocaleData(
              language,
            );

          expect(
            sitemap,
          ).toContain(
            `<loc>${seo.canonicalUrl}</loc>`,
          );

          expect(
            sitemap,
          ).toContain(
            `<lastmod>${seo.lastModified}</lastmod>`,
          );
        }

        expect(
          sitemap.match(
            /<lastmod>2026-09-20<\/lastmod>/g,
          ) ?? [],
        ).toHaveLength(
          3,
        );

        expect(
          sitemap,
        ).not.toContain(
          '<loc>https://josepnr97.github.io/JNR/</loc>',
        );
      },
    );
  },
);
