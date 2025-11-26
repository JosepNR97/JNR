import React from 'react';
import { PROFILE } from '../constants';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-6 bg-slate-950 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-slate-500 text-xs">
          © {currentYear} {PROFILE.name}. {t.contact.rights}
        </p>
      </div>
    </footer>
  );
};