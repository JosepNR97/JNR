import { useEffect } from 'react';

const ANALYTICS_ID = 'G-WH1JZPMVQ5';

declare global {
  interface Window {
    dataLayer?: unknown[][];
    gtag?: (...args: unknown[]) => void;
  }
}

const loadAnalytics = () => {
  (window as unknown as Record<string, unknown>)[`ga-disable-${ANALYTICS_ID}`] = false;
  window.dataLayer = window.dataLayer ?? [];
  window.gtag = window.gtag ?? ((...args: unknown[]) => window.dataLayer?.push(args));

  if (!document.querySelector(`script[data-analytics-id="${ANALYTICS_ID}"]`)) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_ID}`;
    script.dataset.analyticsId = ANALYTICS_ID;
    document.head.append(script);
  }

  if (document.documentElement.dataset.analyticsInitialized === ANALYTICS_ID) return;
  document.documentElement.dataset.analyticsInitialized = ANALYTICS_ID;
  window.gtag('js', new Date());
  window.gtag('config', ANALYTICS_ID, { anonymize_ip: true });
};

export const Analytics = () => {
  useEffect(() => {
    loadAnalytics();
  }, []);

  return null;
};
