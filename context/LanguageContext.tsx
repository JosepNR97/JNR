import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { PROFILE_DATA } from '../aboutMe';
import { translations } from '../translations';
import type { Language, TranslationStructure } from '../types';

const LANGUAGE_STORAGE_KEY = 'jnr-language-v1';
const SUPPORTED_LANGUAGES: Language[] = ['ca', 'es', 'en'];

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: TranslationStructure;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const isLanguage = (value: string | null): value is Language =>
  value !== null && SUPPORTED_LANGUAGES.includes(value as Language);

const getInitialLanguage = (): Language => {
  if (typeof window === 'undefined') return 'es';

  try {
    const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (isLanguage(storedLanguage)) return storedLanguage;
  } catch {
    // Storage can be unavailable in restrictive browsing modes.
  }

  const browserLanguage = window.navigator.languages
    .map((language) => language.split('-')[0] ?? '')
    .find((language): language is Language => isLanguage(language));

  return browserLanguage ?? 'es';
};

const updateMetaContent = (selector: string, content: string) => {
  document.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', content);
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const t = translations[language];

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = `${PROFILE_DATA.name} | ${t.hero.title}`;
    updateMetaContent('meta[name="description"]', t.hero.tagline);
    updateMetaContent('meta[property="og:title"]', document.title);
    updateMetaContent('meta[property="og:description"]', t.hero.tagline);
    updateMetaContent('meta[name="twitter:title"]', document.title);
    updateMetaContent('meta[name="twitter:description"]', t.hero.tagline);

    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      // The language still works for the current visit if storage is unavailable.
    }
  }, [language, t.hero.tagline, t.hero.title]);

  const value = useMemo(
    () => ({ language, setLanguage, t }),
    [language, t],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
