import React from 'react';
import { CAREER_START_YEAR } from '../constants';
import { PROFILE_DATA } from '../aboutMe';
import { useLanguage } from '../context/LanguageContext';
import { useCountUp } from '../hooks/useCountUp';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import { GlobeIcon } from './Icons';
import { Reveal } from './Reveal';

export const About: React.FC = () => {
  const { t } = useLanguage();

  // Cálculos automáticos
  const currentYear = new Date().getFullYear();
  const yearsExp = currentYear - CAREER_START_YEAR + 1;

  // Calcular proyectos reales sumando los logros listados en la experiencia
  const totalProjects =
    t.experience.items?.reduce((total, item) => {
      return total + (item.achievements ? item.achievements.length : 0);
    }, 0) || 0;
  const { ref: statisticsRef, isVisible: statisticsVisible } =
    useRevealOnScroll<HTMLDivElement>();
  const animatedYearsExp = useCountUp(yearsExp, statisticsVisible);
  const animatedTotalProjects = useCountUp(totalProjects, statisticsVisible);

  return (
    <section id="about" className="scroll-mt-20 bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <Reveal className="relative group max-w-md mx-auto lg:mx-0 w-full">
            <div
              className="absolute -inset-4 rounded-2xl bg-linear-to-r/srgb from-brand-500 to-indigo-600 opacity-30 blur-xl transition-opacity group-hover:opacity-50"
              aria-hidden="true"
            />
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-slate-200 shadow-2xl">
              <img
                src={PROFILE_DATA.image}
                alt={PROFILE_DATA.name}
                width="1132"
                height="877"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-top transform transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </Reveal>

          <Reveal>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              {t.about.title}
            </h2>
            <div className="space-y-6 text-slate-600 leading-relaxed">
              <p className="text-lg font-medium text-slate-800">{t.about.p1}</p>
              <p>{t.about.p2}</p>
              <p>{t.about.p3}</p>
            </div>

            {/* Languages Section - Added hover:border-brand-200 and transition-colors */}
            <div className="mt-8 flex items-center gap-3 text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-brand-200 transition-colors">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-brand-600 shadow-xs border border-slate-100 shrink-0">
                <GlobeIcon className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                  {t.about.languagesTitle}
                </span>
                <span className="font-medium text-sm md:text-base">
                  {t.about.languagesText}
                </span>
              </div>
            </div>

            <div ref={statisticsRef} className="mt-8 grid grid-cols-2 gap-6">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-brand-200 transition-colors">
                <h4 className="font-bold text-3xl text-brand-600 mb-1">
                  {animatedYearsExp}+
                </h4>
                <p className="text-sm text-slate-500">{t.about.yearsLabel}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-brand-200 transition-colors">
                <h4 className="font-bold text-3xl text-brand-600 mb-1">
                  {animatedTotalProjects}
                </h4>
                <p className="text-sm text-slate-500">
                  {t.about.projectsLabel}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
