import { act, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { useRevealOnScroll } from './useRevealOnScroll';

describe('useRevealOnScroll', () => {
  it('exposes its ref, starts hidden and disconnects after the first intersection', () => {
    const observe = vi.fn();
    const disconnect = vi.fn();
    let intersectionCallback: IntersectionObserverCallback | undefined;
    let observerOptions: IntersectionObserverInit | undefined;

    class ControlledIntersectionObserver implements IntersectionObserver {
      readonly root = null;
      readonly rootMargin = '0px 0px -10% 0px';
      readonly thresholds = [0.15];

      constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
        intersectionCallback = callback;
        observerOptions = options;
      }

      disconnect = disconnect;
      observe = observe;
      takeRecords = vi.fn(() => []);
      unobserve = vi.fn();
    }

    vi.stubGlobal('IntersectionObserver', ControlledIntersectionObserver);

    const Probe = () => {
      const { ref, isVisible } = useRevealOnScroll<HTMLDivElement>();
      return <div ref={ref} data-testid="reveal-probe" data-visible={String(isVisible)} />;
    };

    render(<Probe />);
    const element = screen.getByTestId('reveal-probe');

    expect(element).toHaveAttribute('data-visible', 'false');
    expect(observe).toHaveBeenCalledWith(element);
    expect(observerOptions).toEqual({
      threshold: 0.15,
      rootMargin: '0px 0px -10% 0px',
    });

    const elementBounds = element.getBoundingClientRect();
    act(() => {
      intersectionCallback?.(
        [
          {
            boundingClientRect: elementBounds,
            intersectionRatio: 1,
            intersectionRect: elementBounds,
            isIntersecting: true,
            rootBounds: null,
            target: element,
            time: 0,
          },
        ],
        {} as IntersectionObserver,
      );
    });

    expect(element).toHaveAttribute('data-visible', 'true');
    expect(disconnect).toHaveBeenCalledTimes(1);
  });
});
