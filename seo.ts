import { HERO_DATA, PROFILE_DATA } from './aboutMe';
import { SUPPORTED_LANGUAGES } from './localeRouting';
import type { Language } from './types';

export const SITE_ORIGIN = 'https://josepnr97.github.io';
export const SITE_BASE_PATH = '/JNR/';
export const SITE_BASE_URL = `${SITE_ORIGIN}${SITE_BASE_PATH}`;

const OPEN_GRAPH_LOCALES: Record<Language, string> = {
  ca: 'ca_ES',
  es: 'es_ES',
  en: 'en_GB',
};

const IMAGE_ALT: Record<Language, string> = {
  ca: 'Retrat professional de Josep Núñez Riba',
  es: 'Retrato profesional de Josep Núñez Riba',
  en: 'Professional portrait of Josep Núñez Riba',
};

const NOSCRIPT_COPY: Record<Language, string> = {
  ca: 'Aquesta web necessita JavaScript per mostrar el contingut interactiu.',
  es: 'Esta web necesita JavaScript para mostrar el contenido interactivo.',
  en: 'This website needs JavaScript to display its interactive content.',
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
}

export const getLocalizedUrl = (language: Language): string =>
  `${SITE_BASE_URL}${language}/`;

export const getSeoLocaleData = (language: Language): SeoLocaleData => ({
  language,
  canonicalUrl: getLocalizedUrl(language),
  title: `${PROFILE_DATA.name} | ${HERO_DATA.title[language]}`,
  description: HERO_DATA.tagline[language],
  openGraphLocale: OPEN_GRAPH_LOCALES[language],
  openGraphAlternateLocales: SUPPORTED_LANGUAGES.filter(
    (candidate) => candidate !== language,
  ).map((candidate) => OPEN_GRAPH_LOCALES[candidate]),
  imageUrl: `${SITE_BASE_URL}assets/people/josep-nunez-riba.webp`,
  imageAlt: IMAGE_ALT[language],
  noScriptText: NOSCRIPT_COPY[language],
});

export const getPersonJsonLd = (language: Language) => {
  const seo = getSeoLocaleData(language);

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${seo.canonicalUrl}#person`,
    name: PROFILE_DATA.name,
    url: seo.canonicalUrl,
    image: seo.imageUrl,
    jobTitle: HERO_DATA.title[language],
    description: seo.description,
    sameAs: [PROFILE_DATA.linkedin],
    address: {
      '@type': 'PostalAddress',
      addressLocality: PROFILE_DATA.location[language],
      addressCountry: 'ES',
    },
  };
};
