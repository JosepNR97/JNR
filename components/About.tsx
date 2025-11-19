import React from 'react';
import { UNIVERSAL_DATA } from '../constants';
import { useLanguage } from '../context/LanguageContext';

export const About: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="relative group max-w-md mx-auto lg:mx-0 w-full">
            <div className="absolute -inset-4 bg-gradient-to-r from-brand-500 to-indigo-600 rounded-2xl opacity-30 blur-xl group-hover:opacity-50 transition-opacity"></div>
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-slate-200 shadow-2xl">
              <img 
                src={UNIVERSAL_DATA.profileImage}
                alt={UNIVERSAL_DATA.name} 
                className="w-full h-full object-cover object-top transform transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>

          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              {t.about.title}
            </h2>
            <div className="space-y-6 text-slate-600 leading-relaxed">
              <p className="text-lg font-medium text-slate-800">
                {t.about.p1}
              </p>
              <p>
                {t.about.p2}
              </p>
              <p>
                {t.about.p3}
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-6">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-brand-200 transition-colors">
                <h4 className="font-bold text-3xl text-brand-600 mb-1">{t.about.years}</h4>
                <p className="text-sm text-slate-500">{t.about.yearsLabel}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-brand-200 transition-colors">
                <h4 className="font-bold text-3xl text-brand-600 mb-1">{t.about.projects}</h4>
                <p className="text-sm text-slate-500">{t.about.projectsLabel}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
