import { useEffect, useRef, useState } from 'react';
import type { Language } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { CloseIcon, MenuIcon } from './Icons';

const LANGUAGES: Array<{ code: Language; label: string }> = [
  { code: 'ca', label: 'Català' },
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'English' },
];

const MENU_LABELS: Record<
  Language,
  { open: string; close: string; navigation: string }
> = {
  ca: {
    open: 'Obrir menú',
    close: 'Tancar menú',
    navigation: 'Navegació principal',
  },
  es: {
    open: 'Abrir menú',
    close: 'Cerrar menú',
    navigation: 'Navegación principal',
  },
  en: {
    open: 'Open menu',
    close: 'Close menu',
    navigation: 'Main navigation',
  },
};

interface LanguageSelectorProps {
  language: Language;
  onChange: (language: Language) => void;
  mobile?: boolean;
  inactiveClassName: string;
}

const LanguageSelector = ({
  language,
  onChange,
  mobile = false,
  inactiveClassName,
}: LanguageSelectorProps) => (
  <div
    className={
      mobile
        ? 'flex items-center gap-3'
        : 'flex items-center gap-1 border-l border-current/20 pl-4'
    }
    aria-label="Language"
    role="group"
  >
    {LANGUAGES.map(({ code, label }) => (
      <button
        key={code}
        type="button"
        lang={code}
        aria-label={label}
        aria-pressed={language === code}
        onClick={() => onChange(code)}
        className={`min-h-10 min-w-10 px-2 text-xs font-bold transition-colors ${
          language === code
            ? mobile
              ? 'text-brand-300'
              : 'text-brand-500'
            : inactiveClassName
        }`}
      >
        {code.toUpperCase()}
      </button>
    ))}
  </div>
);

export const Header = () => {
  const { language, setLanguage, t } = useLanguage();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const progressBarRef = useRef<HTMLDivElement>(null);
  const isScrolledRef = useRef(false);

  const labels = MENU_LABELS[language];

  useEffect(() => {
    let animationFrame = 0;

    const updateScrollState = () => {
      animationFrame = 0;

      const documentElement = document.documentElement;

      const scrollTop = Math.max(
        0,
        window.scrollY || documentElement.scrollTop,
      );

      const scrollableHeight = Math.max(
        0,
        documentElement.scrollHeight - documentElement.clientHeight,
      );

      const progress =
        scrollableHeight > 0 ? scrollTop / scrollableHeight : 0;

      const clampedProgress = Math.max(0, Math.min(1, progress));

      const nextIsScrolled = scrollTop > 50;

      if (nextIsScrolled !== isScrolledRef.current) {
        isScrolledRef.current = nextIsScrolled;
        setIsScrolled(nextIsScrolled);
      }

      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${clampedProgress})`;
      }
    };

    const scheduleScrollUpdate = () => {
      if (animationFrame) return;

      animationFrame = window.requestAnimationFrame(updateScrollState);
    };

    scheduleScrollUpdate();

    window.addEventListener('scroll', scheduleScrollUpdate, {
      passive: true,
    });

    window.addEventListener('resize', scheduleScrollUpdate, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', scheduleScrollUpdate);
      window.removeEventListener('resize', scheduleScrollUpdate);

      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: t.nav.home, href: '#top' },
    { name: t.nav.about, href: '#about' },
    { name: t.nav.services, href: '#services' },
    { name: t.nav.experience, href: '#experience' },
    { name: t.nav.education, href: '#education' },
  ];

  const scrolledHeader = isScrolled && !mobileMenuOpen;

  const navLinkClass = scrolledHeader
    ? 'text-slate-600'
    : 'text-slate-200';

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          scrolledHeader
            ? 'bg-white/95 py-3 shadow-xs backdrop-blur-md'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a
            href="#top"
            onClick={() => setMobileMenuOpen(false)}
            className={`font-serif text-2xl font-bold transition-colors ${
              scrolledHeader ? 'text-brand-900' : 'text-white'
            }`}
            aria-label={`${t.nav.home} - JNR`}
          >
            JNR<span className="text-brand-500">.</span>
          </a>

          <nav
            className="hidden items-center gap-7 lg:flex"
            aria-label={labels.navigation}
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-brand-500 ${navLinkClass}`}
              >
                {link.name}
              </a>
            ))}

            <LanguageSelector
              language={language}
              onChange={setLanguage}
              inactiveClassName={navLinkClass}
            />

            <a
              href="#contact"
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                scrolledHeader
                  ? 'bg-brand-900 text-white hover:bg-brand-800'
                  : 'bg-white text-brand-900 hover:bg-slate-100'
              }`}
            >
              {t.nav.contact}
            </a>
          </nav>

          <button
            type="button"
            className="grid h-11 w-11 place-items-center lg:hidden"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? labels.close : labels.open}
            aria-controls="mobile-navigation"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <CloseIcon className="h-7 w-7 text-white" />
            ) : (
              <MenuIcon
                className={`h-6 w-6 ${
                  isScrolled ? 'text-slate-900' : 'text-white'
                }`}
              />
            )}
          </button>
        </div>

        <div
          ref={progressBarRef}
          className="pointer-events-none absolute bottom-0 left-0 h-[3px] w-full origin-left bg-brand-500 shadow-[0_0_6px_rgba(14,165,233,0.45)] will-change-transform"
          style={{ transform: 'scaleX(0)' }}
          aria-hidden="true"
        />
      </header>

      <div
        id="mobile-navigation"
        aria-hidden={!mobileMenuOpen}
        className={`fixed inset-0 z-40 flex items-center justify-center bg-brand-950 transition-all duration-300 lg:hidden ${
          mobileMenuOpen
            ? 'visible translate-x-0 opacity-100'
            : 'invisible translate-x-full opacity-0'
        }`}
      >
        <nav
          className="flex w-full flex-col items-center gap-6 px-6 text-center"
          aria-label={labels.navigation}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="font-serif text-2xl text-white transition-colors hover:text-brand-300"
            >
              {link.name}
            </a>
          ))}

          <LanguageSelector
            language={language}
            onChange={setLanguage}
            mobile
            inactiveClassName="text-white/60"
          />

          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-2 rounded-full border-2 border-white px-8 py-3 text-lg font-medium text-white transition-colors hover:bg-white hover:text-brand-900"
          >
            {t.nav.contact}
          </a>
        </nav>
      </div>
    </>
  );
};
