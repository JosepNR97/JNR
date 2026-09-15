import type { Language } from './types.ts';

export const SUPPORTED_LANGUAGES = ['ca', 'es', 'en'] as const satisfies readonly Language[];

export const LANGUAGE_STORAGE_KEY = 'jnr-language-v1';

export const isLanguage = (value: string | null | undefined): value is Language =>
  value !== null &&
  value !== undefined &&
  SUPPORTED_LANGUAGES.includes(value as Language);

export const getLanguageFromPathname = (pathname: string): Language | null => {
  const segments = pathname.split('/').filter(Boolean);
  const finalSegment = segments.at(-1);

  return isLanguage(finalSegment) ? finalSegment : null;
};

export const getLocalizedPathname = (
  pathname: string,
  language: Language,
): string => {
  const segments = pathname.split('/').filter(Boolean);
  const finalSegment = segments.at(-1);

  if (isLanguage(finalSegment)) {
    segments[segments.length - 1] = language;
  } else {
    segments.push(language);
  }

  return `/${segments.join('/')}/`;
};

export const getLocalizedHref = (
  pathname: string,
  language: Language,
  search = '',
  hash = '',
): string => `${getLocalizedPathname(pathname, language)}${search}${hash}`;
