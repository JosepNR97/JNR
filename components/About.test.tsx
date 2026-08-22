import { act, render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { CAREER_START_YEAR } from '../constants';
import { LanguageProvider } from '../context/LanguageContext';
import { translations } from '../translations';
import { About } from './About';

describe('About', () => {
  it('shows the final experience and project totals after the statistics intersect', async () => {
    const callbacks = new Map<Element, IntersectionObserverCallback>();

    class ControlledIntersectionObserver implements IntersectionObserver {
      readonly root = null;
      readonly rootMargin = '';
      readonly thresholds = [0.15];

      constructor(private readonly callback: IntersectionObserverCallback) {}

      disconnect = vi.fn();
      observe = vi.fn((element: Element) =>
        callbacks.set(element, this.callback),
      );
      takeRecords = vi.fn(() => []);
      unobserve = vi.fn();
    }

    vi.stubGlobal('IntersectionObserver', ControlledIntersectionObserver);
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    );
    window.localStorage.setItem('jnr-language-v1', 'en');

    render(
      <LanguageProvider>
        <About />
      </LanguageProvider>,
    );

    const yearsLabel = screen.getByText(translations.en.about.yearsLabel);
    const statistics = yearsLabel.parentElement?.parentElement;
    expect(statistics).not.toBeNull();
    if (!statistics) throw new Error('About statistics were not rendered');

    const callback = callbacks.get(statistics);
    expect(callback).toBeDefined();
    const bounds = statistics.getBoundingClientRect();

    act(() => {
      callback?.(
        [
          {
            boundingClientRect: bounds,
            intersectionRatio: 1,
            intersectionRect: bounds,
            isIntersecting: true,
            rootBounds: null,
            target: statistics,
            time: 0,
          },
        ],
        {} as IntersectionObserver,
      );
    });

    const yearsExp = new Date().getFullYear() - CAREER_START_YEAR + 1;
    const totalProjects = translations.en.experience.items.reduce(
      (total, item) => total + item.achievements.length,
      0,
    );

    await waitFor(() => {
      expect(screen.getByText(`${yearsExp}+`)).toBeVisible();
      expect(screen.getByText(String(totalProjects))).toBeVisible();
    });
  });
});
