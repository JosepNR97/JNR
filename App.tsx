import React from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Certifications } from './components/Certifications';
import { Services } from './components/Services';
import { Education } from './components/Education';
// import { Testimonials } from './components/Testimonials';
import { Experience } from './components/Experience';
import { Contact } from './components/Contact';

function App() {
  return (
    <LanguageProvider>
      <div className="relative min-h-screen bg-slate-50">
        <Header />
        <main>
          <Hero />
          <About />
          <Certifications />
          <Services />
          <Experience />
          <Education />
          {/* <Testimonials /> */}
          <Contact />
        </main>
      </div>
    </LanguageProvider>
  );
}

export default App;
