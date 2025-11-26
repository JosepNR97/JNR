import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { QuoteIcon } from './Icons';

export const Testimonials: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="testimonials" className="py-20 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            {t.testimonials.title}
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            {t.testimonials.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {t.testimonials.items.map((item) => (
            <div key={item.id} className="bg-slate-800 p-8 rounded-2xl relative border border-slate-700 hover:border-brand-500 transition-colors duration-300">
              <QuoteIcon className="w-10 h-10 text-brand-500 mb-6 opacity-50" />
              <p className="text-slate-300 italic mb-6 text-lg leading-relaxed">
                "{item.quote}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-brand-900 rounded-full flex items-center justify-center font-bold text-brand-400 border border-brand-700">
                  {item.author.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-white">{item.author}</div>
                  <div className="text-xs text-brand-400 uppercase tracking-wide">{item.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};