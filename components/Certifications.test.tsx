import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { LanguageProvider } from '../context/LanguageContext';
import { Certifications } from './Certifications';

describe('Certifications', () => {
  beforeEach(() => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  it('selects the certification vendor on a regular click', async () => {
    const user = userEvent.setup();
    const onSelectVendor = vi.fn();

    render(
      <LanguageProvider>
        <Certifications onSelectVendor={onSelectVendor} />
      </LanguageProvider>,
    );

    await user.click(screen.getByRole('button', { name: /AWS/i }));

    expect(onSelectVendor).toHaveBeenCalledWith('v_aws');
  });

  it('wraps the automatic scroll back to the equivalent middle segment', () => {
    let animationCallback: FrameRequestCallback | undefined;
    const requestAnimationFrame = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((callback) => {
        animationCallback = callback;
        return 1;
      });

    render(
      <LanguageProvider>
        <Certifications onSelectVendor={vi.fn()} />
      </LanguageProvider>,
    );

    const firstLogo = screen.getByRole('button', { name: /AWS/i });
    const container = firstLogo.closest<HTMLDivElement>('.overflow-x-auto');
    expect(container).not.toBeNull();
    if (!container) throw new Error('Certification carousel was not rendered');

    Object.defineProperty(container, 'scrollWidth', {
      configurable: true,
      value: 3000,
    });
    container.scrollLeft = 1999.8;

    act(() => animationCallback?.(0));

    expect(container.scrollLeft).toBeCloseTo(1000.25, 2);
    requestAnimationFrame.mockRestore();
  });
});
