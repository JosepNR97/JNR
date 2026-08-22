import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { scrollToElementAfterLayout } from '../scrollToElement';
import { BriefcaseIcon, ChevronDownIcon } from './Icons';
import { Reveal, RevealArticle } from './Reveal';

export const Experience = () => {
  const { t } = useLanguage();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleToggle = (itemId: string) => {
    const shouldExpand = expandedId !== itemId;
    setExpandedId(shouldExpand ? itemId : null);
    if (shouldExpand) scrollToElementAfterLayout(`experience-item-${itemId}`);
  };

  return (
    <section id="experience" className="scroll-mt-20 bg-white py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-16 text-center">
          <h2 className="mb-4 font-serif text-3xl font-bold text-slate-900 md:text-4xl">
            {t.experience.title}
          </h2>
          <p className="text-sm text-slate-500">{t.experience.subtitle}</p>
        </Reveal>

        <div className="relative">
          <div className="absolute bottom-0 left-4 top-2 w-0.5 bg-slate-200 md:left-4" aria-hidden="true" />

          <div className="space-y-8 md:space-y-12">
            {t.experience.items.map((item) => {
              const isExpanded = expandedId === item.id;
              const triggerId = `experience-trigger-${item.id}`;
              const panelId = `experience-panel-${item.id}`;

              return (
                <RevealArticle
                  key={item.id}
                  id={`experience-item-${item.id}`}
                  className="group relative scroll-mt-24 pl-12 md:pl-24"
                >
                  <div
                    className={`absolute left-4 top-0 z-10 grid h-10 w-10 -translate-x-1/2 place-items-center rounded-full border-4 border-white shadow transition-colors duration-300 ${
                      isExpanded ? 'bg-brand-600' : 'bg-slate-300 group-hover:bg-brand-500'
                    }`}
                    aria-hidden="true"
                  >
                    <BriefcaseIcon
                      className={`h-4 w-4 transition-colors duration-300 ${
                        isExpanded ? 'text-white' : 'text-slate-700 group-hover:text-white'
                      }`}
                    />
                  </div>

                  <div
                    className={`overflow-hidden rounded-xl border bg-white transition-all duration-300 ${
                      isExpanded
                        ? 'border-brand-500 shadow-lg ring-1 ring-brand-200'
                        : 'border-slate-200 group-hover:-translate-y-1 group-hover:border-brand-300 group-hover:shadow-lg'
                    }`}
                  >
                    <button
                      id={triggerId}
                      type="button"
                      aria-expanded={isExpanded}
                      aria-controls={panelId}
                      onClick={() => handleToggle(item.id)}
                      className="w-full p-6 text-left md:p-8"
                    >
                      <span className="mb-2 flex flex-col justify-between gap-4 md:flex-row md:items-start">
                        <span className="flex-1">
                          <span
                            className={`block text-xl font-bold transition-colors md:text-2xl ${
                              isExpanded ? 'text-brand-700' : 'text-slate-900 group-hover:text-brand-700'
                            }`}
                          >
                            {item.role}
                          </span>
                          <span className="mt-1 block text-lg font-medium text-slate-600">{item.company}</span>
                        </span>

                        <span className="flex shrink-0 flex-row-reverse items-center justify-between gap-3 md:flex-col md:items-end md:justify-start">
                          <img
                            src={item.logoUrl}
                            alt={`Logo ${item.company}`}
                            width="140"
                            height="40"
                            loading="lazy"
                            decoding="async"
                            className="h-8 max-w-36 object-contain"
                          />
                          <span className="rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-center text-xs font-bold text-brand-700">
                            {item.period}
                          </span>
                        </span>
                      </span>

                      <span className="mt-4 block max-w-3xl text-sm leading-relaxed text-slate-600 md:text-base">
                        {item.description}
                      </span>

                      <span className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 transition-colors group-hover:border-brand-100">
                        <span
                          className={`text-sm font-semibold transition-colors ${
                            isExpanded ? 'text-brand-700' : 'text-slate-400 group-hover:text-brand-700'
                          }`}
                        >
                          {isExpanded ? t.experience.collapse : t.experience.expand}
                        </span>
                        <span
                          className={`grid h-8 w-8 place-items-center rounded-full transition-colors ${
                            isExpanded
                              ? 'bg-brand-100 text-brand-700'
                              : 'bg-slate-100 text-slate-500 group-hover:bg-brand-600 group-hover:text-white'
                          }`}
                          aria-hidden="true"
                        >
                          <ChevronDownIcon
                            className={`h-5 w-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          />
                        </span>
                      </span>
                    </button>

                    <div className={`expandable-panel ${isExpanded ? 'is-expanded' : ''}`}>
                      <div className="min-h-0 overflow-hidden">
                        <div
                          id={panelId}
                          role="region"
                          aria-labelledby={triggerId}
                          aria-hidden={isExpanded ? undefined : true}
                          className="border-t border-slate-200 bg-slate-50 px-6 pb-8 pt-6 md:px-8"
                        >
                          <h3 className="mb-6 text-xs font-bold uppercase tracking-widest text-slate-500">
                            {t.experience.detailTitle}
                          </h3>
                          <ul className="space-y-6">
                            {item.achievements.map((achievement) => (
                              <li
                                key={`${achievement.year}-${achievement.title}`}
                                className="border-l-2 border-slate-300 pl-4 transition-colors hover:border-brand-500"
                              >
                                <div className="mb-2 flex flex-wrap items-center gap-2">
                                  {achievement.year ? (
                                    <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-xs font-bold text-white">
                                      {achievement.year}
                                    </span>
                                  ) : null}
                                  {achievement.sector ? (
                                    <span className="text-xs font-bold uppercase text-brand-700">
                                      {achievement.sector}
                                    </span>
                                  ) : null}
                                </div>
                                {achievement.title ? (
                                  <strong className="block text-base leading-snug text-slate-900">
                                    {achievement.title}
                                  </strong>
                                ) : null}
                                <p className="mt-1 text-sm leading-relaxed text-slate-600 md:text-base">
                                  {achievement.description}
                                </p>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </RevealArticle>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
