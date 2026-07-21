import { render, screen } from '@testing-library/react';
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
});
