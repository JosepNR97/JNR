import React from 'react';
import { PROFILE } from '../constants';
import { useLanguage } from '../context/LanguageContext';
import { LinkedinIcon, MailIcon, LocationIcon } from './Icons';

export const Contact: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="contact" className="py-12 bg-slate-900 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Header Compacto */}
        <h2 className="font-serif text-2xl md:text-3xl font-bold mb-3">
          {t.contact.title}
        </h2>
        <p className="text-slate-400 text-sm md:text-base mb-8 max-w-xl mx-auto leading-relaxed">
          {t.contact.subtitle}
        </p>
        
        {/* Contact Info List Compacto */}
        <div className="flex flex-col items-start gap-4 max-w-fit mx-auto">
          
          <a 
            href={`mailto:${PROFILE.email}`} 
            className="flex items-center gap-4 text-slate-300 hover:text-white transition-all group text-left"
          >
            <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-brand-400 group-hover:bg-brand-600 group-hover:text-white transition-colors shrink-0 border border-slate-700">
              <MailIcon className="w-4 h-4" />
            </div>
            <span className="text-base sm:text-lg font-light tracking-wide">{PROFILE.email}</span>
          </a>
          
          <a 
            href={PROFILE.linkedin}
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-4 text-slate-300 hover:text-white transition-all group text-left"
          >
            <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-brand-400 group-hover:bg-brand-600 group-hover:text-white transition-colors shrink-0 border border-slate-700">
              <LinkedinIcon className="w-4 h-4" />
            </div>
            <span className="text-base sm:text-lg font-light tracking-wide">linkedin.com/in/josep-nunez-riba</span>
          </a>

          <div className="flex items-center gap-4 text-slate-300 text-left">
             <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-brand-400 shrink-0 border border-slate-700">
                <LocationIcon className="w-4 h-4" />
             </div>
             <span className="text-base sm:text-lg font-light tracking-wide">{t.contact.location}</span>
          </div>

        </div>

      </div>
    </section>
  );
};