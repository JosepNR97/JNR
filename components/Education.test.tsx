import { render, screen, within } from '@testing-library/react';
import { vi } from 'vitest';
import { LanguageProvider } from '../context/LanguageContext';
import { Education } from './Education';

describe('Education', () => {
  it('renders each certification as its own card in an expanded vendor panel', () => {
    window.localStorage.setItem('jnr-language-v1', 'en');

    render(
      <LanguageProvider>
        <Education expandedVendorId="v_ms" onVendorToggle={vi.fn()} />
      </LanguageProvider>,
    );

    const panel = screen.getByRole('region', { name: /Microsoft Azure/i });
    expect(within(panel).getAllByRole('listitem')).toHaveLength(4);
    expect(panel.querySelector('ul')).toHaveClass('sm:grid-cols-2');

    const badge = panel.querySelector('img[src*="azure-ai-fundamentals"]');
    expect(badge).toHaveAttribute('loading', 'eager');
    expect(badge).toHaveAttribute('decoding', 'sync');
    expect(badge).toHaveClass('h-12', 'w-12', 'object-contain');
  });
});
