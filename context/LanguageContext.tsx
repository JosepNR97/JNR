import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import {
  LANGUAGE_STORAGE_KEY,
  SUPPORTED_LANGUAGES,
  getLanguageFromPathname,
  getLocalizedHref,
  isLanguage,
} from '../localeRouting';
import { translations } from '../translations';
import type { Language, TranslationStructure } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: TranslationStructure;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const getInitialLanguage = (): Language => {
  if (typeof window === 'undefined') return 'es';

  const urlLanguage = getLanguageFromPathname(window.location.pathname);
  if (urlLanguage) return urlLanguage;

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

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);
  const t = translations[language];

  useLayoutEffect(() => {
    document.documentElement.lang = language;

    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      // The explicit URL remains authoritative if storage is unavailable.
    }
  }, [language]);

  const setLanguage = useCallback(
    (nextLanguage: Language) => {
      if (
        !SUPPORTED_LANGUAGES.includes(nextLanguage) ||
        nextLanguage === language
      ) {
        return;
      }

      const currentUrlLanguage = getLanguageFromPathname(
        window.location.pathname,
      );

      if (currentUrlLanguage) {
        window.location.assign(
          getLocalizedHref(
            window.location.pathname,
            nextLanguage,
            window.location.search,
            window.location.hash,
          ),
        );

        return;
      }

      setLanguageState(nextLanguage);
    },
    [language],
  );

  const value = useMemo(
    () => ({ language, setLanguage, t }),
    [language, setLanguage, t],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);

  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }

  return context;
};
