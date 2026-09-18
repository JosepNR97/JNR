import { useCallback, useLayoutEffect, useState } from 'react';
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

const restoreHashPositionAfterMount = () => {
  const rawHash = window.location.hash.slice(1);

  if (!rawHash) {
    return;
  }

  let targetId = rawHash;

  try {
    targetId = decodeURIComponent(rawHash);
  } catch {
    // Keep the raw hash if it is not valid percent-encoded text.
  }

  const target = document.getElementById(targetId);

  if (!target) {
    return;
  }

  /*
   * Localized pages are separate HTML documents whose section elements only
   * exist after React mounts. Explicitly restore the hash target now that the
   * DOM exists instead of relying on the browser's initial hash navigation.
   *
   * Temporarily disable smooth scrolling so the correct position is applied
   * before the browser paints the mounted application.
   */
  const documentElement = document.documentElement;
  const previousScrollBehavior = documentElement.style.scrollBehavior;

  documentElement.style.scrollBehavior = 'auto';

  target.scrollIntoView({
    block: 'start',
    behavior: 'auto',
  });

  documentElement.style.scrollBehavior = previousScrollBehavior;
};

const Portfolio = () => {
  const { t } = useLanguage();
  const [expandedVendorId, setExpandedVendorId] = useState<string | null>(null);

  useLayoutEffect(() => {
    restoreHashPositionAfterMount();
  }, []);

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

        <div id="certifications" className="scroll-mt-20">
          <Certifications onSelectVendor={handleCertificationSelect} />
        </div>

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
