import { PROFILE_DATA } from '../aboutMe';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRightIcon } from './Icons';

export const Hero = () => {
  const { t } = useLanguage();

  return (
    <section
      id="top"
      className="relative flex min-h-screen min-h-[100svh] scroll-mt-20 items-center justify-center overflow-hidden bg-slate-900"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-20" aria-hidden="true">
        <div className="absolute -left-[10%] -top-[10%] h-1/2 w-1/2 rounded-full bg-blue-600 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] h-1/2 w-1/2 rounded-full bg-indigo-600 blur-[120px]" />
      </div>
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-4xl px-4 pt-16 text-center">
        <span className="mb-6 inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white shadow-sm backdrop-blur-sm">
          {t.hero.badge}
        </span>

        <h1 className="mb-6 font-serif text-5xl font-bold leading-tight text-white drop-shadow-lg md:text-7xl">
          {PROFILE_DATA.name}
        </h1>

        <p className="mx-auto mb-8 max-w-2xl text-xl font-light leading-relaxed text-slate-100 drop-shadow-md md:text-2xl">
          {t.hero.title}
        </p>

        <p className="mx-auto mb-12 max-w-xl text-lg leading-relaxed text-slate-300">
          {t.hero.tagline}
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
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
            className="inline-flex min-h-12 items-center rounded-full border border-white/30 bg-transparent px-8 py-4 font-medium text-white backdrop-blur-sm transition-all hover:border-white hover:bg-white/10"
          >
            {t.hero.portfolio}
          </a>
        </div>
      </div>
    </section>
  );
};
