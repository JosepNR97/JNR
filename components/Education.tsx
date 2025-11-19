import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { EducationIcon, ArrowRightIcon } from './Icons';

export const Education: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="education" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-brand-600 font-semibold tracking-wider uppercase text-sm">{t.education.badge}</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4">
            {t.education.title}
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            {t.education.subtitle}
          </p>
        </div>

        <div className="space-y-12">
          {t.education.items.map((item) => (
            <div 
              key={item.id} 
              className="flex flex-col lg:flex-row gap-8 bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-brand-600 mb-4">
                  <EducationIcon className="w-5 h-5" />
                  <span className="font-semibold text-sm uppercase tracking-wide">{t.education.badge}</span>
                </div>
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-brand-700 font-bold text-base mb-4 uppercase tracking-wide">
                  {item.institution}
                </p>
                <p className="text-slate-600 leading-relaxed text-lg">
                  {item.description}
                </p>
              </div>

              <div className="lg:w-2/5 bg-slate-900 p-8 lg:p-12 text-white flex flex-col justify-center">
                <h4 className="font-serif text-xl font-bold mb-6 border-b border-slate-700 pb-4 text-brand-200">
                  {item.id === 'ed1' ? 'Certificacions' : 'Títols'}
                </h4>
                <ul className="space-y-4">
                  {item.items.map((detail, i) => (
                    <li key={i} className="flex items-start gap-3 group">
                      <div className="mt-1.5 w-2 h-2 rounded-full bg-brand-400 shrink-0 shadow-[0_0_10px_rgba(56,189,248,0.5)] group-hover:bg-white transition-colors"></div>
                      <span className="text-slate-300 font-light leading-relaxed group-hover:text-white transition-colors">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
