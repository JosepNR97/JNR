import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = '';
  readonly scrollMargin = '0px 0px 0px 0px';
  readonly thresholds = [];

  disconnect = vi.fn();
  observe = vi.fn();
  takeRecords = vi.fn(() => []);
  unobserve = vi.fn();
}

vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);

if (typeof Element !== 'undefined') {
  Object.defineProperty(Element.prototype, 'scrollIntoView', {
    configurable: true,
    value: vi.fn(),
  });
}
