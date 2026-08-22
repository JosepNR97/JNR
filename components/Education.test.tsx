import { useState } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { LanguageProvider } from '../context/LanguageContext';
import { Education } from './Education';

const EducationHarness = () => {
  const [expandedVendorId, setExpandedVendorId] = useState<string | null>(null);

  const handleVendorToggle = (vendorId: string) => {
    setExpandedVendorId((current) => (current === vendorId ? null : vendorId));
  };

  return <Education expandedVendorId={expandedVendorId} onVendorToggle={handleVendorToggle} />;
};

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

  it('exposes an expanded vendor panel and restores its credential links to the tab order', async () => {
    window.localStorage.setItem('jnr-language-v1', 'en');
    const user = userEvent.setup();

    render(
      <LanguageProvider>
        <EducationHarness />
      </LanguageProvider>,
    );

    const trigger = screen.getByRole('button', { name: /Microsoft Azure/i });
    const panelId = trigger.getAttribute('aria-controls');
    const panel = panelId ? document.getElementById(panelId) : null;
    const credentialLink = panel?.querySelector('a');

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(panel).toHaveAttribute('aria-hidden', 'true');
    expect(credentialLink).toHaveAttribute('tabindex', '-1');

    await user.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(panel).not.toHaveAttribute('aria-hidden');
    expect(credentialLink).not.toHaveAttribute('tabindex');
    expect(screen.getByRole('region', { name: /Microsoft Azure/i })).toBeVisible();
  });
});
