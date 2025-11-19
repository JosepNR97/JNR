import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getServiceIcon } from './Icons';

export const Services: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="services" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            {t.services.title}
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            {t.services.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {t.services.items.map((service) => (
            <div 
              key={service.id}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group border border-slate-100 hover:border-brand-200 hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 mb-6 group-hover:bg-brand-600 group-hover:text-white transition-colors duration-300">
                {getServiceIcon(service.iconName, "w-7 h-7")}
              </div>
              <h3 className="font-semibold text-xl text-slate-900 mb-3">
                {service.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
