import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
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
import {
  saveLanguageNavigationState,
} from '../languageNavigationState';
import { translations } from '../translations';
import type {
  Language,
  TranslationStructure,
} from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (
    language: Language,
  ) => void;
  t: TranslationStructure;
}

const LanguageContext =
  createContext<
    LanguageContextType | undefined
  >(undefined);

const getInitialLanguage =
  (): Language => {
    if (
      typeof window === 'undefined'
    ) {
      return 'es';
    }

    const urlLanguage =
      getLanguageFromPathname(
        window.location.pathname,
      );

    if (urlLanguage) {
      return urlLanguage;
    }

    try {
      const storedLanguage =
        window.localStorage.getItem(
          LANGUAGE_STORAGE_KEY,
        );

      if (
        isLanguage(
          storedLanguage,
        )
      ) {
        return storedLanguage;
      }
    } catch {
      // Storage can be unavailable in restrictive browsing modes.
    }

    const browserLanguage =
      window.navigator.languages
        .map(
          (language) =>
            language.split('-')[0] ??
            '',
        )
        .find(
          (
            language,
          ): language is Language =>
            isLanguage(language),
        );

    return (
      browserLanguage ?? 'es'
    );
  };

const persistLanguage = (
  language: Language,
): void => {
  try {
    window.localStorage.setItem(
      LANGUAGE_STORAGE_KEY,
      language,
    );
  } catch {
    // The explicit URL remains authoritative if storage is unavailable.
  }
};

export const LanguageProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [
    language,
    setLanguageState,
  ] =
    useState<Language>(
      getInitialLanguage,
    );

  const navigationInProgressRef =
    useRef(false);

  const t =
    translations[language];

  useLayoutEffect(() => {
    document.documentElement.lang =
      language;

    persistLanguage(language);
  }, [language]);

  const setLanguage =
    useCallback(
      (
        nextLanguage: Language,
      ) => {
        if (
          !SUPPORTED_LANGUAGES.includes(
            nextLanguage,
          ) ||
          nextLanguage === language ||
          navigationInProgressRef.current
        ) {
          return;
        }

        const currentUrlLanguage =
          getLanguageFromPathname(
            window.location.pathname,
          );

        if (
          currentUrlLanguage
        ) {
          navigationInProgressRef.current =
            true;

          /*
           * Persist the explicit user choice before leaving the current
           * localized document.
           */
          persistLanguage(
            nextLanguage,
          );

          /*
           * Preserve the URL contract exactly:
           *
           * - same query string;
           * - same explicit hash, if one already exists;
           * - no synthetic section hash is added merely because the user
           *   happens to be viewing that part of the page.
           */
          const targetHref =
            getLocalizedHref(
              window.location.pathname,
              nextLanguage,
              window.location.search,
              window.location.hash,
            );

          /*
           * Locale URLs are separate HTML documents. Save a one-shot snapshot
           * of the current visual/UI state so the destination can restore the
           * same browsing context after React mounts.
           */
          saveLanguageNavigationState(
            {
              fromLanguage:
                language,
              toLanguage:
                nextLanguage,
              targetHref,
            },
          );

          window.location.assign(
            targetHref,
          );

          return;
        }

        /*
         * This fallback is only relevant if the provider is rendered without
         * an explicit locale URL. Normal localized pages navigate by URL.
         */
        setLanguageState(
          nextLanguage,
        );
      },
      [language],
    );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
    }),
    [
      language,
      setLanguage,
      t,
    ],
  );

  return (
    <LanguageContext.Provider
      value={value}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context =
    useContext(
      LanguageContext,
    );

  if (
    context === undefined
  ) {
    throw new Error(
      'useLanguage must be used within a LanguageProvider',
    );
  }

  return context;
};
