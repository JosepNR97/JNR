import { useCallback, useState } from 'react';
import { About } from './components/About';
import { Analytics } from './components/Analytics';
import { Certifications } from './components/Certifications';
import { Contact } from './components/Contact';
import { Education } from './components/Education';
import { Experience } from './components/Experience';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { scrollToElementAfterLayout } from './scrollToElement';

const Portfolio = () => {
  const { t } = useLanguage();
  const [expandedVendorId, setExpandedVendorId] = useState<string | null>(null);

  const handleVendorToggle = useCallback(
    (vendorId: string) => {
      const shouldExpand = expandedVendorId !== vendorId;
      setExpandedVendorId(shouldExpand ? vendorId : null);
      if (shouldExpand) {
        scrollToElementAfterLayout(`education-card-${vendorId}`);
      }
    },
    [expandedVendorId],
  );

  const handleCertificationSelect = useCallback((vendorId: string) => {
    setExpandedVendorId(vendorId);
    scrollToElementAfterLayout(`education-card-${vendorId}`);
  }, []);

  const handleSkipToContent = useCallback(() => {
    document.getElementById('main-content')?.focus();
  }, []);

  return (
    <div className="relative min-h-screen bg-slate-50">
      <a
        href="#main-content"
        onClick={handleSkipToContent}
        className="fixed left-4 top-4 z-[60] -translate-y-[calc(100%+2rem)] rounded-md bg-brand-950 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-transform duration-150 focus-visible:translate-y-0 motion-reduce:transition-none"
      >
        {t.accessibility.skipToContent}
      </a>

      <Header />

      <main id="main-content" tabIndex={-1}>
        <Hero />
        <About />
        <Certifications onSelectVendor={handleCertificationSelect} />
        <Services />
        <Experience />
        <Education
          expandedVendorId={expandedVendorId}
          onVendorToggle={handleVendorToggle}
        />
        <Contact />
      </main>

      <Footer />
      <Analytics />
    </div>
  );
};

const App = () => (
  <LanguageProvider>
    <Portfolio />
  </LanguageProvider>
);

export default App;
