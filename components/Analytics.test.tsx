import { render } from '@testing-library/react';
import { Analytics } from './Analytics';

describe('Analytics', () => {
  beforeEach(() => {
    document.querySelectorAll('script[data-analytics-id]').forEach((script) => script.remove());
    delete document.documentElement.dataset.analyticsInitialized;
    window.dataLayer = [];
    window.gtag = undefined;
  });

  it('loads Google Analytics automatically without rendering consent controls', () => {
    const { container } = render(<Analytics />);

    expect(container).toBeEmptyDOMElement();
    expect(document.querySelector('script[data-analytics-id="G-WH1JZPMVQ5"]')).toHaveAttribute(
      'src',
      'https://www.googletagmanager.com/gtag/js?id=G-WH1JZPMVQ5',
    );
    expect(window.dataLayer).toEqual(
      expect.arrayContaining([['config', 'G-WH1JZPMVQ5', { anonymize_ip: true }]]),
    );
  });
});
