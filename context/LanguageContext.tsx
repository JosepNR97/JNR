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
import { translations } from '../translations';
import type { Language, TranslationStructure } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: TranslationStructure;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

const LANGUAGE_NAVIGATION_SECTION_IDS = [
  'top',
  'about',
  'certifications',
  'services',
  'experience',
  'education',
  'contact',
] as const;

type LanguageNavigationSectionId =
  (typeof LANGUAGE_NAVIGATION_SECTION_IDS)[number];

const isLanguageNavigationSectionId = (
  value: string,
): value is LanguageNavigationSectionId =>
  LANGUAGE_NAVIGATION_SECTION_IDS.includes(
    value as LanguageNavigationSectionId,
  );

const getInitialLanguage = (): Language => {
  if (typeof window === 'undefined') return 'es';

  const urlLanguage = getLanguageFromPathname(window.location.pathname);

  if (urlLanguage) {
    return urlLanguage;
  }

  try {
    const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);

    if (isLanguage(storedLanguage)) {
      return storedLanguage;
    }
  } catch {
    // Storage can be unavailable in restrictive browsing modes.
  }

  const browserLanguage = window.navigator.languages
    .map((language) => language.split('-')[0] ?? '')
    .find((language): language is Language => isLanguage(language));

  return browserLanguage ?? 'es';
};

const persistLanguage = (language: Language): void => {
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // The explicit URL remains authoritative if storage is unavailable.
  }
};

const getReadingLineY = (): number =>
  Math.max(
    96,
    Math.min(window.innerHeight * 0.25, 240),
  );

const getLanguageNavigationHash = (): string => {
  const currentHash = window.location.hash;
  const currentHashId = currentHash.startsWith('#')
    ? currentHash.slice(1)
    : currentHash;

  /*
   * Preserve specific deep links that are not one of the portfolio's
   * section-level anchors.
   */
  if (
    currentHash &&
    !isLanguageNavigationSectionId(currentHashId)
  ) {
    return currentHash;
  }

  const sections = LANGUAGE_NAVIGATION_SECTION_IDS
    .map((sectionId) => document.getElementById(sectionId))
    .filter((element): element is HTMLElement => element !== null);

  if (sections.length === 0) {
    return currentHash;
  }

  const documentHeight = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight,
  );

  const viewportBottom = window.scrollY + window.innerHeight;

  /*
   * A short final section cannot always reach the normal reading line.
   * At the bottom of the page, the final portfolio section is therefore
   * the active semantic context.
   */
  if (
    documentHeight > 0 &&
    viewportBottom >= documentHeight - 2
  ) {
    const finalSection = sections.at(-1);

    if (!finalSection || finalSection.id === 'top') {
      return '';
    }

    return `#${finalSection.id}`;
  }

  const readingLineY = getReadingLineY();

  const currentSection = sections.find((section) => {
    const rect = section.getBoundingClientRect();

    return (
      rect.top <= readingLineY &&
      rect.bottom > readingLineY
    );
  });

  if (currentSection) {
    return currentSection.id === 'top'
      ? ''
      : `#${currentSection.id}`;
  }

  /*
   * Layout gaps are not expected between the main sections, but use the
   * closest section as a defensive fallback if the reading line happens to
   * fall outside every section.
   */
  const nearestSection = sections.reduce(
    (nearest, section) => {
      const nearestRect =
        nearest.getBoundingClientRect();

      const sectionRect =
        section.getBoundingClientRect();

      const nearestDistance = Math.min(
        Math.abs(nearestRect.top - readingLineY),
        Math.abs(nearestRect.bottom - readingLineY),
      );

      const sectionDistance = Math.min(
        Math.abs(sectionRect.top - readingLineY),
        Math.abs(sectionRect.bottom - readingLineY),
      );

      return sectionDistance < nearestDistance
        ? section
        : nearest;
    },
  );

  return nearestSection.id === 'top'
    ? ''
    : `#${nearestSection.id}`;
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);
  const navigationInProgressRef = useRef(false);

  const t = translations[language];

  useLayoutEffect(() => {
    document.documentElement.lang = language;
    persistLanguage(language);
  }, [language]);

  const setLanguage = useCallback(
    (nextLanguage: Language) => {
      if (
        !SUPPORTED_LANGUAGES.includes(nextLanguage) ||
        nextLanguage === language ||
        navigationInProgressRef.current
      ) {
        return;
      }

      const currentUrlLanguage = getLanguageFromPathname(
        window.location.pathname,
      );

      if (currentUrlLanguage) {
        navigationInProgressRef.current = true;

        /*
         * Persist the explicit user choice before leaving the current
         * localized document.
         */
        persistLanguage(nextLanguage);

        /*
         * Preserve semantic page context rather than copying a pixel offset,
         * because translated sections can have different heights.
         */
        const navigationHash = getLanguageNavigationHash();

        window.location.assign(
          getLocalizedHref(
            window.location.pathname,
            nextLanguage,
            window.location.search,
            navigationHash,
          ),
        );

        return;
      }

      /*
       * This fallback is only relevant if the provider is rendered without
       * an explicit locale URL. Normal localized pages navigate by URL.
       */
      setLanguageState(nextLanguage);
    },
    [language],
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
    }),
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
