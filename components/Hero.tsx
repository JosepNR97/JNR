import React, { useEffect, useState } from 'react';
import { UNIVERSAL_DATA } from '../constants';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRightIcon } from './Icons';

export const Hero: React.FC = () => {
  const { t } = useLanguage();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToPortfolio = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById('about');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div 
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[120px] transition-transform duration-100 ease-out"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        ></div>
        <div 
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600 rounded-full blur-[120px] transition-transform duration-100 ease-out"
          style={{ transform: `translateY(${scrollY * 0.2}px)` }}
        ></div>
      </div>
      
      <div 
        className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none"
        style={{ transform: `translateY(${scrollY * 0.1}px)` }}
      ></div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold tracking-wider uppercase mb-6 backdrop-blur-sm shadow-sm">
          {t.hero.badge}
        </span>
        
        <h1 className="font-serif text-5xl md:text-7xl font-bold text-white leading-tight mb-6 drop-shadow-lg">
          {UNIVERSAL_DATA.name}
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-200 font-light mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
          {t.hero.title}
        </p>

        <p className="text-lg text-slate-300 mb-12 max-w-xl mx-auto leading-relaxed">
          {t.hero.tagline}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a 
            href={UNIVERSAL_DATA.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-brand-600 text-white rounded-full font-medium hover:bg-brand-500 transition-all shadow-lg hover:shadow-brand-500/30 flex items-center gap-2 group"
          >
            {t.hero.connect}
            <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a 
            href="#about"
            onClick={handleScrollToPortfolio}
            className="px-8 py-4 bg-transparent border border-white/30 text-white rounded-full font-medium hover:bg-white/10 hover:border-white transition-all cursor-pointer backdrop-blur-sm"
          >
            {t.hero.portfolio}
          </a>
        </div>
      </div>
    </section>
  );
};
