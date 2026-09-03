import { useEffect, useRef, useState } from 'react';
import { PROFILE_DATA } from '../aboutMe';
import { CV_FILENAMES, CV_FILES } from '../cvConfig';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRightIcon, ChevronDownIcon, DownloadIcon } from './Icons';

export const Hero = () => {
  const { language, t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const primaryBlobRef = useRef<HTMLDivElement>(null);
  const secondaryBlobRef = useRef<HTMLDivElement>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(() =>
      setHasMounted(true),
    );
    return () => window.cancelAnimationFrame(animationFrame);
  }, []);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return undefined;

    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (!hasFinePointer || prefersReducedMotion) return undefined;

    const section = sectionRef.current;
    const primaryBlob = primaryBlobRef.current;
    const secondaryBlob = secondaryBlobRef.current;
    if (!section || !primaryBlob || !secondaryBlob) return undefined;

    let animationFrame = 0;
    let offsetX = 0;
    let offsetY = 0;

    const renderParallax = () => {
      primaryBlob.style.transform = `translate3d(${offsetX * 22}px, ${offsetY * 22}px, 0)`;
      secondaryBlob.style.transform = `translate3d(${offsetX * -16}px, ${offsetY * -16}px, 0)`;
      animationFrame = 0;
    };

    const scheduleParallax = () => {
      if (!animationFrame)
        animationFrame = window.requestAnimationFrame(renderParallax);
    };

    const handleMouseMove = (event: MouseEvent) => {
      const bounds = section.getBoundingClientRect();
      offsetX = Math.max(
        -1,
        Math.min(1, ((event.clientX - bounds.left) / bounds.width) * 2 - 1),
      );
      offsetY = Math.max(
        -1,
        Math.min(1, ((event.clientY - bounds.top) / bounds.height) * 2 - 1),
      );
      scheduleParallax();
    };

    const handleMouseLeave = () => {
      offsetX = 0;
      offsetY = 0;
      scheduleParallax();
    };

    section.addEventListener('mousemove', handleMouseMove);
    section.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      section.removeEventListener('mousemove', handleMouseMove);
      section.removeEventListener('mouseleave', handleMouseLeave);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  const entranceClassName = `reveal ${hasMounted ? 'is-visible' : ''}`;

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative flex min-h-screen min-h-[100svh] scroll-mt-20 items-center justify-center overflow-hidden bg-slate-900"
    >
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden opacity-20"
        aria-hidden="true"
      >
        <div
          ref={primaryBlobRef}
          className="absolute -left-[10%] -top-[10%] h-1/2 w-1/2 rounded-full bg-blue-600 blur-[120px] will-change-transform"
        />
        <div
          ref={secondaryBlobRef}
          className="absolute -bottom-[10%] -right-[10%] h-1/2 w-1/2 rounded-full bg-indigo-600 blur-[120px] will-change-transform"
        />
      </div>
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-4xl px-4 pb-20 pt-16 text-center">
        <span
          className={`${entranceClassName} mb-6 inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white shadow-xs backdrop-blur-xs`}
          style={{ transitionDelay: '0ms' }}
        >
          {t.hero.badge}
        </span>

        <h1
          className={`${entranceClassName} mb-6 font-serif text-5xl font-bold leading-tight text-white drop-shadow-lg md:text-7xl`}
          style={{ transitionDelay: '80ms' }}
        >
          {PROFILE_DATA.name}
        </h1>

        <p
          className={`${entranceClassName} mx-auto mb-8 max-w-2xl text-xl font-light leading-relaxed text-slate-100 drop-shadow-md md:text-2xl`}
          style={{ transitionDelay: '160ms' }}
        >
          {t.hero.title}
        </p>

        <p
          className={`${entranceClassName} mx-auto mb-12 max-w-xl text-lg leading-relaxed text-slate-300`}
          style={{ transitionDelay: '240ms' }}
        >
          {t.hero.tagline}
        </p>

        <div
          className={`${entranceClassName} flex flex-col flex-wrap items-center justify-center gap-4 md:flex-row`}
          style={{ transitionDelay: '320ms' }}
        >
          <a
            href={PROFILE_DATA.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-brand-600 px-8 py-4 font-medium text-white shadow-lg transition-all hover:bg-brand-500 hover:shadow-brand-500/30"
          >
            {t.hero.connect}
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#about"
            className="inline-flex min-h-12 items-center rounded-full border border-white/30 bg-transparent px-8 py-4 font-medium text-white backdrop-blur-xs transition-all hover:border-white hover:bg-white/10"
          >
            {t.hero.portfolio}
          </a>
          <a
            href={CV_FILES[language]}
            download={CV_FILENAMES[language]}
            className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-8 py-4 font-medium text-brand-900 shadow-lg transition-all hover:bg-slate-100 hover:shadow-white/20"
          >
            {t.hero.downloadCv}
            <DownloadIcon className="h-4 w-4" />
          </a>
        </div>
      </div>

      <a
        href="#about"
        aria-label={t.hero.portfolio}
        className="absolute bottom-5 left-1/2 z-10 grid h-10 w-10 -translate-x-1/2 place-items-center text-white/60 transition-colors hover:text-white focus-visible:text-white"
      >
        <ChevronDownIcon className="h-6 w-6 animate-bounce" />
      </a>
    </section>
  );
};
