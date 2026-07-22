import { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ChevronDownIcon, EducationIcon, ExternalLinkIcon } from './Icons';

interface EducationProps {
  expandedVendorId: string | null;
  onVendorToggle: (vendorId: string) => void;
}

const preloadedCertificationImages = new Map<string, HTMLImageElement>();

const preloadCertificationImage = (src: string) => {
  if (preloadedCertificationImages.has(src)) return;

  const image = new Image();
  image.decoding = 'async';
  image.fetchPriority = 'low';
  image.src = src;
  preloadedCertificationImages.set(src, image);

  if (typeof image.decode === 'function') {
    void image.decode().catch(() => undefined);
  }
};

export const Education = ({ expandedVendorId, onVendorToggle }: EducationProps) => {
  const { t } = useLanguage();

  useEffect(() => {
    t.education.professional.forEach((vendor) => {
      vendor.certifications.forEach((certification) => {
        preloadCertificationImage(certification.image);
      });
    });
  }, [t.education.professional]);

  return (
    <section id="education" className="scroll-mt-20 bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-brand-600">
            {t.education.badge}
          </span>
          <h2 className="mb-4 mt-2 font-serif text-3xl font-bold text-slate-900 md:text-4xl">
            {t.education.title}
          </h2>
          <p className="mx-auto max-w-2xl text-slate-600">{t.education.subtitle}</p>
        </div>

        <div className="mb-20">
          <div className="mb-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <h3 className="text-center text-lg font-bold uppercase text-slate-800 sm:text-xl">
              {t.education.academicTitle}
            </h3>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="mx-auto max-w-4xl space-y-6">
            {t.education.academic.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition-shadow hover:shadow-md sm:p-8"
              >
                <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-[2fr_1fr]">
                  <div className="flex items-center gap-5 text-left sm:gap-6">
                    <div className="grid h-20 w-20 shrink-0 place-items-center rounded-lg border border-slate-100 bg-white p-2 shadow-sm">
                      {item.logoUrl ? (
                        <img
                          src={item.logoUrl}
                          alt={`Logo ${item.institution}`}
                          width="160"
                          height="160"
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <EducationIcon className="h-8 w-8 text-brand-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="mb-2 text-xl font-bold leading-tight text-slate-900">
                        {item.degree}
                      </h4>
                      <p className="text-sm font-bold uppercase text-brand-700">{item.institution}</p>
                    </div>
                  </div>

                  <div className="flex flex-col border-t border-slate-200 pt-4 text-left md:items-end md:border-t-0 md:pt-0 md:text-right">
                    <span className="mb-2 inline-block w-fit rounded-full bg-slate-200 px-4 py-1.5 text-xs font-bold text-slate-700">
                      {item.year}
                    </span>
                    {item.description ? (
                      <p className="max-w-xs text-sm italic text-slate-500">{item.description}</p>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <h3 className="text-center text-lg font-bold uppercase text-slate-800 sm:text-xl">
              {t.education.professionalTitle}
            </h3>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="mx-auto max-w-4xl space-y-4">
            {t.education.professional.map((vendor) => {
              const isExpanded = expandedVendorId === vendor.id;
              const triggerId = `education-trigger-${vendor.id}`;
              const panelId = `education-panel-${vendor.id}`;

              return (
                <article
                  id={`education-card-${vendor.id}`}
                  key={vendor.id}
                  className={`group scroll-mt-24 overflow-hidden rounded-xl border bg-white transition-all duration-300 ${
                    isExpanded
                      ? 'border-brand-500 shadow-lg ring-1 ring-brand-200'
                      : 'border-slate-200 hover:border-brand-300 hover:shadow-md'
                  }`}
                >
                  <button
                    id={triggerId}
                    type="button"
                    aria-expanded={isExpanded}
                    aria-controls={panelId}
                    onClick={() => onVendorToggle(vendor.id)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left sm:p-6"
                  >
                    <span className="flex min-w-0 flex-1 items-center gap-4 sm:gap-6">
                      <span className="grid h-16 w-20 shrink-0 place-items-center rounded-lg border border-slate-100 bg-white p-2 sm:h-20">
                        <img
                          src={vendor.logoUrl}
                          alt={`Logo ${vendor.name}`}
                          width="160"
                          height="100"
                          loading="lazy"
                          decoding="async"
                          className="max-h-full max-w-full object-contain"
                        />
                      </span>

                      <span className="min-w-0">
                        <span className="block text-lg font-bold text-slate-900 sm:text-xl">
                          {vendor.name}
                        </span>
                        <span className="mt-2 flex flex-wrap gap-2" aria-label="Tags">
                          {vendor.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600"
                            >
                              {tag}
                            </span>
                          ))}
                        </span>
                      </span>
                    </span>

                    <span
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors ${
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
                  </button>

                  {isExpanded ? (
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={triggerId}
                      className="border-t border-slate-100 bg-slate-50/50 p-5 sm:p-6"
                    >
                      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {vendor.certifications.map((certification) => (
                          <li
                            key={certification.name}
                            className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-brand-200"
                          >
                            <span className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-lg border border-slate-100 bg-white p-1">
                              <img
                                src={certification.image}
                                alt=""
                                width="64"
                                height="64"
                                loading="eager"
                                decoding="sync"
                                className="max-h-full max-w-full object-contain"
                              />
                            </span>
                            <div className="min-w-0 flex-1">
                              <h5 className="text-sm font-bold leading-tight text-slate-900">
                                {certification.name}
                              </h5>
                              <p className="mb-2 mt-1 text-xs text-slate-500">{certification.date}</p>
                              {certification.credentialUrl && certification.credentialUrl !== '#' ? (
                                <a
                                  href={certification.credentialUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex min-h-8 items-center gap-1.5 text-xs font-semibold text-brand-700 hover:underline"
                                >
                                  {t.education.viewCredential}
                                  <ExternalLinkIcon className="h-3 w-3" />
                                </a>
                              ) : null}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
