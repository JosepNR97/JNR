
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { EducationIcon, ChevronDownIcon, ExternalLinkIcon } from './Icons';

export const Education: React.FC = () => {
  const { t } = useLanguage();
  const [expandedVendorId, setExpandedVendorId] = useState<string | null>(null);

  const toggleVendor = (id: string) => {
    setExpandedVendorId(expandedVendorId === id ? null : id);
  };

  useEffect(() => {
    const handleOpenVendorCard = (event: CustomEvent) => {
      const vendorId = event.detail;
      setExpandedVendorId(vendorId);
      
      // Allow DOM to update before scrolling
      setTimeout(() => {
        const element = document.getElementById(`education-card-${vendorId}`);
        if (element) {
          const headerOffset = 100; // Adjust for fixed header
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }
      }, 100);
    };

    window.addEventListener('open-vendor-card', handleOpenVendorCard as EventListener);
    return () => {
      window.removeEventListener('open-vendor-card', handleOpenVendorCard as EventListener);
    };
  }, []);

  return (
    <section id="education" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-brand-600 font-semibold tracking-wider uppercase text-sm">
            {t.education.badge}
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4">
            {t.education.title}
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            {t.education.subtitle}
          </p>
        </div>

        {/* Academic Section */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px bg-slate-200 flex-1"></div>
            <h3 className="text-xl font-bold text-slate-800 uppercase tracking-wide">
              {t.education.academicTitle}
            </h3>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>

          <div className="max-w-5xl mx-auto space-y-6">
            {t.education.academic.map((item) => (
              <div key={item.id} className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  
                  {/* Left Column: Logo + Degree + Institution */}
                  <div className="flex flex-col sm:flex-row items-center sm:items-center gap-6 text-center sm:text-left flex-1">
                    <div className="w-24 h-24 shrink-0 rounded-xl bg-white p-2 border border-slate-100 flex items-center justify-center shadow-sm">
                      {item.logoUrl ? (
                         <img 
                            src={item.logoUrl} 
                            alt={item.institution} 
                            className="w-full h-full object-contain"
                          />
                      ) : (
                         <EducationIcon className="w-8 h-8 text-brand-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-xl text-slate-900 leading-tight mb-2">
                        {item.degree}
                      </h4>
                      <p className="text-brand-700 font-bold text-base uppercase tracking-wide">
                        {item.institution}
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Date + Description */}
                  <div className="flex flex-col items-center sm:items-end text-center sm:text-right shrink-0 md:max-w-xs border-t md:border-t-0 border-slate-200 pt-4 md:pt-0 w-full md:w-auto">
                    <span className="inline-block px-4 py-1.5 bg-slate-200 text-slate-700 text-xs font-bold rounded-full mb-2">
                      {item.year}
                    </span>
                    {item.description && (
                        <p className="text-sm text-slate-500 italic">
                            {item.description}
                        </p>
                    )}
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Professional Certifications Section */}
        <div>
           <div className="flex items-center gap-4 mb-8">
            <div className="h-px bg-slate-200 flex-1"></div>
            <h3 className="text-xl font-bold text-slate-800 uppercase tracking-wide">
              {t.education.professionalTitle}
            </h3>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            {t.education.professional.map((vendor) => {
              const isExpanded = expandedVendorId === vendor.id;
              
              return (
                <div 
                  id={`education-card-${vendor.id}`}
                  key={vendor.id}
                  className={`bg-white rounded-xl border transition-all duration-300 overflow-hidden group ${
                    isExpanded 
                      ? 'border-brand-500 shadow-lg ring-1 ring-brand-200' 
                      : 'border-slate-200 hover:border-brand-300 hover:shadow-md'
                  }`}
                >
                  {/* Vendor Header (Clickable) */}
                  <div 
                    onClick={() => toggleVendor(vendor.id)}
                    className="p-6 cursor-pointer flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4 sm:gap-6 flex-1">
                      {/* Vendor Logo */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-white rounded-lg p-2 border border-slate-100 flex items-center justify-center">
                        <img 
                          src={vendor.logoUrl} 
                          alt={vendor.name} 
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      
                      {/* Vendor Info */}
                      <div>
                        <h4 className="text-lg sm:text-xl font-bold text-slate-900">
                          {vendor.name}
                        </h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {vendor.tags.map((tag, idx) => (
                            <span 
                              key={idx}
                              className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Expand Icon */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ${
                      isExpanded ? 'bg-brand-100 text-brand-600 rotate-180' : 'bg-slate-100 text-slate-400 group-hover:bg-brand-600 group-hover:text-white'
                    }`}>
                      <ChevronDownIcon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Certifications Grid (Expandable) */}
                  <div 
                    className={`grid transition-[grid-template-rows] duration-500 ease-in-out bg-slate-50/50 ${
                      isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="p-6 pt-0 border-t border-slate-100">
                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {vendor.certifications.map((cert, idx) => (
                            <div 
                              key={idx}
                              className="bg-white p-4 rounded-xl border border-slate-200 flex items-start gap-4 hover:border-brand-200 transition-colors"
                            >
                              {/* Certification Badge */}
                              <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-white border border-slate-100">
                                <img 
                                  src={cert.image} 
                                  alt={cert.name} 
                                  className="w-full h-full object-contain p-1"
                                />
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <h5 className="font-bold text-slate-900 text-sm leading-tight mb-1 truncate whitespace-normal">
                                  {cert.name}
                                </h5>
                                <p className="text-xs text-slate-500 mb-3">
                                  {cert.date}
                                </p>
                                
                                {cert.credentialUrl && cert.credentialUrl !== '#' && (
                                  <a 
                                    href={cert.credentialUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 hover:underline"
                                  >
                                    {t.education.viewCredential}
                                    <ExternalLinkIcon className="w-3 h-3" />
                                  </a>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
