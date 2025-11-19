import React, { useState } from 'react';
import { EXPERIENCE } from '../constants';
import { ChevronDownIcon, BriefcaseIcon } from './Icons';

export const Experience: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Helper function to parse the achievement string
  const parseAchievement = (text: string) => {
    const firstColonIndex = text.indexOf(':');
    if (firstColonIndex === -1) return { description: text };

    const year = text.substring(0, firstColonIndex).trim();
    const remainder1 = text.substring(firstColonIndex + 1).trim();

    const hyphenIndex = remainder1.indexOf(' - ');
    if (hyphenIndex === -1) {
      return { year, description: remainder1 };
    }

    const sector = remainder1.substring(0, hyphenIndex).trim();
    const remainder2 = remainder1.substring(hyphenIndex + 3).trim();

    const secondColonIndex = remainder2.indexOf(':');
    if (secondColonIndex === -1) {
      return { year, sector, title: remainder2 };
    }

    const title = remainder2.substring(0, secondColonIndex).trim();
    const description = remainder2.substring(secondColonIndex + 1).trim();

    return { year, sector, title, description };
  };

  return (
    <section id="experience" className="py-20 bg-white">
      {/* Cambiado a max-w-6xl para aprovechar más ancho de pantalla */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Trayectoria profesional
          </h2>
          <p className="text-slate-500 text-sm">
            Haz clic en las tarjetas para explorar el detalle de los proyectos.
          </p>
        </div>

        <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
          {EXPERIENCE.map((item) => {
            const isExpanded = expandedId === item.id;
            
            return (
              <div key={item.id} className="relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse group">
                
                {/* Timeline Dot */}
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors duration-300 ${isExpanded ? 'bg-brand-600' : 'bg-slate-300 group-hover:bg-brand-400'}`}>
                  <BriefcaseIcon className={`w-4 h-4 ${isExpanded ? 'text-white' : 'text-slate-600'}`} />
                </div>
                
                {/* Content Card */}
                <div 
                  onClick={() => toggleExpand(item.id)}
                  className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden relative
                    ${isExpanded 
                      ? 'border-brand-500 shadow-lg ring-1 ring-brand-200' 
                      : 'border-slate-200 hover:border-brand-300 hover:shadow-lg hover:-translate-y-1'
                    }`}
                >
                  {/* Header Part (Always Visible) */}
                  <div className="p-6 md:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                       <img 
                          src={item.logoUrl} 
                          alt={`Logo ${item.company}`} 
                          className="h-8 max-w-[140px] object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                        />
                       <span className="text-xs font-bold tracking-wide text-brand-700 bg-brand-50 border border-brand-100 px-3 py-1 rounded-full whitespace-nowrap w-fit">
                        {item.period}
                      </span>
                    </div>

                    <h3 className={`font-bold text-xl md:text-2xl transition-colors duration-300 ${isExpanded ? 'text-brand-700' : 'text-slate-900 group-hover:text-brand-700'}`}>
                      {item.role}
                    </h3>
                    <div className="text-base font-medium text-slate-500 mt-1">{item.company}</div>
                    
                    {/* Short Description */}
                     <p className="text-slate-600 text-sm md:text-base mt-4 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Explicit Call to Action / Toggle Bar */}
                    <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100 group-hover:border-brand-100 transition-colors">
                      <span className={`text-sm font-semibold transition-colors ${isExpanded ? 'text-brand-600' : 'text-slate-400 group-hover:text-brand-600'}`}>
                        {isExpanded ? 'Ocultar detalles' : `Ver proyectos destacados`}
                      </span>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isExpanded ? 'bg-brand-100 text-brand-600 rotate-180' : 'bg-slate-100 text-slate-400 group-hover:bg-brand-600 group-hover:text-white'}`}>
                        <ChevronDownIcon className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details (Projects) */}
                  <div 
                    className={`grid transition-[grid-template-rows] duration-500 ease-in-out bg-slate-50 ${isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-6 md:px-8 pb-8 pt-2 border-t border-slate-200">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 mt-4">Detalle de proyectos</h4>
                        <ul className="space-y-8">
                          {item.achievements.map((achievement, i) => {
                            const { year, sector, title, description } = parseAchievement(achievement);

                            return (
                              <li key={i} className="flex items-start text-sm text-slate-700 group/item relative pl-6 border-l-2 border-slate-200 hover:border-brand-500 transition-colors duration-300">
                                <div className="flex flex-col gap-2 w-full">
                                  {year ? (
                                    <div className="flex flex-wrap items-center gap-3 text-xs">
                                      <span className="font-mono font-bold text-white bg-slate-800 px-2 py-1 rounded shadow-sm">
                                        {year}
                                      </span>
                                      {sector && (
                                        <span className="text-brand-600 font-bold uppercase tracking-wide text-[11px]">
                                          {sector}
                                        </span>
                                      )}
                                    </div>
                                  ) : null}
                                  
                                  {title ? (
                                    <strong className="block text-slate-900 text-lg leading-tight mt-1">
                                      {title}
                                    </strong>
                                  ) : null}
                                  
                                  <span className="text-slate-600 leading-relaxed text-base">
                                    {description}
                                  </span>
                                </div>
                              </li>
                            );
                          })}
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
    </section>
  );
};
