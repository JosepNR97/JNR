import { getLanguageFromPathname } from './localeRouting.ts';

const baseUrl = import.meta.env?.BASE_URL ?? './';

const getAssetBaseUrl = (): string => {
  if (typeof window === 'undefined') {
    return baseUrl;
  }

  return getLanguageFromPathname(window.location.pathname) ? '../' : baseUrl;
};

export const assetPath = (path: string) =>
  `${getAssetBaseUrl()}assets/${path}`;
