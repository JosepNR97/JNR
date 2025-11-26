
import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ChevronDownIcon, BriefcaseIcon } from './Icons';

export const Experience: React.FC = () => {
  const { t } = useLanguage();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section id="experience" className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            {t.experience.title}
          </h2>
          <p className="text-slate-500 text-sm">
            {t.experience.subtitle}
          </p>
        </div>

        <div className="relative">
          {/* Vertical Line - Adjusted positioning for mobile */}
          <div className="absolute left-4 md:left-0 top-2 bottom-0 w-0.5 bg-slate-200 md:ml-4"></div>

          <div className="space-y-8 md:space-y-12">
            {t.experience.items.map((item) => {
              const isExpanded = expandedId === item.id;
              
              return (
                <div key={item.id} className="relative pl-12 md:pl-24"> {/* Reduced padding-left from pl-20 to pl-12 for mobile */}
                  
                  {/* Timeline Dot - Adjusted left position from left-6 to left-4 */}
                  <div className={`absolute left-4 md:left-0 md:ml-4 -translate-x-1/2 top-0 flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shadow z-10 transition-colors duration-300 ${isExpanded ? 'bg-brand-600' : 'bg-slate-300 group-hover:bg-brand-400'}`}>
                    <BriefcaseIcon className={`w-4 h-4 ${isExpanded ? 'text-white' : 'text-slate-600'}`} />
                  </div>
                  
                  <div 
                    onClick={() => toggleExpand(item.id)}
                    className={`w-full bg-white rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden group
                      ${isExpanded 
                        ? 'border-brand-500 shadow-lg ring-1 ring-brand-200' 
                        : 'border-slate-200 hover:border-brand-300 hover:shadow-lg hover:-translate-y-1'
                      }`}
                  >
                    <div className="p-6 md:p-8">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-2">
                         <div className="flex-1">
                            <h3 className={`font-bold text-xl md:text-2xl transition-colors duration-300 ${isExpanded ? 'text-brand-700' : 'text-slate-900 group-hover:text-brand-700'}`}>
                              {item.role}
                            </h3>
                            <div className="text-lg font-medium text-slate-600 mt-1">{item.company}</div>
                         </div>

                         <div className="flex flex-row-reverse md:flex-col items-center md:items-end justify-between md:justify-start gap-3 md:gap-2 shrink-0">
                            <img 
                              src={item.logoUrl} 
                              alt={`Logo ${item.company}`} 
                              className="h-8 object-contain"
                            />
                             {/* Removed whitespace-nowrap to prevent clipping on small mobile screens */}
                             <span className="text-xs font-bold tracking-wide text-brand-700 bg-brand-50 border border-brand-100 px-3 py-1 rounded-full text-center">
                              {item.period}
                            </span>
                         </div>
                      </div>

                       <p className="text-slate-600 text-sm md:text-base mt-4 leading-relaxed max-w-3xl">
                        {item.description}
                      </p>

                      <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100 group-hover:border-brand-100 transition-colors">
                        <span className={`text-sm font-semibold transition-colors ${isExpanded ? 'text-brand-600' : 'text-slate-400 group-hover:text-brand-600'}`}>
                          {isExpanded ? t.experience.collapse : t.experience.expand}
                        </span>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isExpanded ? 'bg-brand-100 text-brand-600 rotate-180' : 'bg-slate-100 text-slate-400 group-hover:bg-brand-600 group-hover:text-white'}`}>
                          <ChevronDownIcon className="w-5 h-5" />
                        </div>
                      </div>
                    </div>

                    <div 
                      className={`grid transition-[grid-template-rows] duration-500 ease-in-out bg-slate-50 ${isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                    >
                      <div className="overflow-hidden">
                        <div className="px-6 md:px-8 pb-8 pt-2 border-t border-slate-200">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 mt-4">{t.experience.detailTitle}</h4>
                          <ul className="space-y-6">
                            {item.achievements.map((achievement, i) => (
                                <li key={i} className="flex items-start text-sm text-slate-700 group/item relative pl-4 border-l-2 border-slate-200 hover:border-brand-500 transition-colors duration-300">
                                  <div className="flex flex-col gap-1 w-full">
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                        {achievement.year && (
                                            <span className="font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded text-xs">
                                              {achievement.year}
                                            </span>
                                        )}
                                        {achievement.sector && (
                                          <span className="text-brand-600 font-bold uppercase tracking-wide text-[11px]">
                                            {achievement.sector}
                                          </span>
                                        )}
                                    </div>
                                    
                                    {achievement.title ? (
                                      <strong className="block text-slate-900 text-base font-bold leading-snug">
                                        {achievement.title}
                                      </strong>
                                    ) : null}
                                    
                                    <span className="text-slate-600 leading-relaxed text-sm md:text-base mt-1">
                                      {achievement.description}
                                    </span>
                                  </div>
                                </li>
                            ))}
                          </ul>
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