
import React, { useState, useEffect } from 'react';
import { MenuIcon, CloseIcon } from './Icons';
import { useLanguage } from '../context/LanguageContext';

export const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    if (targetId === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.querySelector(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: t.nav.home, href: '#' },
    { name: t.nav.about, href: '#about' },
    { name: t.nav.services, href: '#services' },
    { name: t.nav.experience, href: '#experience' },
    { name: t.nav.education, href: '#education' },
    // Testimonials removed as requested
  ];

  const headerBgClass = mobileMenuOpen 
    ? 'bg-transparent' 
    : isScrolled 
      ? 'bg-white/90 backdrop-blur-md shadow-sm' 
      : 'bg-transparent';

  const headerTextColorClass = mobileMenuOpen 
    ? 'text-white' 
    : isScrolled 
      ? 'text-brand-900' 
      : 'text-white';
      
  const navLinkColorClass = isScrolled ? 'text-slate-600' : 'text-slate-200';
  const hamburgerColorClass = mobileMenuOpen ? 'text-white' : (isScrolled ? 'text-slate-900' : 'text-white');

  return (
    <>
      <header 
        className={`fixed top-0 w-full transition-all duration-300 z-[50] ${headerBgClass} ${isScrolled ? 'py-3' : 'py-6'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <a 
            href="#"
            onClick={(e) => handleNavClick(e, '#')}
            className={`font-serif font-bold text-2xl tracking-tight transition-colors duration-300 cursor-pointer ${headerTextColorClass}`}
          >
            JNR<span className="text-brand-500">.</span>
          </a>

          <nav className="hidden lg:flex gap-8 items-center">
            {navLinks.map((link) => (
              <a 
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`text-sm font-medium hover:text-brand-500 transition-colors cursor-pointer ${navLinkColorClass}`}
              >
                {link.name}
              </a>
            ))}
            
            {/* Language Selector Desktop */}
            <div className="flex items-center gap-2 ml-2 border-l border-white/20 pl-4">
               <button onClick={() => setLanguage('ca')} className={`text-xs font-bold ${language === 'ca' ? 'text-brand-500' : navLinkColorClass}`}>CA</button>
               <span className="text-slate-400 text-xs">|</span>
               <button onClick={() => setLanguage('es')} className={`text-xs font-bold ${language === 'es' ? 'text-brand-500' : navLinkColorClass}`}>ES</button>
               <span className="text-slate-400 text-xs">|</span>
               <button onClick={() => setLanguage('en')} className={`text-xs font-bold ${language === 'en' ? 'text-brand-500' : navLinkColorClass}`}>EN</button>
            </div>

            <a 
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                isScrolled 
                  ? 'bg-brand-900 text-white hover:bg-brand-800' 
                  : 'bg-white text-brand-900 hover:bg-slate-100'
              }`}
            >
              {t.nav.contact}
            </a>
          </nav>

          <button 
            className="lg:hidden p-2 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {mobileMenuOpen ? (
               <CloseIcon className="w-8 h-8 text-white" />
            ) : (
               <MenuIcon className={`w-6 h-6 ${hamburgerColorClass}`} />
            )}
          </button>
        </div>
      </header>

      <div 
        className={`fixed inset-0 bg-brand-900 z-[40] transition-transform duration-300 flex flex-col justify-center items-center ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <nav className="flex flex-col gap-8 text-center items-center w-full px-6">
          {navLinks.map((link) => (
            <a 
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-2xl font-serif text-white hover:text-brand-400 transition-colors cursor-pointer"
            >
              {link.name}
            </a>
          ))}

           {/* Language Selector Mobile */}
           <div className="flex items-center gap-6 my-4">
               <button onClick={() => setLanguage('ca')} className={`text-lg font-bold ${language === 'ca' ? 'text-brand-400' : 'text-white/60'}`}>CA</button>
               <button onClick={() => setLanguage('es')} className={`text-lg font-bold ${language === 'es' ? 'text-brand-400' : 'text-white/60'}`}>ES</button>
               <button onClick={() => setLanguage('en')} className={`text-lg font-bold ${language === 'en' ? 'text-brand-400' : 'text-white/60'}`}>EN</button>
            </div>

          <a 
            href="#contact"
            onClick={(e) => handleNavClick(e, '#contact')}
            className="mt-4 px-8 py-3 rounded-full border-2 border-white text-white font-medium text-lg hover:bg-white hover:text-brand-900 transition-all cursor-pointer"
          >
            {t.nav.contact}
          </a>
        </nav>
      </div>
    </>
  );
};