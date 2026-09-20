import {
  HERO_DATA,
  PROFILE_DATA,
} from './aboutMe.ts';
import {
  SUPPORTED_LANGUAGES,
} from './localeRouting.ts';
import {
  SEO_IDENTITY,
  SEO_SAME_AS,
} from './seoIdentity.ts';
import type {
  Language,
} from './types.ts';

export const SITE_ORIGIN =
  'https://josepnr97.github.io';

export const SITE_BASE_PATH =
  '/JNR/';

export const SITE_BASE_URL =
  `${SITE_ORIGIN}${SITE_BASE_PATH}`;

export const PERSON_ID =
  `${SITE_BASE_URL}#person`;

const OPEN_GRAPH_LOCALES:
  Record<Language, string> = {
    ca: 'ca_ES',
    es: 'es_ES',
    en: 'en_GB',
  };

const IMAGE_ALT:
  Record<Language, string> = {
    ca: 'Retrat professional de Josep Núñez Riba',
    es: 'Retrato profesional de Josep Núñez Riba',
    en: 'Professional portrait of Josep Núñez Riba',
  };

const SEO_DESCRIPTIONS:
  Record<Language, string> = {
    ca: 'Portfolio de Josep Núñez Riba, gerent d’estratègia tecnològica a Barcelona, especialitzat en transformació digital, arquitectura empresarial, cloud i IA.',
    es: 'Portfolio de Josep Núñez Riba, gerente de estrategia tecnológica en Barcelona, especializado en transformación digital, arquitectura empresarial, cloud e IA.',
    en: 'Portfolio of Josep Núñez Riba, Technology Strategy Manager in Barcelona, focused on digital transformation, enterprise architecture, cloud and AI.',
  };

const NOSCRIPT_COPY:
  Record<Language, string> = {
    ca: 'Aquesta web necessita JavaScript per mostrar el contingut interactiu.',
    es: 'Esta web necesita JavaScript para mostrar el contenido interactivo.',
    en: 'This website needs JavaScript to display its interactive content.',
  };

/*
 * Sitemap <lastmod>.
 *
 * Update a locale only when its indexable page receives a meaningful
 * change: main content, structured data, important links or SEO metadata.
 *
 * Do not update this merely because the site was rebuilt or because a
 * cosmetic/non-content change was deployed.
 *
 * Sitemap lastmod intentionally uses a Date (YYYY-MM-DD).
 */
const LAST_SIGNIFICANT_UPDATE:
  Record<Language, string> = {
    ca: '2026-09-20',
    es: '2026-09-20',
    en: '2026-09-20',
  };

/*
 * ProfilePage dateModified.
 *
 * Google expects ProfilePage.dateModified to be a DateTime rather than
 * the date-only value used by the sitemap.
 *
 * This timestamp corresponds to the SEO profile update introduced on
 * 2026-09-20. Keep it independent from sitemap lastmod so each consumer
 * receives the format it expects.
 *
 * When the profile's indexable content or structured identity changes
 * meaningfully in the future, update both this value and the corresponding
 * sitemap date above.
 */
const LAST_PROFILE_UPDATE:
  Record<Language, string> = {
    ca: '2026-09-20T19:28:22Z',
    es: '2026-09-20T19:28:22Z',
    en: '2026-09-20T19:28:22Z',
  };

export interface SeoLocaleData {
  language: Language;
  canonicalUrl: string;
  title: string;
  description: string;
  openGraphLocale: string;
  openGraphAlternateLocales: string[];
  imageUrl: string;
  imageAlt: string;
  noScriptText: string;
  lastModified: string;
  dateModified: string;
}

export const getLocalizedUrl = (
  language: Language,
): string =>
  `${SITE_BASE_URL}${language}/`;

export const getSeoLocaleData = (
  language: Language,
): SeoLocaleData => ({
  language,
  canonicalUrl:
    getLocalizedUrl(language),
  title:
    `${PROFILE_DATA.name} | ${HERO_DATA.title[language]}`,
  description:
    SEO_DESCRIPTIONS[language],
  openGraphLocale:
    OPEN_GRAPH_LOCALES[language],
  openGraphAlternateLocales:
    SUPPORTED_LANGUAGES.filter(
      (candidate) =>
        candidate !== language,
    ).map(
      (candidate) =>
        OPEN_GRAPH_LOCALES[
          candidate
        ],
    ),
  imageUrl:
    `${SITE_BASE_URL}${SEO_IDENTITY.imagePath}`,
  imageAlt:
    IMAGE_ALT[language],
  noScriptText:
    NOSCRIPT_COPY[language],
  lastModified:
    LAST_SIGNIFICANT_UPDATE[
      language
    ],
  dateModified:
    LAST_PROFILE_UPDATE[
      language
    ],
});

export const getPersonJsonLd = (
  language: Language,
) => {
  const seo =
    getSeoLocaleData(language);

  return {
    '@type': 'Person',
    '@id': PERSON_ID,

    name:
      PROFILE_DATA.name,

    givenName:
      SEO_IDENTITY.givenName,

    familyName:
      SEO_IDENTITY.familyName,

    alternateName:
      SEO_IDENTITY.alternateName,

    /*
     * The Spanish canonical is used as the stable primary public URL for
     * the Person entity. The three localized ProfilePage nodes reference
     * this same Person through PERSON_ID.
     */
    url:
      getLocalizedUrl('es'),

    image:
      seo.imageUrl,

    jobTitle:
      HERO_DATA.title[language],

    description:
      seo.description,

    sameAs: [
      ...SEO_SAME_AS,
    ],

    worksFor: {
      '@type':
        'Organization',
      name:
        SEO_IDENTITY
          .employer
          .name,
    },

    alumniOf:
      SEO_IDENTITY.alumniOf.map(
        (
          organization,
        ) => ({
          '@type':
            organization.type,
          name:
            organization.name,
        }),
      ),

    knowsAbout: [
      ...SEO_IDENTITY.knowsAbout,
    ],

    address: {
      '@type':
        'PostalAddress',
      addressLocality:
        PROFILE_DATA.location[
          language
        ],
      addressCountry:
        'ES',
    },

    mainEntityOfPage: {
      '@id':
        `${seo.canonicalUrl}#profile-page`,
    },
  };
};

export const getProfilePageJsonLd = (
  language: Language,
) => {
  const seo =
    getSeoLocaleData(language);

  return {
    '@context':
      'https://schema.org',

    '@graph': [
      {
        '@type':
          'ProfilePage',

        '@id':
          `${seo.canonicalUrl}#profile-page`,

        url:
          seo.canonicalUrl,

        name:
          seo.title,

        description:
          seo.description,

        inLanguage:
          language,

        dateModified:
          seo.dateModified,

        mainEntity: {
          '@id':
            PERSON_ID,
        },
      },

      getPersonJsonLd(
        language,
      ),
    ],
  };
};
