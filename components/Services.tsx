import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import { getServiceIcon } from './Icons';
import { Reveal } from './Reveal';

export const Services: React.FC = () => {
  const { t } = useLanguage();
  const { ref: servicesGridRef, isVisible: servicesVisible } =
    useRevealOnScroll<HTMLDivElement>();

  return (
    <section id="services" className="scroll-mt-20 bg-slate-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            {t.services.title}
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            {t.services.subtitle}
          </p>
        </Reveal>

        <div
          ref={servicesGridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {t.services.items.map((service, index) => (
            <div
              key={service.id}
              className={`reveal h-full ${servicesVisible ? 'is-visible' : ''}`}
              style={{ transitionDelay: `${Math.min(index * 80, 320)}ms` }}
            >
              <div className="group h-full rounded-lg border border-slate-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-lg bg-brand-50 text-brand-600 transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white">
                  {getServiceIcon(service.iconName, 'w-7 h-7')}
                </div>
                <h3 className="font-semibold text-xl text-slate-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
