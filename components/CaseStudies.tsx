import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ChartIcon, ArrowRightIcon } from './Icons';

export const CaseStudies: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="work" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-brand-600 font-semibold tracking-wider uppercase text-sm">{t.caseStudies.badge}</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4">
            {t.caseStudies.title}
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            {t.caseStudies.subtitle}
          </p>
        </div>

        <div className="space-y-12">
          {t.caseStudies.items.map((study) => (
            <div 
              key={study.id} 
              className="flex flex-col lg:flex-row gap-8 bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-brand-600 mb-4">
                  <ChartIcon className="w-5 h-5" />
                  <span className="font-semibold text-sm uppercase tracking-wide">{t.caseStudies.badge}</span>
                </div>
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                  {study.title}
                </h3>
                <p className="text-slate-500 text-sm mb-6 font-medium">
                  Client: {study.client}
                </p>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">{study.challengeTitle}</h4>
                    <p className="text-slate-600 leading-relaxed">{study.challenge}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">{study.approachTitle}</h4>
                    <p className="text-slate-600 leading-relaxed">{study.approach}</p>
                  </div>
                </div>
              </div>

              <div className="lg:w-1/3 bg-slate-900 p-8 lg:p-12 text-white flex flex-col justify-center">
                <h4 className="font-serif text-xl font-bold mb-6 border-b border-slate-700 pb-4">
                  {study.resultsTitle}
                </h4>
                <ul className="space-y-4">
                  {study.results.map((result, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-1.5 w-2 h-2 rounded-full bg-green-400 shrink-0 shadow-[0_0_10px_rgba(74,222,128,0.5)]"></div>
                      <span className="text-slate-300 font-light leading-relaxed">{result}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 pt-6 border-t border-slate-800">
                  <button className="text-white text-sm font-medium flex items-center gap-2 hover:text-brand-400 transition-colors group">
                    {study.cta}
                    <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};