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
import { LanguageProvider } from './context/LanguageContext';
import { scrollToElementAfterLayout } from './scrollToElement';

const Portfolio = () => {
  const [expandedVendorId, setExpandedVendorId] = useState<string | null>(null);

  const handleVendorToggle = useCallback((vendorId: string) => {
    const shouldExpand = expandedVendorId !== vendorId;
    setExpandedVendorId(shouldExpand ? vendorId : null);
    if (shouldExpand) scrollToElementAfterLayout(`education-card-${vendorId}`);
  }, [expandedVendorId]);

  const handleCertificationSelect = useCallback((vendorId: string) => {
    setExpandedVendorId(vendorId);
    scrollToElementAfterLayout(`education-card-${vendorId}`);
  }, []);

  return (
    <div className="relative min-h-screen bg-slate-50">
      <Header />
      <main>
        <Hero />
        <About />
        <Certifications onSelectVendor={handleCertificationSelect} />
        <Services />
        <Experience />
        <Education expandedVendorId={expandedVendorId} onVendorToggle={handleVendorToggle} />
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
