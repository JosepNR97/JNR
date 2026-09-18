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

const persistLanguage = (language: Language): void => {
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // The explicit URL remains authoritative if storage is unavailable.
  }
};

const getLanguageNavigationHash = (): string => {
  const currentHash = window.location.hash;
  const currentHashId = currentHash.startsWith('#')
    ? currentHash.slice(1)
    : currentHash;

  /*
   * Preserve hashes that do not represent one of the portfolio's main
   * sections. They may point to a more specific deep link that should not
   * be replaced by the section-level navigation logic.
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
   * At the very bottom of the document, a short final section may never
   * reach the normal reading line because there is not enough content below
   * it. In that case the last portfolio section is the intended context.
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

  /*
   * Use a stable reading line below the fixed header instead of copying a
   * raw scrollY value. This keeps the same semantic section across
   * translations even when their content heights differ.
   */
  const referenceY = Math.max(
    96,
    Math.min(window.innerHeight * 0.25, 240),
  );

  let currentSection = sections.find((section) => {
    const rect = section.getBoundingClientRect();

    return rect.top <= referenceY && rect.bottom > referenceY;
  });

  /*
   * A layout gap should not prevent context preservation. If the reading
   * line happens to sit between sections, use the section whose top edge is
   * closest to it.
   */
  if (!currentSection) {
    currentSection = sections.reduce((nearestSection, section) => {
      const nearestDistance = Math.abs(
        nearestSection.getBoundingClientRect().top - referenceY,
      );

      const sectionDistance = Math.abs(
        section.getBoundingClientRect().top - referenceY,
      );

      return sectionDistance < nearestDistance
        ? section
        : nearestSection;
    });
  }

  return currentSection.id === 'top'
    ? ''
    : `#${currentSection.id}`;
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
         * document. The destination URL remains authoritative.
         */
        persistLanguage(nextLanguage);

        /*
         * Preserve the user's semantic position in the portfolio instead of
         * copying a raw pixel offset between translations.
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
